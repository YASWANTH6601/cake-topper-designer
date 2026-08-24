"use client";

import Link from "next/link";
import NextImage from "next/image";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CakeCanvas, { type CakeCanvasHandle } from "./CakeCanvas";
import FontBrowser from "./FontBrowser";
import BackgroundCropModal, { createCoverBackground } from "./BackgroundCropModal";
import AIDesignerPanel, { type AIGeneratedDesign } from "./AIDesignerPanel";
import ElementsPanel from "./ElementsPanel";
import useEditorHistory from "@/hooks/useEditorHistory";
import type { DesignShape } from "@/types/design";
import { BACKGROUND_SELECTION_ID, type BackgroundObject, type EditorObject, type ElementObject, type ImageObject, type TextObject, type UploadedImageAsset } from "@/types/editor";
import type { EditorFontOption } from "@/lib/editor-fonts";
import type { ElementAsset } from "@/lib/editor-elements";

const DESIGN_DPI = 300;
const MIN_FONT_SIZE = 30;
const FONT_SIZE_STEP = 15;
const MAX_CURVE_LEVEL = 20;
const toolItems = [
  { icon: "▦", label: "Templates" },
  { icon: "↑", label: "Uploads" },
  { icon: "T", label: "Text" },
  { icon: "◇", label: "Elements" },
  { icon: "✦", label: "AI Images" },
];

type EditorWorkspaceProps = {
  shape: DesignShape;
  width: number;
  height: number;
  name: string;
  fontOptions: EditorFontOption[];
};

type TextPreset = { text: string; fontSize: number };

type DesignState = {
  textObjects: TextObject[];
  imageObjects: ImageObject[];
  elementObjects: ElementObject[];
  background: BackgroundObject | null;
};

