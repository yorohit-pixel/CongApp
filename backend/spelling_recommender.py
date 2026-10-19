import difflib
import json
import random
import re
from collections import defaultdict
from pathlib import Path

# These are deliberately simple lists so they can be saved by the app later.

# Each item is [pattern, number_of_times_missed].

patternList = []
patternTally = []
# Each item is [word-type label, number_of_times_missed]. This tracks spelling
# concepts (for example, vowel_ough), not just a letter's position in a typo.
mistakeTypeTally = []

# The last 30 words suggested.  Keep this list between calls to findWords.

previousRecommendations = []
recommendations = []

_words = None
_DATA_FILE = Path(__file__).with_name("words_typed.json")


def normalise_word(word):
    return re.sub(r"[^a-z]", "", str(word).lower())


def get_silent_letter_patterns(word):
    starts = {"kn": "silent_kn", "wr": "silent_wr", "ps": "silent_ps", "pn": "silent_pn", "gn": "silent_gn"}
    patterns = [label for letters, label in starts.items() if word.startswith(letters)]
    if word.endswith("mb"):
        patterns.append("silent_mb")
    return patterns


def get_double_consonant_patterns(word):
    return [f"double_{letter}" for letter in "lsrmntcp" if letter * 2 in word]


def get_morpheme_patterns(word):
    prefixes = ["un", "dis", "mis", "re", "pre", "in", "im", "ir", "il", "inter"]
    suffixes = ["tion", "sion", "cian", "ance", "ence", "ent", "ant", "able", "ible", "ous", "ious", "ary"]
    patterns = [f"prefix_{prefix}" for prefix in prefixes if word.startswith(prefix)]
    patterns.extend(f"suffix_{suffix}" for suffix in suffixes if word.endswith(suffix))
    return patterns


def get_consonant_patterns(word):
    patterns = []
    for letters in ("ph", "sh", "th", "dge", "cqu"):
        if letters in word:
            patterns.append(f"consonant_{letters}")
    if "tch" in word:
        patterns.append("consonant_tch")
    elif "ch" in word:
        patterns.append("consonant_ch")
    return patterns


def get_vowel_patterns(word):
    patterns = [f"vowel_{letters}" for letters in ("ie", "ei", "ea", "ou", "ough", "ai", "ay") if letters in word]
    if len(word) > 2 and word.endswith("e"):
        patterns.append("vowel_silent_e")
    return patterns


def get_all_patterns(word):
    """Categorise spelling features in a word using rules, not a neural net."""
    word = normalise_word(word)
    patterns = (
        get_silent_letter_patterns(word)
        + get_double_consonant_patterns(word)
        + get_morpheme_patterns(word)
        + get_consonant_patterns(word)
        + get_vowel_patterns(word)
    )
    return list(dict.fromkeys(patterns)) or ["non"]

def cleanWord(userWord, correctWord):
    userWord = normalise_word(userWord)
    correctWord = normalise_word(correctWord)

    wordMatch = difflib.SequenceMatcher(None, correctWord, userWord, autojunk=False)
    output = []

    for tag, startIndexWord, endIndexWord, startIndexUser, endIndexUser in wordMatch.get_opcodes():
        if tag == "equal":
            output.append(correctWord[startIndexWord:endIndexWord])
        elif tag == "delete":
            output.append("_")
        elif tag == "insert":
            output.append("!")
        elif tag == "replace":
            output.append("?")

    return "".join(output)


def getLetPattern(userWord):
    foundPatterns = []
    for incorrectIndex, character in enumerate(userWord):
        if character not in "!_?":
            continue

        before = userWord[max(0, incorrectIndex - 2):incorrectIndex]
        after = userWord[incorrectIndex + 1:incorrectIndex + 3]
        adjacent = (userWord[max(0, incorrectIndex - 1):incorrectIndex] + "-" + userWord[incorrectIndex + 1:incorrectIndex + 2])

        foundPatterns.extend(value for value in (before, after, adjacent) if value and value != "-")

    patternList.extend(foundPatterns)
    return foundPatterns


def recordMistake(userWord, correctWord):
    markedWord = cleanWord(userWord, correctWord)
    if normalise_word(userWord) == normalise_word(correctWord):
        return markedWord
    newPatterns = getLetPattern(markedWord)

    counts = {item[0]: item[1] for item in patternTally}
    for pattern in newPatterns:
        counts[pattern] = counts.get(pattern, 0) + 1

    patternTally[:] = [[key, value] for key, value in counts.items()]
    typeCounts = {item[0]: item[1] for item in mistakeTypeTally}
    for patternType in get_all_patterns(correctWord):
        # "non" has no useful teaching feature, so do not make it a top type.
        if patternType != "non":
            typeCounts[patternType] = typeCounts.get(patternType, 0) + 1
    mistakeTypeTally[:] = [[key, value] for key, value in typeCounts.items()]
    return markedWord


