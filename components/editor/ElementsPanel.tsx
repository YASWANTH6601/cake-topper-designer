"use client";

import NextImage from "next/image";
import { useMemo, useState } from "react";
import { elementAssets, elementCategories, type ElementAsset, type ElementCategory } from "@/lib/editor-elements";

type ElementsPanelProps = {
  onAdd: (asset: ElementAsset) => void;
};

export default function ElementsPanel({ onAdd }: ElementsPanelProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ElementCategory | "All">("All");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return elementAssets.filter((asset) => {
      const matchesCategory = category === "All" || asset.category === category;
      const searchable = [asset.name, asset.category, ...asset.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  return (
    <div className="border-t border-[#ebe5ea] p-4">
      <h2 className="text-sm font-semibold">Elements</h2>
      <p className="mt-1 text-xs leading-5 text-[#8d828f]">Add printable stickers and decorations.</p>
      <label className="mt-4 block"><span className="sr-only">Search elements</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search elements..." className="w-full rounded-xl border border-[#dcd4db] px-3 py-2.5 text-xs outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd]" /></label>
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Element categories">
        {(["All", ...elementCategories] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[9px] font-semibold ${category === item ? "border-[#7957a7] bg-[#f1eafa] text-[#674691]" : "border-[#e1dae1] text-[#756a77] hover:border-[#c7b9cc]"}`}>{item}</button>)}
      </div>
      {filtered.length ? <div className="mt-4 grid max-h-[calc(100vh-320px)] grid-cols-2 gap-2 overflow-y-auto pr-1">{filtered.map((asset) => <button key={asset.id} type="button" onClick={() => onAdd(asset)} title={`Add ${asset.name}`} className="overflow-hidden rounded-xl border border-[#e2dae2] bg-white text-left transition hover:border-[#aa92c4] hover:shadow-sm"><span className="relative grid aspect-square place-items-center bg-[#faf7fb] p-3"><NextImage src={asset.src} alt="" fill sizes="110px" className="object-contain p-3" /></span><span className="block truncate px-2 py-2 text-[9px] font-semibold text-[#675c69]">{asset.name}</span></button>)}</div> : <p className="mt-5 rounded-xl border border-dashed border-[#ded6de] px-3 py-5 text-center text-xs text-[#968a98]">No elements found.</p>}
    </div>
  );
}
