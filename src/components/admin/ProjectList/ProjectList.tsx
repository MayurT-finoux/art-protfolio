"use client";

import { useState } from "react";
import { saveProjectOrder } from "@/app/admin/actions";
import { MAX_PROJECTS, type ProjectData } from "@/lib/content/types";
import { AdminPage } from "../AdminPage/AdminPage";
import { arrayMove, SortableList } from "../ui/Sortable";
import { ButtonLink, DragHandle, ReorderButtons, Thumb } from "../ui/AdminUI";
import styles from "./ProjectList.module.css";

// Projects from the database; save stores the order (= order on the Work page).
export function ProjectList({ projects }: { projects: ProjectData[] }) {
  const [list, setList] = useState(projects);
  const count = list.length;

  const save = async () => {
    const result = await saveProjectOrder(list.map((p) => p.id));
    if (!result.ok) return result.error;
  };

  return (
    <AdminPage title="Projects" onSave={save}>
    <div data-component="ProjectList" className={styles.list}>
      <div className={styles.toolbar}>
        <div className={styles.summary}>
          <span className={styles.count}>
            {count} of {MAX_PROJECTS} projects on Work
          </span>
          <span className={styles.hint}>Work shows 6–12. Order here = order on site; the first one gets the wide card.</span>
        </div>
        {count < MAX_PROJECTS && (
          <ButtonLink href="/admin/projects/new" variant="primary">
            + new project
          </ButtonLink>
        )}
      </div>

      <SortableList
        items={list}
        getId={(p) => String(p.id)}
        onReorder={setList}
        className={styles.rows}
        renderItem={(p, k, handleProps) => (
          <div className={styles.row}>
            <DragHandle {...handleProps} />
            <span className={styles.n}>{String(k + 1).padStart(2, "0")}</span>
            <Thumb src={p.coverIsVideo ? "" : p.coverUrl} position="center" className={styles.thumb}>
              {k === 0 && <span className={styles.wide}>wide</span>}
            </Thumb>
            <span className={styles.titleCell}>
              <span className={styles.title}>{p.title}</span>
              <span className={styles.meta}>
                {p.kind} · {p.year}
                {p.status === "draft" && " · draft"}
              </span>
            </span>
            <span className={styles.client}>{p.client}</span>
            <span className={styles.badges}>
              {p.youtubeId && <span className={styles.badge}>video</span>}
              {p.behanceUrl && <span className={styles.badge}>behance</span>}
            </span>
            <ReorderButtons index={k} length={count} onMove={(from, to) => setList(arrayMove(list, from, to))} />
            <ButtonLink href={`/admin/projects/${p.slug}`} size="sm">
              edit →
            </ButtonLink>
          </div>
        )}
      />
    </div>
    </AdminPage>
  );
}
