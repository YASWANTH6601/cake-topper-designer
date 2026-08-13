"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage } from "react-konva";
import type { DesignShape } from "@/types/design";

const DESIGN_DPI = 300;
const SAFE_AREA_INSET = 0.05;
const MAX_DISPLAY_WIDTH = 620;
const MAX_DISPLAY_HEIGHT = 560;

type CakeCanvasStageProps = {
  shape: DesignShape;
  widthInches: number;
  heightInches: number;
};

type DisplaySize = {
  width: number;
  height: number;
};

export default function CakeCanvasStage({
  shape,
  widthInches,
  heightInches,
}: CakeCanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState<DisplaySize>({ width: 0, height: 0 });

  // All design objects use 300-DPI coordinates. The Stage stays browser-sized,
  // and the Layer scale maps design pixels to display pixels without changing
  // the coordinate system future text, images, and export code will share.
  const designWidth = Math.round(widthInches * DESIGN_DPI);
  const designHeight = Math.round(heightInches * DESIGN_DPI);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const availableWidth = Math.min(container.clientWidth, MAX_DISPLAY_WIDTH);
      const availableHeight = Math.min(
        Math.max(window.innerHeight - 250, 300),
        MAX_DISPLAY_HEIGHT,
      );
      const scale = Math.min(
        availableWidth / designWidth,
        availableHeight / designHeight,
      );

      setDisplaySize({
        width: Math.max(1, Math.round(designWidth * scale)),
        height: Math.max(1, Math.round(designHeight * scale)),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [designHeight, designWidth]);

  const scale = displaySize.width / designWidth;
  const inset = Math.min(designWidth, designHeight) * SAFE_AREA_INSET;
  const isCircle = shape === "circle";

  return (
    <div ref={containerRef} className="flex min-h-80 w-full items-center justify-center p-4 sm:p-7">
      {displaySize.width > 0 && (
        <div className="overflow-hidden shadow-[0_22px_60px_rgba(55,36,59,0.18)]" style={{ borderRadius: isCircle ? "50%" : 4 }}>
          <Stage width={displaySize.width} height={displaySize.height}>
            <Layer scaleX={scale} scaleY={scale}>
              <Rect width={designWidth} height={designHeight} fill="#ffffff" />

              {/* Future printable objects belong in this clipped group. */}
              <Group
                clipFunc={
                  isCircle
                    ? (context) => {
                        context.arc(
                          designWidth / 2,
                          designHeight / 2,
                          Math.min(designWidth, designHeight) / 2,
                          0,
                          Math.PI * 2,
                        );
                      }
                    : undefined
                }
              >
                <Rect width={designWidth} height={designHeight} fill="#ffffff" />
              </Group>

              {isCircle ? (
                <>
                  <Circle
                    x={designWidth / 2}
                    y={designHeight / 2}
                    radius={Math.min(designWidth, designHeight) / 2 - 2 / scale}
                    stroke="#d7cfd8"
                    strokeWidth={2 / scale}
                  />
                  <Circle
                    x={designWidth / 2}
                    y={designHeight / 2}
                    radius={Math.min(designWidth, designHeight) / 2 - inset}
                    stroke="#b696c1"
                    strokeWidth={1.5 / scale}
                    dash={[8 / scale, 7 / scale]}
                  />
                </>
              ) : (
                <>
                  <Rect
                    width={designWidth}
                    height={designHeight}
                    stroke="#d7cfd8"
                    strokeWidth={2 / scale}
                  />
                  <Rect
                    x={inset}
                    y={inset}
                    width={designWidth - inset * 2}
                    height={designHeight - inset * 2}
                    stroke="#b696c1"
                    strokeWidth={1.5 / scale}
                    dash={[8 / scale, 7 / scale]}
                  />
                </>
              )}

              <Line
                points={[designWidth / 2, inset, designWidth / 2, designHeight - inset]}
                stroke="#9d91a0"
                strokeWidth={1 / scale}
                opacity={0.34}
                dash={[4 / scale, 8 / scale]}
              />
              <Line
                points={[inset, designHeight / 2, designWidth - inset, designHeight / 2]}
                stroke="#9d91a0"
                strokeWidth={1 / scale}
                opacity={0.34}
                dash={[4 / scale, 8 / scale]}
              />
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
}
