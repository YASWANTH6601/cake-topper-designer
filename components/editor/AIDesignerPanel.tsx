"use client";

import NextImage from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type { DesignShape } from "@/types/design";

const MAX_GENERATIONS = 5;
const MAX_REFERENCE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_REFERENCE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const IDEA_LOADING_MESSAGES = [
  "Preparing your idea...",
  "Teaching the pixels to behave...",
  "Mixing the digital frosting...",
  "Making sure everything fits on the cake...",
  "Adding a little birthday magic...",
  "Convincing the confetti to cooperate...",
  "Putting on the finishing sprinkles...",
  "Almost there — good cakes take a few extra seconds.",
];
const REFERENCE_LOADING_MESSAGES = [
  "Studying your image...",
  "Planning the cake layout...",
  "Adding some birthday magic...",
  "Teaching the pixels to behave...",
  "Convincing the confetti to cooperate...",
  "Putting on the finishing sprinkles...",
];

type SharedContext = { message: string; shape: DesignShape; width: number; height: number };
type IdeaContext = SharedContext & { kind: "idea"; idea: string };
type ReferenceContext = SharedContext & { kind: "reference"; instruction: string; referenceFile: File };
type GenerationContext = IdeaContext | ReferenceContext;

export type AIGeneratedDesign = {
  id: string;
  src: string;
  prompt: string;
  createdAt: number;
  context: GenerationContext;
};

type ReferenceImage = { file: File; src: string };
type GenerationError = { restricted: boolean; source: "idea" | "reference" };
type GenerateImageResponse = { success: boolean; prompt?: string; image?: string; mimeType?: string; category?: string };

type AIDesignerPanelProps = {
  shape: DesignShape;
  width: number;
  height: number;
  hidden: boolean;
  onUseAsBackground: (design: AIGeneratedDesign) => void;
};

function getDesignLabel(shape: DesignShape, width: number, height: number) {
  if (shape === "circle") return `${width}\" Round`;
  if (shape === "square") return `${width} × ${height}\" Square`;
  return `${width} × ${height}\" Rectangle`;
}

function matchesIdeaContext(design: AIGeneratedDesign, context: IdeaContext) {
  return design.context.kind === "idea"
    && design.context.idea === context.idea
    && design.context.message === context.message
    && design.context.shape === context.shape
    && design.context.width === context.width
    && design.context.height === context.height;
}

function isRestrictedCategory(category?: string) {
  return ["content_restriction", "safety_refusal", "policy_restriction"].includes(category ?? "");
}

