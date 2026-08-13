"use client";

import Konva from "konva";
import { forwardRef, useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import type { ImageObject } from "@/types/editor";

type CanvasImageNodeProps = {
  item: ImageObject;
  onSelect: () => void;
  onChange: (updates: Partial<ImageObject>) => void;
};

const CanvasImageNode = forwardRef<Konva.Image, CanvasImageNodeProps>(function CanvasImageNode(
  { item, onSelect, onChange },
  ref,
) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const element = new Image();
    element.onload = () => setImage(element);
    element.src = item.src;
    return () => {
      element.onload = null;
    };
  }, [item.src]);

  return (
    <KonvaImage
      ref={ref}
      image={image ?? undefined}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      offsetX={item.width / 2}
      offsetY={item.height / 2}
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
          width: Math.max(30, Math.round(item.width * scale)),
          height: Math.max(30, Math.round(item.height * scale)),
          rotation: node.rotation(),
        });
      }}
    />
  );
});

export default CanvasImageNode;
