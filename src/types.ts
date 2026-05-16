export type Locale = "en" | "ar";

export type ResumeSectionType =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

export type ResumeSection = {
  id: string;
  type: ResumeSectionType;
  title: string;
  visible: boolean;
  content: string;
};

export type ResumeTheme = {
  font: string;
  accent: string;
  density: "compact" | "balanced" | "spacious";
  layout: "single" | "sidebar" | "split";
};

export type Resume = {
  id: string;
  title: string;
  locale: Locale;
  targetRole: string;
  updatedAt: string;
  atsScore: number;
  theme: ResumeTheme;
  basics: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    links: string[];
  };
  sections: ResumeSection[];
};

export type Template = {
  id: string;
  name: string;
  category: "Minimal" | "Corporate" | "Creative" | "Developer" | "Student" | "Executive";
  isPremium: boolean;
  isTrending: boolean;
  atsSafe: boolean;
  supportsArabic: boolean;
  accent: string;
  layout: ResumeTheme["layout"];
  description: string;
};

export type AtsReport = {
  score: number;
  keywordScore: number;
  readabilityScore: number;
  formattingScore: number;
  missingKeywords: string[];
  suggestions: string[];
};
