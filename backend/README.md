# Bee Spelling backend (Python)

A small FastAPI server around `spelling_recommender.py`. It gives the website:

1. **The 10-word check-in quiz.** Random words from `words_typed.json` that get harder one by one (by the dataset's `difficulty`), each with a different word type where possible (`type`, e.g. `double_l`, `vowel_ea`).
2. **The first 10-word list.** Every typed answer goes through `recordMistake`, then `findWords` picks 10 words.
3. **Every list after that.** When a list is finished, its answers go through `recordMistake` again and `findWords` picks the next 10. The level moves up after 8+/10 and down after 5/10 or fewer.

## Files

| File | What it is |
|---|---|
| `spelling_recommender.py` | The recommender (`recordMistake`, `findWords`, `get_all_patterns`). Unchanged. |
| `words_typed.json` | 20,602 words with `difficulty`, `frequency`, syllables and `type`. Made by `build_word_types.py`. |
| `words_cleaned.json`, `build_word_types.py` | The source list and the script that adds `type` to it. |
| `demo_test.py` | Simulates 20 mistakes and prints 10 recommendations. |
| `server.py` | The web server (endpoints below). |
| `kid_safe.py` | Leaves out swear words, adult topics, names of people and places, and abbreviations. 17,066 words pass. |
| `word_types.py` | Kid-friendly names, tips and examples for each word type ("The ough team"). |
| `students/` | One JSON file per student (quiz answers, every list, recommender tallies). Not committed. |

## Run it

Needs Python 3.10+.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

Open http://localhost:8000/docs to try every endpoint in the browser.

Then in the website folder, copy `.env.example` to `.env.local` (it has `NEXT_PUBLIC_API_URL=http://localhost:8000`) and run `npm run dev`. Without `.env.local`, the website uses its built-in demo data instead.

## Endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/quiz?grade=3` | — | `{grade, words: Word[10]}` easiest → hardest |
| POST | `/students/{id}/quiz` | `{grade, answers: [{word, typed}]}` | `WordList` (list 1) |
| GET | `/students/{id}/word-list` | — | `WordList` (404 before the quiz) |
| POST | `/students/{id}/word-list/answers` | `{answers: [{word, typed}]}` | `WordList` (the next list) |
| GET | `/students/{id}` | — | Everything saved for the student |
| GET | `/health` | — | Word counts |

- `Word` = `{id, word, definition, difficulty, syllables[], types[]}`
- `WordList` = `{studentId, setNumber, targetDifficulty, words: Word[10], focusAreas: [{tag, label, tip, example, missed}], lastScore: {correct, total}}`
- `typed` is the student's **first try**.
- The student id comes from the website. Each new demo visit is a new student.

## Notes for changing things

- `spelling_recommender` keeps its tallies in module-level lists, so `server.py` loads one student's tallies in, runs it, and saves them back, with a lock so two requests can't mix up students.
- `findWords` is given only kid-friendly words close to the student's level (`word_pool` in `server.py`), so it doesn't jump to very rare words.
- Grade → quiz difficulty range is `GRADE_DIFFICULTY` in `server.py`.
- To block more words, add them to `kid_safe.py`.
