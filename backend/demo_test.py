"""A repeatable 20-word practice simulation for the recommender."""

import random

import spelling_recommender as app


WORDS = """knock write climb psychology gnome shell happy address little
coffee necessary apple mission action science noticeable dangerous bicycle
thought rough enough beautiful receive friend bread mountain playful
character watch phone question cheerful catch change thumb lamb""".split()


def make_purposeful_mistake(word):
    # Simulate a common typo: omit a letter from the middle of the word.
    index = max(1, len(word) // 2)
    return word[:index] + word[index + 1:]


def main():
    random.seed(42)
    app.patternList.clear()
    app.patternTally.clear()
    app.mistakeTypeTally.clear()
    app.previousRecommendations.clear()

    app._words = [
        {"word": word, "difficulty": 5 + (len(word) % 3), "frequency": 5, "type": app.get_all_patterns(word)}
        for word in WORDS
    ]
    practiceWords = random.sample(WORDS, 20)
    for correctWord in practiceWords:
        app.recordMistake(make_purposeful_mistake(correctWord), correctWord)

    print("20 simulated mistakes:", practiceWords)
    print("Pattern tallies:", app.patternTally)
    print("Top three useful spelling categories:", app.getTopMistakeTypes())
    print("10 recommendations:", app.findWords(difficulty=6))


if __name__ == "__main__":
    main()
