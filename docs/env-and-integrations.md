# Environment And Integrations

## Frontend `.env`

Copy `.env.example` to `.env.local` and paste Firebase web app values.

```txt
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_USE_FIREBASE_EMULATORS=false
VITE_FUNCTIONS_REGION=europe-west1
```

## Functions `.env`

Copy `functions/.env.example` to `functions/.env`.

```txt
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID_CARD=
PAYMOB_INTEGRATION_ID_WALLET=
PAYMOB_IFRAME_ID=
PAYMOB_HMAC_SECRET=
FAWRY_MERCHANT_CODE=
FAWRY_SECURITY_KEY=
APP_URL=
```

## Production Hardening

- Add provider signature verification to `paymentWebhook`.
- Add App Check for callable functions.
- Add per-user AI rate limits.
- Add Stripe/Paymob/Fawry idempotency keys.
- Keep OpenAI and payment keys only in Cloud Functions.
- Use signed URLs or authenticated Storage reads for PDFs.
