import type { CSSProperties } from "react";
import type { AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./ToolsSkills.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

// Sketchbook sticker colours and tilts (cycled).
const STICKERS = [
  { bg: "var(--accent)", fg: "var(--white)" },
  { bg: "var(--ink)", fg: "var(--white)" },
  { bg: "var(--accent-tint)", fg: "var(--ink)" },
];
const TOOL_ROT = ["-6deg", "4deg", "-2deg"];
const SKILL_ROT = ["-1.5deg", "1deg", "-0.5deg", "2deg", "-1deg"];

export function ToolsSkills({ layout, content: c, copy }: Props) {
  if (layout === "editorial") {
    return (
      <section data-component="ToolsSkills" className={`${styles.ed} ${t.edRule}`}>
        <span data-reveal="" className={`${t.label} ${styles.edLabel}`}>
          {copy.tools.label}
        </span>
        <div className={styles.edList}>
          {c.tools.map((tool, i) => (
            <div key={tool.name} data-reveal="" style={{ transitionDelay: `${i * 90}ms` }}>
              <div className={styles.edTool}>
                <span className={styles.edToolName}>{tool.name}</span>
                <span className={styles.edToolFor}>{tool.for}</span>
              </div>
            </div>
          ))}
        </div>
        <div data-reveal="" className={styles.edSkills}>
          <span className={styles.edSkillsLabel}>{copy.tools.skillsLabel}</span>
          {c.skills.map((s, i) => (
            <span key={s} className={styles.edSkill}>
              {s}
              {i < c.skills.length - 1 && <span className={styles.sep}>/</span>}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section data-component="ToolsSkills" data-guide="4" className={styles.sk}>
      <div data-reveal="" className={styles.sheet}>
        <div className={styles.sheetEdge} aria-hidden />
        <header className={styles.skHeader}>
          <div className={t.skHead}>
            <span className={t.label}>{copy.tools.label}</span>
            <h2 className={t.skH2}>{copy.tools.heading}</h2>
          </div>
          <span className={styles.note}>{copy.tools.note}</span>
        </header>
        <div data-scroller="" className={styles.stickers}>
          {c.tools.map((tool, i) => {
            const s = STICKERS[i % STICKERS.length];
            return (
              <div
                key={tool.name}
                className={styles.sticker}
                style={{ background: s.bg, color: s.fg, "--rot": TOOL_ROT[i % TOOL_ROT.length] } as CSSProperties}
              >
                <span className={styles.stickerName}>{tool.name}</span>
                <span className={styles.stickerFor}>{tool.for}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.skills}>
          <span className={styles.skillsLabel}>{copy.tools.skillsLabel}</span>
          <div className={styles.skillList}>
            {c.skills.map((s, i) => (
              <span key={s} className={styles.skill} style={{ transform: `rotate(${SKILL_ROT[i % SKILL_ROT.length]})` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
