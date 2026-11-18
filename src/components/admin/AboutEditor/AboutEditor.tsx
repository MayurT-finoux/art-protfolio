"use client";

import { useState } from "react";
import { saveAbout } from "@/app/admin/actions";
import type {
  AboutButton,
  AboutClient,
  AboutContent,
  AboutFact,
  AboutLayout,
  AboutMedium,
  AboutSocial,
  AboutStep,
  AboutStoryParagraph,
  AboutTimelineEntry,
  AboutTool,
} from "@/lib/placeholder/about";
import { AdminPage } from "../AdminPage/AdminPage";
import { SectionAccordion, type ListItem, type Section, type SectionField } from "../SectionAccordion/SectionAccordion";
import { FieldLabel, Toggle } from "../ui/AdminUI";
import styles from "./AboutEditor.module.css";

const LAYOUTS: { value: AboutLayout; label: string }[] = [
  { value: "sketchbook", label: "Sketchbook" },
  { value: "editorial", label: "Editorial" },
];

/** A two-value list row ↔ one record of the About content. */
type ListMap<T> = { to: (x: T) => ListItem<T>; from: (it: ListItem<T>) => T };

const MAPS = {
  storyParagraphs: {
    to: (p) => ({ a: p.lead, b: p.text, keep: p }),
    from: (it) => ({ ...it.keep, lead: it.a, text: it.b }),
  } satisfies ListMap<AboutStoryParagraph>,
  mediums: {
    to: (m) => ({ a: m.name, b: m.line, soon: m.soon, keep: m }),
    from: (it) => ({
      what: "",
      image: "",
      position: "center",
      count: 0,
      href: "/gallery",
      animated: false,
      ...it.keep,
      name: it.a,
      line: it.b,
      soon: it.soon ?? false,
    }),
  } satisfies ListMap<AboutMedium>,
  process: {
    to: (s) => ({ a: s.title, b: s.line, keep: s }),
    from: (it) => ({ image: "", position: "center", ...it.keep, title: it.a, line: it.b }),
  } satisfies ListMap<AboutStep>,
  tools: {
    to: (t) => ({ a: t.name, b: t.for, keep: t }),
    from: (it) => ({ name: it.a, for: it.b }),
  } satisfies ListMap<AboutTool>,
  timeline: {
    to: (t) => ({ a: t.year, b: t.title, keep: t }),
    from: (it) => ({ line: "", ...it.keep, year: it.a, title: it.b }),
  } satisfies ListMap<AboutTimelineEntry>,
  clients: {
    to: (c) => ({ a: c.name, b: c.kind, keep: c }),
    from: (it) => ({ href: "#", ...it.keep, name: it.a, kind: it.b }),
  } satisfies ListMap<AboutClient>,
  facts: {
    to: (f) => ({ a: f.q, b: f.a, keep: f }),
    from: (it) => ({ q: it.a, a: it.b }),
  } satisfies ListMap<AboutFact>,
  social: {
    to: (s) => ({ a: s.name, b: s.handle, keep: s }),
    from: (it) => ({ line: "", href: "#", ...it.keep, name: it.a, handle: it.b }),
  } satisfies ListMap<AboutSocial>,
};

type ListKey = keyof typeof MAPS;

/** "Hi, I'm Yurix — I make drawings move.": greeting — heading + accent (last word). */
const heroText = (c: AboutContent) => `${c.heroGreeting} — ${c.heroHeading} ${c.heroHeadingAccent}`;
function parseHero(value: string) {
  const [greeting, ...rest] = value.split(" — ");
  const words = rest.join(" — ").trim().split(/\s+/);
  if (!greeting.trim() || words.length < 2) throw new Error('Hero heading: write "greeting — heading", e.g. "Hi, I\'m Yurix — I make drawings move."');
  return { heroGreeting: greeting.trim(), heroHeading: words.slice(0, -1).join(" "), heroHeadingAccent: words[words.length - 1] };
}

