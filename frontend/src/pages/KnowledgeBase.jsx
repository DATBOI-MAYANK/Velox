import { useMemo, useState } from "react";
import AppShell from "@layouts/AppShell.jsx";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileEdit,
  FilePlus2,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";

/* ----------------------------- mock data ----------------------------- */
const SUMMARY = [
  { key: "total",     label: "Total Articles",   value: "156",   hint: "↑ 12 this month",  icon: BookOpen,     tone: "#F1ECFF", color: "#7C5CFF" },
  { key: "published", label: "Published",        value: "132",   hint: "85% of total",     icon: CheckCircle2, tone: "#E9F5E0", color: "#3FA02A" },
  { key: "drafts",    label: "Drafts",           value: "18",    hint: "12% of total",     icon: FileEdit,     tone: "#FFF5DC", color: "#C28A00" },
  { key: "used",      label: "Used in Responses",value: "1,248", hint: "This month",       icon: Eye,          tone: "#FCE7F3", color: "#D63384" },
];

const TABS = [
  { key: "all",       label: "All Articles", count: 156 },
  { key: "published", label: "Published",    count: 132 },
  { key: "drafts",    label: "Drafts",       count: 18 },
  { key: "archived",  label: "Archived",     count: 6 },
];

const STATUS_TONES = {
  Published: { bg: "#E9F5E0", color: "#3FA02A" },
  Draft:     { bg: "#FFF5DC", color: "#C28A00" },
  Archived:  { bg: "#F1ECFF", color: "#7C5CFF" },
};

const ARTICLES = [
  { id: "a1", title: "How to track my order?",            category: "Order & Shipping",  status: "Published", used: 342, updated: "May 20, 2025", tags: ["track order", "shipping", "delivery"] },
  { id: "a2", title: "How can I return an item?",         category: "Returns & Refunds", status: "Published", used: 287, updated: "May 18, 2025", tags: ["returns", "refund"] },
  { id: "a3", title: "What payment methods do you accept?",category:"Payments",          status: "Published", used: 201, updated: "May 18, 2025", tags: ["payments", "billing"] },
  { id: "a4", title: "How do I change my account password?",category:"Account Management",status:"Published", used: 156, updated: "May 15, 2025", tags: ["account", "security"] },
  { id: "a5", title: "How long does delivery take?",      category: "Order & Shipping",  status: "Draft",     used:   0, updated: "May 14, 2025", tags: ["delivery"] },
  { id: "a6", title: "Do you ship internationally?",      category: "Order & Shipping",  status: "Published", used:  98, updated: "May 12, 2025", tags: ["shipping", "international"] },
  { id: "a7", title: "How do I contact customer support?",category: "General",           status: "Published", used: 165, updated: "May 10, 2025", tags: ["support"] },
  { id: "a8", title: "Can I cancel my order?",            category: "Order & Shipping",  status: "Draft",     used:   0, updated: "May 9, 2025",  tags: ["orders", "cancel"] },
];

const CATEGORIES = ["All Categories", "Order & Shipping", "Returns & Refunds", "Payments", "Account Management", "General"];
const SORT_OPTIONS = ["Latest", "Most Used", "Title A–Z", "Title Z–A"];

const WORKFLOW = [
  { key: "create",    title: "Create Article", desc: "Add new FAQ or knowledge article", icon: FilePlus2, tone: "#F1ECFF", color: "#7C5CFF" },
  { key: "category",  title: "Categorize",     desc: "Assign category and tags",         icon: BookOpen,  tone: "#E9F5E0", color: "#3FA02A" },
  { key: "publish",   title: "Publish",        desc: "Make article live for AI & agents",icon: CheckCircle2, tone: "#FFF5DC", color: "#C28A00" },
  { key: "ai",        title: "AI Uses",        desc: "Article used in automated replies",icon: Eye,       tone: "#FCE7F3", color: "#D63384" },
  { key: "analyze",   title: "Analyze",        desc: "Track usage and improve content",  icon: Filter,    tone: "#F1ECFF", color: "#7C5CFF" },
  { key: "update",    title: "Update",         desc: "Edit and keep knowledge fresh",    icon: Pencil,    tone: "#E9F5E0", color: "#3FA02A" },
];

