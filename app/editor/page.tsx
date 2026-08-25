import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { editorFontOptions } from "@/lib/editor-fonts";
import type { DesignShape } from "@/types/design";
import { randomUUID } from "node:crypto";

type EditorSearchParams = {
  shape?: string | string[];
  width?: string | string[];
  height?: string | string[];
  name?: string | string[];
  tool?: string | string[];
  design?: string | string[];
};

const validShapes: DesignShape[] = ["circle", "square", "rectangle"];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function validDimension(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function EditorPage({ searchParams }: { searchParams: Promise<EditorSearchParams> }) {
  const query = await searchParams;
  const requestedShape = firstValue(query.shape);
  const shape: DesignShape = validShapes.includes(requestedShape as DesignShape) ? requestedShape as DesignShape : "circle";
  const requestedWidth = validDimension(firstValue(query.width), 8);
  const requestedHeight = validDimension(firstValue(query.height), 8);
  const width = requestedWidth;
  const height = shape === "rectangle" ? requestedHeight : requestedWidth;
  const name = firstValue(query.name)?.trim() || "Untitled Design";
  const requestedTool = firstValue(query.tool);
  const initialTool = requestedTool === "ai" ? "AI Images" as const : requestedTool === "templates" ? "Templates" as const : undefined;
  const requestedDesignId = firstValue(query.design)?.trim();
  const designId = requestedDesignId || randomUUID();

  return <EditorWorkspace shape={shape} width={width} height={height} name={name} fontOptions={editorFontOptions} initialTool={initialTool} designId={designId} loadExisting={Boolean(requestedDesignId)} />;
}
