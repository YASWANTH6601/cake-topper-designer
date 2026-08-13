import {
  Alex_Brush, Allura, Anton, Architects_Daughter, Audiowide, Bagel_Fat_One,
  Baloo_2, Bangers, Bebas_Neue, Birthstone, Black_Ops_One, Boogaloo,
  Bowlby_One_SC, Bubblegum_Sans, Bungee, Caveat, Chakra_Petch,
  Cherry_Bomb_One, Chewy, Cinzel, Cinzel_Decorative, Coiny, Comic_Neue,
  Concert_One, Crafty_Girls, Dancing_Script, DM_Sans, DynaPuff, Ephesis,
  Fredoka, Gloria_Hallelujah, Gochi_Hand, Grandstander, Great_Vibes,
  Indie_Flower, Italianno, Itim, Jolly_Lodger, Kalam, Lato, Lilita_One,
  Lobster, Luckiest_Guy, Mali, Marck_Script, Modak, MonteCarlo, Montserrat,
  Nunito, Orbitron, Outfit, Pacifico, Parisienne, Passion_One, Patrick_Hand,
  Paytone_One, Permanent_Marker, Poppins, Quantico, Quicksand, Racing_Sans_One,
  Raleway, Rammetto_One, Ranchers, Ribeye, Rubik, Russo_One, Sacramento,
  Schoolbell, Shadows_Into_Light, Short_Stack, Sigmar, Sniglet, Squada_One,
  Staatliches, Tangerine, Teko, Titan_One, Varela_Round,
} from "next/font/google";

export type EditorFontOption = {
  label: string;
  family: string;
  category: "Kids" | "Fun" | "Elegant" | "Action" | "Handwritten" | "Modern";
  recommended: boolean;
};

