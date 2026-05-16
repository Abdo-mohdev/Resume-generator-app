# MENA Resume Builder SaaS Architecture

## Product Shape

This project is designed as a Firebase-backed SaaS resume platform for Egypt, MENA, and international users. The frontend is a Vite React application with Tailwind CSS, Framer Motion, Zustand, dnd-kit, and a structured resume editor. The backend is Firebase Auth, Firestore, Storage, and Cloud Functions.

## Core Architecture

```txt
React/Vite app
  -> Firebase Auth for email/password and Google login
  -> Firestore for users, resumes, templates, ATS reports, exports, payments
  -> Firebase Storage for generated PDFs and template previews
  -> Cloud Functions for ATS analysis, AI, PDF export jobs, checkout sessions, webhooks
```

## Why Structured Editing

The editor uses a structured resume model instead of a fully free canvas. This keeps resumes ATS-safe, makes template switching reliable, enables real-time scoring, and allows high-quality PDF export. Canva-like controls are still supported through section ordering, layout selection, spacing density, themes, colors, and inline editing.

## Firestore Collections

```txt
users/{userId}
users/{userId}/resumes/{resumeId}
users/{userId}/exports/{exportId}
users/{userId}/aiCreditLedger/{entryId}
templates/{templateId}
payments/{paymentId}
```

## Cloud Functions

```txt
analyzeResume
  Scores the resume against a job description and stores the latest report.

rewriteResumeContent
  Uses AI credits and rewrites selected resume content. Currently returns a safe placeholder until OPENAI_API_KEY is added.

createPdfExport
  Creates an export job placeholder. Production should render PDF server-side and store it in Firebase Storage.

createCheckoutSession
  Creates a payment intent/session placeholder for Stripe, Paymob, or Fawry.

paymentWebhook
  Receives payment provider callbacks. Add HMAC/signature validation before enabling production payments.
```

## PDF Export Recommendation

Use a Cloud Run service or a dedicated worker for PDF rendering with Playwright/Chromium. Firebase Functions can enqueue the job, but long-running browser rendering is cleaner in Cloud Run.

Recommended flow:

```txt
User clicks Export
-> createPdfExport callable
-> write queued export document
-> worker renders HTML resume with print CSS
-> Playwright prints PDF
-> upload to Storage users/{uid}/exports/{exportId}.pdf
-> update export document with signed file path
```

## Payment Strategy

Use environment-driven providers:

- Stripe for international cards and subscriptions
- Paymob for Egyptian cards and mobile wallet-style checkout
- Fawry for reference/cash payments
- InstaPay can be handled manually in beta or through a payment partner if an official merchant flow is available

Never trust client-side subscription state. Payment webhooks should update Firestore subscription records after signature verification.

## Scaling Notes

- Cache template metadata publicly.
- Store resume JSON as canonical source.
- Store export history separately.
- Rate-limit AI functions per user.
- Track AI credits in an append-only ledger.
- Use admin custom claims for admin panel access.
- Keep templates data-driven so the marketplace can grow without redeploying the app.
