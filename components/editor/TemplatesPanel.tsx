"use client";
import NextImage from "next/image";
import { useEffect, useMemo, useState } from "react";
import { editorTemplates, templateCategories, type TemplateCategory, type TemplateDefinition } from "@/lib/editor-templates";
type CategoryFilter = "All" | TemplateCategory;
type Props = { loadingTemplateId: string | null; error: string; onClose: () => void; onSelect: (template: TemplateDefinition) => Promise<boolean> };

export default function TemplatesPanel({ loadingTemplateId, error, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const visibleTemplates = useMemo(() => {
    const term = query.trim().toLowerCase();
    return editorTemplates.filter((template) => (category === "All" || template.category === category) && (!term || [template.name, template.category, ...template.tags].join(" ").toLowerCase().includes(term)));
  }, [category, query]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && !loadingTemplateId) onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [loadingTemplateId, onClose]);
  async function selectTemplate(template: TemplateDefinition) { if (!loadingTemplateId && await onSelect(template)) onClose(); }

  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#211925]/65 p-0 backdrop-blur-[2px] sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !loadingTemplateId) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="templates-title" className="flex h-full w-full flex-col overflow-hidden bg-[#faf8fa] shadow-2xl sm:h-[88vh] sm:w-[90vw] sm:max-w-[1360px] sm:rounded-[2rem]">
      <header className="shrink-0 border-b border-[#e4dde3] bg-white px-4 py-4 sm:px-7 sm:py-5">
        <div className="flex items-start justify-between gap-4"><div><h2 id="templates-title" className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">Choose a Template</h2><p className="mt-1 text-xs leading-5 text-[#817584] sm:text-sm">Start with a design and make it your own.</p></div><button type="button" onClick={onClose} disabled={loadingTemplateId !== null} className="grid size-10 shrink-0 place-items-center rounded-full border border-[#ded6dc] text-xl text-[#6d626f] transition hover:bg-[#f6f2f6] disabled:cursor-wait disabled:opacity-40" aria-label="Close template library">×</button></div>
        <label className="relative mt-4 block"><span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#8d828f]" aria-hidden="true">⌕</span><span className="sr-only">Search templates</span><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates..." className="h-12 w-full rounded-2xl border border-[#dcd4db] bg-[#fcfbfc] pl-11 pr-4 text-sm outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd] focus:ring-2 focus:ring-[#8c68bd]/15" /></label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Template categories">{(["All", ...templateCategories] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7957a7] ${category === item ? "border-[#7957a7] bg-[#7957a7] text-white shadow-sm" : "border-[#ded6de] bg-white text-[#6e6270] hover:border-[#bbaac4]"}`}>{item}</button>)}</div>
        {error && <p role="alert" className="mt-3 rounded-xl bg-[#fff1ed] px-4 py-2.5 text-xs font-medium text-[#a84734]">{error}</p>}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{visibleTemplates.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">{visibleTemplates.map((template) => {
        const loading = loadingTemplateId === template.id;
        return <button key={template.id} type="button" disabled={loadingTemplateId !== null} onClick={() => void selectTemplate(template)} className="group overflow-hidden rounded-2xl border border-[#e2dae2] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#b89ec9] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7957a7] disabled:cursor-wait disabled:opacity-60"><span className="relative block aspect-square overflow-hidden bg-[#f0ebf0]"><NextImage src={template.thumbnail} alt={`${template.name} cake topper template`} fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 29vw, (max-width: 1280px) 21vw, 240px" className="object-cover transition duration-300 group-hover:scale-[1.035]" /><span className="absolute inset-0 bg-gradient-to-t from-[#241827]/75 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" /><span className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 px-3 py-2 text-center text-[11px] font-semibold text-[#5f3d8e] opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100">{loading ? "Loading template..." : "Use Template"}</span></span><span className="block p-3"><span className="block text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a8094]">{template.category}</span><span className="mt-1 block text-xs font-semibold leading-5 text-[#514654] sm:text-sm">{template.name}</span></span></button>;
      })}</div> : <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-[#dcd3dc] bg-white"><p className="text-sm text-[#8e828f]">No templates found.</p></div>}</div>
    </section>
  </div>;
}
