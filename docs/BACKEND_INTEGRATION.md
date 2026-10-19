# Backend integration guide

> **The Python backend is in [`/backend`](../backend/README.md).** It already powers the check-in's 10 spelling words and the "Practice for you" 10-word lists (see *Python backend: quiz and word lists* below). Turn it on with `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`. Everything else below still runs on mock data and can move to the backend the same way.

Everything the UI needs from the backend goes through **`src/services/`**. Each function is `async`, returns the types in **`src/lib/types.ts`**, and is currently backed by a mock database (`src/services/mock/db.ts`) that saves to the browser's localStorage.

## How to connect the backend

1. Pick a service file (e.g. `src/services/wordSets.ts`).
2. Replace each function body with a real request, keeping the **same name, parameters and return type**:

   ```ts
   export async function getMySets(): Promise<WordSet[]> {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/sets`, { credentials: "include" });
     if (!res.ok) throw new Error("We couldn't load your sets.");
     return res.json();
   }
   ```
3. Thrown errors are shown to the student as friendly messages — keep error text child-friendly.
4. When every file is converted, delete `src/services/mock/` and `src/data/seed.ts`. (`src/data/patterns.ts` holds the child-friendly pattern descriptions and can stay, or be served by the backend.)

Endpoints below are **suggestions**; use whatever routes you like as long as the service functions keep their signatures.

---

## Functions to implement

### My Words — `services/wordSets.ts`
| Function | Returns | Suggested endpoint |
|---|---|---|
| `getMySets()` | `WordSet[]` newest first | `GET /me/sets` |
| `getMySet(setId)` | `WordSet \| null` | `GET /me/sets/:id` (404 → `null`) |
| `createSet(input: WordSetInput)` | `WordSet` | `POST /me/sets` |
| `updateSet(setId, input)` | `WordSet` | `PUT /me/sets/:id` |
| `deleteSet(setId)` | `void` | `DELETE /me/sets/:id` |
| `saveBankWordToMyWords(bankWordId)` | `WordSet` (the "Saved words" set) | `POST /me/saved-words` |
| `isBankWordSaved(bankWordId)` | `boolean` | `GET /me/saved-words/:bankWordId` |

When a set is saved, the mock looks up each word in the word bank and fills in `definition` and `bankWordId` if it finds a match. The backend should do the same so personalized practice knows each word's patterns.

### Community — `services/community.ts`
| Function | Returns | Suggested endpoint |
|---|---|---|
| `searchCommunitySets(query)` | `CommunitySet[]` (most saved first) | `GET /community/sets?q=` — match title, description, creator, tags, grade band and words |
| `getCommunitySet(setId)` | `CommunitySet \| null` | `GET /community/sets/:id` |
| `getSavedCommunitySetIds()` | `string[]` | `GET /me/sets?source=community` |
| `saveCommunitySetToMyWords(setId)` | `WordSet` (an editable copy with `source`) | `POST /community/sets/:id/save` — should be idempotent |

### Daily Word — `services/dailyWord.ts`
| `getDailyWord(date?)` | `DailyWord` | `GET /daily-word?date=YYYY-MM-DD` — same word for everyone on a date |

### Hive: honey, streaks and the honey shop — `services/hive.ts`
| Function | Returns | Suggested endpoint |
|---|---|---|
| `getHive()` | `HiveState` (honey earned/spent/balance, streak, owned + equipped accessories, games played) | `GET /me/hive` |
| `buyAccessory(id)` | `HiveState` — throws a child-friendly error if there isn't enough honey | `POST /me/hive/accessories/:id` |
| `equipAccessory(id)` / `takeOffAccessory(slot)` | `HiveState` | `PUT` / `DELETE /me/hive/equipped/:slot` |
| `recordGameResult(result: GameResultInput)` | `HiveState` | `POST /me/games` — add one honey drop per first-try answer |

- **Honey earned** = words spelled right in practice (`SessionResult` attempts with `correct: true`) + honey from games. **Balance** = earned − spent. Check the balance on the server before a purchase.
- **Streak** counts days in a row with any practice or game. It still counts if today isn't done yet but yesterday was. `best` is the longest run ever. The mock's rules are in `src/lib/streak.ts`.
- The accessory catalogue (names, slots, prices) is in `src/data/accessories.ts`. The drawings live in the frontend (`BeeAccessories.tsx`), so the backend only needs ids and prices.

### Games — `services/games.ts`
| Function | Returns | Suggested endpoint |
|---|---|---|
| `getGameWords(game: GameKind)` | `BankWord[]` (8 for `letter-detective`, 6 for `word-builder`) | `GET /games/:game/words` |

`letter-detective` needs words containing b, d or p (words tagged `letter-reversal` first). `word-builder` needs 3–7 letter words up to one grade above the student's. When a game ends, the UI calls `recordGameResult` (see Hive).

**Honey jar and today's goal** on Home are also worked out in the browser (`src/lib/honey.ts`) from `getHistory()`: one honey drop per word spelled right, and the goal counts words practised today.

**Badges** (Badges page and My profile) are worked out in the browser (`src/lib/badges.ts`) from `getProgressSummary()`, `getHistory()` and `getLatestAssessment()`, so they need no extra endpoint.

### Practice — `services/practice.ts` and `services/progress.ts`
| Function | Returns | Notes |
|---|---|---|
| `getPracticeSession(sourceId)` | `PracticeSession \| null` | `sourceId` is a My Words id, community id, `"personalized"` or `"daily"`. Can stay client-side if the functions above are real. |
| `submitSessionResult(result)` | `SessionResult` | `POST /me/sessions` — called once when a session ends. Each `WordAttempt` has `correct`, `tries`, `usedHint`, `patterns`, `bankWordId`. |
| `getHistory()` | `SessionResult[]` newest first | `GET /me/sessions` |
| `getProgressSummary()` | `ProgressSummary` | `GET /me/progress` |

A word is recorded as **correct** if the student got it right before moving on (after any number of tries). If they used "Show me the word", it is recorded as **not correct**.

### Python backend: quiz and word lists — `services/api.ts`, `assessment.ts`, `recommendations.ts`

Already connected when `NEXT_PUBLIC_API_URL` is set:

| Frontend function | Calls | What happens |
|---|---|---|
| `getAssessmentItems(grade)` | `GET /quiz?grade=` | 10 random dataset words, easiest → hardest, mixed word types. The sound-match section still comes from `src/data/seed.ts`. |
| `submitAssessment(grade, responses)` | `POST /students/:id/quiz` | Each first-try spelling goes through `recordMistake`; `findWords` picks **list 1**. `practiceAreas` = the recommender's top 3 word types. |
| `skipAssessment(grade)` | `POST /students/:id/start` | The check-in is optional. Skipping saves the grade, sets `onboardingComplete`, and list 1 is picked from the grade alone. |
| `getRecommendations()` | `GET /students/:id/word-list` | The current 10-word list (`Recommendation.setNumber`), shown on "Practice for you" as "Word list N". The words themselves are never listed there (only during practice), so the page can't give spellings away. |
| `submitSessionResult(result)` for `"personalized"` | `POST /students/:id/word-list/answers` | First full run of the list only: answers (`WordAttempt.firstTyped`) go through `recordMistake`, the level adjusts, and `findWords` picks the next list. |

- The student id is `profile.id` (a new one per demo visit). Replace it with the signed-in user's id when accounts exist.
- Backend word types (e.g. `vowel_ough`) are mapped to the frontend's `PatternTag`s for hints in `toPatternTags` (`api.ts`). `PatternInfo.tag` and `matchedPattern` can hold either.
- Dataset `difficulty` (about 5–230) is squeezed into the UI's 1–5 by `toDifficulty`.

### Personalized Practice (mock) — `services/recommendations.ts`
| `getRecommendations()` | `Recommendation` | `GET /me/recommendations` |

The UI shows `focusAreas` (pattern, tip, example, reason) and `words`, and starts practice with those words. **No words are generated** — they are selected from the predefined word bank. The mock's logic is in `src/lib/recommend.ts` as a reference:

1. Use the 10 most recent sessions. For each pattern tag, count words practiced and words missed (wrong **or** needed more than one try).
2. Add +2 missed / +2 practiced for each `practiceArea` from the latest personalization test.
3. Rank patterns by miss rate (ties: most misses); keep the top 3.
4. For each pattern, pick up to 4 bank words with that tag, skipping words already spelled right on the first try, closest to the student's grade first, then easiest first.

### Personalization test — `services/assessment.ts`
| Function | Returns | Suggested endpoint |
|---|---|---|
| `getAssessmentItems(grade)` | `AssessmentItem[]` easiest → hardest | `GET /assessment/items?grade=` |
| `submitAssessment(grade, responses)` | `AssessmentSummary` | `POST /me/assessment` — should also set `profile.grade` and `onboardingComplete = true` |

**Onboarding comes first.** A new student's profile starts with `grade: null` and `onboardingComplete: false`. Until `getProfile()` returns `onboardingComplete: true`, the frontend (`OnboardingGate`) sends every page except `/onboarding` and `/settings` to `/onboarding`.
| `getLatestAssessment()` | `AssessmentSummary \| null` | `GET /me/assessment/latest` |

The test runs in sections, in this order:

1. **Spelling** (`hear-and-type`): exactly **10 words, easiest → hardest** (difficulty 1 → 5, one new spelling pattern per word).
2. **Sound match** (`sound-match`): pick the word with the same sound.

Each `AssessmentResponse` has `response` (exactly what was typed or chosen) and `answer` (the correct word). `AssessmentSummary.spelling` keeps every spelling answer as a `SpellingCheckAnswer` (`word`, `typed`, `correct`, `difficulty`, `patterns`) **for later use**, e.g. reports or picking practice words. Please store it. My profile shows it as a word / I typed / result table. **The summary must never be described as a diagnosis.**

### Profile & settings — `services/profile.ts`, `services/settings.ts`

In the UI, the profile is the **My profile** tab of the Settings page (`/settings?tab=profile`).
| Function | Returns | Suggested endpoint |
|---|---|---|
| `getProfile()` | `StudentProfile` | `GET /me` |
| `updateProfile(patch)` | `StudentProfile` | `PATCH /me` |
| `getSettings()` / `saveSettings(s)` | `AccessibilitySettings` | `GET` / `PUT /me/settings` — includes `backgroundTint` (`cream`/`blue`/`yellow`/`green`/`peach`), which new students choose during onboarding, `honeycombBackground` (faint honeycomb page pattern on/off), and `voiceName` (the browser voice Buzz uses, or `null` for automatic) |
| `resetDemoData()` | — | Demo only; remove (and its button in My profile) |

`StudentProfile.displayName` may be `""` (the name question in onboarding is optional); the UI then says "Hi there!". `avatarColor` is the colour of Buzz, the bee buddy: `gold`, `navy`, `green`, `pink` or `purple`.

The mock also starts a brand-new demo student on every new visit (`FRESH_START_EACH_VISIT` in `src/services/mock/db.ts`). That goes away with the mock.

### Audio — `services/audio.ts`
- `speak`, `speakInChunks`, `stopSpeaking`, `isSpeechAvailable` use the browser's speech synthesis. To use recorded audio files instead, have `BankWord` include an audio URL and play it inside `speak`.

---

## Data the backend needs to store

All shapes are in `src/lib/types.ts`. The important ones:

- **`BankWord`** — the predefined word bank: `id`, `text`, `language` (always `en` for now; the app is English-only and focused on dyslexia), `definition`, `exampleSentence`, `partOfSpeech`, `syllables[]`, `patterns: PatternTag[]`, `difficulty` (1–5), `gradeLevel` (0 = K), `category`. The mock bank (`src/data/wordBank.ts`, ~70 words) can be used as seed data.
- **`PatternTag`** — the fixed list of spelling/reading patterns. Child-friendly labels and tips are in `src/data/patterns.ts`. `letter-reversal` tags words with the look-alike letters b / d / p (the Spanish tags were removed).
- **`WordSet`** / **`SetWord`** — a student's sets. `source` is set when copied from Community.
- **`CommunitySet`** — shared sets with `creatorName`, `gradeBand`, `tags`, `saves`.
- **`SessionResult`** / **`WordAttempt`** — practice history (drives recommendations and progress).
- **`AssessmentSummary`** — latest personalization test result.
- **`StudentProfile`**, **`AccessibilitySettings`**.

## Not built yet (frontend)
- Sign-in / accounts (one demo student is assumed).
- Publishing a student's own set to Community.
- Teacher or parent views.
