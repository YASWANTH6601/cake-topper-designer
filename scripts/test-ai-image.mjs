import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const endpoint = process.env.AI_IMAGE_TEST_URL ?? "http://localhost:3000/api/ai/generate-image";
const outputPath = resolve("tmp/dinosaur-cake-topper.png");

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    idea: "Two cute friendly dinosaurs celebrating a birthday in a colorful jungle",
    message: "Happy 5th Birthday Liam",
    shape: "circle",
    width: 8,
    height: 8,
  }),
});

const result = await response.json();

if (!response.ok || !result.success || typeof result.image !== "string") {
  throw new Error(result.error || `Image request failed with HTTP ${response.status}`);
}

await mkdir(resolve("tmp"), { recursive: true });
await writeFile(outputPath, Buffer.from(result.image, "base64"));

console.log(`Saved one generated image to ${outputPath}`);

