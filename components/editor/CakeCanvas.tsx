"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { CakeCanvasHandle } from "./CakeCanvasStage";
import type { DesignShape } from "@/types/design";
import type { BackgroundObject, ImageObject, TextObject } from "@/types/editor";

const CakeCanvasStage = dynamic(() => import("./CakeCanvasStage"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-72 w-full place-items-center text-sm font-medium text-[#847887]">
      Preparing canvas…
    </div>
  ),
});

type CakeCanvasProps = {
  shape: DesignShape;
  widthInches: number;
  heightInches: number;
  textObjects: TextObject[];
  imageObjects: ImageObject[];
  background: BackgroundObject | null;
  backgroundEditMode: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, updates: Partial<TextObject>) => void;
  onImageChange: (id: string, updates: Partial<ImageObject>) => void;
  onBackgroundChange: (updates: Partial<BackgroundObject>) => void;
};

const CakeCanvas = forwardRef<CakeCanvasHandle, CakeCanvasProps>(function CakeCanvas(props, ref) {
  return <CakeCanvasStage ref={ref} {...props} />;
});

export default CakeCanvas;
export type { CakeCanvasHandle };