/* ============================== page ============================== */
export default function KnowledgeBase() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("Latest");
  const [selectedId, setSelectedId] = useState("a1");
  const [showDetails, setShowDetails] = useState(true);

  const filtered = useMemo(() => {
    let rows = ARTICLES;
    if (tab === "published") rows = rows.filter((r) => r.status === "Published");
    if (tab === "drafts") rows = rows.filter((r) => r.status === "Draft");
    if (tab === "archived") rows = rows.filter((r) => r.status === "Archived");
    if (category !== "All Categories") rows = rows.filter((r) => r.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (sort === "Most Used") rows = [...rows].sort((a, b) => b.used - a.used);
    if (sort === "Title A–Z") rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "Title Z–A") rows = [...rows].sort((a, b) => b.title.localeCompare(a.title));
    return rows;
  }, [tab, category, sort, search]);

  const selected = ARTICLES.find((a) => a.id === selectedId) || ARTICLES[0];

  return (
    <AppShell
      active="kb"
      title="Knowledge Base"
      subtitle="Manage FAQs, articles, and AI knowledge to improve customer support."
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold ring-1 ring-black/15">
            <Filter size={13} strokeWidth={2.5} className="text-[#7C5CFF]" />
            Filters
            <ChevronDown size={12} strokeWidth={2.5} className="text-black/50" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5">
            <Plus size={13} strokeWidth={3} />
            New Article
          </button>
        </>
      }
    >
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY.map((s) => (
          <SummaryCard key={s.key} {...s} />
        ))}
      </div>

      {/* Main split: list + details panel */}
      <div className={`mt-4 grid grid-cols-1 gap-4 ${showDetails ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
        <Card>
          {/* Tabs */}
          <div className="-mx-1 mb-3 flex items-center gap-1 overflow-x-auto border-b border-black/5 px-1 pb-2">
            {TABS.map((t) => {
              const sel = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    sel ? "bg-[#E9F5E0] text-[#3FA02A] ring-1 ring-black/10" : "text-black/55 hover:bg-[#FAFAF6]"
                  }`}
                >
                  {t.label} <span className="text-black/40">({t.count})</span>
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full bg-[#FAFAF6] px-3 py-2 ring-1 ring-black/10">
              <Search size={13} strokeWidth={2.5} className="text-black/45" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-transparent text-[12px] font-medium placeholder:text-black/40 focus:outline-none"
              />
            </label>
            <SelectPill value={category} onChange={setCategory} options={CATEGORIES} />
            <SelectPill value={sort} onChange={setSort} options={SORT_OPTIONS} prefix="Sort:" />
          </div>

          {/* Table */}
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead>
                <tr className="text-black/45">
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Used in Responses</Th>
                  <Th>Updated</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const sel = a.id === selectedId;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => { setSelectedId(a.id); setShowDetails(true); }}
                      className={`cursor-pointer border-t border-black/5 align-middle transition-colors ${
                        sel ? "bg-[#FAFAF6]" : "hover:bg-[#FAFAF6]"
                      }`}
                    >
                      <Td className="font-semibold">{a.title}</Td>
                      <Td className="font-medium text-black/65">{a.category}</Td>
                      <Td><Pill tone={STATUS_TONES[a.status]}>{a.status}</Pill></Td>
                      <Td className="text-right font-semibold text-black/70">{a.used}</Td>
                      <Td className="font-medium text-black/55">{a.updated}</Td>
                      <Td className="text-right">
                        <span className="inline-flex items-center gap-1">
                          <IconBtn aria-label="Edit"><Pencil size={12} strokeWidth={2.5} /></IconBtn>
                          <IconBtn aria-label="More"><MoreHorizontal size={13} strokeWidth={2.5} /></IconBtn>
                        </span>
                      </Td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-2 py-8 text-center text-[12px] font-medium text-black/45">
                      No articles match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[11px] font-medium text-black/55">
              Showing 1 to {Math.min(filtered.length, 8)} of 156 articles
            </div>
            <Pagination />
          </div>
        </Card>

        {showDetails && (
          <Card className="lg:sticky lg:top-4 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-[14px] uppercase tracking-wide">Article Details</span>
              <button
                onClick={() => setShowDetails(false)}
                aria-label="Close details"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAFAF6] hover:bg-white hover:ring-1 hover:ring-black/10"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>

            <Field label="Title">
              <input
                defaultValue={selected.title}
                key={selected.id + "-title"}
                className="w-full rounded-[14px] bg-[#FAFAF6] px-3 py-2 text-[12px] font-semibold ring-1 ring-black/10 focus:outline-none focus:ring-black/25"
              />
            </Field>

            <Field label="Category">
              <SelectBox defaultValue={selected.category} options={CATEGORIES.slice(1)} />
            </Field>

            <Field label="Status">
              <SelectBox defaultValue={selected.status} options={["Published", "Draft", "Archived"]} />
            </Field>

            <Field label="Answer / Content">
              <textarea
                key={selected.id + "-content"}
                rows={5}
                defaultValue={`You can track your order by logging into your account and going to the "My Orders" section. Click on the order you want to track and you will see real-time shipping updates.\n\nYou will also receive email updates with tracking links once your order is shipped.`}
                className="w-full resize-none rounded-[14px] bg-[#FAFAF6] px-3 py-2 text-[12px] leading-relaxed ring-1 ring-black/10 focus:outline-none focus:ring-black/25"
              />
            </Field>

            <Field label="Keywords / Tags">
              <div className="flex flex-wrap items-center gap-1.5">
                {selected.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-[#F1ECFF] px-2.5 py-1 text-[10px] font-bold text-[#7C5CFF]"
                  >
                    {t}
                    <X size={10} strokeWidth={3} className="opacity-60" />
                  </span>
                ))}
                <button className="inline-flex items-center gap-1 rounded-full bg-[#FAFAF6] px-2.5 py-1 text-[10px] font-bold text-black/55 ring-1 ring-black/10">
                  <Plus size={10} strokeWidth={3} /> Add tag
                </button>
              </div>
            </Field>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-[14px] bg-[#FAFAF6] p-3 text-[11px]">
              <div>
                <div className="font-semibold text-black/45 uppercase tracking-wide text-[10px]">Used In Responses</div>
                <div className="mt-1 font-bold text-black/75">{selected.used} times this month</div>
              </div>
              <div>
                <div className="font-semibold text-black/45 uppercase tracking-wide text-[10px]">Last Updated</div>
                <div className="mt-1 font-bold text-black/75">{selected.updated} by Admin User</div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-full bg-black px-4 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5">
                Edit Article
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold ring-1 ring-black/15 transition-transform hover:-translate-y-0.5">
                <Filter size={12} strokeWidth={2.8} className="text-[#7C5CFF]" />
                View Analytics
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Workflow strip */}
      <Card className="mt-4">
        <div className="mb-3 font-display text-[12px] uppercase tracking-wide">Knowledge Workflow</div>
        <div className="flex flex-wrap items-stretch gap-3">
          {WORKFLOW.map((w, i) => {
            const Icon = w.icon;
            return (
              <div key={w.key} className="flex flex-1 min-w-[160px] items-center gap-3">
                <div className="flex flex-1 items-start gap-2.5 rounded-[18px] bg-[#FAFAF6] p-3 ring-1 ring-black/10">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ background: w.tone, color: w.color }}
                  >
                    <Icon size={14} strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-[12px] font-bold">{w.title}</div>
                    <div className="mt-0.5 text-[10px] font-medium text-black/55">{w.desc}</div>
                  </div>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <ChevronRight size={14} strokeWidth={2.5} className="hidden shrink-0 text-black/35 sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </AppShell>
  );
}

