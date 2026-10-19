"""Bee Spelling backend: the 10-word quiz and the personalized word lists.

Run (from this folder):
    .venv\\Scripts\\python -m uvicorn server:app --reload --port 8000
Then open http://localhost:8000/docs to try every endpoint.

How it works
1. GET  /quiz?grade=3              -> 10 random words, easiest -> hardest, mixed word types.
2. POST /students/{id}/quiz         -> the student's typed answers. The recommender
                                       (spelling_recommender.py) records each mistake and
                                       picks the first 10-word list.
3. GET  /students/{id}/word-list    -> the current 10-word list.
4. POST /students/{id}/word-list/answers
                                    -> answers for that list. They are recorded the same
                                       way and the next 10 words are picked.

Each student's recommender data is saved in students/<id>.json.
"""

import json
import random
import re
import threading
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import spelling_recommender as recommender
from kid_safe import kid_friendly_words
from word_types import type_info

QUIZ_LENGTH = 10
LIST_LENGTH = 10
MIN_DIFFICULTY = 7
MAX_DIFFICULTY = 120

# The dataset's "difficulty" runs from about 5 ("so", "go") to 230 (very rare words).
# Each grade's quiz goes from an easy word to a harder one inside this range.
GRADE_DIFFICULTY = {
    0: (7, 12), 1: (7, 15), 2: (8, 18), 3: (9, 22), 4: (10, 26),
    5: (11, 30), 6: (12, 34), 7: (13, 38), 8: (14, 42),
}

STUDENTS_DIR = Path(__file__).with_name("students")
STUDENTS_DIR.mkdir(exist_ok=True)

ALL_WORDS = recommender._load_words()
KID_WORDS = kid_friendly_words(ALL_WORDS)
WORD_BY_TEXT = {entry["word"]: entry for entry in ALL_WORDS}

# spelling_recommender keeps its data in module-level lists (one learner at a time),
# so requests take turns: load a student's data in, run, save it back out.
_recommender_lock = threading.Lock()

