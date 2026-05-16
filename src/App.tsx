import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Check,
  CreditCard,
  Download,
  FileText,
  Globe2,
  LayoutDashboard,
  Moon,
  Palette,
  PanelRight,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  WalletCards,
  Wand2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { templates } from "./data/seed";
import { useResumeStore } from "./store/useResumeStore";
import { ResumeSection, ResumeTheme, Template } from "./types";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Editor", icon: FileText },
  { label: "Templates", icon: Palette },
  { label: "ATS", icon: ShieldCheck },
  { label: "Billing", icon: CreditCard }
];

const paymentOptions = [
  { name: "Paymob", detail: "Cards, wallets, Vodafone Cash-style flows", icon: WalletCards },
  { name: "Fawry", detail: "Reference payments for Egypt cash users", icon: BriefcaseBusiness },
  { name: "Stripe", detail: "International cards and subscriptions", icon: Globe2 }
];

export const App = () => {
  const [activeTab, setActiveTab] = useState("Editor");
  const [templateQuery, setTemplateQuery] = useState("");
  const [dark, setDark] = useState(false);
  const {
    resume,
    selectedSectionId,
    jobDescription,
    atsReport,
    isSaving,
    setSelectedSection,
    updateBasics,
    updateSection,
    reorderSections,
    toggleSection,
    updateTheme,
    setJobDescription,
    runLocalAts,
    setSaving
  } = useResumeStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const selectedSection = resume.sections.find((section) => section.id === selectedSectionId) ?? resume.sections[0];

  const filteredTemplates = useMemo(() => {
    const query = templateQuery.toLowerCase();
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
    );
  }, [templateQuery]);

  useEffect(() => {
    runLocalAts();
    setSaving(true);
    const saveTimer = window.setTimeout(() => setSaving(false), 900);
    return () => window.clearTimeout(saveTimer);
  }, [resume, jobDescription, runLocalAts, setSaving]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const onDragEnd = (event: DragEndEvent) => {
    if (event.over && event.active.id !== event.over.id) {
      reorderSections(String(event.active.id), String(event.over.id));
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink transition-colors dark:bg-[#0c111d] dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-20 border-r border-slate-200/80 bg-white/80 px-3 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:block">
          <div className="mb-8 grid h-12 w-12 place-items-center rounded-lg bg-brand-600 text-white shadow-lift">
            <Sparkles size={22} />
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                aria-label={item.label}
                title={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`grid h-12 w-12 place-items-center rounded-lg transition ${
                  activeTab === item.label
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-100"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                }`}
              >
                <item.icon size={20} />
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c111d]/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-100">
                  MENA Resume Studio
                </p>
                <h1 className="text-xl font-bold md:text-2xl">ATS resume builder for Egypt and global careers</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 md:flex">
                  <Search size={16} />
                  Search resumes, templates, jobs
                </div>
                <StatusPill saving={isSaving} />
                <button
                  onClick={() => setDark((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  aria-label="Toggle theme"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className="hidden h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white shadow-lift transition hover:-translate-y-0.5 dark:bg-white dark:text-ink md:flex">
                  <Download size={17} />
                  Export PDF
                </button>
              </div>
            </div>
          </header>

          <div className="grid flex-1 grid-cols-1 xl:grid-cols-[300px_minmax(480px,1fr)_360px]">
            <Panel title="Workspace" icon={LayoutDashboard} className="order-2 xl:order-1">
              <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
              <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
              <SectionManager
                sections={resume.sections}
                selectedSectionId={selectedSectionId}
                onSelect={setSelectedSection}
                onToggle={toggleSection}
                onDragEnd={onDragEnd}
                sensors={sensors}
              />
            </Panel>

            <section className="order-1 min-w-0 bg-slate-100/80 p-4 dark:bg-black/20 md:p-6 xl:order-2">
              <AnimatePresence mode="wait">
                {activeTab === "Templates" ? (
                  <TemplateMarketplace
                    query={templateQuery}
                    setQuery={setTemplateQuery}
                    templates={filteredTemplates}
                    onApply={(template) => updateTheme({ accent: template.accent, layout: template.layout })}
                  />
                ) : (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="mx-auto max-w-4xl"
                  >
                    <EditorToolbar
                      accent={resume.theme.accent}
                      density={resume.theme.density}
                      layout={resume.theme.layout}
                      onTheme={updateTheme}
                    />
                    <ResumeCanvas resume={resume} selectedSectionId={selectedSectionId} onSelect={setSelectedSection} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <Panel title="Intelligence" icon={PanelRight} className="order-3">
              <AtsPanel
                score={atsReport.score}
                report={atsReport}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
              />
              <AiWriter
                selectedSection={selectedSection}
                onChange={(content) => updateSection(selectedSection.id, content)}
              />
              <BasicsForm resume={resume} updateBasics={updateBasics} />
              <BillingPreview />
            </Panel>
          </div>
        </section>
      </div>
    </main>
  );
};

const Panel = ({
  children,
  title,
  icon: Icon,
  className = ""
}: {
  children: React.ReactNode;
  title: string;
  icon: typeof LayoutDashboard;
  className?: string;
}) => (
  <aside className={`border-slate-200/80 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] ${className}`}>
    <div className="mb-4 flex items-center gap-2 text-sm font-bold">
      <Icon size={18} className="text-brand-600 dark:text-brand-100" />
      {title}
    </div>
    <div className="space-y-4">{children}</div>
  </aside>
);

const MobileNav = ({
  activeTab,
  setActiveTab
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => (
  <div className="grid grid-cols-5 gap-1 lg:hidden">
    {navItems.map((item) => (
      <button
        key={item.label}
        onClick={() => setActiveTab(item.label)}
        className={`grid h-10 place-items-center rounded-lg ${
          activeTab === item.label ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-white/10"
        }`}
        aria-label={item.label}
      >
        <item.icon size={16} />
      </button>
    ))}
  </div>
);

const StatusPill = ({ saving }: { saving: boolean }) => (
  <div className="flex h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
    <span className={`h-2 w-2 rounded-full ${saving ? "animate-pulse bg-gold" : "bg-mint"}`} />
    {saving ? "Saving" : "Saved"}
  </div>
);

const Dashboard = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold">Startup MVP</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">3 resumes, 26 AI credits</p>
      </div>
      <Bell size={18} className="text-slate-400" />
    </div>
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        ["82", "ATS"],
        ["14", "Exports"],
        ["4", "Templates"]
      ].map(([value, label]) => (
        <button
          key={label}
          onClick={() => setActiveTab(label === "ATS" ? "ATS" : activeTab)}
          className="rounded-lg bg-slate-50 p-3 dark:bg-white/5"
        >
          <p className="text-lg font-black">{value}</p>
          <p className="text-[11px] uppercase text-slate-500">{label}</p>
        </button>
      ))}
    </div>
  </div>
);

const SectionManager = ({
  sections,
  selectedSectionId,
  onSelect,
  onToggle,
  onDragEnd,
  sensors
}: {
  sections: ResumeSection[];
  selectedSectionId: string;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-bold">Sections</p>
      <span className="text-xs text-slate-500">Drag to reorder</span>
    </div>
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              selected={section.id === selectedSectionId}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  </div>
);

const SortableSection = ({
  section,
  selected,
  onSelect,
  onToggle
}: {
  section: ResumeSection;
  selected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${
        selected
          ? "border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-100/50 dark:bg-brand-500/20 dark:text-white"
          : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab rounded-md px-2 text-slate-400">
        ::
      </button>
      <button onClick={() => onSelect(section.id)} className="min-w-0 flex-1 truncate text-left font-semibold">
        {section.title}
      </button>
      <button
        onClick={() => onToggle(section.id)}
        className={`h-5 w-9 rounded-full p-0.5 transition ${section.visible ? "bg-mint" : "bg-slate-300"}`}
        aria-label={`Toggle ${section.title}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${section.visible ? "translate-x-4" : ""}`}
        />
      </button>
    </div>
  );
};

const EditorToolbar = ({
  accent,
  density,
  layout,
  onTheme
}: {
  accent: string;
  density: string;
  layout: string;
  onTheme: (theme: Partial<ResumeTheme>) => void;
}) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="flex items-center gap-2">
      <Wand2 size={18} className="text-brand-600" />
      <span className="text-sm font-bold">Visual editor</span>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {["#2672ff", "#1dbf91", "#ff6b5f", "#f5b841", "#111827"].map((color) => (
        <button
          key={color}
          onClick={() => onTheme({ accent: color })}
          className={`h-7 w-7 rounded-full border-2 ${accent === color ? "border-ink dark:border-white" : "border-white"}`}
          style={{ backgroundColor: color }}
          aria-label={`Use ${color}`}
        />
      ))}
      <select
        value={density}
        onChange={(event) => onTheme({ density: event.target.value as ResumeTheme["density"] })}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-900"
      >
        <option value="compact">Compact</option>
        <option value="balanced">Balanced</option>
        <option value="spacious">Spacious</option>
      </select>
      <select
        value={layout}
        onChange={(event) => onTheme({ layout: event.target.value as ResumeTheme["layout"] })}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-900"
      >
        <option value="single">Single</option>
        <option value="sidebar">Sidebar</option>
        <option value="split">Split</option>
      </select>
    </div>
  </div>
);

const ResumeCanvas = ({
  resume,
  selectedSectionId,
  onSelect
}: {
  resume: ReturnType<typeof useResumeStore.getState>["resume"];
  selectedSectionId: string;
  onSelect: (id: string) => void;
}) => {
  const visibleSections = resume.sections.filter((section) => section.visible);
  const spacious = resume.theme.density === "spacious";
  return (
    <div className="mx-auto min-h-[900px] max-w-[820px] bg-white p-8 shadow-soft dark:bg-slate-50 dark:text-ink md:p-10">
      <div
        className={`grid gap-8 ${
          resume.theme.layout === "sidebar" ? "md:grid-cols-[240px_1fr]" : resume.theme.layout === "split" ? "md:grid-cols-2" : ""
        }`}
      >
        <div>
          <p className="text-4xl font-black leading-tight" style={{ color: resume.theme.accent }}>
            {resume.basics.name}
          </p>
          <p className="mt-2 text-base font-semibold text-slate-700">{resume.basics.headline}</p>
          <div className="mt-5 space-y-1 text-sm text-slate-500">
            <p>{resume.basics.email}</p>
            <p>{resume.basics.phone}</p>
            <p>{resume.basics.location}</p>
            {resume.basics.links.map((link) => (
              <p key={link}>{link}</p>
            ))}
          </div>
        </div>
        <div className={spacious ? "space-y-8" : "space-y-5"}>
          {visibleSections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={`block w-full rounded-lg border p-4 text-left transition ${
                selectedSectionId === section.id ? "border-brand-500 bg-brand-50/70" : "border-transparent hover:bg-slate-50"
              }`}
            >
              <h2 className="mb-2 text-sm font-black uppercase tracking-[0.14em]" style={{ color: resume.theme.accent }}>
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-slate-700">{section.content}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TemplateMarketplace = ({
  query,
  setQuery,
  templates,
  onApply
}: {
  query: string;
  setQuery: (query: string) => void;
  templates: Template[];
  onApply: (template: Template) => void;
}) => (
  <motion.div
    key="templates"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    className="mx-auto max-w-6xl"
  >
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Template marketplace</p>
        <h2 className="text-3xl font-black">Searchable, monetizable resume templates</h2>
      </div>
      <label className="flex h-11 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-sm dark:border-white/10 dark:bg-white/5">
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search developer, Arabic, premium..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <div
          key={template.id}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-white/5"
        >
          <div className="h-56 bg-slate-100 p-5 dark:bg-black/20">
            <div className="h-full rounded-md bg-white p-4 shadow-sm dark:bg-slate-100" style={{ borderTop: `7px solid ${template.accent}` }}>
              <div className="mb-4 h-5 w-2/3 rounded bg-slate-800" />
              <div className="space-y-2">
                <div className="h-2 rounded bg-slate-200" />
                <div className="h-2 w-5/6 rounded bg-slate-200" />
                <div className="h-2 w-4/6 rounded bg-slate-200" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-20 rounded bg-slate-100" />
                <div className="h-20 rounded bg-slate-100" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{template.name}</h3>
                <p className="text-sm text-slate-500">{template.description}</p>
              </div>
              {template.isPremium && <Star size={18} className="fill-gold text-gold" />}
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {[template.category, template.atsSafe ? "ATS-safe" : "Creative", template.supportsArabic ? "Arabic" : "English"].map(
                (tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-white/10">
                    {tag}
                  </span>
                )
              )}
            </div>
            <button
              onClick={() => onApply(template)}
              className="h-10 w-full rounded-lg bg-ink text-sm font-bold text-white dark:bg-white dark:text-ink"
            >
              Apply template
            </button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const AtsPanel = ({
  score,
  report,
  jobDescription,
  setJobDescription
}: {
  score: number;
  report: ReturnType<typeof useResumeStore.getState>["atsReport"];
  jobDescription: string;
  setJobDescription: (value: string) => void;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold">Real-time ATS</p>
        <p className="text-xs text-slate-500">Updates as content changes</p>
      </div>
      <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-xl font-black text-brand-600 dark:bg-brand-500/20 dark:text-brand-100">
        {score}
      </div>
    </div>
    <textarea
      value={jobDescription}
      onChange={(event) => setJobDescription(event.target.value)}
      className="mb-3 min-h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-black/20"
    />
    <div className="space-y-2">
      {[
        ["Keywords", report.keywordScore],
        ["Readability", report.readabilityScore],
        ["Formatting", report.formattingScore]
      ].map(([label, value]) => (
        <div key={label as string}>
          <div className="mb-1 flex justify-between text-xs font-semibold">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-mint" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 space-y-2">
      {report.suggestions.map((suggestion) => (
        <div key={suggestion} className="flex gap-2 text-sm">
          <Check size={16} className="mt-0.5 shrink-0 text-mint" />
          <span>{suggestion}</span>
        </div>
      ))}
    </div>
  </div>
);

const AiWriter = ({
  selectedSection,
  onChange
}: {
  selectedSection: ResumeSection;
  onChange: (value: string) => void;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="mb-3 flex items-center gap-2">
      <Bot size={18} className="text-brand-600" />
      <p className="text-sm font-bold">AI writing studio</p>
    </div>
    <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{selectedSection.title}</p>
    <textarea
      value={selectedSection.content}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-32 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-black/20"
    />
    <div className="mt-3 grid grid-cols-2 gap-2">
      {["Rewrite", "Add metrics", "Shorten", "Arabic"].map((action) => (
        <button
          key={action}
          onClick={() => onChange(`${selectedSection.content} ${action === "Add metrics" ? "Improved measurable impact by 25%." : ""}`.trim())}
          className="h-9 rounded-lg bg-slate-100 text-xs font-bold transition hover:bg-brand-50 hover:text-brand-600 dark:bg-white/10"
        >
          {action}
        </button>
      ))}
    </div>
  </div>
);

const BasicsForm = ({
  resume,
  updateBasics
}: {
  resume: ReturnType<typeof useResumeStore.getState>["resume"];
  updateBasics: ReturnType<typeof useResumeStore.getState>["updateBasics"];
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
    <p className="mb-3 text-sm font-bold">Profile</p>
    <div className="space-y-2">
      {(["name", "headline", "email", "phone", "location"] as const).map((field) => (
        <input
          key={field}
          value={resume.basics[field]}
          onChange={(event) => updateBasics(field, event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-black/20"
        />
      ))}
    </div>
  </div>
);

const BillingPreview = () => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="mb-3 flex items-center gap-2">
      <BarChart3 size={18} className="text-brand-600" />
      <p className="text-sm font-bold">Monetization</p>
    </div>
    <div className="space-y-2">
      {paymentOptions.map((option) => (
        <div key={option.name} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
          <option.icon size={18} className="mt-0.5 text-brand-600" />
          <div>
            <p className="text-sm font-bold">{option.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{option.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
