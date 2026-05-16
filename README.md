# MENA Resume Builder SaaS

Modern ATS resume builder SaaS foundation for Egypt, MENA, and international job seekers.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- dnd-kit
- Firebase Auth, Firestore, Storage, Cloud Functions
- OpenAI-ready Cloud Function boundary
- Stripe, Paymob, and Fawry-ready payment boundary

## Local Setup

```bash
npm install
npm run dev
```

PowerShell may block `npm.ps1` on Windows. If that happens, use:

```bash
npm.cmd install
npm.cmd run dev
```

## Environment

Copy `.env.example` to `.env.local` and paste your Firebase web config.

Copy `functions/.env.example` to `functions/.env` and paste server-only keys:

- OpenAI
- Stripe
- Paymob
- Fawry

## Firebase

The project includes:

- `firebase.json`
- `firestore.rules`
- `storage.rules`
- `firestore.indexes.json`
- `functions/src/index.ts`

Run functions locally after installing dependencies:

```bash
npm --prefix functions install
npm run functions:serve
```

## Current Product Surface

- Premium responsive SaaS shell
- Dashboard cards
- Canva-like resume canvas
- Drag-and-drop section ordering
- Visual theme controls
- Template marketplace with search
- Real-time local ATS scoring
- AI writing panel placeholder
- Egypt/international billing surface
- Firebase callable function stubs
- Firestore and Storage security rules
- Architecture and roadmap docs

## Next Implementation Priorities

1. Connect Firebase Auth screens.
2. Persist resume drafts to Firestore.
3. Replace local ATS scoring with callable `analyzeResume`.
4. Add Cloud Run or worker-based Playwright PDF export.
5. Add real Stripe/Paymob/Fawry checkout flows.
6. Connect OpenAI in `rewriteResumeContent`.
7. Add admin template management.
