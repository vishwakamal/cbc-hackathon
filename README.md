# SidelineRx

**Your personal sports medicine assistant — at home, on the sideline, wherever you need it.**

SidelineRx is a mobile-first web app that acts as a personal sports medicine assistant. It combines two core features:

1. **Overtraining Detector** — Daily check-in that tracks fatigue and soreness and gives you a personalized recovery score
2. **Injury Response Guide** — Walks you through RICE protocol and home recovery steps for common sports injuries, including a built-in icing timer

## Tech Stack

- **Frontend**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API (claude-sonnet-4-6) via direct fetch
- **State**: React useState (client-side only, no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and enter your Anthropic API key to use the app.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Disclaimer

SidelineRx is for informational purposes only and is not a substitute for professional medical advice. Always consult a healthcare provider for serious injuries.
