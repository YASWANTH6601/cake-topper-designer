"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";
import type { BackgroundObject } from "@/types/editor";
import type { DesignShape } from "@/types/design";

const MAX_PREVIEW_WIDTH = 520;
const MAX_PREVIEW_HEIGHT = 420;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

type BackgroundCropModalProps = {
  background: BackgroundObject;
  designWidth: number;
  designHeight: number;
  shape: DesignShape;
  onApply: (background: BackgroundObject) => void;
  onCancel: () => void;
};

function clampPosition(background: BackgroundObject, designWidth: number, designHeight: number) {
  return {
    ...background,
    x: Math.min(background.width / 2, Math.max(designWidth - background.width / 2, background.x)),
    y: Math.min(background.height / 2, Math.max(designHeight - background.height / 2, background.y)),
  };
}

export function createCoverBackground(
  src: string,
  name: string,
  originalWidth: number,
  originalHeight: number,
  designWidth: number,
  designHeight: number,
): BackgroundObject {
  const coverScale = Math.max(designWidth / originalWidth, designHeight / originalHeight);
  return {
    type: "background",
    src,
    name,
    originalWidth,
    originalHeight,
    x: designWidth / 2,
    y: designHeight / 2,
    width: originalWidth * coverScale,
    height: originalHeight * coverScale,
    zoom: 1,
  };
}

export default function BackgroundCropModal({
  background,
  designWidth,
  designHeight,
  shape,
  onApply,
  onCancel,
}: BackgroundCropModalProps) {
  const [draft, setDraft] = useState(background);
  const dragRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const preview = useMemo(() => {
    const scale = Math.min(MAX_PREVIEW_WIDTH / designWidth, MAX_PREVIEW_HEIGHT / designHeight);
    return { scale, width: designWidth * scale, height: designHeight * scale };
  }, [designHeight, designWidth]);

  function setZoom(nextZoom: number) {
    const zoom = Math.min(MAX_ZOOM, Math.max(1, Math.round(nextZoom * 10) / 10));
    const ratio = zoom / draft.zoom;
    setDraft(clampPosition({
      ...draft,
      width: draft.width * ratio,
      height: draft.height * ratio,
      zoom,
    }, designWidth, designHeight));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerX: event.clientX, pointerY: event.clientY, x: draft.x, y: draft.y };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = dragRef.current;
    if (!start) return;
    setDraft((current) => clampPosition({
      ...current,
      x: start.x + (event.clientX - start.pointerX) / preview.scale,
      y: start.y + (event.clientY - start.pointerY) / preview.scale,
    }, designWidth, designHeight));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#211925]/70 p-4" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="crop-title" className="text-lg font-semibold">Position background</h2><p className="mt-1 text-xs leading-5 text-[#817584]">Drag to choose the visible area. Zoom always keeps the design fully covered.</p></div>
          <button type="button" onClick={onCancel} className="grid size-9 shrink-0 place-items-center rounded-full border border-[#ded6dc] text-[#6d626f]" aria-label="Cancel background editing">×</button>
        </div>

        <div className="mt-5 flex min-h-[300px] items-center justify-center rounded-2xl bg-[#eee9ef] p-4">
          <div
            className="relative cursor-grab touch-none overflow-hidden bg-white shadow-xl active:cursor-grabbing"
            style={{ width: preview.width, height: preview.height, borderRadius: shape === "circle" ? "50%" : 8 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
          >
            {/* A plain img is intentional here: the source is a local object URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.src}
              alt="Background crop preview"
              draggable={false}
              className="pointer-events-none absolute max-w-none select-none"
              style={{
                width: draft.width * preview.scale,
                height: draft.height * preview.scale,
                left: draft.x * preview.scale,
                top: draft.y * preview.scale,
                transform: "translate(-50%, -50%)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 border-2 border-white/90" style={{ borderRadius: shape === "circle" ? "50%" : 8 }} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" aria-label="Background zoom controls">
            <button type="button" onClick={() => setZoom(draft.zoom - ZOOM_STEP)} disabled={draft.zoom <= 1} className="grid size-10 place-items-center rounded-full border border-[#ded6dc] text-lg disabled:cursor-not-allowed disabled:opacity-35" aria-label="Zoom out">−</button>
            <span className="min-w-20 text-center text-xs font-semibold text-[#706473]">Zoom</span>
            <button type="button" onClick={() => setZoom(draft.zoom + ZOOM_STEP)} disabled={draft.zoom >= MAX_ZOOM} className="grid size-10 place-items-center rounded-full border border-[#ded6dc] text-lg disabled:cursor-not-allowed disabled:opacity-35" aria-label="Zoom in">+</button>
          </div>
          <div className="flex gap-2"><button type="button" onClick={onCancel} className="rounded-full border border-[#ded6dc] px-5 py-2.5 text-xs font-semibold">Cancel</button><button type="button" onClick={() => onApply(draft)} className="rounded-full bg-[#f57558] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#e8694d]">Apply</button></div>
        </div>
      </div>
    </div>
  );
}
