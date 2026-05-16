import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { AtsReport, Resume } from "../types";
import { db, functions } from "../lib/firebase";

export const saveResumeDraft = async (userId: string, resume: Resume) => {
  await setDoc(
    doc(db, "users", userId, "resumes", resume.id),
    {
      ...resume,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
};

export const subscribeToResume = (
  userId: string,
  resumeId: string,
  onChange: (resume: Resume | null) => void
) => {
  return onSnapshot(doc(db, "users", userId, "resumes", resumeId), (snapshot) => {
    onChange(snapshot.exists() ? (snapshot.data() as Resume) : null);
  });
};

export const analyzeResume = async (resume: Resume, jobDescription: string): Promise<AtsReport> => {
  const callable = httpsCallable<{ resume: Resume; jobDescription: string }, AtsReport>(
    functions,
    "analyzeResume"
  );
  const result = await callable({ resume, jobDescription });
  return result.data;
};

export const generateAiRewrite = async (content: string, targetRole: string) => {
  const callable = httpsCallable<{ content: string; targetRole: string }, { rewrite: string }>(
    functions,
    "rewriteResumeContent"
  );
  const result = await callable({ content, targetRole });
  return result.data.rewrite;
};

export const createPdfExport = async (resumeId: string) => {
  const callable = httpsCallable<{ resumeId: string }, { exportUrl: string }>(functions, "createPdfExport");
  const result = await callable({ resumeId });
  return result.data.exportUrl;
};
