# CLAUDE.md — SidelineRx

## Project Overview

SidelineRx is a mobile-first React web app that serves as a personal sports medicine assistant. It has two main features:
1. **Daily Check-In (Overtraining Detector)** — Users input soreness, sleep quality, training load, and sore area to get a recovery score with tips.
2. **Injury Help (RICE Protocol Guide)** — Users describe an injury to get a structured RICE treatment plan with a built-in icing countdown timer.

The app calls the Anthropic Claude API directly from the browser (no backend).

## Tech Stack

- **React 19** with Vite 7 (SPA, no routing)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Anthropic Claude API** (`claude-sonnet-4-6`) called via `fetch` from the client
- **No backend, no database, no localStorage** — all state is in-memory via React `useState`

## Project Structure

```
src/
├── main.jsx              # App entry point
├── index.css             # Tailwind imports + custom theme + slider styles
├── App.jsx               # Root component: manages tab state and API key
├── api.js                # Claude API helper: callClaude(), prompt builders
└── components/
    ├── Header.jsx        # App header with logo and subtitle
    ├── TabBar.jsx        # Two-tab navigation (Daily Check-In / Injury Help)
    ├── ApiKeyInput.jsx   # API key input field (shared across tabs)
    ├── SliderInput.jsx   # Reusable range slider with label and live value
    ├── CheckInTab.jsx    # Check-in form + ScoreBadge + CheckInResult
    ├── InjuryTab.jsx     # Injury form + RiceCards + RecoveryTimeline + InjuryResult
    ├── IcingTimer.jsx    # Countdown timer with ON/OFF phases and cycle tracking
    ├── LoadingSpinner.jsx# Animated loading indicator
    ├── ErrorCard.jsx     # Error display with retry button
    └── Disclaimer.jsx    # Medical disclaimer text
```

## Key Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Design System / Color Palette

Defined in `src/index.css` via `@theme`:
- **Navy** `#1E3A5F` — primary color (buttons, headers, accents)
- **Navy Light** `#2A4F7F` — hover state
- **Green** `#4CAF82` — positive states (good scores, success)
- **Amber** `#F5A623` — warnings, caution states
- **Red** `#E53E3E` — alerts, "see a doctor" warnings
- Background: `#F7F8FA`, cards: white, max content width: 480px

## API Integration

- All API calls go through `src/api.js`
- `callClaude(systemPrompt, userMessage, apiKey)` — makes a POST to `https://api.anthropic.com/v1/messages`
- Uses the `anthropic-dangerous-direct-browser-access` header for client-side calls
- Prompts are built by `getCheckInPrompt()` and `getInjuryPrompt()` which return `{systemPrompt, userMessage}`
- Claude is instructed to return JSON only; the response parser handles both raw JSON and markdown code-block-wrapped JSON

## Claude API Response Schemas

### Check-In Response
```json
{
  "score": 75,
  "status": "Good to Train | Train Light | Rest Day Recommended | Overtraining Warning",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "seeDoctorFlag": false,
  "seeDoctorReason": null
}
```

### Injury Response
```json
{
  "riceSummary": {
    "rest": "...",
    "ice": "...",
    "compression": "...",
    "elevation": "..."
  },
  "icingIntervalMinutes": 20,
  "recoveryTimelineDays": "3-5 days",
  "avoid": ["...", "..."],
  "seeDoctorConditions": ["...", "..."],
  "urgentFlag": false
}
```

## Conventions

- All components are functional React components with hooks
- No TypeScript — plain JSX
- Tailwind utility classes for all styling (no separate CSS files per component)
- No prop-types or runtime type checking
- Forms use controlled inputs with `useState`
- The API key is entered by the user at runtime and passed as a prop — never hardcoded or stored
- Medical disclaimer must appear on all result screens

## Important Notes for AI Assistants

- The app has NO backend — don't suggest adding server-side routes
- The API key is entered in the UI — don't add .env files for it
- Don't add localStorage/persistence — this is intentionally stateless for the hackathon
- Keep the single-page two-tab architecture — no React Router
- The icing timer in `IcingTimer.jsx` uses `setInterval` with cleanup in `useEffect`
- Tailwind v4 uses `@theme` directive in CSS instead of `tailwind.config.js`