// next/font requires literal calls; every family uses only its regular face.
const editorFont0 = Alex_Brush({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-alex-brush" });
const editorFont1 = Allura({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-allura" });
const editorFont2 = Anton({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-anton" });
const editorFont3 = Architects_Daughter({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-architects-daughter" });
const editorFont4 = Audiowide({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-audiowide" });
const editorFont5 = Bagel_Fat_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-bagel-fat-one" });
const editorFont6 = Baloo_2({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-baloo-2" });
const editorFont7 = Bangers({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-bangers" });
const editorFont8 = Bebas_Neue({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-bebas-neue" });
const editorFont9 = Birthstone({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-birthstone" });
const editorFont10 = Black_Ops_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-black-ops-one" });
const editorFont11 = Boogaloo({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-boogaloo" });
const editorFont12 = Bowlby_One_SC({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-bowlby-one-sc" });
const editorFont13 = Bubblegum_Sans({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-bubblegum-sans" });
const editorFont14 = Bungee({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-bungee" });
const editorFont15 = Caveat({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-caveat" });
const editorFont16 = Chakra_Petch({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-chakra-petch" });
const editorFont17 = Cherry_Bomb_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-cherry-bomb-one" });
const editorFont18 = Chewy({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-chewy" });
const editorFont19 = Cinzel({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-cinzel" });
const editorFont20 = Cinzel_Decorative({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-cinzel-decorative" });
const editorFont21 = Coiny({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-coiny" });
const editorFont22 = Comic_Neue({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-comic-neue" });
const editorFont23 = Concert_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-concert-one" });
const editorFont24 = Crafty_Girls({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-crafty-girls" });
const editorFont25 = Dancing_Script({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-dancing-script" });
const editorFont26 = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-dm-sans" });
const editorFont27 = DynaPuff({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-dynapuff" });
const editorFont28 = Ephesis({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-ephesis" });
const editorFont29 = Fredoka({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-fredoka" });
const editorFont30 = Gloria_Hallelujah({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-gloria-hallelujah" });
const editorFont31 = Gochi_Hand({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-gochi-hand" });
const editorFont32 = Grandstander({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-grandstander" });
const editorFont33 = Great_Vibes({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-great-vibes" });
const editorFont34 = Indie_Flower({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-indie-flower" });
const editorFont35 = Italianno({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-italianno" });
const editorFont36 = Itim({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-itim" });
const editorFont37 = Jolly_Lodger({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-jolly-lodger" });
const editorFont38 = Kalam({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-kalam" });
const editorFont39 = Lato({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-lato" });
const editorFont40 = Lilita_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-lilita-one" });
const editorFont41 = Lobster({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-lobster" });
const editorFont42 = Luckiest_Guy({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-luckiest-guy" });
const editorFont43 = Mali({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-mali" });
const editorFont44 = Marck_Script({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-marck-script" });
const editorFont45 = Modak({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-modak" });
const editorFont46 = MonteCarlo({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-montecarlo" });
const editorFont47 = Montserrat({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-montserrat" });
const editorFont48 = Nunito({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-nunito" });
const editorFont49 = Orbitron({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-orbitron" });
const editorFont50 = Outfit({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-outfit" });
const editorFont51 = Pacifico({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-pacifico" });
const editorFont52 = Parisienne({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-parisienne" });
const editorFont53 = Passion_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-passion-one" });
const editorFont54 = Patrick_Hand({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-patrick-hand" });
const editorFont55 = Paytone_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-paytone-one" });
const editorFont56 = Permanent_Marker({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-permanent-marker" });
const editorFont57 = Poppins({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-poppins" });
const editorFont58 = Quantico({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-quantico" });
const editorFont59 = Quicksand({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-quicksand" });
const editorFont60 = Racing_Sans_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-racing-sans-one" });
const editorFont61 = Raleway({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-raleway" });
const editorFont62 = Rammetto_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-rammetto-one" });
const editorFont63 = Ranchers({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-ranchers" });
const editorFont64 = Ribeye({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-ribeye" });
const editorFont65 = Rubik({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-rubik" });
const editorFont66 = Russo_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-russo-one" });
const editorFont67 = Sacramento({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-sacramento" });
const editorFont68 = Schoolbell({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-schoolbell" });
const editorFont69 = Shadows_Into_Light({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-shadows-into-light" });
const editorFont70 = Short_Stack({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-short-stack" });
const editorFont71 = Sigmar({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-sigmar" });
const editorFont72 = Sniglet({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-sniglet" });
const editorFont73 = Squada_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-squada-one" });
const editorFont74 = Staatliches({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-staatliches" });
const editorFont75 = Tangerine({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-tangerine" });
const editorFont76 = Teko({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-teko" });
const editorFont77 = Titan_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-titan-one" });
const editorFont78 = Varela_Round({ subsets: ["latin"], display: "swap", preload: false, weight: "400", variable: "--font-varela-round" });

const fonts = {
  "Alex Brush": editorFont0,
  "Allura": editorFont1,
  "Anton": editorFont2,
  "Architects Daughter": editorFont3,
  "Audiowide": editorFont4,
  "Bagel Fat One": editorFont5,
  "Baloo 2": editorFont6,
  "Bangers": editorFont7,
  "Bebas Neue": editorFont8,
  "Birthstone": editorFont9,
  "Black Ops One": editorFont10,
  "Boogaloo": editorFont11,
  "Bowlby One SC": editorFont12,
  "Bubblegum Sans": editorFont13,
  "Bungee": editorFont14,
  "Caveat": editorFont15,
  "Chakra Petch": editorFont16,
  "Cherry Bomb One": editorFont17,
  "Chewy": editorFont18,
  "Cinzel": editorFont19,
  "Cinzel Decorative": editorFont20,
  "Coiny": editorFont21,
  "Comic Neue": editorFont22,
  "Concert One": editorFont23,
  "Crafty Girls": editorFont24,
  "Dancing Script": editorFont25,
  "DM Sans": editorFont26,
  "DynaPuff": editorFont27,
  "Ephesis": editorFont28,
  "Fredoka": editorFont29,
  "Gloria Hallelujah": editorFont30,
  "Gochi Hand": editorFont31,
  "Grandstander": editorFont32,
  "Great Vibes": editorFont33,
  "Indie Flower": editorFont34,
  "Italianno": editorFont35,
  "Itim": editorFont36,
  "Jolly Lodger": editorFont37,
  "Kalam": editorFont38,
  "Lato": editorFont39,
  "Lilita One": editorFont40,
  "Lobster": editorFont41,
  "Luckiest Guy": editorFont42,
  "Mali": editorFont43,
  "Marck Script": editorFont44,
  "Modak": editorFont45,
  "MonteCarlo": editorFont46,
  "Montserrat": editorFont47,
  "Nunito": editorFont48,
  "Orbitron": editorFont49,
  "Outfit": editorFont50,
  "Pacifico": editorFont51,
  "Parisienne": editorFont52,
  "Passion One": editorFont53,
  "Patrick Hand": editorFont54,
  "Paytone One": editorFont55,
  "Permanent Marker": editorFont56,
  "Poppins": editorFont57,
  "Quantico": editorFont58,
  "Quicksand": editorFont59,
  "Racing Sans One": editorFont60,
  "Raleway": editorFont61,
  "Rammetto One": editorFont62,
  "Ranchers": editorFont63,
  "Ribeye": editorFont64,
  "Rubik": editorFont65,
  "Russo One": editorFont66,
  "Sacramento": editorFont67,
  "Schoolbell": editorFont68,
  "Shadows Into Light": editorFont69,
  "Short Stack": editorFont70,
  "Sigmar": editorFont71,
  "Sniglet": editorFont72,
  "Squada One": editorFont73,
  "Staatliches": editorFont74,
  "Tangerine": editorFont75,
  "Teko": editorFont76,
  "Titan One": editorFont77,
  "Varela Round": editorFont78,
};
const recommended = new Set(["Fredoka", "Baloo 2", "Chewy", "DynaPuff", "Lilita One", "Luckiest Guy", "Bangers", "Bebas Neue", "Black Ops One", "Great Vibes", "Dancing Script", "Parisienne", "Pacifico", "Poppins", "Montserrat"]);
const categories: Record<string, EditorFontOption["category"]> = {
  "Fredoka":"Kids","Baloo 2":"Kids","Chewy":"Kids","DynaPuff":"Kids","Lilita One":"Kids","Luckiest Guy":"Kids","Bubblegum Sans":"Kids","Coiny":"Kids","Sniglet":"Kids","Schoolbell":"Kids","Short Stack":"Kids","Grandstander":"Kids","Boogaloo":"Kids","Titan One":"Kids","Concert One":"Kids","Ranchers":"Kids","Modak":"Kids","Itim":"Kids","Mali":"Kids","Comic Neue":"Kids","Crafty Girls":"Kids","Cherry Bomb One":"Kids","Bagel Fat One":"Kids","Jolly Lodger":"Kids","Ribeye":"Kids",
  "Pacifico":"Fun","Lobster":"Fun","Permanent Marker":"Fun","Bungee":"Fun","Paytone One":"Fun","Passion One":"Fun","Sigmar":"Fun","Rammetto One":"Fun",
  "Bangers":"Action","Bebas Neue":"Action","Black Ops One":"Action","Anton":"Action","Russo One":"Action","Bowlby One SC":"Action","Teko":"Action","Staatliches":"Action","Squada One":"Action","Audiowide":"Action","Racing Sans One":"Action","Quantico":"Action","Chakra Petch":"Action","Orbitron":"Action",
  "Great Vibes":"Elegant","Dancing Script":"Elegant","Parisienne":"Elegant","Allura":"Elegant","Alex Brush":"Elegant","Sacramento":"Elegant","Tangerine":"Elegant","Cinzel":"Elegant","Cinzel Decorative":"Elegant","Marck Script":"Elegant","Birthstone":"Elegant","Ephesis":"Elegant","Italianno":"Elegant","MonteCarlo":"Elegant",
  "Patrick Hand":"Handwritten","Indie Flower":"Handwritten","Gloria Hallelujah":"Handwritten","Architects Daughter":"Handwritten","Caveat":"Handwritten","Kalam":"Handwritten","Gochi Hand":"Handwritten","Shadows Into Light":"Handwritten",
  "Poppins":"Modern","Montserrat":"Modern","Nunito":"Modern","Quicksand":"Modern","Rubik":"Modern","Raleway":"Modern","Lato":"Modern","DM Sans":"Modern","Outfit":"Modern","Varela Round":"Modern",
};

export const editorFontVariables = Object.values(fonts).map((font) => font.variable).join(" ");
export const editorFontOptions: EditorFontOption[] = Object.entries(fonts).map(([label, font]) => ({ label, family: font.style.fontFamily, category: categories[label], recommended: recommended.has(label) }));

