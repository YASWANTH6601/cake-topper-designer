"use client";

import { useEffect } from "react";
import type { DesignShape } from "@/types/design";
import type { A4PrintLayout } from "@/lib/print-layout";

type PrintPreviewModalProps = {
  artworkUrl: string;
  layout: A4PrintLayout;
  shape: DesignShape;
  onClose: () => void;
};

function topperLabel(shape: DesignShape, width: number, height: number) {
  if (shape === "circle") return `${width}\" Round`;
  if (shape === "square") return `${width} × ${height}\" Square`;
  return `${width} × ${height}\" Rectangle`;
}

export default function PrintPreviewModal({ artworkUrl, layout, shape, onClose }: PrintPreviewModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [onClose]);

  function printActualSize() {
    const frame = document.createElement("iframe");
    frame.title = "A4 print document";
    frame.style.position = "fixed";
    frame.style.width = "1px";
    frame.style.height = "1px";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.border = "0";
    const orientation = layout.orientation;
    frame.srcdoc = `<!doctype html><html><head><title>Cake Topper Print</title><style>
      @page { size: A4 ${orientation}; margin: 0; }
      html, body { margin: 0; padding: 0; width: ${layout.pageWidthMm}mm; height: ${layout.pageHeightMm}mm; overflow: hidden; }
      body { display: flex; align-items: center; justify-content: center; background: white; }
      img { display: block; width: ${layout.topperWidthInches}in; height: ${layout.topperHeightInches}in; object-fit: fill; max-width: none; max-height: none; }
    </style></head><body><img src="${artworkUrl}" alt=""></body></html>`;
    frame.onload = () => {
      const printWindow = frame.contentWindow;
      if (!printWindow) return;
      const cleanup = () => window.setTimeout(() => frame.remove(), 500);
      printWindow.addEventListener("afterprint", cleanup, { once: true });
      printWindow.focus();
      printWindow.print();
      window.setTimeout(cleanup, 60_000);
    };
    document.body.appendChild(frame);
  }

  const artworkWidthPercent = layout.topperWidthInches / layout.pageWidthInches * 100;
  const artworkHeightPercent = layout.topperHeightInches / layout.pageHeightInches * 100;

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211925]/70 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="print-preview-title" className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:flex-row">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#eee9ef] p-5 sm:p-8">
        <div className="relative max-h-[70vh] max-w-full bg-white shadow-[0_18px_55px_rgba(47,30,50,0.2)]" style={{ aspectRatio: `${layout.pageWidthMm} / ${layout.pageHeightMm}`, height: layout.orientation === "portrait" ? "min(68vh, 680px)" : "auto", width: layout.orientation === "landscape" ? "min(68vw, 720px)" : "auto" }} aria-label="A4 sheet preview">
          {/* The blob URL is generated locally from the clean printable Konva scene. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artworkUrl} alt={`${topperLabel(shape, layout.topperWidthInches, layout.topperHeightInches)} centered on A4`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: `${artworkWidthPercent}%`, height: `${artworkHeightPercent}%` }} />
        </div>
      </div>
      <div className="w-full shrink-0 overflow-y-auto p-6 lg:w-[340px] lg:p-7">
        <div className="flex items-start justify-between gap-4"><div><h2 id="print-preview-title" className="text-xl font-semibold">Print Preview</h2><p className="mt-1 text-xs text-[#817584]">Your topper centered on an A4 sheet.</p></div><button type="button" onClick={onClose} aria-label="Close print preview" className="grid size-9 place-items-center rounded-full border border-[#ddd5dc] text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7957a7]">×</button></div>
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-[#f7f3f7] p-4 text-xs"><div><dt className="text-[#928694]">Paper</dt><dd className="mt-1 font-semibold">A4</dd></div><div><dt className="text-[#928694]">Orientation</dt><dd className="mt-1 font-semibold capitalize">{layout.orientation}</dd></div><div><dt className="text-[#928694]">Topper</dt><dd className="mt-1 font-semibold">{topperLabel(shape, layout.topperWidthInches, layout.topperHeightInches)}</dd></div><div><dt className="text-[#928694]">Print Size</dt><dd className="mt-1 font-semibold">{layout.topperWidthInches}&Prime; × {layout.topperHeightInches}&Prime;</dd></div><div className="col-span-2"><dt className="text-[#928694]">Scale</dt><dd className="mt-1 font-semibold">100% / Actual Size</dd></div></dl>
        <div className="mt-5 rounded-2xl border border-[#efc9ba] bg-[#fff5ef] p-4"><p className="text-sm font-bold text-[#a84f39]">Print at 100% / Actual Size.</p><p className="mt-2 text-xs leading-5 text-[#805e55]">Use A4 paper and disable Fit to Page or Scale to Fit in your printer settings. The app has already selected the correct orientation.</p></div>
        <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={onClose} className="rounded-full border border-[#ddd5dc] px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7957a7]">Cancel</button><button type="button" onClick={printActualSize} className="rounded-full bg-[#f57558] px-4 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7957a7]">Print</button></div>
      </div>
    </section>
  </div>;
}
