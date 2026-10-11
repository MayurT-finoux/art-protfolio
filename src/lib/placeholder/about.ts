// Placeholder content for the About page, copied from the v6 designs
// (design/design_handoff_yurix_site/designs/About Sketchbook.dc.html and
// About Editorial.dc.html). Both layouts share this content; only the
// presentation differs. Shaped like the handoff `AboutContent` model so it
// can move to the database later. Images are the designs' Wikimedia
// placeholders (the image slots in the design are empty drop boxes).

import { img } from "@/lib/placeholder/admin";

export type AboutLayout = "sketchbook" | "editorial";

/** Which layout is live (picked in the admin; Sketchbook is the default). */
export const ABOUT_LAYOUT: AboutLayout = "sketchbook";

/** Drives the "open for freelance" badge in AboutHero. */
export const OPEN_FOR_FREELANCE = true;

export type AboutStoryParagraph = { lead: string; text: string; /** squiggle under it (Sketchbook) */ doodle?: boolean };
export type AboutSketch = { image: string; position: string; caption: string; ratio: string; /** desktop width in the polaroid stack */ width: string };
export type AboutMedium = {
  name: string;
  what: string;
  line: string;
  /** not live yet: "soon" tag, no link */
  soon: boolean;
  /** cover: newest artwork in the category */
  image: string;
  position: string;
  count: number;
  href: string;
  animated: boolean;
};
export type AboutStep = { title: string; line: string; image: string; position: string };
export type AboutTool = { name: string; for: string };
export type AboutTimelineEntry = { year: string; title: string; line: string };
export type AboutClient = { name: string; kind: string; href: string };
export type AboutFact = { q: string; a: string };
export type AboutSocial = { name: string; handle: string; line: string; href: string };
export type AboutButton = { label: string; href: string; cursor: string };

export type AboutContent = {
  layout: AboutLayout;
  openForFreelance: boolean;
  heroLabel: string;
  /** Editorial top rule, right side */
  heroRole: string;
  heroGreeting: string;
  heroHeading: string;
  /** the highlighted last word(s) of the heading */
  heroHeadingAccent: string;
  heroIntro: string;
  city: string;
  makes: string;
  portraitVideo: string | null;
  portraitImage: string;
  portraitCaption: string;
  storyQuote: string;
  storyParagraphs: AboutStoryParagraph[];
  storySketches: AboutSketch[];
  mediums: AboutMedium[];
  process: AboutStep[];
  tools: AboutTool[];
  skills: string[];
  timeline: AboutTimelineEntry[];
  clients: AboutClient[];
  clientsCta: AboutButton;
  facts: AboutFact[];
  deskImage: string;
  deskCaption: string;
  social: AboutSocial[];
  ctaHeading: string;
  ctaHeadingAccent: string;
  ctaText: string;
  ctaButtons: AboutButton[];
  ctaNote: string;
  guideImage: string;
  guideLines: string[];
};

const medium = (
  name: string,
  what: string,
  line: string,
  image: string,
  position: string,
  animated = false,
): AboutMedium => ({
  name,
  what,
  line,
  soon: false,
  image,
  position,
  count: 4,
  // Category deep links (/gallery?category=…) aren't supported by the Gallery yet.
  href: "/gallery",
  animated,
});

const soon = (name: string, line: string): AboutMedium => ({
  name,
  what: "",
  line,
  soon: true,
  image: "",
  position: "center",
  count: 0,
  href: "",
  animated: false,
});