export default function AIDesignerPanel({ shape, width, height, hidden, onUseAsBackground }: AIDesignerPanelProps) {
  const [idea, setIdea] = useState("");
  const [message, setMessage] = useState("");
  const [referenceInstruction, setReferenceInstruction] = useState("");
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);
  const [referenceError, setReferenceError] = useState("");
  const [showReferenceFallback, setShowReferenceFallback] = useState(false);
  const [generations, setGenerations] = useState<AIGeneratedDesign[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingSource, setLoadingSource] = useState<"idea" | "reference" | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<GenerationError | null>(null);
  const requestInFlight = useRef(false);
  const ideaInputRef = useRef<HTMLTextAreaElement>(null);
  const referenceInstructionRef = useRef<HTMLTextAreaElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const referenceUrlRef = useRef<string | null>(null);
  const activeDesign = useMemo(
    () => generations.find((item) => item.id === activeId) ?? generations[0] ?? null,
    [activeId, generations],
  );
  const loadingMessages = loadingSource === "reference" ? REFERENCE_LOADING_MESSAGES : IDEA_LOADING_MESSAGES;

  useEffect(() => {
    if (!loadingSource) return;
    const interval = window.setInterval(
      () => setLoadingMessageIndex((index) => (index + 1) % loadingMessages.length),
      3200,
    );
    return () => window.clearInterval(interval);
  }, [loadingMessages.length, loadingSource]);

  useEffect(() => () => {
    if (referenceUrlRef.current) URL.revokeObjectURL(referenceUrlRef.current);
  }, []);

  function chooseReferenceImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setShowReferenceFallback(true);
    setError(null);
    if (!SUPPORTED_REFERENCE_TYPES.includes(file.type) || file.size <= 0 || file.size > MAX_REFERENCE_SIZE) {
      setReferenceError("Choose a PNG, JPEG, or WEBP image up to 10 MB.");
      return;
    }

    if (referenceUrlRef.current) URL.revokeObjectURL(referenceUrlRef.current);
    const src = URL.createObjectURL(file);
    referenceUrlRef.current = src;
    setReferenceImage({ file, src });
    setReferenceError("");
  }

  function removeReferenceImage() {
    if (referenceUrlRef.current) URL.revokeObjectURL(referenceUrlRef.current);
    referenceUrlRef.current = null;
    setReferenceImage(null);
    setReferenceError("");
    setError(null);
  }

  async function generateDesign(existingDesign?: AIGeneratedDesign) {
    if (requestInFlight.current) return;

    const previousContext = existingDesign?.context;
    const previousReference = previousContext?.kind === "reference"
      ? previousContext
      : null;
    const previousIdea = previousContext?.kind === "idea" ? previousContext : null;
    const source = previousContext?.kind ?? (showReferenceFallback ? "reference" : "idea");
    const currentIdea = previousIdea?.idea ?? idea.trim();
    const currentInstruction = previousReference?.instruction ?? referenceInstruction.trim();
    const currentReferenceFile = previousReference?.referenceFile ?? referenceImage?.file;
    const currentMessage = previousContext?.message ?? message.trim();
    // Content can be reused from a selected history version, but canvas geometry
    // must always come from the active editor design to prevent stale sizing.
    const currentShape = shape;
    const currentWidth = width;
    const currentHeight = height;

    if (source === "idea" && !currentIdea) {
      ideaInputRef.current?.focus();
      return;
    }
    if (source === "reference" && (!currentReferenceFile || !currentInstruction)) {
      (currentReferenceFile ? referenceInstructionRef : referenceInputRef).current?.focus();
      return;
    }

    requestInFlight.current = true;
    setLoadingMessageIndex(0);
    setLoadingSource(source);
    setError(null);

    try {
      let response: Response;
      let context: GenerationContext;

      if (source === "reference" && currentReferenceFile) {
        context = {
          kind: "reference",
          instruction: currentInstruction,
          referenceFile: currentReferenceFile,
          message: currentMessage,
          shape: currentShape,
          width: currentWidth,
          height: currentHeight,
        };
        const formData = new FormData();
        formData.append("image", currentReferenceFile);
        formData.append("instruction", currentInstruction);
        formData.append("message", currentMessage);
        formData.append("shape", currentShape);
        formData.append("width", String(currentWidth));
        formData.append("height", String(currentHeight));
        response = await fetch("/api/ai/edit-image", { method: "POST", body: formData });
      } else {
        context = { kind: "idea", idea: currentIdea, message: currentMessage, shape: currentShape, width: currentWidth, height: currentHeight };
        const reusableDesign = generations.find((item) => matchesIdeaContext(item, context as IdeaContext));
        response = await fetch("/api/ai/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...context, ...(reusableDesign ? { prompt: reusableDesign.prompt } : {}) }),
        });
      }

      const result = await response.json() as GenerateImageResponse;
      if (!response.ok || !result.success || !result.image || !result.prompt) {
        setError({ restricted: isRestrictedCategory(result.category), source });
        return;
      }

      const item: AIGeneratedDesign = {
        id: crypto.randomUUID(),
        src: `data:${result.mimeType || "image/png"};base64,${result.image}`,
        prompt: result.prompt,
        createdAt: Date.now(),
        context,
      };
      setGenerations((items) => [item, ...items].slice(0, MAX_GENERATIONS));
      setActiveId(item.id);
    } catch {
      setError({ restricted: false, source });
    } finally {
      requestInFlight.current = false;
      setLoadingSource(null);
    }
  }

  function openReferenceFallback() {
    referenceInputRef.current?.click();
  }

  return (
    <div hidden={hidden} className="border-t border-[#ebe5ea] p-4">
      <input ref={referenceInputRef} type="file" accept="image/png,image/jpeg,image/webp,.jpg,.jpeg" onChange={chooseReferenceImage} className="hidden" />
      <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">AI Designer</h2><p className="mt-1 text-xs leading-5 text-[#8d828f]">Describe the artwork you want and we’ll create a cake-ready design for you.</p></div><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#f2ebfb] text-[#7652a5]" aria-hidden="true">✦</span></div>
      <div className="mt-4 rounded-xl border border-[#e4dce8] bg-[#f8f4fa] px-3 py-2.5 text-[10px] text-[#756879]"><span className="font-bold uppercase tracking-[0.1em]">Design</span><span className="ml-2 font-semibold text-[#493d4d]">{getDesignLabel(shape, width, height)}</span></div>

      {!showReferenceFallback && <label className="mt-4 block text-xs font-semibold text-[#665b68]">What do you want?<textarea ref={ideaInputRef} value={idea} onChange={(event) => { setIdea(event.target.value); setError(null); }} rows={4} placeholder="A cute dinosaur birthday party in a colorful jungle" className="mt-2 w-full resize-none rounded-xl border border-[#dcd4db] px-3 py-2.5 text-xs font-normal leading-5 outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd]" /></label>}

      {showReferenceFallback && <div className="mt-4"><p className="text-xs font-semibold text-[#665b68]">Reference Image</p>{referenceImage ? <div className="mt-2 overflow-hidden rounded-xl border border-[#ddd4df] bg-white"><div className="relative aspect-[4/3] bg-[#f2eef2]"><NextImage src={referenceImage.src} alt="Selected AI reference" fill unoptimized className="object-contain" /></div><div className="flex items-center justify-between gap-2 border-t border-[#ebe5ea] px-3 py-2"><span className="min-w-0 truncate text-[10px] font-semibold text-[#6e626f]">{referenceImage.file.name}</span><div className="flex shrink-0 gap-2"><button type="button" onClick={() => referenceInputRef.current?.click()} disabled={loadingSource !== null} className="text-[10px] font-semibold text-[#674691] disabled:opacity-40">Change Image</button><button type="button" onClick={removeReferenceImage} disabled={loadingSource !== null} className="text-[10px] font-semibold text-[#b4503d] disabled:opacity-40">Remove</button></div></div></div> : <button type="button" onClick={() => referenceInputRef.current?.click()} disabled={loadingSource !== null} className="mt-2 w-full rounded-xl border border-dashed border-[#cdbdd5] bg-[#faf7fc] px-3 py-5 text-xs font-semibold text-[#674691] disabled:opacity-40">↑ Upload Reference Image</button>}<p className="mt-2 text-[9px] leading-4 text-[#988d9a]">Only upload images you have permission to use. PNG, JPG, or WEBP up to 10 MB.</p>{referenceError && <p role="alert" className="mt-2 text-[10px] font-semibold text-[#ad4937]">{referenceError}</p>}{referenceImage && <label className="mt-4 block text-xs font-semibold text-[#665b68]">What would you like us to do with this image?<textarea ref={referenceInstructionRef} value={referenceInstruction} onChange={(event) => { setReferenceInstruction(event.target.value); setError(null); }} rows={4} placeholder="Turn this into a colorful birthday cake design with balloons, confetti and a festive background." className="mt-2 w-full resize-none rounded-xl border border-[#dcd4db] px-3 py-2.5 text-xs font-normal leading-5 outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd]" /></label>}</div>}

      <label className="mt-4 block text-xs font-semibold text-[#665b68]">Birthday message <span className="font-normal text-[#9a8f9c]">(optional)</span><input type="text" value={message} onChange={(event) => { setMessage(event.target.value); setError(null); }} placeholder="Happy Birthday Yaswanth" className="mt-2 w-full rounded-xl border border-[#dcd4db] px-3 py-2.5 text-xs font-normal outline-none placeholder:text-[#aaa0ab] focus:border-[#8c68bd]" /></label>
      <button type="button" onClick={() => generateDesign()} disabled={loadingSource !== null || (showReferenceFallback ? !referenceImage || !referenceInstruction.trim() : !idea.trim())} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#f57558] px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e8694d] disabled:cursor-not-allowed disabled:bg-[#d8cfd7]"><span className={loadingSource ? "size-3.5 animate-spin rounded-full border-2 border-white/45 border-t-white" : "hidden"} aria-hidden="true" />{loadingSource ? "Creating your design..." : showReferenceFallback ? "Create Design" : "Generate Design"}</button>

      {loadingSource && <div className="mt-4 overflow-hidden rounded-2xl border border-[#e4d8eb] bg-[linear-gradient(145deg,#fbf7fd,#f7eef8)] px-4 py-5 text-center" role="status" aria-live="polite" aria-atomic="true"><div className="relative mx-auto h-14 w-20" aria-hidden="true"><span className="absolute bottom-0 left-1/2 grid h-10 w-14 -translate-x-1/2 place-items-center rounded-t-xl border-b-4 border-[#d7644c] bg-[#f89a7e] text-xl shadow-sm">🎂</span><span className="absolute left-1 top-1 animate-pulse text-[#e3a62f]">✦</span><span className="absolute right-1 top-0 animate-ping text-xs text-[#8b67b2]">✦</span><span className="absolute right-5 top-5 animate-bounce text-[10px] text-[#f57558]">●</span></div><p className="mt-3 min-h-10 text-xs font-semibold leading-5 text-[#66556b]">{loadingMessages[loadingMessageIndex]}</p><p className="mt-1 text-[10px] text-[#958799]">Your image and previous designs are safe while we create.</p></div>}

      {error?.source === "idea" && !showReferenceFallback && <div className="mt-4 rounded-2xl border border-[#efd2cb] bg-[#fff6f3] p-4" role="alert"><h3 className="text-sm font-semibold text-[#7f3f33]">We couldn’t create this design.</h3><p className="mt-1 text-xs leading-5 text-[#8a5d54]">{error.restricted ? "Some content may not be available for AI generation. Try adjusting your idea, or upload a reference image for the next step." : "AI couldn’t generate this design this time. Try adjusting your idea, or upload a reference image for the next step."}</p><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => generateDesign()} className="rounded-full bg-[#f57558] px-3 py-2.5 text-[10px] font-semibold text-white">Try Again</button><button type="button" onClick={() => { setError(null); ideaInputRef.current?.focus(); }} className="rounded-full border border-[#dfc4bd] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#8a4d41]">Change Idea</button><button type="button" onClick={openReferenceFallback} className="col-span-2 rounded-full border border-[#d8c9df] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#674691]">Upload Reference Image</button></div></div>}

      {error?.source === "reference" && <div className="mt-4 rounded-xl border border-[#f0cfc8] bg-[#fff6f3] p-3" role="alert"><p className="text-xs font-semibold text-[#a84734]">We couldn’t create a design from this image.</p></div>}

      {activeDesign && <section className="mt-5 border-t border-[#eee8ed] pt-4" aria-labelledby="ai-result-title"><div className="flex items-center justify-between"><h3 id="ai-result-title" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#998e9a]">Your design</h3><span className="rounded-full bg-[#ecf7ef] px-2 py-1 text-[9px] font-bold text-[#3f7b51]">Ready</span></div><div className="relative mt-2 aspect-square overflow-hidden rounded-2xl border border-[#ded6dd] bg-[#f3eff3] shadow-sm"><NextImage src={activeDesign.src} alt="AI-generated cake topper artwork" fill unoptimized className="object-cover" /></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => onUseAsBackground(activeDesign)} disabled={loadingSource !== null} className="rounded-full bg-[#6d489f] px-2 py-2.5 text-[10px] font-semibold text-white disabled:opacity-40">Use as Background</button><button type="button" onClick={() => generateDesign(activeDesign)} disabled={loadingSource !== null} className="rounded-full border border-[#d7c9dc] px-2 py-2.5 text-[10px] font-semibold text-[#674691] disabled:opacity-40">{activeDesign.context.kind === "reference" ? "Try Another" : "Regenerate"}</button></div>{generations.length > 1 && <div className="mt-4"><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9a8f9c]">Recent versions</p><div className="mt-2 grid grid-cols-4 gap-2">{generations.map((item, index) => <button key={item.id} type="button" onClick={() => setActiveId(item.id)} aria-label={`Select generated version ${generations.length - index}`} aria-pressed={item.id === activeDesign.id} className={`relative aspect-square overflow-hidden rounded-lg border-2 ${item.id === activeDesign.id ? "border-[#7a55a7]" : "border-transparent hover:border-[#cbbbd8]"}`}><NextImage src={item.src} alt="" fill unoptimized className="object-cover" /></button>)}</div></div>}</section>}
    </div>
  );
}
