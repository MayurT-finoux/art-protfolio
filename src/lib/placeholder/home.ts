// Placeholder content for the Home page, copied from the v6 design
// (design/design_handoff_yurix_site/designs/HomePage.dc.html).
// Shaped like the handoff data model so it can be swapped for database
// queries in Phase 4. Images are the design's Wikimedia placeholders.

const wm = (file: string, width = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

export type NavItem = { label: string; href: string };

export type SelectedArtwork = {
  title: string;
  kind: string;
  year: string;
  image: string;
  /** background-position for the crop */
  position: string;
  /** card aspect ratio in the masonry, e.g. "2/3" */
  pin: string;
  /** animated piece: shows the "loop" badge */
  animated: boolean;
};

export type FreshItem = {
  title: string;
  when: string;
  image: string;
  position: string;
  isNew?: boolean;
  /** Instagram post (links out) rather than an artwork */
  instagram?: boolean;
  href?: string;
};

export type InfoCard = { label: string; title: string; text: string; href: string; cursor: string };

export type SocialLink = { label: string; href: string };

export const site = {
  wordmark: "yurix",
  location: "Mumbai, IN",
  email: "hey@yurix.art",
  sayHiLabel: "say hi",
  copyright: "© 2026 · all artwork mine, no tracing pls",
  instagramHandle: "yurix.draws",
};

export const nav: NavItem[] = [
  { label: "work", href: "/work" },
  { label: "gallery", href: "/gallery" },
  { label: "shop", href: "/shop" },
  { label: "about", href: "/about" },
  { label: "contact", href: "/contact" },
];

export const footerLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Behance and YouTube URLs are not known yet.
export const social: SocialLink[] = [
  { label: "Instagram", href: `https://www.instagram.com/${site.instagramHandle}/` },
  { label: "Behance", href: "#" },
  { label: "YouTube", href: "#" },
];

export const music = {
  track: "lullaby for a cat (loop)",
};

export const hero = {
  /** Loop MP4 from the CMS; none yet, so the still is shown. */
  video: null as string | null,
  still: wm("Claude_Monet,_Impression,_soleil_levant.jpg", 1600),
  label: "2D animator & illustrator · mumbai",
  heading: "Hi, I'm Yurix",
  intro: "I'm an animator and illustrator making hand-drawn loops, characters and music videos.",
  scrollHint: "scroll · it gets dreamy",
  scrollHintMobile: "scroll",
};

export const selectedWork = {
  label: "the ones i'm proudest of",
  labelMobile: "proudest of",
  heading: "selected work",
  button: { label: "all work →", href: "/work" },
  items: [
    { title: "moth lullaby", kind: "music video", year: "2026", image: wm("Gustav_Klimt_016.jpg"), position: "center", pin: "2/3", animated: true },
    { title: "ghost roommate", kind: "character", year: "2026", image: wm("Girl_with_a_Pearl_Earring.jpg"), position: "center 30%", pin: "1/1", animated: false },
    { title: "neon auto ride", kind: "loop", year: "2026", image: wm("Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"), position: "center", pin: "3/4", animated: true },
    { title: "static hearts", kind: "cover", year: "2025", image: wm("The_Scream.jpg"), position: "center 35%", pin: "9/14", animated: false },
    { title: "sticker sheet 03", kind: "merch", year: "2025", image: wm("Vassily_Kandinsky,_1913_-_Composition_7.jpg"), position: "center", pin: "4/5", animated: false },
    { title: "slow static", kind: "music video", year: "2025", image: wm("Tsunami_by_hokusai_19th_century.jpg"), position: "center", pin: "2/3", animated: true },
    { title: "monsoon diary", kind: "illustration", year: "2025", image: wm("Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg"), position: "center", pin: "5/4", animated: false },
    { title: "tiny gods", kind: "short film", year: "2024", image: wm("Claude_Monet,_Impression,_soleil_levant.jpg", 1400), position: "center", pin: "3/4", animated: true },
  ] satisfies SelectedArtwork[],
};

const igUrl = `https://www.instagram.com/${site.instagramHandle}/`;

export const freshWork = {
  label: "newest uploads",
  heading: "fresh",
  followButton: `follow @${site.instagramHandle} ↗`,
  followHref: igUrl,
  items: [
    { title: "frog choir", when: "2 days ago", image: wm("Vassily_Kandinsky,_1913_-_Composition_7.jpg", 500), position: "left center", isNew: true },
    { title: `@${site.instagramHandle}`, when: "on instagram · 1d", image: wm("The_Scream.jpg", 500), position: "center", instagram: true, href: igUrl },
    { title: "bus stop sketch", when: "5 days ago", image: wm("Girl_with_a_Pearl_Earring.jpg", 500), position: "center top" },
    { title: `@${site.instagramHandle}`, when: "on instagram · 3d", image: wm("Claude_Monet,_Impression,_soleil_levant.jpg", 500), position: "left center", instagram: true, href: igUrl },
    { title: "night shift", when: "1 week ago", image: wm("Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", 500), position: "right center" },
    { title: `@${site.instagramHandle}`, when: "on instagram · 6d", image: wm("Tsunami_by_hokusai_19th_century.jpg", 500), position: "right center", instagram: true, href: igUrl },
  ] satisfies FreshItem[],
};

export const aboutSection = {
  /** Window loop MP4 from the CMS; none yet, so the still is shown. */
  video: null as string | null,
  still: wm("Girl_with_a_Pearl_Earring.jpg"),
  windowLabel: "me_at_work.mp4",
  label: "about me",
  paragraphs: [
    "I'm Yurix, a 2D animator and illustrator based in Mumbai. I draw everything by hand, frame by frame, mostly in Procreate Dreams, sometimes on paper when the screen gets boring.",
    "I make music videos, looping characters, covers and the occasional sticker sheet, for musicians, studios and anyone with a weird idea that needs to move.",
  ],
  buttons: [
    { label: "more about me →", href: "/about", cursor: "about" },
    { label: "say hi", href: "/contact", cursor: "say hi" },
  ],
};

export const infoCards: InfoCard[] = [
  { label: "Shop", title: "Prints & originals", text: "Riso editions, giclée prints and the odd canvas.", href: "/shop", cursor: "shop" },
  { label: "About", title: "How I work", text: "iPad first, oils when the screen gets boring.", href: "/about", cursor: "about" },
  { label: "Contact", title: "Commission me", text: "Characters, covers, editorial. Quote in a day.", href: "/contact", cursor: "say hi" },
];
