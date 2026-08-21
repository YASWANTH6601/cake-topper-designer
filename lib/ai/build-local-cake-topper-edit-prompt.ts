import "server-only";

import type { CakeTopperPromptRequest } from "./build-cake-topper-prompt";

export type CakeTopperEditPromptRequest = Omit<CakeTopperPromptRequest, "idea"> & {
  instruction: string;
};

function getTarget({ shape, width, height }: CakeTopperEditPromptRequest) {
  if (shape === "circle") return `${width}-inch round edible cake topper`;
  return `${width} × ${height}-inch ${shape} edible cake topper`;
}

function getCompositionGuidance({ shape, width, height, message }: CakeTopperEditPromptRequest) {
  const protectedContent = message
    ? "faces, the exact birthday message, and all important visual details"
    : "faces and all important visual details";

  if (shape === "circle") {
    return `Use a square 1:1 source composition intended for a circular final crop. Keep ${protectedContent} comfortably inside the circular safe area and away from the trimming edge.`;
  }
  if (shape === "square") {
    return `Use a balanced square composition and keep ${protectedContent} comfortably inside safe margins.`;
  }

  const orientation = height > width ? "portrait" : width > height ? "landscape" : "square";
  return `Use a ${orientation} composition with an approximate ${width}:${height} aspect ratio. Keep ${protectedContent} comfortably inside safe margins.`;
}

function getMessageGuidance(message: string) {
  if (!message) {
    return "No customer message was provided. Use the full composition naturally without empty banners, blank ribbons, or reserved text areas. Do not generate written words, captions, labels, watermarks, signatures, or unnecessary logos.";
  }

  const exactMessage = JSON.stringify(message);
  return `Integrate the exact customer message ${exactMessage} directly into the finished artwork. Render exactly ${exactMessage}; preserve every word, name, number, and spelling without shortening, rewriting, or replacing it. Make it clearly readable with polished decorative typography appropriate to the transformed theme. Choose its placement, lettering style, color, contrast, and any useful outline, shadow, or highlight as part of the overall professional composition. Keep every important letter comfortably inside the printable safe area and away from trimming boundaries. Do not create a separate blank banner or large empty region for the message; balance the artwork and typography together as one complete design. Do not add any other written text.`;
}

export function buildLocalCakeTopperEditPrompt(input: CakeTopperEditPromptRequest) {
  return [
    "Use the supplied image as the primary visual reference. Preserve its important, recognizable main subject while transforming and enhancing the complete composition.",
    `Customer instructions: ${input.instruction}`,
    getMessageGuidance(input.message),
    `Create a polished themed birthday composition for a ${getTarget(input)}. The physical dimensions are composition context only; the editor handles final 300-DPI print sizing.`,
    "Add appropriate background, decorations, lighting, complementary colors, and birthday atmosphere while treating the customer's requested transformation as the highest-priority direction.",
    getCompositionGuidance(input),
    "Produce colorful, polished, print-friendly artwork suitable for an edible cake topper. Do not add random words, captions, signatures, watermarks, unnecessary logos, or any unintended text.",
  ].join("\n\n");
}
