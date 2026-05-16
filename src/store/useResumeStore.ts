import { create } from "zustand";
import { starterResume } from "../data/seed";
import { AtsReport, Resume, ResumeTheme } from "../types";

type ResumeStore = {
  resume: Resume;
  selectedSectionId: string;
  jobDescription: string;
  atsReport: AtsReport;
  isSaving: boolean;
  setSelectedSection: (id: string) => void;
  updateBasics: (field: keyof Resume["basics"], value: string | string[]) => void;
  updateSection: (id: string, content: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  toggleSection: (id: string) => void;
  updateTheme: (theme: Partial<ResumeTheme>) => void;
  setJobDescription: (value: string) => void;
  runLocalAts: () => void;
  setSaving: (value: boolean) => void;
};

const computeAts = (resume: Resume, jobDescription: string): AtsReport => {
  const text = `${resume.basics.headline} ${resume.sections.map((section) => section.content).join(" ")}`.toLowerCase();
  const keywords = Array.from(
    new Set(
      jobDescription
        .toLowerCase()
        .replace(/[^a-z0-9+#\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 4)
    )
  ).slice(0, 14);
  const matched = keywords.filter((keyword) => text.includes(keyword));
  const missingKeywords = keywords.filter((keyword) => !text.includes(keyword)).slice(0, 6);
  const keywordScore = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 78;
  const hasMetrics = /\d|%|users|revenue|growth|reduced|improved/i.test(text);
  const readabilityScore = text.length > 450 ? 86 : 72;
  const formattingScore = resume.theme.layout === "single" ? 94 : 86;
  const score = Math.round(keywordScore * 0.42 + readabilityScore * 0.28 + formattingScore * 0.2 + (hasMetrics ? 10 : 3));

  return {
    score: Math.min(score, 98),
    keywordScore,
    readabilityScore,
    formattingScore,
    missingKeywords,
    suggestions: [
      hasMetrics ? "Strong quantified impact detected." : "Add measurable impact to 2-3 bullets.",
      missingKeywords.length ? "Mirror the job description language where it is truthful." : "Keyword coverage is strong for this job.",
      resume.sections.some((section) => section.type === "projects")
        ? "Projects section supports technical credibility."
        : "Add projects to improve early-career positioning."
    ]
  };
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: starterResume,
  selectedSectionId: "summary",
  jobDescription:
    "We are hiring a Frontend Developer with React, TypeScript, Firebase, design systems, accessibility, performance optimization, and SaaS dashboard experience.",
  atsReport: computeAts(starterResume, ""),
  isSaving: false,
  setSelectedSection: (id) => set({ selectedSectionId: id }),
  updateBasics: (field, value) =>
    set((state) => ({
      resume: {
        ...state.resume,
        updatedAt: "Unsaved changes",
        basics: { ...state.resume.basics, [field]: value }
      }
    })),
  updateSection: (id, content) =>
    set((state) => ({
      resume: {
        ...state.resume,
        updatedAt: "Unsaved changes",
        sections: state.resume.sections.map((section) => (section.id === id ? { ...section, content } : section))
      }
    })),
  reorderSections: (activeId, overId) =>
    set((state) => {
      const sections = [...state.resume.sections];
      const activeIndex = sections.findIndex((section) => section.id === activeId);
      const overIndex = sections.findIndex((section) => section.id === overId);
      if (activeIndex < 0 || overIndex < 0) return state;
      const [active] = sections.splice(activeIndex, 1);
      sections.splice(overIndex, 0, active);
      return { resume: { ...state.resume, sections, updatedAt: "Unsaved changes" } };
    }),
  toggleSection: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.map((section) =>
          section.id === id ? { ...section, visible: !section.visible } : section
        )
      }
    })),
  updateTheme: (theme) =>
    set((state) => ({
      resume: {
        ...state.resume,
        theme: { ...state.resume.theme, ...theme }
      }
    })),
  setJobDescription: (value) => set({ jobDescription: value }),
  runLocalAts: () => set({ atsReport: computeAts(get().resume, get().jobDescription) }),
  setSaving: (value) => set({ isSaving: value })
}));
