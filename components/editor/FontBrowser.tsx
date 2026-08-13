"use client";

import { useEffect, useMemo, useState } from "react";
import type { EditorFontOption } from "@/lib/editor-fonts";

const filters = ["All", "Kids", "Fun", "Elegant", "Action", "Handwritten", "Modern"] as const;

type FontBrowserProps = {
  fonts: EditorFontOption[];
  selectedFamily: string;
  onSelect: (family: string) => void;
  onClose: () => void;
};

export default function FontBrowser({ fonts, selectedFamily, onSelect, onClose }: FontBrowserProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof filters)[number]>("All");
  const visibleFonts = useMemo(() => fonts.filter((font) => {
    const matchesSearch = font.label.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = category === "All" || font.category === category;
    return matchesSearch && matchesCategory;
  }), [category, fonts, search]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211725]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="font-browser-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-[#fffdfb] shadow-[0_30px_90px_rgba(38,24,42,0.3)]">
        <div className="border-b border-[#e9e1e7] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><h2 id="font-browser-title" className="text-xl font-semibold tracking-[-0.03em]">More Fonts</h2><p className="mt-1 text-xs text-[#8a7e8c]">Choose a style for your selected text.</p></div><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full border border-[#ddd4dc] text-lg text-[#6d616f] hover:bg-[#f4eff3]" aria-label="Close font browser">×</button></div>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search fonts..." autoFocus className="mt-5 w-full rounded-xl border border-[#dcd3db] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b68b5] focus:ring-2 focus:ring-[#8b68b5]/10" />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{filters.map((filter) => <button key={filter} type="button" onClick={() => setCategory(filter)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${category === filter ? "bg-[#332238] text-white" : "border border-[#ddd5dc] bg-white text-[#756977] hover:border-[#b9aeba]"}`}>{filter}</button>)}</div>
        </div>
        <div className="overflow-y-auto p-4 sm:p-6">
          {visibleFonts.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleFonts.map((font) => <button key={font.label} type="button" onClick={() => { onSelect(font.family); onClose(); }} className={`min-h-28 rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#bca8cf] hover:shadow-md ${selectedFamily === font.family ? "border-[#8b68b5] ring-2 ring-[#8b68b5]/15" : "border-[#e5dee4]"}`}><span className="block truncate text-2xl text-[#332238]" style={{ fontFamily: font.family }}>Happy Birthday</span><span className="mt-3 block text-[11px] font-semibold text-[#776b79]">{font.label}</span><span className="mt-0.5 block text-[9px] uppercase tracking-wide text-[#a096a2]">{font.category}</span></button>)}</div> : <div className="py-16 text-center text-sm text-[#8d828f]">No fonts match your search.</div>}
        </div>
      </div>
    </div>
  );
}
