# Bee Spelling

Friendly reading and spelling practice for kids, including children with dyslexia, built for the Congressional App Challenge.

- **Frontend** (this folder): Next.js website.
- **Backend** ([`backend/`](backend/README.md)): Python (FastAPI) around our spelling recommender. It picks the 10-word check-in quiz from a 20,000-word dataset, then builds each personalized 10-word list from the student's answers.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4**.

---

## Run it

You need **Node.js 18.18 or newer** (Node 20 or 22 recommended) and an internet connection for the first install.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Other commands:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check only |

No API keys or database are needed. On its own, the website uses built-in demo data.

### With the Python backend

1. Start the backend (see [backend/README.md](backend/README.md)): `cd backend`, set up the venv, then `uvicorn server:app --reload --port 8000`.
2. Copy `.env.example` to `.env.local` (it sets `NEXT_PUBLIC_API_URL=http://localhost:8000`).
3. Run `npm run dev`. The check-in's spelling words and "Practice for you" lists now come from the recommender.

> **Fonts:** Open Sans, Patrick Hand (the handwritten headings) and Atkinson Hyperlegible (easy-read mode) come from Google Fonts through `next/font`. They are downloaded once during `npm run dev` / `npm run build`, then served locally.

**Demo data:** every new visit (a new tab or window) starts as a brand-new student, so the full Welcome flow shows each time. Within a visit, data is kept in localStorage, so a refresh keeps your place. To start over mid-visit, go to **Settings → My profile → Reset demo data**. To keep data between visits instead, set `FRESH_START_EACH_VISIT = false` in `src/services/mock/db.ts`.

---

## What's in the app

| Route | Screen | Design reference |
|---|---|---|
| `/` | Home: Buzz's greeting + tip of the day, today's goal, honey jar, then "My words list", "Games" and "Community list" tiles, Daily Word tile | Designs 3 & 9 |
| `/practice/[setId]` | One-word-at-a-time practice: hear the word, type, hint, check, next | Designs 2, 4, 5, 6, 7 |
| (same route, at the end) | Results: "All Done!!!", score, try again, home, word list | Design 8 |
| `/onboarding` | "Welcome!!!!" + Start → visibility settings (text size, page colour, font, spacing) → first name (optional) + grade question → personalization test (easy → hard). New students are sent here first and can't open other pages (except Settings) until they finish. Retakes from Profile start at the grade question. | Design 1 |
| `/shop` | Honey shop: spend honey on hats, glasses and more for Buzz, with a try-on mirror | — |
| `/badges` | All badges, with how to earn each and progress toward it | — |
| `/streak` | Days in a row, this week's honeycomb, best streak, streak goals | — |
| `/games` | Game picker | — |
| `/games/letter-detective` | "b or d?": hear a word, pick the missing b, d or p | — |
| `/games/word-builder` | "Build the word": tap shuffled letter tiles in order | — |
| `/my-words` | All of the student's sets | — |
| `/my-words/[setId]` | Review a set's words, practice, edit, delete | — |
| `/my-words/[setId]/edit` · `/create` | Create / edit a set: name, add, remove, reorder words | — |
| `/personalized` | Practice for you: tricky patterns + words picked from the word bank | — |
| `/daily-word` | Word, chunks, pronunciation, meaning, example, save, practice | — |
| `/community` · `/community/[setId]` | Search other users' sets, preview, practice, save to My words | — |
| `/settings?tab=profile` | **My profile** (a tab inside Settings): name, grade, Buzz's colour, progress, streak, badges, test results and spelling answers, recent practice, demo reset. `/profile` redirects here. | — |
| `/settings` | Text size, page colour, easy-read font, extra spacing, less movement, voice speed, auto-play, show meanings | — |

`practice/[setId]` accepts a My Words set id, a community set id, `personalized`, or `daily`.

The honeycomb navigation (top right) has six buttons: Home, Create, Games, Honey shop, Badges and Settings (which holds My profile). The streak is shown on Home, in My profile and in the footer. The nav is hidden while a new student does the welcome check-in, since they can't leave it until it's done. Practice, the test and the games show a **bee progress bar** at the bottom of the screen: Buzz flies along a honeycomb track toward a flower as each word is done.

### Mocked / placeholder features
- **Audio playback** uses the browser's built-in speech voice (`speechSynthesis`). No server needed. If a browser has no voice, the speaker button is disabled with a message. Buzz automatically picks the friendliest voice on the device (natural voices like Edge's "Ana" or "Jenny" first, deep or novelty voices never) at a slightly higher pitch; students can choose another under **Settings → Buzz's voice**.
- **The personalization test** has two sections: **1. Spelling** (10 words, easiest to hardest) and **2. Sound match**. There is no reading-aloud part. Every spelling answer (the word and what was typed) is saved with the test result.
- **Sign-in** does not exist yet; there is one demo student ("Sam").

### Accessibility
- One task per screen, large controls (≥ 44px, most ≥ 56px), keyboard-friendly (Enter checks, Enter again moves on).
- Right/wrong is shown with **colour plus a ✓ / ✗ symbol and words**, and announced to screen readers.
- Thick, visible focus ring on every control; skip link; landmarks and headings on every page.
- Settings for text size, page colour (cream, blue, yellow, green, peach), an easy-read font, extra letter spacing and reduced motion apply across the whole site. New students set these up before reading anything.
- Supportive wording ("Not quite yet…") and a reveal option after two tries.
- **Buzz**, the student's bee buddy, explains each step in a speech bubble with a **Read it to me** button, so children who can't read the instructions yet can hear them.
- The personalization test states that it **does not diagnose dyslexia**.

---

## Project structure

```
src/
  app/                 Next.js routes (one folder per page) + layout and global styles
    globals.css        Design tokens (colours sampled from the Canva designs) + accessibility modes + honey drip / tile comb styles
  components/
    layout/            Header bar, big bee, honeycomb navigation, flying bee, PageShell
    ui/                Pills, tiles, handwritten headings, icons, fields, toggles, dialogs
    practice/          Practice runner, answer pill, hint panel, feedback, results screen
    sets/              Set tiles, word list, create/edit form
    onboarding/        Grade picker, test intro, test runner, summary
  context/             SettingsProvider (applies accessibility settings to <html>)
  hooks/               useAsync, useSpeech, usePracticeSession (all practice rules live here)
  lib/                 Types, spelling check + hint builder, recommendation rules, helpers
  services/            ⭐ The backend seam — every data call the UI makes (currently mock)
    mock/db.ts         In-browser mock database (delete when the backend is connected)
  data/                Mock word bank, sample sets, sample history, test questions
docs/
  BACKEND_INTEGRATION.md   Functions, data types and suggested endpoints for the backend
```

**Rule of thumb:** pages and components only import from `@/services`, never from `services/mock` or `data/seed`. Replace the service functions and the UI keeps working.

For the backend handoff, read **[docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)**.
