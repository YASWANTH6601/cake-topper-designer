import OpenAI, { toFile } from "openai";
import type { CakeTopperShape } from "@/lib/ai/build-cake-topper-prompt";
import { buildLocalCakeTopperEditPrompt } from "@/lib/ai/build-local-cake-topper-edit-prompt";

export const runtime = "nodejs";

const DESIGN_SHAPES: CakeTopperShape[] = ["circle", "square", "rectangle"];
const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_INSTRUCTION_LENGTH = 2_000;
const MAX_MESSAGE_LENGTH = 500;

function getGenerationSize(shape: CakeTopperShape, width: number, height: number) {
  if (shape !== "rectangle" || width === height) return "1024x1024" as const;
  return height > width ? "1024x1536" as const : "1536x1024" as const;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ success: false, error: "OpenAI API is not configured." }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ success: false, error: "Invalid image-edit request." }, { status: 400 });
  }

  const image = formData.get("image");
  const instruction = String(formData.get("instruction") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const shapeValue = String(formData.get("shape") ?? "");
  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));

  if (!(image instanceof File) || !SUPPORTED_IMAGE_TYPES.includes(image.type) || image.size <= 0 || image.size > MAX_FILE_SIZE) {
    return Response.json({ success: false, error: "Choose a PNG, JPEG, or WEBP image up to 10 MB." }, { status: 400 });
  }

  if (
    !instruction
    || instruction.length > MAX_INSTRUCTION_LENGTH
    || message.length > MAX_MESSAGE_LENGTH
    || !DESIGN_SHAPES.includes(shapeValue as CakeTopperShape)
    || !Number.isFinite(width)
    || width <= 0
    || !Number.isFinite(height)
    || height <= 0
  ) {
    return Response.json({ success: false, error: "Provide valid instructions, shape, and positive dimensions." }, { status: 400 });
  }

  const shape = shapeValue as CakeTopperShape;
  const prompt = buildLocalCakeTopperEditPrompt({ instruction, message, shape, width, height });
  const requestStartedAt = performance.now();

  try {
    const client = new OpenAI({ apiKey });
    const upload = await toFile(
      new Uint8Array(await image.arrayBuffer()),
      image.name || "reference-image",
      { type: image.type },
    );
    const imageStartedAt = performance.now();
    const result = await client.images.edit({
      model: "gpt-image-2",
      image: upload,
      prompt,
      size: getGenerationSize(shape, width, height),
      quality: "low",
      output_format: "png",
      background: "opaque",
      n: 1,
    });
    const imageTime = Math.round(performance.now() - imageStartedAt);
    const output = result.data?.[0]?.b64_json;
    if (!output) throw new Error("Image edit response did not contain image data");

    if (process.env.NODE_ENV !== "production") {
      const totalTime = Math.round(performance.now() - requestStartedAt);
      console.info(`AI image edit: image=${imageTime}ms total=${totalTime}ms`);
    }

    return Response.json({ success: true, prompt, image: output, mimeType: "image/png" });
  } catch {
    return Response.json({ success: false, error: "Unable to create a design from this image." }, { status: 502 });
  }
}
