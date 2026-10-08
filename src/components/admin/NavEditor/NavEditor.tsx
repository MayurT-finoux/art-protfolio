"use client";

import { useState } from "react";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { arrayMove, SortableList } from "../ui/Sortable";
import { DragHandle, Field, ReorderButtons, TextInput, Toggle } from "../ui/AdminUI";
import styles from "./NavEditor.module.css";

export function NavEditor() {
  const { nav, setNav } = useAdmin();
  const [wordmark, setWordmark] = useState("yurix");

  return (
    <div data-component="NavEditor" className={styles.editor}>
      <span className={styles.intro}>MainNav on desktop and the full-screen menu on mobile. Hidden items stay in the footer.</span>
      <SortableList
        items={nav}
        getId={(n) => n.id}
        onReorder={setNav}
        className={styles.rows}
        renderItem={(item, i, handleProps) => (
          <div className={styles.row} style={{ opacity: item.visible ? 1 : 0.55 }}>
            <DragHandle {...handleProps} />
            <input
              className={styles.label}
              aria-label="Label"
              value={item.label}
              onChange={(e) => setNav(nav.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
            />
            <input
              className={styles.href}
              aria-label="Path"
              value={item.href}
              onChange={(e) => setNav(nav.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))}
            />
            <ReorderButtons index={i} length={nav.length} onMove={(from, to) => setNav(arrayMove(nav, from, to))} />
            <Toggle
              on={item.visible}
              label="Show or hide"
              onChange={(visible) => setNav(nav.map((x, j) => (j === i ? { ...x, visible } : x)))}
            />
          </div>
        )}
      />
      <div className={styles.wordmark}>
        <Field label="mobile menu wordmark">
          <TextInput value={wordmark} onChange={(e) => setWordmark(e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
