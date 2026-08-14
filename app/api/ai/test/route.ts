import OpenAI from "openai";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { success: false, error: "OpenAI API is not configured." },
      { status: 500 },
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: "Respond with exactly this text and nothing else: Cake Topper AI connected",
    });
    const message = response.output_text.trim();

    if (!message) {
      return Response.json(
        { success: false, error: "OpenAI returned an empty response." },
        { status: 502 },
      );
    }

    return Response.json({
      success: true,
      message,
    });
  } catch {
    return Response.json(
      { success: false, error: "Unable to connect to OpenAI right now." },
      { status: 502 },
    );
  }
}