export const ABOUT_CONTENT: AboutContent = {
  layout: ABOUT_LAYOUT,
  openForFreelance: OPEN_FOR_FREELANCE,
  heroLabel: "about · the person behind the wobbly lines",
  heroRole: "Yurix · animator & illustrator",
  heroGreeting: "Hi, I'm Yurix",
  heroHeading: "I make drawings",
  heroHeadingAccent: "move.",
  heroIntro:
    "Animator and illustrator. I draw, paint, animate — and customise anything that holds still long enough: skateboards, headphones, metro cards, clay.",
  city: "Mumbai, IN",
  makes: "drawings, paintings, loops, objects",
  portraitVideo: null,
  portraitImage: img("pearl", 900),
  portraitCaption: "me, roughly. (it loops)",
  storyQuote: "I started in the margins. I never really left.",
  storyParagraphs: [
    { lead: "I started on the back of school notebooks.", text: "Mostly cats, sometimes teachers, always in the margins where nobody was supposed to look." },
    { lead: "Then a flipbook changed everything.", text: "Forty pages of a ball bouncing badly — and the moment it moved, I was hooked on frame-by-frame for good.", doodle: true },
    { lead: "Now I split my days", text: "between Procreate, a box of gouache, and whatever object I can get my hands on: skateboards, headphones, metro cards, lumps of clay." },
    { lead: "What drives me:", text: "making small, slightly wonky things that make people smile — and proving that hand-drawn still beats perfect." },
  ],
  storySketches: [
    { image: img("starry", 600), position: "center", caption: "sketchbook, age 12", ratio: "4/5", width: "62%" },
    { image: img("scream", 600), position: "center 30%", caption: "the famous ball", ratio: "1/1", width: "48%" },
    { image: img("wave", 600), position: "center", caption: "still doing this", ratio: "5/4", width: "56%" },
  ],
  mediums: [
    medium("Traditional", "drawing & painting", "Watercolour, gouache, ink — and a lot of paper towels.", img("venus", 700), "center"),
    medium("Digital", "illustration", "Procreate on the iPad, mostly from the sofa.", img("kand", 700), "left center"),
    medium("Animation", "2D frame by frame", "Every frame drawn by hand. The wobble is on purpose.", img("klimt", 700), "center", true),
    medium("Handmade", "custom objects", "Skateboards, headphones, metro cards, clay — if it holds still, I'll paint it.", img("pearl", 700), "center 30%"),
    soon("Graffiti", "walls are on the list."),
    soon("Comics", "panels are being inked."),
  ],
  process: [
    { title: "sketch", line: "Loose, fast, lots of bad ones. That's the point.", image: img("monet", 600), position: "center" },
    { title: "line art", line: "Clean lines — still a little wonky, on purpose.", image: img("kand", 600), position: "left center" },
    { title: "colour", line: "Flat colours first, then light, then mood.", image: img("klimt", 600), position: "center" },
    { title: "animation", line: "Frame by frame in Procreate Dreams until it breathes.", image: img("venus", 600), position: "center" },
  ],
  tools: [
    { name: "Procreate", for: "sketching & illustration" },
    { name: "Procreate Dreams", for: "frame-by-frame animation" },
    { name: "Watercolour & gouache", for: "paintings on paper" },
  ],
  skills: ["character design", "frame-by-frame animation", "illustration", "customising objects", "video editing"],
  timeline: [
    { year: "2016", title: "first sketchbook, filled", line: "Mostly cats. A few teachers." },
    { year: "2019", title: "the flipbook", line: "Found out drawings could move. No going back." },
    { year: "2023", title: "first paid commission", line: "An album cover for a friend's band." },
    { year: "2024", title: "tiny gods", line: "My first festival short film." },
    { year: "2025", title: "monsoon diary", line: "A month of rain for The Bombay Review." },
    { year: "2026", title: "moth lullaby", line: "Music video for Lalit & The Lamps." },
  ],
  // Client URLs are not known yet.
  clients: [
    { name: "Lalit & The Lamps", kind: "music video", href: "#" },
    { name: "Mumbai Film Fest", kind: "loop", href: "#" },
    { name: "Static Hearts", kind: "album cover", href: "#" },
    { name: "Kavya", kind: "music video", href: "#" },
    { name: "The Bombay Review", kind: "editorial", href: "#" },
  ],
  clientsCta: { label: "your name here?", href: "/contact", cursor: "say hi" },
  facts: [
    { q: "snack while drawing", a: "masala peanuts. too many." },
    { q: "I animate to", a: "lo-fi, old Bollywood, rain sounds" },
    { q: "on my desk", a: "one cat, nine brushes, zero clean mugs" },
    { q: "inspired by", a: "Ghibli skies, rickshaw art, Mumbai in monsoon" },
  ],
  deskImage: img("monet", 1000),
  deskCaption: "where it all happens (tidied for the photo)",
  // Shares data with Footer & social. Behance / YouTube / Patreon URLs are not known yet.
  social: [
    { name: "Instagram", handle: "@yurix.draws", line: "WIPs, doodles and the odd reel. Almost daily.", href: "https://www.instagram.com/yurix.draws/" },
    { name: "Behance", handle: "behance.net/yurix", line: "Full case studies, from first sketch to final.", href: "#" },
    { name: "YouTube", handle: "@yurix", line: "Finished animations and process timelapses.", href: "#" },
    { name: "Patreon", handle: "patreon.com/yurix", line: "Brushes, timelapses and early looks for supporters.", href: "#" },
  ],
  ctaHeading: "let's work",
  ctaHeadingAccent: "together",
  ctaText: "Characters, covers, music videos, editorial — or a pair of headphones that needs a face. Quote in a day.",
  ctaButtons: [{ label: "say hi →", href: "/contact", cursor: "say hi" }],
  ctaNote: "goes to the contact page",
  guideImage: img("pearl", 240),
  guideLines: [
    "hi! I'm the doodle version. scroll, I'll show you around ↓",
    "this is where it all started.",
    "pick a medium, any medium.",
    "step 4 is my favourite. obviously.",
    "everything in my bag.",
    "how I got here (the long way).",
    "these people were very nice.",
    "please ignore the mugs.",
    "come say hi online too.",
    "ok — your turn!",
  ],
};

