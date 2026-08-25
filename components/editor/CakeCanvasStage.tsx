"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Konva from "konva";
import { Circle, Group, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import WarpedTextNode from "./WarpedTextNode";
import CanvasImageNode from "./CanvasImageNode";
import CanvasBackgroundNode from "./CanvasBackgroundNode";
import CanvasElementNode from "./CanvasElementNode";
import type { DesignShape } from "@/types/design";
import { BACKGROUND_SELECTION_ID, type BackgroundObject, type ElementObject, type ImageObject, type TextObject } from "@/types/editor";

const DESIGN_DPI = 300;
const SAFE_AREA_INSET = 0.05;
const MAX_DISPLAY_WIDTH = 620;
const MAX_DISPLAY_HEIGHT = 560;
const MIN_FONT_SIZE = 30;

type CakeCanvasStageProps = {
  shape: DesignShape;
  widthInches: number;
  heightInches: number;
  textObjects: TextObject[];
  imageObjects: ImageObject[];
  elementObjects: ElementObject[];
  background: BackgroundObject | null;
  backgroundEditMode: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, updates: Partial<TextObject>) => void;
  onImageChange: (id: string, updates: Partial<ImageObject>) => void;
  onElementChange: (id: string, updates: Partial<ElementObject>) => void;
  onBackgroundChange: (updates: Partial<BackgroundObject>) => void;
};

type DisplaySize = { width: number; height: number };

export type CakeCanvasHandle = {
  exportPng: () => Promise<Blob>;
  exportThumbnail: (maxEdge?: number) => Promise<Blob>;
};

function waitForFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