export default function EditorWorkspace({ shape, width, height, name, fontOptions }: EditorWorkspaceProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { state: designState, commit, undo, redo, endGroup, canUndo, canRedo } = useEditorHistory<DesignState>({ textObjects: [], imageObjects: [], elementObjects: [], background: null });
  const { textObjects, imageObjects, elementObjects, background } = designState;
  const [uploadedAssets, setUploadedAssets] = useState<UploadedImageAsset[]>([]);
  const [cropDraft, setCropDraft] = useState<BackgroundObject | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [fontBrowserOpen, setFontBrowserOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const canvasRef = useRef<CakeCanvasHandle>(null);
  const clipboardRef = useRef<{ object: EditorObject; pasteCount: number } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const selectedText = useMemo(() => textObjects.find((item) => item.id === selectedId) ?? null, [selectedId, textObjects]);
  const selectedImage = useMemo(() => imageObjects.find((item) => item.id === selectedId) ?? null, [imageObjects, selectedId]);
  const selectedElement = useMemo(() => elementObjects.find((item) => item.id === selectedId) ?? null, [elementObjects, selectedId]);
  const backgroundSelected = selectedId === BACKGROUND_SELECTION_ID && background !== null;
  const allObjects = useMemo<EditorObject[]>(() => [...textObjects, ...imageObjects, ...elementObjects], [elementObjects, imageObjects, textObjects]);
  const selectedObject = useMemo(() => allObjects.find((item) => item.id === selectedId) ?? null, [allObjects, selectedId]);
  const recommendedFonts = useMemo(() => fontOptions.filter((font) => font.recommended), [fontOptions]);

  const exportFilename = useMemo(() => {
    const sanitizedName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${sanitizedName && sanitizedName !== "untitled-design" ? sanitizedName : "cake-topper"}.png`;
  }, [name]);

  const handleUndo = useCallback(() => {
    setSelectedId(null);
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    setSelectedId(null);
    redo();
  }, [redo]);

  const updateText = useCallback((id: string, updates: Partial<TextObject>) => {
    commit((state) => ({ ...state, textObjects: state.textObjects.map((item) => item.id === id ? { ...item, ...updates } : item) }));
  }, [commit]);

  const updateTextInput = useCallback((id: string, text: string) => {
    commit((state) => ({ ...state, textObjects: state.textObjects.map((item) => item.id === id ? { ...item, text } : item) }), { groupKey: `text:${id}` });
  }, [commit]);

  const updateImage = useCallback((id: string, updates: Partial<ImageObject>) => {
    commit((state) => ({ ...state, imageObjects: state.imageObjects.map((item) => item.id === id ? { ...item, ...updates } : item) }));
  }, [commit]);

  const updateElement = useCallback((id: string, updates: Partial<ElementObject>) => {
    commit((state) => ({ ...state, elementObjects: state.elementObjects.map((item) => item.id === id ? { ...item, ...updates } : item) }));
  }, [commit]);

  const addObjectCopy = useCallback((source: EditorObject, offsetMultiplier: number) => {
    const offset = Math.min(width, height) * DESIGN_DPI * 0.025 * offsetMultiplier;
    const copy: EditorObject = { ...source, id: crypto.randomUUID(), x: source.x + offset, y: source.y + offset };
    commit((state) => {
      if (copy.type === "text") return { ...state, textObjects: [...state.textObjects, copy] };
      if (copy.type === "image") return { ...state, imageObjects: [...state.imageObjects, copy] };
      return { ...state, elementObjects: [...state.elementObjects, copy] };
    });
    setSelectedId(copy.id);
  }, [commit, height, width]);

  const duplicateSelected = useCallback(() => {
    if (selectedObject) addObjectCopy(selectedObject, 1);
  }, [addObjectCopy, selectedObject]);

  const copySelected = useCallback(() => {
    if (!selectedObject) return;
    clipboardRef.current = { object: { ...selectedObject }, pasteCount: 0 };
  }, [selectedObject]);

  const pasteCopied = useCallback(() => {
    const clipboard = clipboardRef.current;
    if (!clipboard) return;
    clipboard.pasteCount += 1;
    addObjectCopy(clipboard.object, clipboard.pasteCount);
  }, [addObjectCopy]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    if (selectedId === BACKGROUND_SELECTION_ID) return;
    commit((state) => ({
      ...state,
      textObjects: state.textObjects.filter((item) => item.id !== selectedId),
      imageObjects: state.imageObjects.filter((item) => item.id !== selectedId),
      elementObjects: state.elementObjects.filter((item) => item.id !== selectedId),
    }));
    setSelectedId(null);
  }, [commit, selectedId]);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || (target instanceof HTMLElement && target.isContentEditable);
      if (isTyping) return;

      const modifierPressed = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (modifierPressed && key === "z") {
        event.preventDefault();
        if (event.shiftKey) handleRedo();
        else handleUndo();
        return;
      }
      if (modifierPressed && key === "c" && selectedObject) {
        event.preventDefault();
        copySelected();
        return;
      }
      if (modifierPressed && key === "v" && clipboardRef.current) {
        event.preventDefault();
        pasteCopied();
        return;
      }
      if (modifierPressed && key === "d" && selectedObject) {
        event.preventDefault();
        duplicateSelected();
        return;
      }
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (!selectedObject) return;
      event.preventDefault();
      deleteSelected();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copySelected, deleteSelected, duplicateSelected, handleRedo, handleUndo, pasteCopied, selectedObject]);

  function addText(preset: TextPreset = { text: "Happy Birthday", fontSize: 180 }) {
    const designWidth = width * DESIGN_DPI;
    const designHeight = height * DESIGN_DPI;
    const offsetStep = Math.min(designWidth, designHeight) * 0.065;
    const placementIndex = textObjects.length % 5;
    const offsets = [
      { x: 0, y: 0 },
      { x: offsetStep, y: offsetStep },
      { x: -offsetStep, y: -offsetStep },
      { x: offsetStep, y: -offsetStep },
      { x: -offsetStep, y: offsetStep },
    ];
    const offset = offsets[placementIndex];
    const item: TextObject = {
      id: crypto.randomUUID(),
      type: "text",
      text: preset.text,
      x: designWidth / 2 + offset.x,
      y: designHeight / 2 + offset.y,
      fontSize: preset.fontSize,
      fontFamily: fontOptions.find((font) => font.label === "Poppins")?.family ?? fontOptions[0].family,
      fill: "#3d2944",
      rotation: 0,
      curveLevel: 0,
    };
    commit((state) => ({ ...state, textObjects: [...state.textObjects, item] }));
    setSelectedId(item.id);
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setUploadError("");

    for (const file of files) {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setUploadError("Choose a PNG, JPEG, or WEBP image.");
        continue;
      }

      const src = URL.createObjectURL(file);
      objectUrlsRef.current.add(src);
      const image = new Image();
      image.onload = () => {
        const asset: UploadedImageAsset = {
          id: crypto.randomUUID(),
          src,
          name: file.name,
          originalWidth: image.naturalWidth,
          originalHeight: image.naturalHeight,
        };
        setUploadedAssets((items) => [...items, asset]);
      };
      image.onerror = () => {
        URL.revokeObjectURL(src);
        objectUrlsRef.current.delete(src);
        setUploadError(`Could not load ${file.name}. Try another image.`);
      };
      image.src = src;
    }
  }

  function addImageAsset(asset: UploadedImageAsset) {
    const designWidth = width * DESIGN_DPI;
    const designHeight = height * DESIGN_DPI;
    const maxWidth = designWidth * 0.5;
    const maxHeight = designHeight * 0.5;
    const initialScale = Math.min(1, maxWidth / asset.originalWidth, maxHeight / asset.originalHeight);
    const placementIndex = imageObjects.length % 5;
    const offset = (placementIndex - 2) * Math.min(designWidth, designHeight) * 0.025;
    const item: ImageObject = {
      id: crypto.randomUUID(),
      type: "image",
      src: asset.src,
      name: asset.name,
      x: designWidth / 2 + offset,
      y: designHeight / 2 + offset,
      width: Math.max(30, Math.round(asset.originalWidth * initialScale)),
      height: Math.max(30, Math.round(asset.originalHeight * initialScale)),
      rotation: 0,
    };
    commit((state) => ({ ...state, imageObjects: [...state.imageObjects, item] }));
    setSelectedId(item.id);
  }

  function addElement(asset: ElementAsset) {
    const designWidth = width * DESIGN_DPI;
    const designHeight = height * DESIGN_DPI;
    const baseSize = Math.min(designWidth, designHeight) * 0.22;
    const placementIndex = elementObjects.length % 5;
    const offset = (placementIndex - 2) * Math.min(designWidth, designHeight) * 0.035;
    const elementWidth = asset.aspectRatio >= 1 ? baseSize : baseSize * asset.aspectRatio;
    const elementHeight = asset.aspectRatio >= 1 ? baseSize / asset.aspectRatio : baseSize;
    const item: ElementObject = { id: crypto.randomUUID(), type: "element", elementId: asset.id, name: asset.name, src: asset.src, x: designWidth / 2 + offset, y: designHeight / 2 + offset, width: Math.round(elementWidth), height: Math.round(elementHeight), rotation: 0 };
    commit((state) => ({ ...state, elementObjects: [...state.elementObjects, item] }));
    setSelectedId(item.id);
  }

  function handleBackgroundUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setUploadError("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setUploadError("Choose a PNG, JPEG, or WEBP image.");
      return;
    }
    const src = URL.createObjectURL(file);
    objectUrlsRef.current.add(src);
    const image = new Image();
    image.onload = () => setCropDraft(createCoverBackground(
      src,
      file.name,
      image.naturalWidth,
      image.naturalHeight,
      width * DESIGN_DPI,
      height * DESIGN_DPI,
    ));
    image.onerror = () => {
      URL.revokeObjectURL(src);
      objectUrlsRef.current.delete(src);
      setUploadError(`Could not load ${file.name}. Try another image.`);
    };
    image.src = src;
  }

  function cancelCrop() {
    if (cropDraft && cropDraft.src !== background?.src) {
      if (objectUrlsRef.current.has(cropDraft.src)) {
        URL.revokeObjectURL(cropDraft.src);
        objectUrlsRef.current.delete(cropDraft.src);
      }
    }
    setCropDraft(null);
  }

  function useAiDesignAsBackground(design: AIGeneratedDesign) {
    if (background && !window.confirm("Replace the current background with this AI design? You can adjust the crop before applying.")) return;

    const image = new Image();
    image.onload = () => setCropDraft(createCoverBackground(
      design.src,
      "AI generated design",
      image.naturalWidth,
      image.naturalHeight,
      width * DESIGN_DPI,
      height * DESIGN_DPI,
    ));
    image.onerror = () => setUploadError("Could not prepare the AI design as a background. Try generating it again.");
    image.src = design.src;
  }

  function applyBackground(nextBackground: BackgroundObject) {
    commit((state) => ({ ...state, background: nextBackground }));
    setCropDraft(null);
    setSelectedId(BACKGROUND_SELECTION_ID);
  }

  function removeBackground() {
    commit((state) => ({ ...state, background: null }));
    if (selectedId === BACKGROUND_SELECTION_ID) setSelectedId(null);
  }

  async function exportDesign() {
    if (exporting) return;
    setExporting(true);
    setExportError("");
    try {
      const blob = await canvasRef.current?.exportPng();
      if (!blob) throw new Error("The design canvas is not ready.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = exportFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch {
      setExportError("Unable to export this design.");
    } finally {
      setExporting(false);
    }
  }

  const selectedObjectActions = (
    <div className="mt-5 grid grid-cols-2 gap-2">
      <button type="button" onClick={duplicateSelected} className="rounded-full border border-[#d8c9df] bg-[#f8f4fa] px-3 py-2.5 text-xs font-semibold text-[#674691] hover:bg-[#f1eafa]">Duplicate</button>
      <button type="button" onClick={deleteSelected} className="rounded-full border border-[#f0cfc8] bg-[#fff6f3] px-3 py-2.5 text-xs font-semibold text-[#bf513b] hover:bg-[#fff0eb]">Delete</button>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f1f4] text-[#281c2d]">
      <header className="relative z-10 border-b border-[#ddd6dd] bg-white">
        <nav className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-5" aria-label="Editor toolbar">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link href="/create" className="grid size-9 shrink-0 place-items-center rounded-full border border-[#ded6dc] text-[#665a69] transition hover:border-[#b9adb6]" aria-label="Back to design settings">←</Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">{name}</p>
              <p className="text-[10px] font-medium text-[#918694] sm:text-xs">{width} × {height} inches · <span className="capitalize">{shape}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button type="button" disabled className="cursor-not-allowed rounded-full border border-[#ded6dc] px-3 py-2 text-xs font-semibold text-[#aaa0ab] sm:px-4">Save</button>
            <button type="button" onClick={exportDesign} disabled={exporting} className="rounded-full bg-[#6d489f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#5f3d8e] disabled:cursor-wait disabled:opacity-65 sm:px-4">{exporting ? "Preparing…" : "Export"}</button>
          </div>
        </nav>
      </header>

      <div className={`grid flex-1 ${activeTool === "AI Images" || activeTool === "Elements" ? "lg:grid-cols-[280px_minmax(0,1fr)_270px]" : "lg:grid-cols-[180px_minmax(0,1fr)_270px]"}`}>
        <aside className="order-2 border-t border-[#ddd6dd] bg-white lg:order-none lg:border-r lg:border-t-0" aria-label="Design tools">
          <div className="grid grid-cols-5 lg:grid-cols-2 lg:gap-1 lg:p-3">
            {toolItems.map((tool) => {
              const isText = tool.label === "Text";
              const isUploads = tool.label === "Uploads";
              const isAi = tool.label === "AI Images";
              const isElements = tool.label === "Elements";
              const isAvailable = isText || isUploads || isAi || isElements;
              const active = activeTool === tool.label;
              return <button key={tool.label} type="button" disabled={!isAvailable} onClick={() => isAvailable && setActiveTool(active ? null : tool.label)} title={isText ? "Add and edit text" : isUploads ? "Upload images" : isAi ? "Create artwork with AI" : isElements ? "Add stickers and decorations" : `${tool.label} is coming soon`} className={`flex flex-col items-center gap-1.5 px-1 py-3 text-[10px] font-semibold lg:rounded-xl ${active ? "bg-[#f2ebfb] text-[#6d489f]" : isAvailable ? "text-[#655a68] hover:bg-[#f7f3f7]" : "cursor-not-allowed text-[#aaa0ab]"}`}><span className="grid size-7 place-items-center text-base">{tool.icon}</span>{tool.label}</button>;
            })}
          </div>
          <AIDesignerPanel shape={shape} width={width} height={height} hidden={activeTool !== "AI Images"} onUseAsBackground={useAiDesignAsBackground} />
          {activeTool === "Elements" && <ElementsPanel onAdd={addElement} />}
          {activeTool === "Uploads" && (
            <div className="border-t border-[#ebe5ea] p-4">
              <h2 className="text-sm font-semibold">Uploads</h2>
              <input ref={backgroundInputRef} type="file" accept="image/png,image/jpeg,image/webp,.jpg,.jpeg" onChange={handleBackgroundUpload} className="hidden" />
              <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp,.jpg,.jpeg" multiple onChange={handleImageUpload} className="hidden" />

              <section className="mt-4" aria-labelledby="background-upload-title">
                <h3 id="background-upload-title" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#998e9a]">Background</h3>
                {background ? (
                  <div className="mt-2 space-y-2">
                    <button type="button" onClick={() => { setSelectedId(BACKGROUND_SELECTION_ID); setCropDraft(background); }} className="w-full rounded-full bg-[#f57558] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#e8694d]">Edit Background</button>
                    <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => backgroundInputRef.current?.click()} className="rounded-full border border-[#ded6dc] px-2 py-2 text-[10px] font-semibold">Replace</button><button type="button" onClick={removeBackground} className="rounded-full border border-[#f0cfc8] bg-[#fff6f3] px-2 py-2 text-[10px] font-semibold text-[#bf513b]">Remove</button></div>
                  </div>
                ) : <button type="button" onClick={() => backgroundInputRef.current?.click()} className="mt-2 w-full rounded-full border border-[#d7c9dc] bg-[#f7f2fa] px-3 py-2.5 text-xs font-semibold text-[#674691] hover:bg-[#f0e7f5]">Set Background Image</button>}
              </section>

              <section className="mt-5 border-t border-[#eee8ed] pt-4" aria-labelledby="your-images-title">
                <h3 id="your-images-title" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#998e9a]">Your Images</h3>
                <button type="button" onClick={() => imageInputRef.current?.click()} className="mt-2 w-full rounded-full bg-[#f57558] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e8694d]">Upload Image</button>
                {uploadedAssets.length > 0 ? <div className="mt-3 grid grid-cols-2 gap-2">{uploadedAssets.map((asset) => <button key={asset.id} type="button" onClick={() => addImageAsset(asset)} title={`Add ${asset.name} to canvas`} className="overflow-hidden rounded-xl border border-[#e1d9e0] bg-white text-left transition hover:border-[#aa92c4]"><span className="grid aspect-square place-items-center overflow-hidden bg-[#f2eef2]"><span className="relative block size-full"><span className="sr-only">Add {asset.name}</span><NextImage src={asset.src} alt="" fill unoptimized className="object-cover" /></span></span><span className="block truncate px-2 py-1.5 text-[9px] font-semibold text-[#675c69]">{asset.name}</span></button>)}</div> : <p className="mt-3 text-[10px] leading-4 text-[#9a8f9c]">Uploaded images appear here. Click a thumbnail to add it to the canvas.</p>}
              </section>
              {uploadError && <p role="alert" className="mt-3 rounded-lg bg-[#fff3ef] px-3 py-2 text-xs leading-5 text-[#a84734]">{uploadError}</p>}
              <p className="mt-3 text-[10px] leading-4 text-[#9a8f9c]">Images remain local to this browser session.</p>
            </div>
          )}
          {activeTool === "Text" && <div className="border-t border-[#ebe5ea] p-4"><h2 className="text-sm font-semibold">Add text</h2><p className="mt-1 text-xs leading-5 text-[#8d828f]">Choose a starting style, then make it yours.</p><button type="button" onClick={() => addText()} className="mt-4 w-full rounded-full bg-[#f57558] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e8694d]">+ Add Text</button><div className="mt-4 border-t border-[#eee8ed] pt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#998e9a]">Quick presets</p><div className="space-y-2"><button type="button" onClick={() => addText({ text: "Happy Birthday", fontSize: 220 })} className="w-full rounded-lg border border-[#e1d9e0] px-3 py-2.5 text-left text-sm font-semibold hover:border-[#beaebe]">Add Heading</button><button type="button" onClick={() => addText({ text: "Name", fontSize: 150 })} className="w-full rounded-lg border border-[#e1d9e0] px-3 py-2.5 text-left text-xs font-medium hover:border-[#beaebe]">Add Subheading</button><button type="button" onClick={() => addText({ text: "Your message", fontSize: 90 })} className="w-full rounded-lg border border-[#e1d9e0] px-3 py-2 text-left text-[10px] hover:border-[#beaebe]">Add Small Text</button></div></div></div>}
        </aside>

        <section className="order-1 flex min-w-0 flex-col lg:order-none" aria-label="Design canvas workspace">
          <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[#ddd6dd] bg-[#faf8fa] px-3 py-1.5 sm:px-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8c818e]">Canvas</span>
            <div className="flex items-center rounded-xl border border-[#ded7de] bg-white p-0.5 shadow-sm" aria-label="Design history">
              <button type="button" onClick={handleUndo} disabled={!canUndo} title="Undo (Command/Ctrl + Z)" className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-[#685d6b] transition hover:bg-[#f5f1f5] disabled:cursor-not-allowed disabled:text-[#b4aab5]" aria-label="Undo"><span className="text-base leading-none" aria-hidden="true">↶</span><span>Undo</span></button>
              <span className="h-5 w-px bg-[#e9e3e8]" aria-hidden="true" />
              <button type="button" onClick={handleRedo} disabled={!canRedo} title="Redo (Command/Ctrl + Shift + Z)" className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-[#685d6b] transition hover:bg-[#f5f1f5] disabled:cursor-not-allowed disabled:text-[#b4aab5]" aria-label="Redo"><span className="text-base leading-none" aria-hidden="true">↷</span><span>Redo</span></button>
            </div>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8c818e] sm:inline">Safe area & center guides</span>
          </div>
          <div className="flex min-h-[430px] flex-1 items-center justify-center overflow-hidden bg-[#ece8ed] bg-[radial-gradient(#d3ccd4_0.7px,transparent_0.7px)] [background-size:18px_18px]">
            <CakeCanvas ref={canvasRef} shape={shape} widthInches={width} heightInches={height} textObjects={textObjects} imageObjects={imageObjects} elementObjects={elementObjects} background={background} backgroundEditMode={backgroundSelected} selectedId={selectedId} onSelect={setSelectedId} onChange={updateText} onImageChange={updateImage} onElementChange={updateElement} onBackgroundChange={(updates) => commit((state) => ({ ...state, background: state.background ? { ...state.background, ...updates } : null }))} />
          </div>
          {exportError && <p role="alert" className="border-t border-[#f0cfc8] bg-[#fff6f3] px-4 py-2 text-center text-xs font-semibold text-[#a84734]">{exportError}</p>}
        </section>

        <aside className="order-3 border-t border-[#ddd6dd] bg-white p-5 lg:border-l lg:border-t-0" aria-label="Design information and properties">
          {selectedText ? (
            <div>
              <h2 className="text-sm font-semibold">Text properties</h2>
              <label className="mt-5 block text-xs font-semibold text-[#665b68]">Text<input type="text" value={selectedText.text} onChange={(event) => updateTextInput(selectedText.id, event.target.value)} onBlur={endGroup} className="mt-2 w-full rounded-lg border border-[#dcd4db] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#8c68bd]" /></label>
              <label className="mt-4 block text-xs font-semibold text-[#665b68]">Font<select value={recommendedFonts.some((font) => font.family === selectedText.fontFamily) ? selectedText.fontFamily : "__current"} onChange={(event) => { if (event.target.value === "__more") setFontBrowserOpen(true); else if (event.target.value !== "__current") updateText(selectedText.id, { fontFamily: event.target.value }); }} className="mt-2 w-full rounded-lg border border-[#dcd4db] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#8c68bd]">{!recommendedFonts.some((font) => font.family === selectedText.fontFamily) && <option value="__current">{fontOptions.find((font) => font.family === selectedText.fontFamily)?.label ?? "Selected font"}</option>}{recommendedFonts.map((font) => <option key={font.label} value={font.family}>{font.label}</option>)}<option disabled>──────────</option><option value="__more">More Fonts…</option></select></label>
              <fieldset className="mt-4">
                <legend className="text-xs font-semibold text-[#665b68]">Text Shape</legend>
                <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-[#f4f0f4] p-1">
                  <button type="button" onClick={() => updateText(selectedText.id, { curveLevel: 0 })} aria-pressed={selectedText.curveLevel === 0} className={`flex flex-col items-center rounded-lg px-1 py-2 transition ${selectedText.curveLevel === 0 ? "bg-white text-[#674691] shadow-sm" : "text-[#877b89] hover:text-[#504453]"}`}>
                    <span className="text-xl leading-none">─</span><span className="mt-1 text-[9px] font-semibold">Straight</span>
                  </button>
                  <button type="button" onClick={() => updateText(selectedText.id, { curveLevel: selectedText.curveLevel + 1 })} disabled={selectedText.curveLevel >= MAX_CURVE_LEVEL} aria-pressed={selectedText.curveLevel > 0} className={`flex flex-col items-center rounded-lg px-1 py-2 transition disabled:cursor-not-allowed disabled:opacity-35 ${selectedText.curveLevel > 0 ? "bg-white text-[#674691] shadow-sm" : "text-[#877b89] hover:text-[#504453]"}`}>
                    <span className="text-xl leading-none">⌒</span><span className="mt-1 text-[9px] font-semibold">Curve Up</span>
                  </button>
                  <button type="button" onClick={() => updateText(selectedText.id, { curveLevel: selectedText.curveLevel - 1 })} disabled={selectedText.curveLevel <= -MAX_CURVE_LEVEL} aria-pressed={selectedText.curveLevel < 0} className={`flex flex-col items-center rounded-lg px-1 py-2 transition disabled:cursor-not-allowed disabled:opacity-35 ${selectedText.curveLevel < 0 ? "bg-white text-[#674691] shadow-sm" : "text-[#877b89] hover:text-[#504453]"}`}>
                    <span className="text-xl leading-none">⌣</span><span className="mt-1 text-[9px] font-semibold">Curve Down</span>
                  </button>
                </div>
              </fieldset>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div><p className="text-xs font-semibold text-[#665b68]">Text Size</p><div className="mt-2 flex h-[42px] items-center justify-between rounded-lg border border-[#dcd4db] bg-white p-1"><button type="button" onClick={() => updateText(selectedText.id, { fontSize: Math.max(MIN_FONT_SIZE, selectedText.fontSize - FONT_SIZE_STEP) })} disabled={selectedText.fontSize <= MIN_FONT_SIZE} className="grid size-8 place-items-center rounded-md text-lg text-[#685d6b] transition hover:bg-[#f3eef3] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Decrease text size">−</button><span className="select-none text-sm font-semibold text-[#5c4f60]" aria-hidden="true">Aa</span><button type="button" onClick={() => updateText(selectedText.id, { fontSize: selectedText.fontSize + FONT_SIZE_STEP })} className="grid size-8 place-items-center rounded-md text-lg text-[#685d6b] transition hover:bg-[#f3eef3]" aria-label="Increase text size">+</button></div></div>
                <label className="text-xs font-semibold text-[#665b68]">Rotation<input type="number" value={Math.round(selectedText.rotation)} onChange={(event) => updateText(selectedText.id, { rotation: Number(event.target.value) || 0 })} className="mt-2 w-full rounded-lg border border-[#dcd4db] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#8c68bd]" /></label>
              </div>
              <label className="mt-4 flex items-center justify-between rounded-lg border border-[#e2dbe1] px-3 py-2.5 text-xs font-semibold text-[#665b68]">Color<input type="color" value={selectedText.fill} onChange={(event) => updateText(selectedText.id, { fill: event.target.value })} className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent" /></label>
              {selectedObjectActions}
            </div>
          ) : selectedImage ? (
            <div>
              <h2 className="text-sm font-semibold">Image properties</h2>
              <dl className="mt-5 space-y-4 text-xs">
                <div><dt className="text-[#8a7f8c]">File</dt><dd className="mt-1 truncate font-semibold" title={selectedImage.name}>{selectedImage.name}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-[#8a7f8c]">Canvas size</dt><dd className="text-right font-semibold">{Math.round(selectedImage.width)} × {Math.round(selectedImage.height)} px</dd></div>
                <div className="flex justify-between"><dt className="text-[#8a7f8c]">Rotation</dt><dd className="font-semibold">{Math.round(selectedImage.rotation)}°</dd></div>
              </dl>
              {selectedObjectActions}
            </div>
          ) : selectedElement ? (
            <div><h2 className="text-sm font-semibold">Element properties</h2><dl className="mt-5 space-y-4 text-xs"><div><dt className="text-[#8a7f8c]">Element</dt><dd className="mt-1 truncate font-semibold">{selectedElement.name}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#8a7f8c]">Canvas size</dt><dd className="text-right font-semibold">{Math.round(selectedElement.width)} × {Math.round(selectedElement.height)} px</dd></div><div className="flex justify-between"><dt className="text-[#8a7f8c]">Rotation</dt><dd className="font-semibold">{Math.round(selectedElement.rotation)}°</dd></div></dl>{selectedObjectActions}</div>
          ) : backgroundSelected && background ? (
            <div>
              <h2 className="text-sm font-semibold">Background</h2>
              <p className="mt-2 truncate text-xs text-[#8a7f8c]" title={background.name}>{background.name}</p>
              <p className="mt-3 rounded-lg bg-[#f5f0f7] px-3 py-2 text-[10px] leading-4 text-[#756879]">Background editing is active. Drag or resize it on the canvas, or reopen the crop view.</p>
              <button type="button" onClick={() => setCropDraft(background)} className="mt-4 w-full rounded-full bg-[#f57558] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#e8694d]">Edit Crop</button>
              <button type="button" onClick={() => backgroundInputRef.current?.click()} className="mt-2 w-full rounded-full border border-[#ded6dc] px-3 py-2.5 text-xs font-semibold">Replace</button>
              <button type="button" onClick={removeBackground} className="mt-2 w-full rounded-full border border-[#f0cfc8] bg-[#fff6f3] px-3 py-2.5 text-xs font-semibold text-[#bf513b] hover:bg-[#fff0eb]">Remove</button>
            </div>
          ) : (
            <div><h2 className="text-sm font-semibold">Design information</h2><dl className="mt-5 space-y-4 text-xs"><div className="flex justify-between"><dt className="text-[#8a7f8c]">Shape</dt><dd className="font-semibold capitalize">{shape}</dd></div><div className="flex justify-between"><dt className="text-[#8a7f8c]">Dimensions</dt><dd className="font-semibold">{width} × {height} in</dd></div><div className="flex justify-between gap-3"><dt className="text-[#8a7f8c]">Resolution</dt><dd className="text-right font-semibold">{Math.round(width * DESIGN_DPI)} × {Math.round(height * DESIGN_DPI)} px</dd></div></dl></div>
          )}

          <div className="mt-7 border-t border-[#ebe5ea] pt-5">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Layers</h2><span className="rounded-full bg-[#f3eef3] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#948997]">{allObjects.length + (background ? 1 : 0)}</span></div>
            {allObjects.length || background ? <div className="mt-3 space-y-1.5">
              {[...[...textObjects].reverse(), ...[...elementObjects].reverse(), ...[...imageObjects].reverse()].map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium ${selectedId === item.id ? "border-[#bca5d8] bg-[#f3edfb] text-[#654590]" : "border-transparent bg-[#faf8fa] text-[#6d626f] hover:border-[#ded5dd]"}`}><span className="grid size-6 shrink-0 place-items-center rounded bg-white text-[10px] font-bold">{item.type === "text" ? "T" : item.type === "element" ? "◇" : "▧"}</span><span className="truncate">{item.type === "text" ? item.text || "Empty text" : item.name}</span></button>)}
              {background && <button type="button" onClick={() => setSelectedId(BACKGROUND_SELECTION_ID)} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium ${backgroundSelected ? "border-[#bca5d8] bg-[#f3edfb] text-[#654590]" : "border-transparent bg-[#f4f1f4] text-[#6d626f] hover:border-[#ded5dd]"}`}><span className="grid size-6 shrink-0 place-items-center rounded bg-white text-[10px]" aria-hidden="true">▣</span><span className="min-w-0 flex-1 truncate">Background</span><span className="text-[9px] text-[#948997]" aria-label="Background locked at bottom">🔒</span></button>}
            </div> : <div className="mt-4 rounded-xl border border-dashed border-[#ddd4dc] bg-[#fbf9fb] px-3 py-5 text-center text-xs leading-5 text-[#9a8f9c]">Add text, an image, or an element to see it here.</div>}
          </div>
          <Link href="/create" className="mt-7 flex items-center justify-center rounded-full border border-[#ded6dc] px-4 py-2.5 text-xs font-semibold text-[#665a69] hover:border-[#b9adb6]">Change design settings</Link>
        </aside>
      </div>
      {fontBrowserOpen && selectedText && <FontBrowser fonts={fontOptions} selectedFamily={selectedText.fontFamily} onSelect={(family) => updateText(selectedText.id, { fontFamily: family })} onClose={() => setFontBrowserOpen(false)} />}
      {cropDraft && <BackgroundCropModal background={cropDraft} designWidth={width * DESIGN_DPI} designHeight={height * DESIGN_DPI} shape={shape} onApply={applyBackground} onCancel={cancelCrop} />}
    </main>
  );
}
