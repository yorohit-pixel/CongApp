"""Child-friendly names, tips and examples for the word types made by
spelling_recommender.get_all_patterns (e.g. "vowel_ough", "silent_kn").

The website shows these on the "Practice for you" page as "What we noticed".
"""

# type -> (label, tip, example)
_INFO = {
    # Silent letters
    "silent_kn": ("Silent k in kn", "In kn, the k is quiet. You only hear the n.", "know, knee"),
    "silent_wr": ("Silent w in wr", "In wr, the w is quiet. You only hear the r.", "write, wrap"),
    "silent_ps": ("Silent p in ps", "In ps at the start, the p is quiet.", "psychology"),
    "silent_pn": ("Silent p in pn", "In pn at the start, the p is quiet.", "pneumonia"),
    "silent_gn": ("Silent g in gn", "In gn, the g is quiet. You only hear the n.", "gnome, gnat"),
    "silent_mb": ("Silent b in mb", "At the end of a word, mb sounds like m.", "lamb, climb"),
    # Consonant teams
    "consonant_ph": ("ph says f", "The letters p and h together say /f/.", "phone, graph"),
    "consonant_sh": ("The sh sound", "s and h together make the /sh/ sound.", "ship, fish"),
    "consonant_th": ("The th sound", "t and h together make the /th/ sound.", "thin, this"),
    "consonant_ch": ("The ch sound", "c and h together make the /ch/ sound.", "chin, lunch"),
    "consonant_tch": ("tch after a short vowel", "After a short vowel, /ch/ is often spelled tch.", "catch, watch"),
    "consonant_dge": ("dge after a short vowel", "After a short vowel, /j/ is often spelled dge.", "badge, bridge"),
    "consonant_cqu": ("cqu says kw", "The letters cqu together say /kw/.", "acquire"),
    # Vowel teams
    "vowel_ie": ("The ie team", "i and e work together. Often they say /ee/ or /eye/.", "field, pie"),
    "vowel_ei": ("The ei team", "e and i work together. Remember: i before e, except after c.", "receive, eight"),
    "vowel_ea": ("The ea team", "e and a work together. Often they say /ee/.", "eat, team"),
    "vowel_ou": ("The ou team", "o and u work together. Often they say /ow/.", "out, cloud"),
    "vowel_ough": ("The ough team", "ough can make different sounds. Learn each word by sight.", "though, rough"),
    "vowel_ai": ("The ai team", "a and i work together to say the long /a/ sound.", "rain, paint"),
    "vowel_ay": ("The ay team", "At the end of a word, long /a/ is often spelled ay.", "day, play"),
    "vowel_silent_e": ("Magic e", "A quiet e at the end often makes the vowel say its name.", "cap → cape"),
}

_DOUBLE_EXAMPLES = {
    "l": "ball, hello", "s": "miss, class", "r": "carrot, hurry", "m": "summer, hammer",
    "n": "dinner, funny", "t": "little, kitten", "c": "accident, soccer", "p": "happy, apple",
}
for _letter, _example in _DOUBLE_EXAMPLES.items():
    _INFO[f"double_{_letter}"] = (
        f"Double {_letter}{_letter}",
        f"Some words have two {_letter}'s side by side. Clap the syllables to hear where they go.",
        _example,
    )

_PREFIXES = {
    "un": ("means not", "unhappy"), "dis": ("means not or opposite", "disagree"),
    "mis": ("means wrongly", "misspell"), "re": ("means again", "redo"),
    "pre": ("means before", "preview"), "in": ("can mean not or into", "incorrect"),
    "im": ("means not, before b, m or p", "impossible"), "ir": ("means not, before r", "irregular"),
    "il": ("means not, before l", "illegal"), "inter": ("means between", "internet"),
}
for _prefix, (_meaning, _example) in _PREFIXES.items():
    _INFO[f"prefix_{_prefix}"] = (
        f"Starts with {_prefix}-",
        f"The beginning {_prefix}- {_meaning}. Spell it first, then add the base word.",
        _example,
    )

_SUFFIXES = {
    "tion": ("says /shun/", "action"), "sion": ("says /zhun/ or /shun/", "vision"),
    "cian": ("says /shun/ for a person's job", "magician"), "ance": ("sounds like /ens/", "balance"),
    "ence": ("sounds like /ens/", "science"), "ent": ("sounds like /ent/", "student"),
    "ant": ("sounds like /ent/", "elephant"), "able": ("means can be", "readable"),
    "ible": ("means can be", "possible"), "ous": ("means full of", "famous"),
    "ious": ("means full of", "curious"), "ary": ("sounds like /air-ee/", "library"),
}
for _suffix, (_meaning, _example) in _SUFFIXES.items():
    _INFO[f"suffix_{_suffix}"] = (
        f"Ends with -{_suffix}",
        f"The ending -{_suffix} {_meaning}. Spell the base word, then add -{_suffix}.",
        _example,
    )


def type_info(word_type):
    """Return {"tag", "label", "tip", "example"} for a word type."""
    label, tip, example = _INFO.get(
        word_type,
        ("Tricky letters", "Say the word slowly and listen for each sound.", "—"),
    )
    return {"tag": word_type, "label": label, "tip": tip, "example": example}
