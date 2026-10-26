import type { ArtworkImageData } from "@/lib/content/types";

/** One live artwork as the Gallery page needs it (slimmed down for the client). */
export type GalleryItem = {
  id: number;
  title: string;
  year: string;
  category: string;
  description: string;
  materials: string[];
  links: { label: string; href: string }[];
  previewUrl: string | null;
  ratio: string;
  images: ArtworkImageData[];
};

export type GalleryChip = { label: string; count: number };

export const isAnimation = (a: Pick<GalleryItem, "category">) => a.category === "Animation";