export type AboutSectionCopy = { label: string; heading: string };
export type AboutCopy = {
  story: AboutSectionCopy;
  mediums: AboutSectionCopy;
  process: AboutSectionCopy;
  tools: AboutSectionCopy & { note: string; skillsLabel: string };
  timeline: AboutSectionCopy;
  clients: AboutSectionCopy;
  facts: AboutSectionCopy;
  social: AboutSectionCopy;
  cta: { label: string };
  swipe: string;
};

/** Section labels and headings, per layout (presentation copy from the designs). */
export const ABOUT_COPY: Record<AboutLayout, AboutCopy> = {
  sketchbook: {
    story: { label: "02 · how it started", heading: "my story" },
    mediums: { label: "03 · pick a medium", heading: "what I make" },
    process: { label: "04 · sketch to screen", heading: "how I work" },
    tools: { label: "05 · sticker sheet", heading: "tools & skills", note: "peel one off. (you can't.)", skillsLabel: "things I'm good at" },
    timeline: { label: "06 · the long way round", heading: "journey" },
    clients: { label: "07 · nice people", heading: "drawn for" },
    facts: { label: "08 · behind the scenes", heading: "the messy desk" },
    social: { label: "09 · find me elsewhere", heading: "out in the wild" },
    cta: { label: "10 · your turn" },
    swipe: "swipe →",
  },
  editorial: {
    story: { label: "02 — story", heading: "" },
    mediums: { label: "03 — mediums", heading: "what I make" },
    process: { label: "04 — process", heading: "sketch → screen" },
    tools: { label: "05 — tools & skills", heading: "", note: "", skillsLabel: "also good at" },
    timeline: { label: "06 — journey", heading: "so far" },
    clients: { label: "07 — clients & collabs", heading: "drawn for" },
    facts: { label: "08 — behind the scenes", heading: "off the clock" },
    social: { label: "09 — find me elsewhere", heading: "" },
    cta: { label: "10 — your turn" },
    swipe: "swipe →",
  },
};
