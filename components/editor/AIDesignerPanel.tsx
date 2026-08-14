"use client";

import NextImage from "next/image";
import { useMemo, useRef, useState } from "react";
import type { DesignShape } from "@/types/design";

const MAX_GENERATIONS = 5;

export type AIGeneratedDesign = {
  id: string;
  src: string;
  prompt: string;
  createdAt: number;
};

type AIDesignerPanelProps = {
  shape: DesignShape;
  width: number;
  height: number;
  hidden: boolean;
  onUseAsBackground: (design: AIGeneratedDesign) => void;
};

type GenerateImageResponse = {
  success: boolean;
  prompt?: string;
  image?: string;
  mimeType?: string;
};

function getDesignLabel(shape: DesignShape, width: number, height: number) {
  if (shape === "circle") return `${width}\" Round`;
  if (shape === "square") return `${width} × ${height}\" Square`;
  return `${width} × ${height}\" Rectangle`;
}

export default function AIDesignerPanel({
  shape,
  width,
  height,
  hidden,
  onUseAsBackground,
}: AIDesignerPanelProps) {
  const [idea, setIdea] = useState("");
  const [message, setMessage] = useState("");
  const [generations, setGenerations] = useState<AIGeneratedDesign[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestInFlight = useRef(false);
  const activeDesign = useMemo(
    () => generations.find((item) => item.id === activeId) ?? generations[0] ?? null,
    [activeId, generations],
  );

  async function generateDesign() {
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) {
      setError("Tell us what artwork you want to create.");
      return;
    }
    if (requestInFlight.current) return;

    requestInFlight.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: trimmedIdea, message: message.trim(), shape, width, height }),
      });
      const result = await response.json() as GenerateImageResponse;

      if (!response.ok || !result.success || !result.image || !result.prompt) {
        throw new Error("Image generation failed");
      }

      const item: AIGeneratedDesign = {
        id: crypto.randomUUID(),
        src: `data:${result.mimeType || "image/png"};base64,${result.image}`,
        prompt: result.prompt,
        createdAt: Date.now(),
      };
      setGenerations((items) => [item, ...items].slice(0, MAX_GENERATIONS));
      setActiveId(item.id);
    } catch {
      setError("Unable to generate this design.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <div hidden={hidden} className="border-t border-[#ebe5ea] p-4">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="text-sm font-semibold">AI Designer</h2><p className="mt-1 text-xs leading-5 text-[#8d828f]">Describe the artwork you want and we’ll create a cake-ready design for you.</p></div>
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#f2ebfb] text-[#7652a5]" aria-hidden="true">✦</span>
      </div>

      <div className="mt-4 rounded-xl border border-[#e4dce8] bg-[#f8f4fa] px-3 py-2.5 text-[10px] text-[#756879]"><span className="font-bold uppercase tracking-[0.1em]">Design</span><span className="ml-2 font-semibold text-[#493d4d]">{getDesignLabel(shape, width, height)}</span></div>

      <label className="mt-4 block text-xs font-semibold text-[#665b68]">What do you want?<textarea value={idea} onChange={(event) => { setIdea(event.target.value); if (error) setError(""); }} rows={4} placeholder="A cute dinosaur birthday party in a colorful jungle" className="mt-2 w-full resize-none rounded-xl border border-[#dcd4db] px-3 py-2.5 text-xs font-normal leading-5 outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd]" /></label>
      <label className="mt-4 block text-xs font-semibold text-[#665b68]">Birthday message <span className="font-normal text-[#9a8f9c]">(optional)</span><input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Happy Birthday Yaswanth" className="mt-2 w-full rounded-xl border border-[#dcd4db] px-3 py-2.5 text-xs font-normal outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd]" /></label>

      <button type="button" onClick={generateDesign} disabled={loading || !idea.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#f57558] px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e8694d] disabled:cursor-not-allowed disabled:bg-[#d8cfd7]">
        {loading && <span className="size-3.5 animate-spin rounded-full border-2 border-white/45 border-t-white" aria-hidden="true" />}
        {loading ? "Creating your design..." : "Generate Design"}
      </button>

      {error && <div className="mt-4 rounded-xl border border-[#f0cfc8] bg-[#fff6f3] p-3" role="alert"><p className="text-xs font-semibold text-[#a84734]">{error}</p><button type="button" onClick={generateDesign} disabled={loading || !idea.trim()} className="mt-2 text-[10px] font-bold text-[#bf513b] underline underline-offset-2 disabled:opacity-40">Try Again</button></div>}

      {activeDesign && (
        <section className="mt-5 border-t border-[#eee8ed] pt-4" aria-labelledby="ai-result-title">
          <div className="flex items-center justify-between"><h3 id="ai-result-title" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#998e9a]">Your design</h3><span className="rounded-full bg-[#ecf7ef] px-2 py-1 text-[9px] font-bold text-[#3f7b51]">Ready</span></div>
          <div className="relative mt-2 aspect-square overflow-hidden rounded-2xl border border-[#ded6dd] bg-[#f3eff3] shadow-sm"><NextImage src={activeDesign.src} alt="AI-generated cake topper artwork" fill unoptimized className="object-cover" /></div>
          <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => onUseAsBackground(activeDesign)} className="rounded-full bg-[#6d489f] px-2 py-2.5 text-[10px] font-semibold text-white hover:bg-[#5e3c8c]">Use as Background</button><button type="button" onClick={generateDesign} disabled={loading} className="rounded-full border border-[#d7c9dc] px-2 py-2.5 text-[10px] font-semibold text-[#674691] hover:bg-[#f7f2fa] disabled:cursor-not-allowed disabled:opacity-40">Regenerate</button></div>

          {generations.length > 1 && <div className="mt-4"><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9a8f9c]">Recent versions</p><div className="mt-2 grid grid-cols-4 gap-2">{generations.map((item, index) => <button key={item.id} type="button" onClick={() => setActiveId(item.id)} aria-label={`Select generated version ${generations.length - index}`} aria-pressed={item.id === activeDesign.id} className={`relative aspect-square overflow-hidden rounded-lg border-2 ${item.id === activeDesign.id ? "border-[#7a55a7]" : "border-transparent hover:border-[#cbbbd8]"}`}><NextImage src={item.src} alt="" fill unoptimized className="object-cover" /></button>)}</div></div>}
        </section>
      )}
    </div>
  );
}