/** CTA heading: the last word is the highlighted one. */
const ctaText = (c: AboutContent) => `${c.ctaHeading} ${c.ctaHeadingAccent}`;
function parseCta(value: string) {
  const words = value.trim().split(/\s+/);
  if (words.length < 2) throw new Error("AboutCTA heading: use at least two words (the last one is highlighted).");
  return { ctaHeading: words.slice(0, -1).join(" "), ctaHeadingAccent: words[words.length - 1] };
}

/** "say hi → /contact": the last word is the link. Empty = no button. */
const buttonText = (b?: AboutButton) => (b ? `${b.label} ${b.href}` : "");
function parseButton(value: string, n: number, cursor: string): AboutButton | null {
  if (!value.trim()) return null;
  const m = value.trim().match(/^(.*\S)\s+(\S+)$/);
  if (!m) throw new Error(`AboutCTA button ${n}: write the label, then the link (e.g. "say hi → /contact").`);
  return { label: m[1], href: m[2], cursor };
}

// Saved as site_content "about"; the About page reads it. Medium covers and
// counts come from the artworks; social links use the Footer & social URLs.
export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [c, setC] = useState(initial);
  const [hero, setHero] = useState(() => heroText(initial));
  const [cta, setCta] = useState(() => ctaText(initial));
  const [buttons, setButtons] = useState(() => [buttonText(initial.ctaButtons[0]), buttonText(initial.ctaButtons[1])]);
  const [guide, setGuide] = useState<ListItem[]>(() => initial.guideLines.map((line) => ({ a: line, b: "" })));

  const onChange = (name: string, value: string) => {
    if (name === "hero") setHero(value);
    else if (name === "cta") setCta(value);
    else if (name === "button:0" || name === "button:1") setButtons((b) => b.map((v, i) => (i === Number(name.slice(-1)) ? value : v)));
    else setC((prev) => ({ ...prev, [name]: value }));
  };

  const list = <K extends ListKey>(key: K, label: string, addLabel: string, blank: ListItem): SectionField => {
    const map = MAPS[key] as unknown as ListMap<AboutContent[K][number]>;
    return {
      kind: "list",
      label,
      addLabel,
      blank,
      items: (c[key] as AboutContent[K][number][]).map(map.to),
      onChange: (items) => setC((prev) => ({ ...prev, [key]: (items as ListItem<AboutContent[K][number]>[]).map(map.from) })),
    };
  };

  const sections: Section[] = [
    {
      name: "AboutHero",
      summary: c.heroGreeting,
      fields: [
        { kind: "text", name: "heroLabel", label: "small label", value: c.heroLabel },
        { kind: "text", name: "hero", label: "heading", value: hero },
        { kind: "text", name: "heroIntro", label: "intro", value: c.heroIntro },
        { kind: "text", name: "city", label: "city", value: c.city },
        { kind: "file", name: "portraitVideo", url: c.portraitVideo, label: "portrait loop", value: "me-loop.mp4", hint: "square · muted, loops · caption: me, roughly. (it loops)", image: c.portraitImage, accept: "video", folder: "about" },
      ],
    },
    {
      name: "AboutStory",
      summary: "02 · how it started",
      fields: [
        { kind: "text", name: "storyQuote", label: "pull quote", value: c.storyQuote },
        list("storyParagraphs", "paragraphs · lead / text", "+ add paragraph", { a: "new lead", b: "the rest of the paragraph" }),
      ],
    },
    {
      name: "MediumsShowcase",
      summary: `${c.mediums.length} mediums`,
      fields: [
        list("mediums", "cards · soon = no link", "+ add medium", { a: "new medium", b: "one line about it", soon: true }),
        { kind: "auto", label: "cover images", value: "pulled from the newest artwork in each category", cta: "Categories →", href: "/admin/categories" },
      ],
    },
    {
      name: "ProcessSteps",
      summary: `${c.process.length} steps`,
      fields: [list("process", "steps", "+ add step", { a: "new step", b: "one line" })],
    },
    {
      name: "ToolsSkills",
      summary: `${c.tools.length} tools · ${c.skills.length} skills`,
      fields: [
        list("tools", "tools", "+ add tool", { a: "new tool", b: "what it's for" }),
        {
          kind: "list",
          label: "skills",
          addLabel: "+ add skill",
          blank: { a: "new skill", b: "" },
          items: c.skills.map((s) => ({ a: s, b: "" })),
          onChange: (items) => setC((prev) => ({ ...prev, skills: items.map((it) => it.a) })),
        },
      ],
    },
    {
      name: "JourneyTimeline",
      summary: `${c.timeline.length} entries`,
      fields: [list("timeline", "year · title", "+ add entry", { a: "2027", b: "something new" })],
    },
    {
      name: "ClientsList",
      summary: `${c.clients.length} clients`,
      fields: [list("clients", "client · kind of work", "+ add client", { a: "new client", b: "type of work" })],
    },
    {
      name: "FunFacts",
      summary: `${c.facts.length} facts`,
      fields: [list("facts", "question · answer", "+ add fact", { a: "new question", b: "answer" })],
    },
    {
      name: "SocialLinks",
      summary: `${c.social.length} links`,
      fields: [
        list("social", "network · handle", "+ add link", { a: "new network", b: "@handle" }),
        { kind: "auto", label: "same links as the footer", value: "edit once, used everywhere", cta: "Footer & social →", href: "/admin/footer" },
      ],
    },
    {
      name: "AboutCTA",
      summary: cta,
      fields: [
        { kind: "text", name: "cta", label: "heading", value: cta },
        { kind: "text", name: "button:0", label: "button 1 · link", value: buttons[0] },
        { kind: "text", name: "button:1", label: "button 2 · link", value: buttons[1] },
      ],
    },
    {
      name: "GuideCharacter",
      summary: "Sketchbook layout only",
      fields: [
        { kind: "file", name: "guideImage", url: c.guideImage || null, label: "character", value: "guide-doodle.png", hint: "transparent PNG · sits bottom-right", image: c.guideImage, accept: "image", folder: "about" },
        { kind: "list", label: "line per section", addLabel: "+ add line", blank: { a: "new line", b: "" }, items: guide, onChange: setGuide },
      ],
    },
  ];

  const save = async () => {
    let data: AboutContent;
    try {
      const ctaButtons = [parseButton(buttons[0], 1, "say hi"), parseButton(buttons[1], 2, "view")].filter((b): b is AboutButton => !!b);
      if (!ctaButtons.length) throw new Error("AboutCTA: add at least one button.");
      data = { ...c, ...parseHero(hero), ...parseCta(cta), ctaButtons, guideLines: guide.map((g) => g.a) };
    } catch (e) {
      return (e as Error).message;
    }
    const result = await saveAbout(data);
    if (!result.ok) return result.error;
  };

  return (
    <AdminPage title="About page" onSave={save}>
      <div data-component="AboutEditor" className={styles.editor}>
        <span className={styles.intro}>About page sections, top to bottom. Pick a layout; the content is shared by both.</span>
        <div className={styles.bar}>
          <FieldLabel>layout</FieldLabel>
          <div className={styles.layouts}>
            {LAYOUTS.map((l) => (
              <button key={l.value} type="button" data-active={c.layout === l.value || undefined} onClick={() => setC({ ...c, layout: l.value })}>
                {l.label}
              </button>
            ))}
          </div>
          <span className={styles.spacer} />
          <span className={styles.freelance}>open for freelance</span>
          <Toggle on={c.openForFreelance} onChange={(on) => setC({ ...c, openForFreelance: on })} label="Toggle open for freelance" />
        </div>
        <SectionAccordion
          sections={sections.filter((s) => s.name !== "GuideCharacter" || c.layout === "sketchbook")}
          defaultOpen="AboutHero"
          onChange={onChange}
        />
      </div>
    </AdminPage>
  );
}
