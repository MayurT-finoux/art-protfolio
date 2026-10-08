"use client";

import { img } from "@/lib/placeholder/admin";
import { aboutSection, freshWork, hero, infoCards, selectedWork } from "@/lib/placeholder/home";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { SectionAccordion, type Section } from "../SectionAccordion/SectionAccordion";
import styles from "./HomeEditor.module.css";

// Field structure from the design; values from the live Home placeholder content.
export function HomeEditor() {
  const { featured } = useAdmin();

  const card = (i: number) => {
    const c = infoCards[i];
    return `${c.label} · ${c.title} · ${c.text} · ${c.href}`;
  };

  const sections: Section[] = [
    {
      name: "HeroAnimation",
      summary: "full-screen loop behind the intro",
      fields: [
        { kind: "file", label: "loop video", value: "hero-loop.mp4", hint: "1920×1080 · muted, loops · plays inline on phones", image: img("klimt", 200) },
        { kind: "file", label: "still frame · reduced motion", value: "hero-still.jpg", hint: "shown instead of the loop when motion is reduced", image: img("klimt", 200) },
      ],
    },
    {
      name: "HeroIntro",
      summary: hero.heading,
      fields: [
        { kind: "text", label: "small label", value: hero.label },
        { kind: "text", label: "heading", value: hero.heading },
        { kind: "text", label: "intro", value: hero.intro },
        { kind: "auto", label: "scroll hint", value: hero.scrollHint, cta: "edit in Microcopy →", href: "/admin/microcopy" },
      ],
    },
    {
      name: "SelectedWork",
      summary: `${featured.length} featured pieces`,
      fields: [
        { kind: "text", label: "label", value: selectedWork.heading },
        { kind: "text", label: "button", value: selectedWork.button.label },
        { kind: "auto", label: "pieces", value: `${featured.length} of 8 featured, in star order`, cta: "manage in Artworks →", href: "/admin/artworks" },
      ],
    },
    {
      name: "FreshWork",
      summary: "newest artworks + Instagram",
      fields: [
        { kind: "text", label: "label", value: freshWork.heading },
        { kind: "text", label: "follow button", value: freshWork.followButton },
        { kind: "auto", label: "pieces", value: "fills itself: 3 newest live artworks + 3 newest Instagram posts", cta: "Instagram →", href: "/admin/footer" },
      ],
    },
    {
      name: "AboutSection",
      summary: "floating window + about me",
      fields: [
        { kind: "file", label: "window video", value: "about-window.mp4", hint: "square · muted, loops", image: img("pearl", 200) },
        { kind: "text", label: "window label", value: aboutSection.windowLabel },
        { kind: "text", label: "label", value: aboutSection.label },
        { kind: "text", label: "paragraph 1", value: aboutSection.paragraphs[0] },
        { kind: "text", label: "paragraph 2", value: aboutSection.paragraphs[1] },
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

  return (
    <div data-component="HomeEditor" className={styles.editor}>
      <span className={styles.intro}>Home sections, top to bottom. The layout is fixed; only the content changes.</span>
      <SectionAccordion sections={sections} defaultOpen="HeroIntro" />
    </div>
  );
}
