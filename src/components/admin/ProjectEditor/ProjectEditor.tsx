"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProject } from "@/app/admin/actions";
import type { ProjectData } from "@/lib/content/types";
import { slugify } from "@/lib/placeholder/admin";
import { AdminPage } from "../AdminPage/AdminPage";
import { SlugSeoFields, type SeoValues } from "../SlugSeoFields/SlugSeoFields";
import { FilePicker, progressLabel } from "../ui/FilePicker";
import { SortableList } from "../ui/Sortable";
import { DragHandle, Field, Panel, PanelToggleHeader, TextArea, TextInput, Thumb, Toggle } from "../ui/AdminUI";
import styles from "./ProjectEditor.module.css";

type Item = { id: string; text: string };
type Step = { id: string; label: string; src: string };
type Final = { id: string; src: string };

let nextId = 0;
const uid = () => `n${nextId++}`;

const BEHANCE = "https://www.behance.net/gallery/";

/** Video ID from a pasted YouTube link (youtu.be/ID, watch?v=ID, /shorts/ID) or the ID itself. */
function youtubeIdFrom(value: string) {
  const v = value.trim();
  const m = v.match(/(?:youtu\.be\/|[?&]v=|\/(?:shorts|embed|live)\/)([\w-]{6,20})/);
  return m ? m[1] : v.replace(/^https?:\/\/\S*\//, "");
}

/** `project` null = new project. Saved to the projects table. */
export function ProjectEditor({ project }: { project: ProjectData | null }) {
  const router = useRouter();
  const p = project;

  const [title, setTitle] = useState(p?.title ?? "");
  const [kind, setKind] = useState(p?.kind ?? "");
  const [year, setYear] = useState(p?.year ?? "");
  const [client, setClient] = useState(p?.client ?? "");
  const [role, setRole] = useState(p?.role ?? "");
  const [tools, setTools] = useState(p?.tools ?? "");
  const [teaser, setTeaser] = useState(p?.teaser ?? "");
  const [story, setStory] = useState<Item[]>(() => (p?.story ?? []).map((text, j) => ({ id: `s${j}`, text })));
  const [steps, setSteps] = useState<Step[]>(() => (p?.process ?? []).map((s, j) => ({ id: `p${j}`, label: s.label, src: s.url })));
  const [finals, setFinals] = useState<Final[]>(() => (p?.finals ?? []).map((src, j) => ({ id: `f${j}`, src })));
  const [youtubeOn, setYoutubeOn] = useState(!!p?.youtubeId);
  const [youtubeId, setYoutubeId] = useState(p?.youtubeId || "");
  const [behanceOn, setBehanceOn] = useState(!!p?.behanceUrl);
  const [behanceSlug, setBehanceSlug] = useState(p?.behanceUrl?.replace(/^https?:\/\/(www\.)?behance\.net\/gallery\//, "") ?? "");
  const [behanceText, setBehanceText] = useState(p?.behanceText || "the full case study, every frame");
  const [seo, setSeo] = useState<SeoValues>({ slug: p?.slug ?? "", seoTitle: p?.seoTitle ?? "", seoDescription: p?.seoDescription ?? "" });
  const [draft, setDraft] = useState(p ? p.status === "draft" : true);
  const [cover, setCover] = useState(p?.coverUrl ?? "");
  const [coverIsVideo, setCoverIsVideo] = useState(p?.coverIsVideo ?? false);

  const save = async () => {
    const result = await saveProject({
      id: p?.id,
      slug: seo.slug,
      title,
      kind,
      year,
      client,
      role,
      tools,
      teaser,
      coverUrl: cover,
      coverIsVideo: !!cover && coverIsVideo,
      story: story.map((s) => s.text.trim()).filter(Boolean),
      process: steps.map((s) => ({ label: s.label, url: s.src })).filter((s) => s.url),
      finals: finals.map((f) => f.src).filter(Boolean),
      youtubeId: youtubeOn && youtubeId.trim() ? youtubeIdFrom(youtubeId) : null,
      behanceUrl: behanceOn && behanceSlug.trim() ? BEHANCE + behanceSlug.trim().replace(/^https?:\/\/(www\.)?behance\.net\/gallery\//, "") : null,
      behanceText: behanceText.trim(),
      status: draft ? "draft" : "live",
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
    });
    if (!result.ok) return result.error;
    if (result.slug !== p?.slug) router.replace(`/admin/projects/${result.slug}`);
    else router.refresh();
  };
  const folder = `projects/${p?.slug ?? (slugify(title) || "untitled")}`;

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
    <AdminPage
      title={title || "new project"}
      back={{ href: "/admin/projects", label: "Projects" }}
      status={{ draft, onChange: setDraft }}
      onSave={save}
    >
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
            <FilePicker
              kind={["image", "video"]}
              folder={folder}
              onUploaded={(url, file) => {
                setCover(url);
                setCoverIsVideo(file.type.startsWith("video/"));
              }}
            >
              {({ open, progress }) =>
                cover ? (
                  <Thumb src={coverIsVideo ? "" : cover} className={styles.cover}>
                    {coverIsVideo && <video className={styles.coverVideo} src={cover} autoPlay muted loop playsInline />}
                    <button type="button" className={styles.coverReplace} onClick={open}>
                      {progressLabel(progress, "replace")}
                    </button>
                  </Thumb>
                ) : (
                  <button type="button" className={`${styles.cover} ${styles.dashedTile}`} onClick={open}>
                    <span className={styles.plus}>+</span>
                    <span>{progressLabel(progress, "add cover")}</span>
                  </button>
                )
              }
            </FilePicker>
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
              <FilePicker kind="image" folder={folder} onUploaded={(url) => setSteps((list) => [...list, { id: uid(), label: "", src: url }])}>
                {({ open, progress }) => (
                  <button type="button" className={`${styles.stepAdd} ${styles.dashedTile}`} onClick={open}>
                    <span className={styles.plus}>+</span>
                    <span>{progressLabel(progress, "add step")}</span>
                  </button>
                )}
              </FilePicker>
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
                  <Thumb src={coverIsVideo ? "" : cover} className={styles.ytPreview}>
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
              <FilePicker kind="image" folder={folder} onUploaded={(url) => setFinals((list) => [...list, { id: uid(), src: url }])}>
                {({ open, progress }) => (
                  <button type="button" className={`${styles.finalAdd} ${styles.dashedTile}`} onClick={open}>
                    <span className={styles.plus}>+</span>
                    <span>{progressLabel(progress, "add piece")}</span>
                  </button>
                )}
              </FilePicker>
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
              {...seo}
              onChange={(patch) => setSeo({ ...seo, ...patch })}
              titleFallback={`${title || "untitled"} — Yurix`}
              descriptionFallback="uses teaser if empty"
              shareImage={(!coverIsVideo && cover) || undefined}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
