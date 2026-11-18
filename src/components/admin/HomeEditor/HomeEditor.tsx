"use client";

import { useState } from "react";
import { saveHome } from "@/app/admin/actions";
import type { HomeContent, HomeInfoCard, HomeLink } from "@/lib/content/types";
import { AdminPage } from "../AdminPage/AdminPage";
import { SectionAccordion, type Section } from "../SectionAccordion/SectionAccordion";
import styles from "./HomeEditor.module.css";

const SEP = " · ";

/** "more about me → /about": the last word is the link. */
const buttonText = (b: HomeLink) => `${b.label} ${b.href}`;
function parseButton(value: string, n: number): HomeLink {
  const m = value.trim().match(/^(.*\S)\s+(\S+)$/);
  if (!m) throw new Error(`Button ${n}: write the label, then the link (e.g. "say hi /contact").`);
  return { label: m[1], href: m[2] };
}

/** "Shop · Prints & originals · Riso editions… · /shop" */
const cardText = (c: HomeInfoCard) => [c.label, c.title, c.text, c.href].join(SEP);
function parseCard(value: string, name: string): HomeInfoCard {
  const parts = value.split("·").map((p) => p.trim());
  if (parts.length < 4) throw new Error(`${name} card: write label · title · text · link.`);
  return { label: parts[0], title: parts[1], text: parts.slice(2, -1).join(SEP), href: parts[parts.length - 1] };
}

const CARD_NAMES = ["Shop", "About", "Contact"];

// Field structure from the design. Fields with a `name` are saved (site_content "home");
// About buttons and InfoCards are one line each, as designed, and split on save.
export function HomeEditor({ initial, featuredCount }: { initial: HomeContent; featuredCount: number }) {
  const [c, setC] = useState<HomeContent>(initial);
  const [buttons, setButtons] = useState(() => initial.aboutButtons.map(buttonText));
  const [cards, setCards] = useState(() => initial.infoCards.map(cardText));

  const set = (name: string, value: string) => {
    const [, list, i] = name.match(/^(button|card):(\d)$/) ?? [];
    const update = (prev: string[]) => prev.map((v, j) => (j === Number(i) ? value : v));
    if (list === "button") setButtons(update);
    else if (list === "card") setCards(update);
    else setC((prev) => ({ ...prev, [name]: value }));
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
        { kind: "text", name: "button:0", label: "button 1 · link", value: buttons[0] },
        { kind: "text", name: "button:1", label: "button 2 · link", value: buttons[1] },
      ],
    },
    {
      name: "InfoCards",
      summary: "Shop · About · Contact",
      fields: [
        { kind: "text", name: "card:0", label: "shop card · label / title / text / link", value: cards[0] },
        { kind: "text", name: "card:1", label: "about card", value: cards[1] },
        { kind: "text", name: "card:2", label: "contact card", value: cards[2] },
      ],
    },
  ];

  const save = async () => {
    let data: HomeContent;
    try {
      data = {
        ...c,
        aboutButtons: buttons.map((b, i) => parseButton(b, i + 1)),
        infoCards: cards.map((v, i) => parseCard(v, CARD_NAMES[i])),
      };
    } catch (e) {
      return (e as Error).message;
    }
    const result = await saveHome(data);
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