const CakeCanvasStage = forwardRef<CakeCanvasHandle, CakeCanvasStageProps>(function CakeCanvasStage({
  shape,
  widthInches,
  heightInches,
  textObjects,
  imageObjects,
  elementObjects,
  background,
  backgroundEditMode,
  selectedId,
  onSelect,
  onChange,
  onImageChange,
  onElementChange,
  onBackgroundChange,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const printableGroupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const objectRefs = useRef<Map<string, Konva.Node>>(new Map());
  const [displaySize, setDisplaySize] = useState<DisplaySize>({ width: 0, height: 0 });

  // Objects live in a stable 300-DPI design coordinate system. Only the Layer
  // is scaled to the responsive browser Stage, so dragging and transforms are
  // always reported back in internal design pixels.
  const designWidth = Math.round(widthInches * DESIGN_DPI);
  const designHeight = Math.round(heightInches * DESIGN_DPI);

  useImperativeHandle(ref, () => {
    async function renderPrintable(pixelRatio: number) {
      const printableGroup = printableGroupRef.current;
      if (!printableGroup) throw new Error("The design canvas is not ready.");

      if (document.fonts) {
        await Promise.all(textObjects.map((item) =>
          document.fonts.load(`${item.fontSize}px ${item.fontFamily}`, item.text),
        ));
        await document.fonts.ready;
      }

      // Image nodes update after their browser images finish loading. Waiting
      // for their node images prevents an export while artwork is still blank.
      const expectedImageIds = [
        ...(background ? [BACKGROUND_SELECTION_ID] : []),
        ...imageObjects.map((item) => item.id),
        ...elementObjects.map((item) => item.id),
      ];
      const deadline = performance.now() + 10_000;
      while (expectedImageIds.some((id) => {
        const node = objectRefs.current.get(id);
        return !(node instanceof Konva.Image) || !node.image();
      })) {
        if (performance.now() >= deadline) throw new Error("Design images did not finish loading.");
        await waitForFrame();
      }

      // Warped text regenerates its bitmap after its font promise resolves.
      // Give React/Konva a frame to commit that final bitmap before rendering.
      await waitForFrame();
      layerRef.current?.draw();

      // A detached deep clone keeps all current image/canvas content and the
      // circle clip, while dropping the responsive scale of the live Layer.
      const exportGroup = printableGroup.clone();
      try {
        const blob = await exportGroup.toBlob({
          x: 0,
          y: 0,
          width: designWidth,
          height: designHeight,
          pixelRatio,
          mimeType: "image/png",
        });
        if (!(blob instanceof Blob)) throw new Error("Konva could not create the PNG.");
        return blob;
      } finally {
        exportGroup.destroy();
      }
    }
    return {
      exportPng: () => renderPrintable(1),
      exportThumbnail: (maxEdge = 420) => renderPrintable(Math.min(1, maxEdge / Math.max(designWidth, designHeight))),
    };
  }, [background, designHeight, designWidth, elementObjects, imageObjects, textObjects]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const availableWidth = Math.min(container.clientWidth, MAX_DISPLAY_WIDTH);
      const availableHeight = Math.min(Math.max(window.innerHeight - 250, 300), MAX_DISPLAY_HEIGHT);
      const scale = Math.min(availableWidth / designWidth, availableHeight / designHeight);
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

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;
    const selectedNode = selectedId ? objectRefs.current.get(selectedId) : undefined;
    transformer.nodes(selectedNode ? [selectedNode] : []);
    transformer.getLayer()?.batchDraw();
  }, [background, elementObjects, imageObjects, selectedId, textObjects]);

  useEffect(() => {
    if (!document.fonts) return;
    const fontLoads = textObjects.map((item) =>
      document.fonts.load(`${item.fontSize}px ${item.fontFamily}`, item.text),
    );
    void Promise.all(fontLoads).then(() => layerRef.current?.batchDraw());
  }, [textObjects]);

  const scale = displaySize.width / designWidth;
  const inset = Math.min(designWidth, designHeight) * SAFE_AREA_INSET;
  const isCircle = shape === "circle";

  return (
    <div ref={containerRef} className="flex min-h-80 w-full items-center justify-center p-4 sm:p-7">
      {displaySize.width > 0 && (
        <div className="overflow-hidden shadow-[0_22px_60px_rgba(55,36,59,0.18)]" style={{ borderRadius: isCircle ? "50%" : 4 }}>
          <Stage
            width={displaySize.width}
            height={displaySize.height}
            onPointerDown={(event) => {
              if (event.target === event.target.getStage()) onSelect(null);
            }}
          >
            <Layer ref={layerRef} scaleX={scale} scaleY={scale}>
              <Rect width={designWidth} height={designHeight} fill="#ffffff" listening={false} />

              {/* Every printable object belongs in this group. Circle designs
                  clip the group while Transformer controls remain unobstructed. */}
              <Group
                ref={printableGroupRef}
                clipFunc={isCircle ? (context) => {
                  context.arc(designWidth / 2, designHeight / 2, Math.min(designWidth, designHeight) / 2, 0, Math.PI * 2);
                } : undefined}
              >
                <Rect width={designWidth} height={designHeight} fill="#ffffff" listening={false} />
                {background && (
                  <CanvasBackgroundNode
                    ref={(node) => {
                      if (node) objectRefs.current.set(BACKGROUND_SELECTION_ID, node);
                      else objectRefs.current.delete(BACKGROUND_SELECTION_ID);
                    }}
                    background={background}
                    designWidth={designWidth}
                    designHeight={designHeight}
                    editable={backgroundEditMode}
                    onChange={onBackgroundChange}
                  />
                )}
                {imageObjects.map((item) => (
                  <CanvasImageNode
                    key={item.id}
                    ref={(node) => {
                      if (node) objectRefs.current.set(item.id, node);
                      else objectRefs.current.delete(item.id);
                    }}
                    item={item}
                    onSelect={() => onSelect(item.id)}
                    onChange={(updates) => onImageChange(item.id, updates)}
                  />
                ))}
                {elementObjects.map((item) => (
                  <CanvasElementNode
                    key={item.id}
                    ref={(node) => {
                      if (node) objectRefs.current.set(item.id, node);
                      else objectRefs.current.delete(item.id);
                    }}
                    item={item}
                    onSelect={() => onSelect(item.id)}
                    onChange={(updates) => onElementChange(item.id, updates)}
                  />
                ))}
                {textObjects.map((item) => {
                  const commonProps = {
                    text: item.text,
                    x: item.x,
                    y: item.y,
                    fontSize: item.fontSize,
                    fontFamily: item.fontFamily,
                    fill: item.fill,
                    rotation: item.rotation,
                    draggable: true,
                    onClick: () => onSelect(item.id),
                    onTap: () => onSelect(item.id),
                    onDragStart: () => onSelect(item.id),
                    onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => onChange(item.id, { x: event.target.x(), y: event.target.y() }),
                    onTransformEnd: (event: Konva.KonvaEventObject<Event>) => {
                      const node = event.target;
                      const nextFontSize = Math.max(MIN_FONT_SIZE, item.fontSize * Math.max(Math.abs(node.scaleX()), Math.abs(node.scaleY())));
                      node.scaleX(1);
                      node.scaleY(1);
                      onChange(item.id, { x: node.x(), y: node.y(), rotation: node.rotation(), fontSize: Math.round(nextFontSize) });
                    },
                  };
                  const setNodeRef = (node: Konva.Node | null) => {
                    if (node) objectRefs.current.set(item.id, node);
                    else objectRefs.current.delete(item.id);
                  };

                  if (item.curveLevel !== 0) {
                    return (
                      <WarpedTextNode
                        key={item.id}
                        ref={setNodeRef}
                        item={item}
                        onSelect={() => onSelect(item.id)}
                        onChange={(updates) => onChange(item.id, updates)}
                      />
                    );
                  }

                  return <Text key={item.id} ref={(node) => {
                    if (node) {
                      node.offsetX(node.width() / 2);
                      node.offsetY(node.height() / 2);
                    }
                    setNodeRef(node);
                  }} {...commonProps} />;
                })}
              </Group>

              {isCircle ? (
                <>
                  <Circle x={designWidth / 2} y={designHeight / 2} radius={Math.min(designWidth, designHeight) / 2 - 2 / scale} stroke="#d7cfd8" strokeWidth={2 / scale} listening={false} />
                  <Circle x={designWidth / 2} y={designHeight / 2} radius={Math.min(designWidth, designHeight) / 2 - inset} stroke="#b696c1" strokeWidth={1.5 / scale} dash={[8 / scale, 7 / scale]} listening={false} />
                </>
              ) : (
                <>
                  <Rect width={designWidth} height={designHeight} stroke="#d7cfd8" strokeWidth={2 / scale} listening={false} />
                  <Rect x={inset} y={inset} width={designWidth - inset * 2} height={designHeight - inset * 2} stroke="#b696c1" strokeWidth={1.5 / scale} dash={[8 / scale, 7 / scale]} listening={false} />
                </>
              )}
              <Line points={[designWidth / 2, inset, designWidth / 2, designHeight - inset]} stroke="#9d91a0" strokeWidth={1 / scale} opacity={0.34} dash={[4 / scale, 8 / scale]} listening={false} />
              <Line points={[inset, designHeight / 2, designWidth - inset, designHeight / 2]} stroke="#9d91a0" strokeWidth={1 / scale} opacity={0.34} dash={[4 / scale, 8 / scale]} listening={false} />
              <Transformer
                ref={transformerRef}
                rotateEnabled={selectedId !== BACKGROUND_SELECTION_ID}
                keepRatio
                enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                anchorFill="#ffffff"
                anchorStroke="#7957c8"
                borderStroke="#7957c8"
                anchorSize={6 / scale}
                anchorCornerRadius={2 / scale}
                borderStrokeWidth={0.8 / scale}
                rotateAnchorOffset={20 / scale}
                boundBoxFunc={(oldBox, newBox) => newBox.width < MIN_FONT_SIZE || newBox.height < MIN_FONT_SIZE ? oldBox : newBox}
              />
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
});

export default CakeCanvasStage;
