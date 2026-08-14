import OpenAI from "openai";
import { buildCakeTopperPrompt, validateCakeTopperPromptRequest } from "@/lib/ai/build-cake-topper-prompt";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  try {
    const client = new OpenAI({ apiKey });
    const prompt = await buildCakeTopperPrompt(client, input);

    return Response.json({ success: true, prompt });
  } catch {
    return Response.json(
      { success: false, error: "Unable to build design prompt." },
      { status: 502 },
    );
  }
}
