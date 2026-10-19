"""Keeps the word list suitable for kids.

words_typed.json comes from a general English dictionary, so it also has
swear words, adult topics, names of people and places, and abbreviations.
Only words that pass is_kid_friendly() are used in the quiz or recommended.
"""

import re

# Words that should never be shown, even if their definition looks harmless.
BLOCKED_WORDS = {
    "ass", "arse", "bastard", "bitch", "bloody", "boob", "booze", "bra", "butt", "crap", "damn",
    "dick", "drunk", "dumb", "fag", "fart", "fuck", "gay", "hell", "homo", "horny", "idiot", "kinky",
    "lesbian", "moron", "nazi", "nude", "pee", "piss", "poo", "poop", "porn", "prick", "pussy", "queer", "retard", "sexy",
    "shit", "slut", "stupid", "suck", "sucks", "tit", "twat", "wank", "whore", "wtf",
}

# Word parts that mark an adult word wherever they appear in it.
BLOCKED_PARTS = (
    "fuck", "shit", "bitch", "whore", "slut", "porn", "rape", "sexual", "erotic", "orgasm",
    "masturb", "nazi", "genocid", "suicid", "cocaine", "heroin", "molest", "prostitut",
)

# If the definition talks about any of these, the word is left out.
BLOCKED_DEFINITION_WORDS = re.compile(
    r"\b("
    r"obscene|vulgar|slang|offensive|derogatory|disparaging|insulting|taboo|"
    r"sex|sexual|sexually|intercourse|genital|genitals|penis|vagina|breast|breasts|buttocks|"
    r"naked|nude|erotic|prostitute|prostitution|brothel|lust|lewd|"
    r"feces|faeces|excrement|excretory|excrete|urine|urinate|urination|defecate|vomit|"
    r"virgin|pregnant|pregnancy|seduce|seduction|mistress|lover|adultery|"
    r"alcohol|alcoholic|liquor|intoxicated|drunk|drunken|beer|wine|whiskey|"
    r"drug|drugs|narcotic|narcotics|cocaine|heroin|marijuana|opium|"
    r"kill|killed|killing|kills|murder|murderer|murdered|assassin|assassinate|slaughter|"
    r"suicide|execution|execute|executed|torture|rape|massacre|genocide|corpse|"
    r"weapon|weapons|gun|guns|firearm|bomb|explosive|"
    r"nazi|terrorist|terrorism|slave|slavery|racist|"
    r"death|tobacco|cigarette|cigar|smoking|warhead|nuclear|lethal|hostage|stupid|fatuous|gambling|gamble"
    r")\b",
    re.IGNORECASE,
)

_LETTERS_ONLY = re.compile(r"^[a-z]+$")
_VOWELS = set("aeiouy")


def is_kid_friendly(entry):
    word = str(entry.get("word", ""))
    definition = str(entry.get("definition", ""))

    # Plain lowercase words with at least 3 letters and a vowel (drops "tv", "uk", "ad-lib").
    if len(word) < 3 or not _LETTERS_ONLY.match(word) or not _VOWELS.intersection(word):
        return False
    if word in BLOCKED_WORDS or any(part in word for part in BLOCKED_PARTS):
        return False
    # Dictionary definitions are lowercase except for names, so a capital
    # letter means the word is (or is about) a person, place or language.
    if re.search(r"[A-Z]", definition):
        return False
    if BLOCKED_DEFINITION_WORDS.search(definition):
        return False
    return True


def kid_friendly_words(words):
    return [entry for entry in words if is_kid_friendly(entry)]
