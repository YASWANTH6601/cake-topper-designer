import { editorTemplates } from "./editor-templates";

const BASE = `Use case: stylized-concept
Asset type: reusable premium cake-topper master artwork
Primary request: Create a polished, print-friendly square 1:1 illustration for the named theme.
Composition/framing: Keep every essential subject, face, and focal object within the central 60–65%. Extend only expendable decoration, scenery, texture, lighting, foliage, confetti, stars, clouds, or balloons toward all four edges. The image must survive center cropping to circle, square, wide landscape rectangle, and tall portrait rectangle. Nothing essential may depend on a corner. Make a complete full composition with no empty banner, blank text box, or reserved message area.
Constraints: no words, letters, numbers, names, captions, signatures, logos, watermarks, readable scoreboards, copyrighted characters, celebrity or athlete likenesses, professional team or league marks, branded uniforms, trademarks, or branded products. Use only generic original subjects.`;

const directions: Readonly<Record<string, string>> = {
  "classic-balloon-birthday": "Bright polished dimensional party illustration; central jewel-color balloon bouquet, curling ribbons, warm lights and tasteful confetti.",
  "colorful-confetti-party": "Crisp contemporary party art; central energetic burst of cyan, coral, yellow and violet confetti, streamers and poppers.",
  "golden-birthday-celebration": "Sophisticated cream and champagne-gold editorial celebration; metallic balloons, satin ribbons, warm bokeh and refined sparkles.",
  "rainbow-birthday-party": "Joyful children's-book art; central radiant rainbow arch, fluffy clouds, vivid balloons and playful confetti.",
  "pastel-birthday-celebration": "Airy premium pastel illustration; blush, lavender, mint and powder-blue balloons with pearly light and delicate streamers.",
  "star-birthday-party": "Elegant celestial party; central luminous gold and blue star cluster, midnight gradient, sparkling trails and subtle balloons.",
  "birthday-cake-celebration": "Appetizing dimensional illustration; central decorated generic cake with non-number candles, frosting, balloons and warm party lighting.",
  "gift-box-party": "Festive polished 3D-like art; central stack of colorful gift boxes with oversized ribbons, balloons and sparkling confetti.",
  "bright-kids-birthday": "Bold modern children's art; central playful mix of balloons, pinwheels and stars in orange, turquoise, yellow and purple.",
  "elegant-birthday-celebration": "Refined painterly botanical celebration; central champagne-gold balloons, ivory flowers, foliage, satin ribbons and subtle sparkle.",
  "dinosaur-jungle-birthday": "Lush whimsical storybook jungle; friendly original colorful dinosaurs centered among tropical foliage, flowers and subtle balloons.",
  "dinosaur-party": "Sunny playful prehistoric clearing; three original friendly dinosaurs centered with party hats, teal and orange balloons and confetti.",
  "baby-dinosaur-birthday": "Soft cute pastel storybook art; adorable baby dinosaurs centered among gentle tropical plants and tiny balloons.",
  "jungle-adventure": "Adventurous layered storybook jungle; central vine-framed path, generic friendly monkey and parrot, distant waterfall and emerald foliage.",
  "colorful-kids-party": "Contemporary playful illustration; central arrangement of balloons, toy-like stars, pinwheels and rainbow party shapes.",
  "kids-rainbow-celebration": "Bright optimistic children's art; central rainbow, fluffy faceless clouds, colorful balloons and stars.",
  "princess-fantasy-birthday": "Premium original storybook fantasy; central magical castle, generic crown motifs, butterflies, flowers and pink-lavender-gold clouds.",
  "royal-crown-birthday": "Regal painterly art; ornate original crown centered on velvet with jewels, roses, gold filigree and palace light, no insignia.",
  "magical-princess-party": "Refined enchanted palace celebration; glowing generic castle centered with floating crowns, butterflies, pastel balloons and magic sparkles.",
  "rainbow-unicorn": "Vivid whimsical fantasy; graceful original white unicorn centered beneath a rainbow with clouds, flowers and jewel-tone mane accents.",
  "unicorn-dream": "Serene dreamy painting; original unicorn resting centrally on luminous clouds under crescent moon, pastel stars and mist.",
  "butterfly-fantasy": "Elegant jewel-tone fantasy; magnificent iridescent butterfly centered over a magical flower meadow with glowing particles.",
  "magical-stars-birthday": "Dreamy premium celestial fantasy; central constellation-like gold, lavender and blue stars with crescent moon and soft clouds.",
  "soccer-stadium-birthday": "Energetic dramatic generic stadium art; central soccer ball on green field, royal-blue and gold floodlights, trophy accents and confetti.",
  "basketball-birthday": "Bold arena-inspired art; central generic basketball before a glowing hoop, orange and royal-blue lighting and gold confetti.",
  "football-birthday": "Dramatic generic American-football stadium; central brown football, goalposts, navy-gold floodlights and streamers.",
  "baseball-birthday": "Bright premium ballpark art; central generic baseball, crossed wooden bats and glove on a diamond with red, navy and gold accents.",
  "sports-champion": "Dynamic championship art; central generic gold trophy and medal surrounded by unbranded mixed sports balls and stadium lights.",
  "trophy-celebration": "Luminous blue-and-gold celebration; central generic trophy on stadium pedestal with spotlights, ribbons and metallic confetti.",
  "all-star-birthday": "Bold all-sports illustration; central star-shaped trophy with generic soccer, basketball, baseball and football equipment.",
  "game-day-birthday": "Dramatic generic game-day stadium; central mixed sports equipment, abstract crowd, floodlights, streamers and confetti, no scoreboard text.",
  "space-adventure": "Rich colorful galaxy; central original rocket among glowing planets, cobalt-violet nebulae, turquoise stars and coral accents.",
  "rocket-birthday": "Energetic retro-futurist children's art; bright original rocket launching centrally through colorful clouds, planets and sparkling stars.",
  "moon-and-stars": "Calm premium celestial storybook art; luminous crescent moon centered among layered stars, soft clouds and delicate gold sparkles.",
  "outer-space-party": "Playful polished galaxy art; central ringed planet with generic rockets, colorful planets and confetti-like meteors.",
  "little-astronaut-adventure": "Warm children's space illustration; cute original childlike astronaut centered beside small rocket, moon and planets; blank generic suit.",
  "safari-birthday": "Warm illustrated savanna; friendly original giraffe, elephant, zebra and lion grouped centrally with leaves and balloons at golden sunset.",
  "lion-birthday": "Charming original storybook savanna; friendly majestic lion centered with warm balloons, tropical leaves, stars and confetti.",
  "butterfly-garden": "Detailed sunlit botanical painting; large colorful butterfly centered over abundant flowers with dew, bokeh and smaller butterflies.",
  "cute-animal-party": "Cozy dimensional woodland art; original bunny, bear, fox and deer centered with pastel balloons, tiny hats and confetti.",
  "jungle-animals": "Vibrant children's jungle illustration; original tiger, monkey, toucan and elephant centered amid lush foliage and distant waterfall.",
  "floral-celebration": "Sophisticated watercolor-inspired botanical art; central peony and rose bouquet, greenery, flowing ribbons, butterflies and gold sparkle.",
  "pink-flower-birthday": "Romantic premium botanical painting; lush central pink peonies and roses, pearl highlights, butterflies and delicate foliage.",
  "sunflower-birthday": "Sunny watercolor-inspired garden; radiant sunflowers centered with green leaves, butterflies, blue sky and soft gold ribbons.",
  "butterfly-flowers": "Fresh airy botanical art; elegant butterflies circle a central colorful garden bouquet with glowing pollen and watercolor textures.",
  "garden-birthday": "Sophisticated magical garden; central flower-covered arch and winding path, roses, daisies, butterflies and lantern-like sparkles.",
  "baby-cloud-celebration": "Soothing nursery illustration; soft clouds centered with tiny gold stars, crescent moon, pastel balloons and pearly sparkle.",
  "pastel-stars": "Gentle plush-like nursery art; central cluster of lavender, mint and peach stars, clouds, crescent moon and pearly gradients.",
  "little-rainbow": "Clean sweet nursery illustration; small pastel rainbow centered between fluffy clouds with tiny stars, hearts and gentle sparkles.",
  "sweet-hearts-birthday": "Warm refined nursery art; central pink, coral and gold hearts with clouds, ribbons, tiny flowers and delicate sparkles.",
};
if (Object.keys(directions).length !== editorTemplates.length) throw new Error("Every template needs one prompt direction.");
export function buildMasterTemplatePrompt(templateId: string) { const template = editorTemplates.find((item) => item.id === templateId); const direction = directions[templateId]; if (!template || !direction) throw new Error(`Unknown master template: ${templateId}`); return `${BASE}\nTheme: ${template.name}\nArt direction: ${direction}`; }