/* ============================== bits ============================== */
function SummaryCard({ label, value, hint, icon: Icon, tone, color }) {
  return (
    <div className="rounded-[28px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.03)] ring-1 ring-black/15">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/5"
          style={{ background: tone, color }}
        >
          <Icon size={16} strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-black/55">{label}</div>
          <div className="mt-1 font-display text-[24px] leading-none tracking-tight">{value}</div>
          <div className="mt-1.5 text-[10px] font-medium text-black/45">{hint}</div>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[32px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.03)] ring-1 ring-black/15 ${className}`}>
      {children}
    </div>
  );
}

function Pill({ tone, children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ background: tone.bg, color: tone.color }}
    >
      {children}
    </span>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wide ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-2 py-2.5 ${className}`}>{children}</td>;
}

function IconBtn({ children, ...rest }) {
  return (
    <button
      {...rest}
      onClick={(e) => { e.stopPropagation(); rest.onClick?.(e); }}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FAFAF6] hover:bg-white hover:ring-1 hover:ring-black/10"
    >
      {children}
    </button>
  );
}

function SelectPill({ value, onChange, options, prefix }) {
  return (
    <label className="inline-flex items-center gap-1 rounded-full bg-[#FAFAF6] px-3 py-2 text-[11px] font-semibold ring-1 ring-black/10">
      {prefix && <span className="text-black/45">{prefix}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-1 focus:outline-none"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} strokeWidth={2.5} className="text-black/50" />
    </label>
  );
}

function Field({ label, children }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-black/55">{label}</span>
      {children}
    </label>
  );
}

function SelectBox({ defaultValue, options }) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        className="w-full appearance-none rounded-[14px] bg-[#FAFAF6] px-3 py-2 pr-8 text-[12px] font-semibold ring-1 ring-black/10 focus:outline-none focus:ring-black/25"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} strokeWidth={2.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/50" />
    </div>
  );
}

function Pagination() {
  const pages = ["1", "2", "3", "…", "20"];
  const [active, setActive] = useState("1");
  return (
    <div className="inline-flex items-center gap-1">
      <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAFAF6] text-black/55 hover:bg-white hover:ring-1 hover:ring-black/10">
        <ChevronLeft size={12} strokeWidth={2.5} />
      </button>
      {pages.map((p) => {
        const sel = p === active;
        return (
          <button
            key={p}
            onClick={() => p !== "…" && setActive(p)}
            className={`min-w-7 rounded-full px-2 py-1 text-[11px] font-bold ${
              sel ? "bg-[#E9F5E0] text-[#3FA02A] ring-1 ring-black/10" : "text-black/55 hover:bg-[#FAFAF6]"
            }`}
            disabled={p === "…"}
          >
            {p}
          </button>
        );
      })}
      <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAFAF6] text-black/55 hover:bg-white hover:ring-1 hover:ring-black/10">
        <ChevronRight size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
