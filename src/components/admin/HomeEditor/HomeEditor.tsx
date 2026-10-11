"use client";

import { useState } from "react";
import { saveHome } from "@/app/admin/actions";
import type { HomeContent } from "@/lib/content/types";
import { aboutSection, infoCards } from "@/lib/placeholder/home";
import { AdminPage } from "../AdminPage/AdminPage";
import { SectionAccordion, type Section } from "../SectionAccordion/SectionAccordion";
import styles from "./HomeEditor.module.css";

// Field structure from the design. Saved fields have a `name`; the About buttons
// and InfoCards are not saved yet (they keep the design's content).
export function HomeEditor({ initial, featuredCount }: { initial: HomeContent; featuredCount: number }) {
  const [c, setC] = useState<HomeContent>(initial);
  const set = (name: string, value: string) => setC((prev) => ({ ...prev, [name]: value }));

  const card = (i: number) => {
    const ic = infoCards[i];
    return `${ic.label} · ${ic.title} · ${ic.text} · ${ic.href}`;
  };

  const sections: Section[] = [
    {
      name: "HeroAnimation",
      summary: "full-screen loop behind the intro",
      fields: [
        { kind: "file", name: "heroVideo", url: c.heroVideo, label: "loop video", value: "hero-loop.mp4", hint: "1920×1080 · muted, loops · plays inline on phones", image: c.heroStill, accept: "video", folder: "home" },
        { kind: "file", name: "heroStill", url: c.heroStill, label: "still frame · reduced motion", value: "hero-still.jpg", hint: "shown instead of the loop when motion is reduced", image: c.heroStill, accept: "image", folder: "home" },
      ],
    },
    {
      name: "HeroIntro",
      summary: c.heroHeading,
      fields: [
        { kind: "text", name: "heroLabel", label: "small label", value: c.heroLabel },
        { kind: "text", name: "heroHeading", label: "heading", value: c.heroHeading },
        { kind: "text", name: "heroIntro", label: "intro", value: c.heroIntro },
        { kind: "auto", label: "scroll hint", value: "scroll · it gets dreamy", cta: "edit in Microcopy →", href: "/admin/microcopy" },
      ],
    },
    {
      name: "SelectedWork",
      summary: `${featuredCount} featured pieces`,
      fields: [
        { kind: "text", name: "selectedHeading", label: "label", value: c.selectedHeading },
        { kind: "text", name: "selectedButton", label: "button", value: c.selectedButton },
        { kind: "auto", label: "pieces", value: `${featuredCount} of 8 featured, in star order`, cta: "manage in Artworks →", href: "/admin/artworks" },
      ],
    },
    {
      name: "FreshWork",
      summary: "newest artworks + Instagram",
      fields: [
        { kind: "text", name: "freshHeading", label: "label", value: c.freshHeading },
        { kind: "text", name: "followButton", label: "follow button", value: c.followButton },
        { kind: "auto", label: "pieces", value: "fills itself: 3 newest live artworks + 3 newest Instagram posts", cta: "Instagram →", href: "/admin/footer" },
      ],
    },
    {
      name: "AboutSection",
      summary: "floating window + about me",
      fields: [
        { kind: "file", name: "aboutVideo", url: c.aboutVideo, label: "window video", value: "about-window.mp4", hint: "square · muted, loops", image: c.aboutStill, accept: "video", folder: "home" },
        { kind: "text", name: "aboutWindowLabel", label: "window label", value: c.aboutWindowLabel },
        { kind: "text", name: "aboutLabel", label: "label", value: c.aboutLabel },
        { kind: "text", name: "aboutParagraph1", label: "paragraph 1", value: c.aboutParagraph1 },
        { kind: "text", name: "aboutParagraph2", label: "paragraph 2", value: c.aboutParagraph2 },
        { kind: "text", label: "button 1 · link", value: `${aboutSection.buttons[0].label} ${aboutSection.buttons[0].href}` },
        { kind: "text", label: "button 2 · link", value: `${aboutSection.buttons[1].label} → ${aboutSection.buttons[1].href}` },
      ],
    },
    {
      name: "InfoCards",
      summary: "Shop · About · Contact",
      fields: [
        { kind: "text", label: "shop card · label / title / text / link", value: card(0) },
        { kind: "text", label: "about card", value: card(1) },
        { kind: "text", label: "contact card", value: card(2) },
      ],
    },
  ];

  const save = async () => {
    const result = await saveHome(c);
    if (!result.ok) return result.error;
  };

  return (
    <AdminPage title="Home page" onSave={save}>
      <div data-component="HomeEditor" className={styles.editor}>
        <span className={styles.intro}>Home sections, top to bottom. The layout is fixed; only the content changes.</span>
        <SectionAccordion sections={sections} defaultOpen="HeroIntro" onChange={set} />
      </div>
    </AdminPage>
  );
}
