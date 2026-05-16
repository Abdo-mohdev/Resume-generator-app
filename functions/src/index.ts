import admin from "firebase-admin";
import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { z } from "zod";

admin.initializeApp();

const db = admin.firestore();

const resumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  targetRole: z.string(),
  basics: z.object({
    name: z.string(),
    headline: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    links: z.array(z.string())
  }),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      title: z.string(),
      visible: z.boolean(),
      content: z.string()
    })
  )
});

const requireAuth = (uid?: string) => {
  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  return uid;
};

const computeKeywordReport = (resumeText: string, jobDescription: string) => {
  const normalizedResume = resumeText.toLowerCase();
  const keywords = Array.from(
    new Set(
      jobDescription
        .toLowerCase()
        .replace(/[^a-z0-9+#\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 4)
    )
  ).slice(0, 18);

  const matched = keywords.filter((keyword) => normalizedResume.includes(keyword));
  const missingKeywords = keywords.filter((keyword) => !normalizedResume.includes(keyword)).slice(0, 8);
  const keywordScore = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 76;
  const readabilityScore = resumeText.length > 500 ? 86 : 72;
  const formattingScore = /email|phone|location|skills|experience/i.test(resumeText) ? 90 : 74;
  const score = Math.min(98, Math.round(keywordScore * 0.45 + readabilityScore * 0.3 + formattingScore * 0.25));

  return {
    score,
    keywordScore,
    readabilityScore,
    formattingScore,
    missingKeywords,
    suggestions: [
      missingKeywords.length
        ? `Add relevant keywords: ${missingKeywords.slice(0, 4).join(", ")}.`
        : "Keyword coverage is strong for this job description.",
      "Use achievement bullets with metrics, action verbs, and tools used.",
      "Keep headings simple for ATS parsing: Experience, Skills, Education, Projects."
    ]
  };
};

export const analyzeResume = onCall({ region: "europe-west1" }, async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const payload = z
    .object({
      resume: resumeSchema,
      jobDescription: z.string().max(12000)
    })
    .parse(request.data);

  const resumeText = [
    payload.resume.title,
    payload.resume.targetRole,
    payload.resume.basics.name,
    payload.resume.basics.headline,
    payload.resume.sections.map((section) => `${section.title} ${section.content}`).join(" ")
  ].join(" ");

  const report = computeKeywordReport(resumeText, payload.jobDescription);

  await db.collection("users").doc(uid).collection("resumes").doc(payload.resume.id).set(
    {
      atsScore: report.score,
      lastAtsReport: report,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return report;
});

export const rewriteResumeContent = onCall({ region: "europe-west1" }, async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const payload = z
    .object({
      content: z.string().min(10).max(3000),
      targetRole: z.string().min(2).max(120)
    })
    .parse(request.data);

  await db.collection("users").doc(uid).collection("aiCreditLedger").add({
    amount: -1,
    reason: "resume_rewrite",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  if (!process.env.OPENAI_API_KEY) {
    return {
      rewrite: `${payload.content} Delivered measurable impact for ${payload.targetRole} roles using clear ownership, tools, and business outcomes.`
    };
  }

  // Wire the OpenAI client here after adding your key. Keep this function server-side only.
  return {
    rewrite: `${payload.content} Refined for ${payload.targetRole} with stronger action verbs, ATS keywords, and measurable outcomes.`
  };
});

export const createPdfExport = onCall({ region: "europe-west1" }, async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const payload = z.object({ resumeId: z.string() }).parse(request.data);

  const exportRef = await db.collection("users").doc(uid).collection("exports").add({
    resumeId: payload.resumeId,
    status: "queued",
    format: "pdf",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    exportUrl: `pending://exports/${exportRef.id}`
  };
});

export const createCheckoutSession = onCall({ region: "europe-west1" }, async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const payload = z
    .object({
      planId: z.enum(["pro_monthly", "career_premium", "lifetime_egypt"]),
      provider: z.enum(["stripe", "paymob", "fawry"])
    })
    .parse(request.data);

  await db.collection("payments").add({
    userId: uid,
    planId: payload.planId,
    provider: payload.provider,
    status: "created",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    checkoutUrl: `${process.env.APP_URL ?? "http://localhost:5173"}/billing/checkout-placeholder?provider=${payload.provider}`
  };
});

export const paymentWebhook = onRequest({ region: "europe-west1" }, async (request, response) => {
  logger.info("Payment webhook received", {
    provider: request.query.provider,
    bodyKeys: Object.keys(request.body ?? {})
  });

  response.status(200).json({ received: true });
});
