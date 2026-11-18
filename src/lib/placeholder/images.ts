// TEMPORARY sample images (public-domain paintings on Wikimedia Commons), so every
// frame shows something while the real artwork is added. Yurix's request (2026-11-18):
// replace them through the admin, then remove the samples with `npm run db:samples -- --remove`
// and set SAMPLE_IMAGES_ON to false.

/** Switch off to show plain frames again (no sample images in the default content). */
export const SAMPLE_IMAGES_ON = true;

const FILES = {
  klimt: "Gustav_Klimt_016.jpg",
  pearl: "Girl_with_a_Pearl_Earring.jpg",
  starry: "Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  scream: "The_Scream.jpg",
  kand: "Vassily_Kandinsky,_1913_-_Composition_7.jpg",
  wave: "Tsunami_by_hokusai_19th_century.jpg",
  venus: "Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
  monet: "Claude_Monet,_Impression,_soleil_levant.jpg",
};
export type SampleKey = keyof typeof FILES;
export const SAMPLE_KEYS = Object.keys(FILES) as SampleKey[];

/** Wikimedia image URL at the given width; `offset` picks a neighbouring painting. */
export function sampleUrl(key: SampleKey, width = 800, offset = 0) {
  const file = FILES[SAMPLE_KEYS[(SAMPLE_KEYS.indexOf(key) + offset) % SAMPLE_KEYS.length]];
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

/** Sample image for default content, or "" when samples are switched off. */
export const sampleImage = (key: SampleKey, width = 800, offset = 0) => (SAMPLE_IMAGES_ON ? sampleUrl(key, width, offset) : "");
