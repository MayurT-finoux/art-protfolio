"use client";

import { MAX_PROJECTS, PROJECTS, img } from "@/lib/placeholder/admin";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { arrayMove, SortableList } from "../ui/Sortable";
import { ButtonLink, DragHandle, ReorderButtons, Thumb } from "../ui/AdminUI";
import styles from "./ProjectList.module.css";

export function ProjectList() {
  const { projectOrder, setProjectOrder } = useAdmin();
  const count = projectOrder.length;

  return (
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
        items={projectOrder}
        getId={(pi) => PROJECTS[pi].slug}
        onReorder={setProjectOrder}
        className={styles.rows}
        renderItem={(pi, k, handleProps) => {
          const p = PROJECTS[pi];
          return (
            <div className={styles.row}>
              <DragHandle {...handleProps} />
              <span className={styles.n}>{String(k + 1).padStart(2, "0")}</span>
              <Thumb src={img(p.imageKey, 240)} position="center" className={styles.thumb}>
                {k === 0 && <span className={styles.wide}>wide</span>}
              </Thumb>
              <span className={styles.titleCell}>
                <span className={styles.title}>{p.title}</span>
                <span className={styles.meta}>
                  {p.kind} · {p.year}
                </span>
              </span>
              <span className={styles.client}>{p.client}</span>
              <span className={styles.badges}>
                {p.youtubeId && <span className={styles.badge}>video</span>}
                {p.behance && <span className={styles.badge}>behance</span>}
              </span>
              <ReorderButtons index={k} length={count} onMove={(from, to) => setProjectOrder(arrayMove(projectOrder, from, to))} />
              <ButtonLink href={`/admin/projects/${p.slug}`} size="sm">
                edit →
              </ButtonLink>
            </div>
          );
        }}
      />
    </div>
  );
}
