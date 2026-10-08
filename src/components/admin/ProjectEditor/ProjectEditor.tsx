"use client";

import { useState } from "react";
import { img, slugify, type Project } from "@/lib/placeholder/admin";
import { AdminPage } from "../AdminPage/AdminPage";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { SlugSeoFields } from "../SlugSeoFields/SlugSeoFields";
import { SortableList } from "../ui/Sortable";
import { DragHandle, Field, Panel, PanelToggleHeader, TextArea, TextInput, Thumb, Toggle } from "../ui/AdminUI";
import styles from "./ProjectEditor.module.css";

type Item = { id: string; text: string };
type Step = { id: string; label: string; src: string };
type Final = { id: string; src: string };

let nextId = 0;
const uid = () => `n${nextId++}`;

/** `project` null = new project. */
export function ProjectEditor({ project }: { project: Project | null }) {
  const { projectDraft, setProjectDraft } = useAdmin();
  const p = project;
  const image = (offset: number, width: number) => (p ? img(p.imageKey, width, offset) : "");

  const [title, setTitle] = useState(p?.title ?? "");
  const [kind, setKind] = useState(p?.kind ?? "");
  const [year, setYear] = useState(p?.year ?? "");
  const [client, setClient] = useState(p?.client ?? "");
  const [role, setRole] = useState(p?.role ?? "");
  const [tools, setTools] = useState(p?.tools ?? "");
  const [teaser, setTeaser] = useState(p?.teaser ?? "");
  const [story, setStory] = useState<Item[]>(() =>
    p
      ? [
          `${p.teaser} It started as a sketch on the back of a receipt and slowly grew legs.`,
          "Everything was drawn by hand, frame by frame. The wobble is on purpose — it's how you know a person made it.",
        ].map((text, j) => ({ id: `s${j}`, text }))
      : [],
  );
  const [steps, setSteps] = useState<Step[]>(() =>
    p ? ["sketches", "animatic", "colour script", "clean-up"].map((label, j) => ({ id: `p${j}`, label, src: image(j + 1, 300) })) : [],
  );
  const [finals, setFinals] = useState<Final[]>(() =>
    p ? [0, 3, 5].map((o, j) => ({ id: `f${j}`, src: image(o, j === 0 ? 1000 : 500) })) : [],
  );
  const [youtubeOn, setYoutubeOn] = useState(!!p?.youtubeId);
  const [youtubeId, setYoutubeId] = useState(p?.youtubeId || "");
  const [behanceOn, setBehanceOn] = useState(p?.behance ?? false);
  const [behanceSlug, setBehanceSlug] = useState(p?.slug ?? "");
  const [behanceText, setBehanceText] = useState("the full case study, every frame");
  const [localDraft, setLocalDraft] = useState(true);

  const draft = p ? projectDraft[p.slug] : localDraft;
  const setDraft = (d: boolean) => (p ? setProjectDraft(p.slug, d) : setLocalDraft(d));
  const cover = image(0, 1200);

  const outline: [string, string, string][] = [
    ["Basics", "", "basics"],
    ["Cover", "", "cover"],
    ["Story", String(story.length), "story"],
    ["Process", String(steps.length), "process"],
    ["YouTube video", youtubeOn ? "on" : "off", "youtube"],
    ["Final pieces", String(finals.length), "finals"],
    ["Behance", behanceOn ? "on" : "off", "behance"],
    ["URL & SEO", "", "seo"],
  ];

  return (
    <AdminPage title={title || "new project"} back={{ href: "/admin/projects", label: "Projects" }} status={{ draft, onChange: setDraft }}>
      <div data-component="ProjectEditor" className={styles.editor}>
        <nav className={styles.outline}>
          <span className={styles.outlineTitle}>ProjectPage</span>
          {outline.map(([label, note, id]) => (
            <a key={id} href={`#pe-${id}`} className={styles.outlineItem} data-off={note === "off" || undefined}>
              {label}
              <span className={styles.outlineNote}>{note}</span>
            </a>
          ))}
        </nav>

        <div className={styles.sections}>
          <Panel id="pe-basics" title="Basics">
            <div className={styles.basics1}>
              <Field label="title">
                <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <Field label="type">
                <TextInput value={kind} onChange={(e) => setKind(e.target.value)} />
              </Field>
              <Field label="year">
                <TextInput value={year} inputMode="numeric" placeholder="year" onChange={(e) => setYear(e.target.value)} />
              </Field>
            </div>
            <div className={styles.basics2}>
              <Field label="client">
                <TextInput value={client} onChange={(e) => setClient(e.target.value)} />
              </Field>
              <Field label="role">
                <TextInput value={role} onChange={(e) => setRole(e.target.value)} />
              </Field>
              <Field label="tools">
                <TextInput value={tools} onChange={(e) => setTools(e.target.value)} />
              </Field>
            </div>
            <Field label="teaser · one line on the Work card">
              <TextInput value={teaser} onChange={(e) => setTeaser(e.target.value)} />
            </Field>
          </Panel>

          <Panel id="pe-cover" title="Cover" note="image or MP4 loop · 16:9 or wider" gap={14}>
            {cover ? (
              <Thumb src={cover} className={styles.cover}>
                <button type="button" className={styles.coverReplace}>
                  replace
                </button>
              </Thumb>
            ) : (
              <button type="button" className={`${styles.cover} ${styles.dashedTile}`}>
                <span className={styles.plus}>+</span>
                <span>add cover</span>
              </button>
            )}
          </Panel>

          <Panel id="pe-story" title="Story" gap={12}>
            <SortableList
              items={story}
              getId={(s) => s.id}
              onReorder={setStory}
              className={styles.storyList}
              renderItem={(s, _j, handleProps) => (
                <div className={styles.storyRow}>
                  <DragHandle className={styles.storyHandle} {...handleProps} />
                  <TextArea
                    aria-label="Story paragraph"
                    className={styles.storyText}
                    value={s.text}
                    onChange={(e) => setStory(story.map((x) => (x.id === s.id ? { ...x, text: e.target.value } : x)))}
                  />
                </div>
              )}
            />
            <button type="button" className={styles.addPill} onClick={() => setStory([...story, { id: uid(), text: "" }])}>
              + add paragraph
            </button>
          </Panel>

          <Panel id="pe-process" title="Process" note="steps in order · image + label" gap={14}>
            <div className={styles.processGrid}>
              <SortableList
                items={steps}
                getId={(s) => s.id}
                onReorder={setSteps}
                layout="grid"
                className={styles.contents}
                renderItem={(st, j, handleProps) => (
                  <div className={styles.step}>
                    <Thumb src={st.src} className={styles.stepImage}>
                      <span className={styles.stepN} {...handleProps}>
                        {String(j + 1).padStart(2, "0")}
                      </span>
                    </Thumb>
                    <input
                      className={styles.smallInput}
                      aria-label="Step label"
                      value={st.label}
                      onChange={(e) => setSteps(steps.map((x) => (x.id === st.id ? { ...x, label: e.target.value } : x)))}
                    />
                  </div>
                )}
              />
              <button type="button" className={`${styles.stepAdd} ${styles.dashedTile}`}>
                <span className={styles.plus}>+</span>
                <span>add step</span>
              </button>
            </div>
          </Panel>

          <Panel id="pe-youtube" gap={14}>
            <PanelToggleHeader title="YouTube video" note={youtubeOn ? "shown as a player on the project page" : "off · section hidden on the page"}>
              <Toggle on={youtubeOn} onChange={setYoutubeOn} label="Toggle YouTube" />
            </PanelToggleHeader>
            {youtubeOn && (
              <div className={styles.youtube}>
                <Field label="video link">
                  <TextInput mono prefix="youtu.be/" placeholder="paste-link" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} />
                  <span className={styles.fieldHint}>Plays only after a click; until then the site shows the preview image.</span>
                </Field>
                <Field label="preview image">
                  <Thumb src={cover} className={styles.ytPreview}>
                    <span className={styles.ytPlay}>▶</span>
                  </Thumb>
                </Field>
              </div>
            )}
          </Panel>

          <Panel id="pe-finals" title="Final pieces" note="first one runs wide · drag to reorder" gap={14}>
            <div className={styles.finals}>
              <SortableList
                items={finals}
                getId={(f) => f.id}
                onReorder={setFinals}
                layout="grid"
                className={styles.contents}
                renderItem={(f, j, handleProps) => (
                  <Thumb
                    src={f.src}
                    className={styles.final}
                    style={{ aspectRatio: j === 0 ? "21/9" : "4/3" }}
                  >
                    <span className={styles.finalGrab} {...handleProps} aria-label="Drag to reorder" />
                    {j === 0 && <span className={styles.wideTag}>wide</span>}
                  </Thumb>
                )}
              />
              <button type="button" className={`${styles.finalAdd} ${styles.dashedTile}`}>
                <span className={styles.plus}>+</span>
                <span>add piece</span>
              </button>
            </div>
          </Panel>

          <Panel id="pe-behance" gap={14}>
            <PanelToggleHeader title="View on Behance" note={behanceOn ? "shown as a link block near the end" : "off · section hidden on the page"}>
              <Toggle on={behanceOn} onChange={setBehanceOn} label="Toggle Behance" />
            </PanelToggleHeader>
            {behanceOn && (
              <div className={styles.behance}>
                <Field label="behance link">
                  <TextInput mono prefix="behance.net/gallery/" value={behanceSlug} onChange={(e) => setBehanceSlug(e.target.value)} />
                </Field>
                <Field label="block text">
                  <TextInput small value={behanceText} onChange={(e) => setBehanceText(e.target.value)} />
                </Field>
              </div>
            )}
          </Panel>

          <div id="pe-seo">
            <SlugSeoFields
              base="yurix.art/work/"
              slug={p?.slug ?? slugify(title)}
              title={p?.title ?? ""}
              descriptionFallback="uses teaser if empty"
              shareImage={cover || undefined}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
