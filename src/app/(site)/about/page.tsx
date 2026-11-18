import type { Metadata } from "next";
import { AboutEditorial } from "@/components/about/AboutEditorial/AboutEditorial";
import { AboutSketchbook } from "@/components/about/AboutSketchbook/AboutSketchbook";
import { getAboutPageData } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "About — Yurix",
  description: "Yurix, a 2D animator and illustrator in Mumbai: story, mediums, process, tools and clients.",
};

// The layout (Sketchbook | Editorial) and the content come from the admin ("About page").
export default async function AboutPage() {
  const content = await getAboutPageData();
  return content.layout === "editorial" ? <AboutEditorial content={content} /> : <AboutSketchbook content={content} />;
}
