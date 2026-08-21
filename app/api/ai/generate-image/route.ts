import OpenAI from "openai";
import {
  type CakeTopperPromptRequest,
  validateCakeTopperPromptRequest,
} from "@/lib/ai/build-cake-topper-prompt";
import { buildLocalCakeTopperPrompt } from "@/lib/ai/build-local-cake-topper-prompt";

export const runtime = "nodejs";

function getGenerationSize({ shape, width, height }: CakeTopperPromptRequest) {
  if (shape !== "rectangle" || width === height) return "1024x1024" as const;
  return height > width ? "1024x1536" as const : "1536x1024" as const;
}

export async function POST(request: Request) {
  const requestStartedAt = performance.now();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { success: false, error: "OpenAI API is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const input = validateCakeTopperPromptRequest(body);
  if (!input) {
    return Response.json(
      { success: false, error: "Provide an idea, a valid shape, and positive numeric width and height values. Message is optional." },
      { status: 400 },
    );
  }

  const suppliedPrompt = typeof (body as Record<string, unknown>).prompt === "string"
    ? (body as Record<string, string>).prompt.trim()
    : "";
  if (suppliedPrompt.length > 8_000) {
    return Response.json(
      { success: false, error: "The reusable prompt is too long." },
      { status: 400 },
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const prompt = suppliedPrompt || buildLocalCakeTopperPrompt(input);
    const imageStartedAt = performance.now();
    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      size: getGenerationSize(input),
      quality: "low",
      output_format: "png",
      background: "opaque",
      n: 1,
    });
    const imageTime = Math.round(performance.now() - imageStartedAt);
    const image = result.data?.[0]?.b64_json;

    if (!image) throw new Error("Image response did not contain image data");

    if (process.env.NODE_ENV !== "production") {
      const totalTime = Math.round(performance.now() - requestStartedAt);
      console.info(`AI generation: prompt=${suppliedPrompt ? "reused" : "local"} image=${imageTime}ms total=${totalTime}ms`);
    }

    return Response.json({
      success: true,
      prompt,
      image,
      mimeType: "image/png",
    });
  } catch {
    return Response.json(
      { success: false, error: "Unable to generate this design." },
      { status: 502 },
    );
  }
}
