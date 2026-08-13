"use client";

import Konva from "konva";
import { forwardRef, useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import type { BackgroundObject } from "@/types/editor";

type CanvasBackgroundNodeProps = {
  background: BackgroundObject;
  designWidth: number;
  designHeight: number;
  editable: boolean;
  onChange: (updates: Partial<BackgroundObject>) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const CanvasBackgroundNode = forwardRef<Konva.Image, CanvasBackgroundNodeProps>(function CanvasBackgroundNode(
  { background, designWidth, designHeight, editable, onChange },
  ref,
) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const element = new Image();
    element.onload = () => setImage(element);
    element.src = background.src;
    return () => { element.onload = null; };
  }, [background.src]);

  return (
    <KonvaImage
      ref={ref}
      image={image ?? undefined}
      x={background.x}
      y={background.y}
      width={background.width}
      height={background.height}
      offsetX={background.width / 2}
      offsetY={background.height / 2}
      draggable={editable}
      listening={editable}
      dragBoundFunc={(position) => ({
        x: clamp(position.x, designWidth - background.width / 2, background.width / 2),
        y: clamp(position.y, designHeight - background.height / 2, background.height / 2),
      })}
      onDragEnd={(event) => onChange({ x: event.target.x(), y: event.target.y() })}
      onTransformEnd={(event) => {
        const node = event.target;
        const requestedScale = Math.max(Math.abs(node.scaleX()), Math.abs(node.scaleY()));
        const minimumScale = Math.max(designWidth / background.width, designHeight / background.height);
        const scale = Math.max(requestedScale, minimumScale);
        const nextWidth = background.width * scale;
        const nextHeight = background.height * scale;
        const coverScale = Math.max(designWidth / background.originalWidth, designHeight / background.originalHeight);
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: clamp(node.x(), designWidth - nextWidth / 2, nextWidth / 2),
          y: clamp(node.y(), designHeight - nextHeight / 2, nextHeight / 2),
          width: nextWidth,
          height: nextHeight,
          zoom: nextWidth / (background.originalWidth * coverScale),
        });
      }}
    />
  );
});

export default CanvasBackgroundNode;