def _load_words():
    global _words
    if _words is None:
        try:
            with _DATA_FILE.open(encoding="utf-8") as file:
                _words = json.load(file)
        except FileNotFoundError as error:
            raise FileNotFoundError(
                f"Could not find {_DATA_FILE.name}. Put it beside {Path(__file__).name}."
            ) from error
    return _words


def _top_patterns(extraPatterns=None):
    """Return at most the three patterns the learner has missed most often."""
    counts = defaultdict(int)
    for pattern, tally in patternTally:
        counts[pattern] += tally
    if extraPatterns:
        if isinstance(extraPatterns, str):
            extraPatterns = [extraPatterns]
        for pattern in extraPatterns:
            if pattern:
                counts[str(pattern).lower()] += 1
    return [pattern for pattern, _ in sorted(counts.items(), key=lambda item: item[1], reverse=True)[:3]]


def getTopMistakeTypes():
    """Return the three spelling categories the learner misses most often."""
    ranked = sorted(mistakeTypeTally, key=lambda item: item[1], reverse=True)
    return [patternType for patternType, _ in ranked[:3]]


def _matches_pattern(word, pattern):
    # "a-e" means the app noticed an error between adjacent letters a and e.
    if "-" in pattern:
        return pattern.replace("-", "") in word
    return pattern in word


def _normalise_types(wordType):
    if wordType is None:
        return set()
    if isinstance(wordType, str):
        return {wordType.lower()}
    return {str(value).lower() for value in wordType}


def findWords(pattern=None, difficulty=None, type=None):

    global recommendations
    words = _load_words()
    requestedTypes = _normalise_types(type)
    targetDifficulty = 5 if difficulty is None else float(difficulty)
    strongestPatterns = _top_patterns(pattern)
    strongestMistakeTypes = set(getTopMistakeTypes())

    available = [item for item in words if item.get("word") not in previousRecommendations]
    # A small dataset might not have ten unused words.  In that case reuse is
    # preferable to returning fewer than ten recommendations.
    if len(available) < 10:
        available = list(words)

    def difficulty_distance(item):
        return abs(float(item.get("difficulty", targetDifficulty)) - targetDifficulty)

    def score(item):
        word = normalise_word(item.get("word", ""))
        itemTypes = _normalise_types(item.get("type", []))
        difficultyScore = max(0, 50 - 10 * difficulty_distance(item))
        typeScore = 20 if requestedTypes and requestedTypes.intersection(itemTypes) else 0
        mistakeTypeScore = 25 * len(strongestMistakeTypes.intersection(itemTypes))
        patternScore = 15 * sum(_matches_pattern(word, itemPattern) for itemPattern in strongestPatterns)
        frequencyScore = min(float(item.get("frequency", 0)), 10)
        return difficultyScore + typeScore + mistakeTypeScore + patternScore + frequencyScore

    # First make six targeted choices.  Ties get a tiny random value so a word
    # with exactly the same data does not always win.
    ranked = sorted(available, key=lambda item: (score(item), random.random()), reverse=True)
    targeted = ranked[:6]
    selectedWords = {item.get("word") for item in targeted}

    # These four use difficulty only: no type, frequency, or pattern data.
    difficultyOnlyPool = [item for item in available if item.get("word") not in selectedWords]
    difficultyOnlyPool.sort(key=difficulty_distance)
    closestDistance = difficulty_distance(difficultyOnlyPool[0]) if difficultyOnlyPool else 0
    closeEnough = [item for item in difficultyOnlyPool if difficulty_distance(item) == closestDistance]
    randomChoices = random.sample(closeEnough, min(4, len(closeEnough)))
    if len(randomChoices) < 4:
        remaining = [item for item in difficultyOnlyPool if item not in randomChoices]
        randomChoices.extend(remaining[:4 - len(randomChoices)])

    chosen = targeted + randomChoices
    # If the dataset has fewer than ten usable records, return what exists.
    recommendations = [item["word"] for item in chosen if item.get("word")]
    random.shuffle(recommendations)

    previousRecommendations.extend(recommendations)
    del previousRecommendations[:-30]
    return recommendations


