import "server-only";

import type { CakeTopperPromptRequest } from "./build-cake-topper-prompt";

function getCompositionGuidance({ shape, width, height, message }: CakeTopperPromptRequest) {
  const importantContent = message
    ? "the main subject, faces, the exact birthday message, and all important details"
    : "the main subject, faces, and important details";

  if (shape === "circle") {
    return `Use a square 1:1 source composition intended for a circular final crop. Keep ${importantContent} centered, comfortably inside the circular safe area, and away from trimming edges.`;
  }

  if (shape === "square") {
    return `Use a balanced square composition and keep ${importantContent} comfortably inside safe margins.`;
  }

  const orientation = height > width ? "portrait" : width > height ? "landscape" : "square";
  return `Use a ${orientation} composition with an approximate ${width}:${height} aspect ratio. Keep ${importantContent} comfortably inside safe margins.`;
}

function getMessageGuidance(message: string) {
  if (!message) {
    return "No customer message was provided. Use the full composition naturally without empty banners, blank ribbons, or reserved text areas. Do not render any written words, captions, signatures, watermarks, or unnecessary logos.";
  }

  const exactMessage = JSON.stringify(message);
  return `Integrate the exact customer message ${exactMessage} directly into the finished artwork. Render exactly ${exactMessage}; preserve every word, name, number, and spelling without shortening, rewriting, or replacing it. Make it clearly readable with polished decorative typography appropriate to the requested theme. Choose its placement, lettering style, color, contrast, and any useful outline, shadow, or highlight as part of the overall professional composition. Keep every important letter comfortably inside the printable safe area and away from trimming boundaries. Do not create a separate blank banner or large empty region for the message; balance the artwork and typography together as one complete design. Do not add any other written text.`;
}

export function buildLocalCakeTopperPrompt(input: CakeTopperPromptRequest) {
  const target = input.shape === "circle"
    ? `${input.width}-inch round edible cake topper`
    : `${input.width} × ${input.height}-inch ${input.shape} edible cake topper`;

  return [
    "Create a polished, premium, print-friendly digital illustration for an edible birthday cake topper.",
    `Customer idea: ${input.idea}`,
    `Target: ${target}. The physical dimensions are composition context only; the editor handles final 300-DPI print sizing.`,
    getMessageGuidance(input.message),
    getCompositionGuidance(input),
    "Preserve the customer's main subject and request. Add only complementary background, color, lighting, birthday atmosphere, and visual details that improve the composition.",
    "Use clear shapes, strong visual separation, attractive color, and enough detail for a professional edible print.",
    "Do not add random written words, captions, watermarks, signatures, unwanted logos, or any unintended text.",
  ].join("\n\n");
}
