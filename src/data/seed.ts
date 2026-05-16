import { Resume, Template } from "../types";

export const templates: Template[] = [
  {
    id: "cairo-minimal",
    name: "Cairo Minimal",
    category: "Minimal",
    isPremium: false,
    isTrending: true,
    atsSafe: true,
    supportsArabic: true,
    accent: "#2672ff",
    layout: "single",
    description: "Clean one-column layout for fresh graduates and corporate roles."
  },
  {
    id: "alex-dev",
    name: "Alex Developer",
    category: "Developer",
    isPremium: true,
    isTrending: true,
    atsSafe: true,
    supportsArabic: false,
    accent: "#1dbf91",
    layout: "sidebar",
    description: "Project-first template for software engineers and product builders."
  },
  {
    id: "gulf-executive",
    name: "Gulf Executive",
    category: "Executive",
    isPremium: true,
    isTrending: false,
    atsSafe: true,
    supportsArabic: true,
    accent: "#f5b841",
    layout: "split",
    description: "Elegant leadership format for regional management roles."
  },
  {
    id: "studio-creative",
    name: "Studio Creative",
    category: "Creative",
    isPremium: true,
    isTrending: true,
    atsSafe: false,
    supportsArabic: false,
    accent: "#ff6b5f",
    layout: "sidebar",
    description: "Polished portfolio resume for designers and marketers."
  }
];

export const starterResume: Resume = {
  id: "resume-demo",
  title: "Frontend Developer Resume",
  locale: "en",
  targetRole: "Frontend Developer",
  updatedAt: "Just now",
  atsScore: 82,
  theme: {
    font: "Inter",
    accent: "#2672ff",
    density: "balanced",
    layout: "sidebar"
  },
  basics: {
    name: "Ahmed Hassan",
    headline: "Frontend Developer focused on React, design systems, and SaaS dashboards",
    email: "ahmed@example.com",
    phone: "+20 100 000 0000",
    location: "Cairo, Egypt",
    links: ["linkedin.com/in/ahmed", "github.com/ahmed"]
  },
  sections: [
    {
      id: "summary",
      type: "summary",
      title: "Professional Summary",
      visible: true,
      content:
        "Frontend engineer with 3+ years building React applications, dashboard experiences, and accessible design systems for SaaS products."
    },
    {
      id: "experience",
      type: "experience",
      title: "Experience",
      visible: true,
      content:
        "Built a customer analytics dashboard used by 12k monthly users. Improved page-load performance by 38% through route-level code splitting and asset optimization."
    },
    {
      id: "projects",
      type: "projects",
      title: "Projects",
      visible: true,
      content:
        "Launched an ATS resume analyzer using React, Firebase, and OpenAI to score resumes against job descriptions in real time."
    },
    {
      id: "skills",
      type: "skills",
      title: "Skills",
      visible: true,
      content: "React, TypeScript, Firebase, Tailwind CSS, Framer Motion, Zustand, REST APIs, Accessibility"
    },
    {
      id: "education",
      type: "education",
      title: "Education",
      visible: true,
      content: "B.Sc. Computer Science, Cairo University"
    }
  ]
};
