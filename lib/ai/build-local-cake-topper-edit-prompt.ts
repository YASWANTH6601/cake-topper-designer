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
    const messagePlacement = message
      ? "Keep the complete customer message inside the circle with every letter safely away from the trimming edge. Make the typography follow and balance with the circular composition naturally, while remaining fully readable after the circular crop."
      : "Use the entire circular composition naturally. Do not reserve blank text space, create an empty banner, or generate random words.";
    return `Create the transformed artwork specifically as a finished circular cake-topper composition for the current ${width}-inch round cake. Although the API requires a square 1:1 source image, the actual finished artwork must be designed entirely for the circular printable region. Treat the circle inscribed inside the square source as the final design boundary. Do not compose this as a square poster. The four outside corner regions are not part of the finished cake topper, so do not place meaningful or important visual content in those corners. Keep ${protectedContent} comfortably inside the circular boundary. Use the full circle naturally, balancing the design from the center outward. Nothing important may be lost when the square source is clipped to a perfect circle. ${messagePlacement}`;
  }
  if (shape === "square") {
    return `Create this specifically for the current ${width} × ${height}-inch square edible cake topper. Use the full square composition naturally and keep ${protectedContent} comfortably inside square-safe margins.`;
  }

  const orientation = height > width ? "portrait" : width > height ? "landscape" : "square";
  return `Create this specifically for the current ${width} × ${height}-inch ${orientation} rectangular edible cake topper. Use a ${orientation} composition with an approximate ${width}:${height} aspect ratio, preserve that physical width-to-height relationship, and keep ${protectedContent} comfortably inside printable safe margins.`;
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
    `Create a polished themed birthday composition for the current ${getTarget(input)}. The physical dimensions are composition context only; the editor handles final 300-DPI print sizing.`,
    "Add appropriate background, decorations, lighting, complementary colors, and birthday atmosphere while treating the customer's requested transformation as the highest-priority direction.",
    getCompositionGuidance(input),
    "Produce colorful, polished, print-friendly artwork suitable for an edible cake topper. Do not add random words, captions, signatures, watermarks, unnecessary logos, or any unintended text.",
  ].join("\n\n");
}
