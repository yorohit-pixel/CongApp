"""Add rule-based spelling categories to words_cleaned.json.

Run: python3 build_word_types.py
"""

import json
from pathlib import Path

from spelling_recommender import get_all_patterns


def create_typed_dataset(inputFile="words_cleaned.json", outputFile="words_typed.json"):
    with Path(inputFile).open(encoding="utf-8") as file:
        words = json.load(file)

    for entry in words:
        entry["type"] = get_all_patterns(entry.get("word", ""))

    with Path(outputFile).open("w", encoding="utf-8") as file:
        json.dump(words, file, indent=2, ensure_ascii=False)

    print(f"Finished! Added types to {len(words)} words.")
    print(f"Saved the updated dataset as {outputFile}")


if __name__ == "__main__":
    create_typed_dataset()
