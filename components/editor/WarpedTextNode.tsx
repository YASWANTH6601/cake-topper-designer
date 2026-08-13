"use client";

import Konva from "konva";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import type { TextObject } from "@/types/editor";

const MAX_CURVE_LEVEL = 20;
const SLICE_WIDTH = 1;

type WarpedTextNodeProps = {
  item: TextObject;
  onSelect: () => void;
  onChange: (updates: Partial<TextObject>) => void;
};

type WarpedBitmap = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
};

function cropToVisibleBounds(canvas: HTMLCanvasElement, padding: number): WarpedBitmap {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { canvas, width: canvas.width, height: canvas.height };
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (pixels[(y * canvas.width + x) * 4 + 3] === 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return { canvas, width: canvas.width, height: canvas.height };
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropRight = Math.min(canvas.width, maxX + padding + 1);
  const cropBottom = Math.min(canvas.height, maxY + padding + 1);
  const cropped = document.createElement("canvas");
  cropped.width = cropRight - cropX;
  cropped.height = cropBottom - cropY;
  cropped.getContext("2d")?.drawImage(
    canvas,
    cropX,
    cropY,
    cropped.width,
    cropped.height,
    0,
    0,
    cropped.width,
    cropped.height,
  );
  return { canvas: cropped, width: cropped.width, height: cropped.height };
}

function createWarpedBitmap(
  text: string,
  fontFamily: string,
  fontSize: number,
  fill: string,
  curveLevel: number,
): WarpedBitmap {
  const measureCanvas = document.createElement("canvas");
  const measureContext = measureCanvas.getContext("2d");
  const font = `${fontSize}px ${fontFamily}`;
  if (measureContext) measureContext.font = font;
  const metrics = measureContext?.measureText(text || " ");
  const measuredWidth = metrics?.width ?? fontSize * Math.max(text.length, 2) * 0.55;
  const leftExtent = metrics?.actualBoundingBoxLeft ?? 0;
  const rightExtent = metrics?.actualBoundingBoxRight ?? measuredWidth;
  const ascent = metrics?.actualBoundingBoxAscent ?? fontSize * 0.85;
  const descent = metrics?.actualBoundingBoxDescent ?? fontSize * 0.25;
  const padding = Math.ceil(fontSize * 0.18);
  const sourceWidth = Math.max(1, Math.ceil(leftExtent + rightExtent + padding * 2));
  const sourceHeight = Math.max(1, Math.ceil(ascent + descent + padding * 2));

  const source = document.createElement("canvas");
  source.width = sourceWidth;
  source.height = sourceHeight;
  const sourceContext = source.getContext("2d");
  if (sourceContext) {
    sourceContext.font = font;
    sourceContext.fillStyle = fill;
    sourceContext.textBaseline = "alphabetic";
    sourceContext.fillText(text, padding + leftExtent, padding + ascent);
  }

  const strength = Math.min(MAX_CURVE_LEVEL, Math.abs(curveLevel)) / MAX_CURVE_LEVEL;
  const bend = Math.ceil(Math.min(sourceWidth * 0.34, fontSize * 3.6) * strength);
  const envelopeExpansion = Math.ceil(sourceHeight * 0.14 * strength);
  const output = document.createElement("canvas");
  output.width = sourceWidth;
  output.height = sourceHeight + bend + envelopeExpansion;
  const outputContext = output.getContext("2d");

  if (outputContext) {
    // Map the complete rectangular text field between curved top and bottom
    // envelope boundaries. Columns keep their horizontal relationship while
    // their position and height vary smoothly, making the field act like one
    // flexible ribbon instead of a row of independently curved characters.
    for (let x = 0; x < sourceWidth; x += SLICE_WIDTH) {
      const sliceWidth = Math.min(SLICE_WIDTH, sourceWidth - x);
      const normalizedX = (x + sliceWidth / 2) / sourceWidth;
      const distanceFromCenter = normalizedX * 2 - 1;
      const parabola = distanceFromCenter * distanceFromCenter;
      const curve = curveLevel > 0 ? parabola : 1 - parabola;
      const y = bend * curve;
      const fieldScale = 1 + 0.14 * strength * (1 - parabola);
      const warpedHeight = sourceHeight * fieldScale;
      outputContext.drawImage(source, x, 0, sliceWidth, sourceHeight, x, y, sliceWidth, warpedHeight);
    }
  }

  return cropToVisibleBounds(output, Math.max(2, Math.ceil(fontSize * 0.04)));
}

const WarpedTextNode = forwardRef<Konva.Image, WarpedTextNodeProps>(function WarpedTextNode(
  { item, onSelect, onChange },
  ref,
) {
  const [fontRevision, setFontRevision] = useState(0);
  const { curveLevel, fill, fontFamily, fontSize, text } = item;

  useEffect(() => {
    let active = true;
    void document.fonts.load(`${item.fontSize}px ${item.fontFamily}`, item.text).then(() => {
      if (active) setFontRevision((revision) => revision + 1);
    });
    return () => {
      active = false;
    };
  }, [item.fontFamily, item.fontSize, item.text]);

  const bitmap = useMemo(
    () => {
      // Recreate once the browser confirms the selected face is available.
      void fontRevision;
      return createWarpedBitmap(text, fontFamily, fontSize, fill, curveLevel);
    },
    [fontRevision, curveLevel, fill, fontFamily, fontSize, text],
  );

  return (
    <KonvaImage
      ref={ref}
      image={bitmap.canvas}
      width={bitmap.width}
      height={bitmap.height}
      offsetX={bitmap.width / 2}
      offsetY={bitmap.height / 2}
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={onSelect}
      onDragEnd={(event) => onChange({ x: event.target.x(), y: event.target.y() })}
      onTransformEnd={(event) => {
        const node = event.target;
        const scale = Math.max(Math.abs(node.scaleX()), Math.abs(node.scaleY()));
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          fontSize: Math.max(30, Math.round(item.fontSize * scale)),
        });
      }}
    />
  );
});

export default WarpedTextNode;