app = FastAPI(title="Bee Spelling backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request bodies ----------

class Answer(BaseModel):
    word: str = Field(description="The correct word")
    typed: str = Field(description="Exactly what the student typed (their first try)")


class QuizAnswers(BaseModel):
    grade: int = Field(ge=0, le=8)
    answers: list[Answer]


class ListAnswers(BaseModel):
    answers: list[Answer]


# ---------- Helpers ----------

def now():
    return datetime.now(timezone.utc).isoformat()


def word_out(entry):
    syllables = [part for part in str(entry.get("syllable_spelling", "")).split("-") if part]
    return {
        "id": f"w{entry.get('index', entry['word'])}",
        "word": entry["word"],
        "definition": entry.get("definition", ""),
        "difficulty": entry.get("difficulty"),
        "syllables": syllables or [entry["word"]],
        "types": [t for t in entry.get("type", []) if t != "non"],
    }


def is_correct(answer):
    return recommender.normalise_word(answer.typed) == recommender.normalise_word(answer.word)


def student_path(student_id):
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", student_id):
        raise HTTPException(status_code=400, detail="That student id isn't valid.")
    return STUDENTS_DIR / f"{student_id}.json"


def load_student(student_id):
    path = student_path(student_id)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def save_student(state):
    student_path(state["id"]).write_text(json.dumps(state, indent=2), encoding="utf-8")


def pick_quiz(grade):
    """10 words that get harder each time, using as many different word types as possible."""
    low, high = GRADE_DIFFICULTY[grade]
    chosen, used_types, used_words = [], set(), set()
    previous_difficulty = low - 1
    for position in range(QUIZ_LENGTH):
        target = low + (high - low) * position / (QUIZ_LENGTH - 1)
        spread = 1
        while True:
            candidates = [
                entry for entry in KID_WORDS
                if abs(entry["difficulty"] - target) <= spread
                and entry["difficulty"] > previous_difficulty
                and entry["word"] not in used_words
            ]
            if len(candidates) >= 5 or spread > 20:
                break
            spread += 1
        if not candidates:
            continue

        def preference(entry):
            types = {t for t in entry.get("type", []) if t != "non"}
            new_types = types - used_types
            # New word types first, then plain words, then repeated types. Random breaks ties.
            rank = 0 if new_types else (1 if not types else 2)
            return (rank, random.random())

        entry = min(candidates, key=preference)
        chosen.append(entry)
        used_words.add(entry["word"])
        used_types.update(t for t in entry.get("type", []) if t != "non")
        previous_difficulty = entry["difficulty"]
    return chosen


def starting_difficulty(grade, answers):
    """Start the lists near the hardest level the student could spell in the quiz."""
    low, high = GRADE_DIFFICULTY[grade]
    levels = sorted(WORD_BY_TEXT.get(recommender.normalise_word(a.word), {}).get("difficulty", low) for a in answers)
    right = sum(is_correct(a) for a in answers)
    if right == 0:
        return low
    if right >= len(levels):
        return high + 2
    return levels[right - 1]


def next_difficulty(target, answers):
    """Harder after a great set, easier after a tough one."""
    if not answers:
        return target
    score = sum(is_correct(a) for a in answers) / len(answers)
    step = max(1, round(target * 0.15))
    if score >= 0.8:
        target += step
    elif score <= 0.5:
        target -= step
    return max(MIN_DIFFICULTY, min(MAX_DIFFICULTY, target))


def word_pool(target):
    """Kid-friendly words near the target difficulty, for findWords to choose from."""
    spread = 4
    while True:
        pool = [entry for entry in KID_WORDS if abs(entry["difficulty"] - target) <= spread]
        if len(pool) >= 60 or spread > 40:
            return pool
        spread += 2


def run_recommender(state, answers):
    """Record the answers with spelling_recommender and pick the next 10 words."""
    with _recommender_lock:
        recommender.patternList.clear()
        recommender.patternTally[:] = state["patternTally"]
        recommender.mistakeTypeTally[:] = state["mistakeTypeTally"]
        recommender.previousRecommendations[:] = state["previousRecommendations"]

        for answer in answers:
            recommender.recordMistake(answer.typed, answer.word)

        recommender._words = word_pool(state["targetDifficulty"])
        try:
            words = recommender.findWords(difficulty=state["targetDifficulty"])
            top_types = recommender.getTopMistakeTypes()
        finally:
            recommender._words = ALL_WORDS

        state["patternTally"] = [list(item) for item in recommender.patternTally]
        state["mistakeTypeTally"] = [list(item) for item in recommender.mistakeTypeTally]
        state["previousRecommendations"] = list(recommender.previousRecommendations)

    missed = dict(state["mistakeTypeTally"])
    state["focusAreas"] = [{**type_info(t), "missed": missed.get(t, 0)} for t in top_types]
    state["setNumber"] += 1
    state["currentList"] = [word_out(WORD_BY_TEXT[w]) for w in words if w in WORD_BY_TEXT][:LIST_LENGTH]
    state["updatedAt"] = now()


def list_out(state):
    return {
        "studentId": state["id"],
        "setNumber": state["setNumber"],
        "targetDifficulty": state["targetDifficulty"],
        "words": state["currentList"],
        "focusAreas": state["focusAreas"],
        "lastScore": state["sets"][-1]["score"] if state["sets"] else state["quiz"]["score"],
    }


def score_of(answers):
    return {"correct": sum(is_correct(a) for a in answers), "total": len(answers)}


# ---------- Endpoints ----------

@app.get("/health")
def health():
    return {"ok": True, "words": len(ALL_WORDS), "kidFriendlyWords": len(KID_WORDS)}


@app.get("/quiz")
def get_quiz(grade: int = Query(ge=0, le=8)):
    """10 random words for the assessment, easiest -> hardest, with varied word types."""
    return {"grade": grade, "words": [word_out(entry) for entry in pick_quiz(grade)]}


@app.post("/students/{student_id}/quiz")
def submit_quiz(student_id: str, body: QuizAnswers):
    """Save the quiz answers and build the student's first 10-word list."""
    if not body.answers:
        raise HTTPException(status_code=400, detail="Please answer at least one word.")
    state = {
        "id": student_id,
        "grade": body.grade,
        "createdAt": now(),
        "updatedAt": now(),
        "patternTally": [],
        "mistakeTypeTally": [],
        # Don't recommend the quiz words straight away.
        "previousRecommendations": [recommender.normalise_word(a.word) for a in body.answers],
        "targetDifficulty": starting_difficulty(body.grade, body.answers),
        "setNumber": 0,
        "currentList": [],
        "focusAreas": [],
        "quiz": {
            "completedAt": now(),
            "answers": [{**a.model_dump(), "correct": is_correct(a)} for a in body.answers],
            "score": score_of(body.answers),
        },
        "sets": [],
    }
    student_path(student_id)  # validates the id before any work
    run_recommender(state, body.answers)
    save_student(state)
    return list_out(state)


@app.get("/students/{student_id}/word-list")
def get_word_list(student_id: str):
    """The student's current 10-word list."""
    state = load_student(student_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Take the quiz first to get your word list.")
    return list_out(state)


@app.post("/students/{student_id}/word-list/answers")
def submit_word_list(student_id: str, body: ListAnswers):
    """Save answers for the current list, then pick the next 10 words from them."""
    state = load_student(student_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Take the quiz first to get your word list.")
    if not body.answers:
        raise HTTPException(status_code=400, detail="Please answer at least one word.")
    state["sets"].append({
        "setNumber": state["setNumber"],
        "completedAt": now(),
        "targetDifficulty": state["targetDifficulty"],
        "answers": [{**a.model_dump(), "correct": is_correct(a)} for a in body.answers],
        "score": score_of(body.answers),
    })
    state["targetDifficulty"] = next_difficulty(state["targetDifficulty"], body.answers)
    run_recommender(state, body.answers)
    save_student(state)
    return list_out(state)


@app.get("/students/{student_id}")
def get_student(student_id: str):
    """Everything saved for a student (quiz answers, every set, recommender tallies)."""
    state = load_student(student_id)
    if state is None:
        raise HTTPException(status_code=404, detail="No student with that id yet.")
    return state
