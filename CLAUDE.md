# Project notes for Claude Code

Bee Spelling: a bee/honeycomb-themed reading and spelling practice website for kids, including children with dyslexia. Built for the Congressional App Challenge by two students.

## Scope: FRONTEND ONLY
- I build the frontend and UI/UX. My friend builds the backend separately.
- Do NOT add API routes, server actions, middleware, databases, authentication, external services, or environment secrets.
- All data goes through `src/services/` (currently mock data in `src/services/mock/` and `src/data/`). Pages and components import only from `@/services`. Keep function names and types in `src/lib/types.ts` stable — the backend will replace the service bodies.
- Backend handoff details live in `docs/BACKEND_INTEGRATION.md`; update it if a service function or type changes.

## Design
- The original Canva screenshots are the source of truth: navy title bar with the big bee, gold honeycomb hexagon navigation (home, +, profile, settings), cream background, white rounded tiles, black-outlined white pill buttons, handwritten section headings, green/red answer pill, small flying bee bottom-left on practice screens.
- Colours are tokens in `src/app/globals.css` (`cream`, `navy`, `ink`, `gold`, `correct`, `incorrect`, `panel`).
- No generic dashboard look, gradients, glassmorphism, heavy shadows or decorative animation.

## Accessibility (required)
- Large controls, visible focus rings, keyboard support, readable type.
- Right/wrong must never be shown by colour alone (use ✓/✗ and words).
- Supportive wording. Never describe the personalization test as a dyslexia diagnosis.
- Settings (text size, easy-read font, spacing, reduced motion) are applied via attributes on `<html>`.

## Commands
- `npm install`, `npm run dev` (http://localhost:3000), `npm run build`, `npm run typecheck`

## Status
- The project was written without being able to run `next build` (offline workspace). It was checked by bundling the same source with esbuild, end-to-end interaction tests in Chromium, and TypeScript against stand-in type definitions. First step on a real machine: run `npm install` and `npm run build` and fix anything that comes up.
