import type { Metadata } from "next";
import { AboutEditorial } from "@/components/about/AboutEditorial/AboutEditorial";
import { AboutSketchbook } from "@/components/about/AboutSketchbook/AboutSketchbook";
import { ABOUT_CONTENT } from "@/lib/placeholder/about";

export const metadata: Metadata = {
  title: "About — Yurix",
  description: "Yurix, a 2D animator and illustrator in Mumbai: story, mediums, process, tools and clients.",
};

// The layout (Sketchbook | Editorial) is picked in the admin; content is shared.
export default function AboutPage() {
  const content = ABOUT_CONTENT;
  return content.layout === "editorial" ? <AboutEditorial content={content} /> : <AboutSketchbook content={content} />;
}
