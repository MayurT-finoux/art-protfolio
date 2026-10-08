"use client";

import { img } from "@/lib/placeholder/admin";
import { useAdmin, type AboutLayout } from "../AdminProvider/AdminProvider";
import { SectionAccordion, type Section } from "../SectionAccordion/SectionAccordion";
import { FieldLabel, Toggle } from "../ui/AdminUI";
import styles from "./AboutEditor.module.css";

const LAYOUTS: AboutLayout[] = ["Sketchbook", "Editorial"];

// Placeholder values from the design. The public About page is built later.
export function AboutEditor() {
  const { aboutLists: L, aboutLayout, setAboutLayout, freelance, setFreelance } = useAdmin();

  const sections: Section[] = [
    {
      name: "AboutHero",
      summary: "Hi, I'm Yurix",
      fields: [
        { kind: "text", label: "small label", value: "about · the person behind the wobbly lines" },
        { kind: "text", label: "heading", value: "Hi, I'm Yurix — I make drawings that move." },
        { kind: "text", label: "intro", value: "Animator and illustrator. I draw, paint, animate — and customise anything that holds still long enough." },
        { kind: "text", label: "city", value: "Mumbai, IN" },
        { kind: "file", label: "portrait loop", value: "me-loop.mp4", hint: "square · muted, loops · caption: me, roughly. (it loops)", image: img("pearl", 200) },
      ],
    },
    {
      name: "AboutStory",
      summary: "02 · how it started",
      fields: [
        { kind: "text", label: "pull quote", value: "I started in the margins. I never really left." },
        { kind: "text", label: "paragraph 1", value: "Placeholder: the first sketchbook, mostly cats." },
        { kind: "text", label: "paragraph 2", value: "Placeholder: finding out drawings could move." },
      ],
    },
    {
      name: "MediumsShowcase",
      summary: `${L.mediums.length} mediums`,
      fields: [
        { kind: "list", label: "cards · soon = no link", list: "mediums", addLabel: "+ add medium", blank: { a: "new medium", b: "one line about it", soon: true } },
        { kind: "auto", label: "cover images", value: "pulled from the newest artwork in each category", cta: "Categories →", href: "/admin/categories" },
      ],
    },
    {
      name: "ProcessSteps",
      summary: `${L.process.length} steps`,
      fields: [{ kind: "list", label: "steps", list: "process", addLabel: "+ add step", blank: { a: "new step", b: "one line" } }],
    },
    {
      name: "ToolsSkills",
      summary: `${L.tools.length} tools · ${L.skills.length} skills`,
      fields: [
        { kind: "list", label: "tools", list: "tools", addLabel: "+ add tool", blank: { a: "new tool", b: "what it's for" } },
        { kind: "list", label: "skills", list: "skills", addLabel: "+ add skill", blank: { a: "new skill", b: "" } },
      ],
    },
    {
      name: "JourneyTimeline",
      summary: `${L.timeline.length} entries`,
      fields: [{ kind: "list", label: "year · title", list: "timeline", addLabel: "+ add entry", blank: { a: "2027", b: "something new" } }],
    },
    {
      name: "ClientsList",
      summary: `${L.clients.length} clients`,
      fields: [{ kind: "list", label: "client · kind of work", list: "clients", addLabel: "+ add client", blank: { a: "new client", b: "type of work" } }],
    },
    {
      name: "FunFacts",
      summary: `${L.facts.length} facts`,
      fields: [{ kind: "list", label: "question · answer", list: "facts", addLabel: "+ add fact", blank: { a: "new question", b: "answer" } }],
    },
    {
      name: "SocialLinks",
      summary: `${L.social.length} links`,
      fields: [
        { kind: "list", label: "network · handle", list: "social", addLabel: "+ add link", blank: { a: "new network", b: "@handle" } },
        { kind: "auto", label: "same links as the footer", value: "edit once, used everywhere", cta: "Footer & social →", href: "/admin/footer" },
      ],
    },
    {
      name: "AboutCTA",
      summary: "ok — your turn!",
      fields: [
        { kind: "text", label: "heading", value: "Got something that needs drawing?" },
        { kind: "text", label: "button 1 · link", value: "start a commission → /contact" },
        { kind: "text", label: "button 2 · link", value: "see the work → /work" },
      ],
    },
    {
      name: "GuideCharacter",
      summary: "Sketchbook layout only",
      fields: [
        { kind: "file", label: "character", value: "guide-doodle.png", hint: "transparent PNG · sits bottom-right", image: img("pearl", 200) },
        { kind: "text", label: "line per section", value: "hi! I'm the doodle version. scroll, I'll show you around ↓ · …10 lines" },
      ],
    },
  ];

  return (
    <div data-component="AboutEditor" className={styles.editor}>
      <span className={styles.intro}>About page sections, top to bottom. Pick a layout; the content is shared by both.</span>
      <div className={styles.bar}>
        <FieldLabel>layout</FieldLabel>
        <div className={styles.layouts}>
          {LAYOUTS.map((l) => (
            <button key={l} type="button" data-active={aboutLayout === l || undefined} onClick={() => setAboutLayout(l)}>
              {l}
            </button>
          ))}
        </div>
        <span className={styles.spacer} />
        <span className={styles.freelance}>open for freelance</span>
        <Toggle on={freelance} onChange={setFreelance} label="Toggle open for freelance" />
      </div>
      <SectionAccordion
        sections={sections.filter((s) => s.name !== "GuideCharacter" || aboutLayout === "Sketchbook")}
        defaultOpen="AboutHero"
      />
    </div>
  );
}
