"use client";

import dynamic from "next/dynamic";
import type { DesignShape } from "@/types/design";

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
};

export default function CakeCanvas(props: CakeCanvasProps) {
  return <CakeCanvasStage {...props} />;
}
