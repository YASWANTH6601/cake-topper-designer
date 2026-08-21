// Graphics: Twemoji v17.0.2, maintained by jdecked/twemoji, licensed CC BY 4.0.
// Full attribution is retained alongside the local SVGs in public/elements/twemoji/ATTRIBUTION.md.
export const elementCategories = ["Birthday", "Kids", "Fantasy", "Sports", "Nature", "Space", "Food", "Shapes"] as const;

export type ElementCategory = (typeof elementCategories)[number];
export type ElementAsset = { id: string; name: string; src: string; category: ElementCategory; tags: string[]; aspectRatio: number };

const asset = (id: string, name: string, codepoint: string, category: ElementCategory, tags: string[]): ElementAsset => ({
  id, name, category, tags, aspectRatio: 1, src: `/elements/twemoji/${codepoint}.svg`,
});

export const elementAssets: ElementAsset[] = [
  asset("balloon", "Balloon", "1f388", "Birthday", ["birthday", "party", "celebration"]),
  asset("birthday-cake", "Birthday Cake", "1f382", "Birthday", ["cake", "candle", "dessert"]),
  asset("gift", "Gift", "1f381", "Birthday", ["present", "party", "surprise"]),
  asset("party-popper", "Party Popper", "1f389", "Birthday", ["confetti", "celebration", "party"]),
  asset("confetti-ball", "Confetti Ball", "1f38a", "Birthday", ["confetti", "celebration", "party"]),
  asset("candle", "Candle", "1f56f", "Birthday", ["birthday", "flame", "cake"]),
  asset("star", "Star", "2b50", "Birthday", ["shape", "sparkle", "space"]),
  asset("heart", "Heart", "2764", "Birthday", ["love", "shape", "princess"]),

  asset("t-rex", "T-Rex", "1f996", "Kids", ["dinosaur", "dino", "animal"]),
  asset("sauropod", "Long-Neck Dinosaur", "1f995", "Kids", ["dinosaur", "dino", "animal"]),
  asset("unicorn", "Unicorn", "1f984", "Kids", ["fantasy", "magic", "horse"]),
  asset("lion", "Lion", "1f981", "Kids", ["animal", "jungle", "safari"]),
  asset("tiger", "Tiger", "1f42f", "Kids", ["animal", "jungle", "safari"]),
  asset("dog", "Dog", "1f436", "Kids", ["animal", "puppy", "pet"]),
  asset("cat", "Cat", "1f431", "Kids", ["animal", "kitten", "pet"]),
  asset("teddy-bear", "Teddy Bear", "1f9f8", "Kids", ["toy", "animal", "baby"]),

  asset("crown", "Crown", "1f451", "Fantasy", ["princess", "royal", "king", "queen"]),
  asset("rainbow", "Rainbow", "1f308", "Fantasy", ["colorful", "magic", "kids"]),
  asset("sparkles", "Sparkles", "2728", "Fantasy", ["magic", "star", "shine"]),
  asset("gem", "Gem", "1f48e", "Fantasy", ["diamond", "jewel", "princess"]),
  asset("moon", "Crescent Moon", "1f319", "Fantasy", ["night", "space", "magic"]),
  asset("magic-wand", "Magic Wand", "1fa84", "Fantasy", ["magic", "sparkle", "wizard"]),
  asset("fairy", "Fairy", "1f9da", "Fantasy", ["magic", "wings", "princess"]),

  asset("soccer-ball", "Soccer Ball", "26bd", "Sports", ["football", "ball", "sport"]),
  asset("basketball", "Basketball", "1f3c0", "Sports", ["ball", "hoop", "sport"]),
  asset("football", "Football", "1f3c8", "Sports", ["american football", "ball", "sport"]),
  asset("baseball", "Baseball", "26be", "Sports", ["ball", "sport", "game"]),
  asset("trophy", "Trophy", "1f3c6", "Sports", ["winner", "award", "champion"]),
  asset("medal", "Medal", "1f3c5", "Sports", ["winner", "award", "champion"]),
  asset("volleyball", "Volleyball", "1f3d0", "Sports", ["ball", "sport", "game"]),
  asset("tennis", "Tennis", "1f3be", "Sports", ["ball", "racket", "sport"]),

  asset("cherry-blossom", "Cherry Blossom", "1f338", "Nature", ["flower", "floral", "spring"]),
  asset("sunflower", "Sunflower", "1f33b", "Nature", ["flower", "floral", "garden"]),
  asset("leaf", "Leaf", "1f343", "Nature", ["plant", "green", "wind"]),
  asset("clover", "Four Leaf Clover", "1f340", "Nature", ["plant", "lucky", "green"]),
  asset("cloud", "Cloud", "2601", "Nature", ["sky", "weather", "soft"]),
  asset("hibiscus", "Hibiscus", "1f33a", "Nature", ["flower", "floral", "tropical"]),
  asset("butterfly", "Butterfly", "1f98b", "Nature", ["animal", "wings", "princess"]),

  asset("rocket", "Rocket", "1f680", "Space", ["spaceship", "launch", "kids"]),
  asset("planet", "Ringed Planet", "1fa90", "Space", ["saturn", "orbit", "galaxy"]),
  asset("earth", "Earth", "1f30d", "Space", ["planet", "world", "globe"]),
  asset("glowing-star", "Glowing Star", "1f31f", "Space", ["star", "sparkle", "shine"]),
  asset("milky-way", "Milky Way", "1f30c", "Space", ["galaxy", "night", "stars"]),

  asset("cupcake", "Cupcake", "1f9c1", "Food", ["cake", "dessert", "birthday"]),
  asset("ice-cream", "Ice Cream", "1f366", "Food", ["dessert", "sweet", "cone"]),
  asset("lollipop", "Lollipop", "1f36d", "Food", ["candy", "sweet", "fun"]),
  asset("strawberry", "Strawberry", "1f353", "Food", ["fruit", "berry", "sweet"]),
  asset("candy", "Candy", "1f36c", "Food", ["sweet", "wrapped", "fun"]),
  asset("cookie", "Cookie", "1f36a", "Food", ["dessert", "sweet", "biscuit"]),
  asset("donut", "Donut", "1f369", "Food", ["dessert", "sweet", "sprinkles"]),

  asset("red-circle", "Red Circle", "1f534", "Shapes", ["round", "dot", "red"]),
  asset("blue-circle", "Blue Circle", "1f535", "Shapes", ["round", "dot", "blue"]),
  asset("orange-diamond", "Orange Diamond", "1f536", "Shapes", ["rhombus", "orange", "shape"]),
  asset("blue-diamond", "Blue Diamond", "1f537", "Shapes", ["rhombus", "blue", "shape"]),
  asset("red-triangle-up", "Up Triangle", "1f53a", "Shapes", ["arrow", "red", "shape"]),
  asset("red-triangle-down", "Down Triangle", "1f53b", "Shapes", ["arrow", "red", "shape"]),
  asset("purple-heart", "Purple Heart", "1f49c", "Shapes", ["love", "heart", "purple"]),
  asset("yellow-heart", "Yellow Heart", "1f49b", "Shapes", ["love", "heart", "yellow"]),
  asset("orange-circle", "Orange Circle", "1f7e0", "Shapes", ["round", "dot", "orange"]),
  asset("green-circle", "Green Circle", "1f7e2", "Shapes", ["round", "dot", "green"]),
];
