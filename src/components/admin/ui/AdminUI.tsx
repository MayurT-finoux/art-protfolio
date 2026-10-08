// Shared admin controls, styled from Admin.dc.html.
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import styles from "./AdminUI.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** White panel (radius 20, padding 24). */
export function Panel({
  title,
  note,
  gap = 16,
  padding = 24,
  className,
  children,
  ...rest
}: { title?: ReactNode; note?: ReactNode; gap?: number; padding?: number } & ComponentProps<"section">) {
  return (
    <section className={cx(styles.panel, className)} style={{ gap, padding }} {...rest}>
      {title != null && (note != null ? (
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{title}</h3>
          <span className={styles.note}>{note}</span>
        </div>
      ) : (
        <h3 className={styles.panelTitle}>{title}</h3>
      ))}
      {children}
    </section>
  );
}

/** Panel header with a title, a note under it and a control on the right (e.g. a Toggle). */
export function PanelToggleHeader({ title, note, children }: { title: ReactNode; note: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.toggleHeader}>
      <div className={styles.stack2}>
        <h3 className={styles.panelTitle}>{title}</h3>
        <span className={styles.note}>{note}</span>
      </div>
      {children}
    </div>
  );
}

export function PanelTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cx(styles.panelTitle, className)}>{children}</h3>;
}

export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.note, className)}>{children}</span>;
}

/** DM Mono 11px uppercase field label. */
export function FieldLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.label, className)}>{children}</span>;
}

/** Label + control, stacked with a 6px gap. */
export function Field({ label, children, gap = 6, className }: { label: ReactNode; children: ReactNode; gap?: number; className?: string }) {
  return (
    <label className={cx(styles.field, className)} style={{ gap }}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </label>
  );
}

type InputProps = {
  mono?: boolean;
  small?: boolean;
  muted?: boolean;
  prefix?: string;
} & Omit<ComponentProps<"input">, "prefix">;

/** 44px input, radius 12. `prefix` shows muted text before the value (URLs). */
export function TextInput({ mono, small, muted, prefix, className, ...rest }: InputProps) {
  const input = (
    <input
      className={cx(styles.input, mono && styles.mono, small && styles.small, muted && styles.muted, prefix && styles.inputBare, !prefix && className)}
      {...rest}
    />
  );
  if (!prefix) return input;
  return (
    <span className={cx(styles.input, styles.prefixed, mono && styles.mono, className)}>
      <span className={styles.prefix}>{prefix}</span>
      {input}
    </span>
  );
}

export function TextArea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cx(styles.textarea, className)} {...rest} />;
}

/** 46×28 pill toggle: purple on, #d6d5d0 off. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={styles.toggle}
      data-on={on || undefined}
      onClick={() => onChange(!on)}
    >
      <span className={styles.knob} />
    </button>
  );
}

/** Filter / single-select chip: ink when active. */
export function Chip({
  active,
  count,
  children,
  ...rest
}: { active: boolean; count?: number } & ComponentProps<"button">) {
  return (
    <button type="button" className={styles.chip} data-active={active || undefined} {...rest}>
      {children}
      {count != null && <span className={styles.chipCount}>{count}</span>}
    </button>
  );
}

/** ↑ ↓ buttons, 34px; 30% opacity at the ends. */
export function ReorderButtons({ index, length, onMove }: { index: number; length: number; onMove: (from: number, to: number) => void }) {
  return (
    <span className={styles.reorder}>
      <button type="button" aria-label="Move up" className={styles.reorderButton} style={{ opacity: index === 0 ? 0.3 : 1 }} disabled={index === 0} onClick={() => onMove(index, index - 1)}>
        ↑
      </button>
      <button type="button" aria-label="Move down" className={styles.reorderButton} style={{ opacity: index === length - 1 ? 0.3 : 1 }} disabled={index === length - 1} onClick={() => onMove(index, index + 1)}>
        ↓
      </button>
    </span>
  );
}

/** ⋮⋮ drag handle; spread dnd-kit listeners onto it. */
export function DragHandle({ className, ...rest }: ComponentProps<"span">) {
  return (
    <span className={cx(styles.handle, className)} aria-label="Drag to reorder" role="button" tabIndex={0} {...rest}>
      ⋮⋮
    </span>
  );
}

type ButtonVariant = "primary" | "outline" | "dark" | "ghost";
type ButtonSize = "lg" | "md" | "sm" | "xs";

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...rest
}: { variant?: ButtonVariant; size?: ButtonSize } & ComponentProps<"button">) {
  return <button type="button" className={cx(styles.button, styles[variant], styles[size], className)} {...rest} />;
}

export function ButtonLink({
  variant = "outline",
  size = "md",
  className,
  ...rest
}: { variant?: ButtonVariant; size?: ButtonSize } & ComponentProps<typeof Link>) {
  return <Link className={cx(styles.button, styles[variant], styles[size], className)} {...rest} />;
}

/** Dashed "+ add …" row or tile. */
export function AddRow({ children, className, ...rest }: ComponentProps<"button">) {
  return (
    <button type="button" className={cx(styles.addRow, className)} {...rest}>
      {children}
    </button>
  );
}

export function StatusDot({ color, children, mono, className }: { color: string; children: ReactNode; mono?: boolean; className?: string }) {
  return (
    <span className={cx(styles.status, mono && styles.statusMono, className)} style={{ color }}>
      <span className={styles.dot} style={{ background: color }} />
      {children}
    </span>
  );
}

/** Small "soon" tag with a dashed border. */
export function SoonTag() {
  return <span className={styles.soon}>soon</span>;
}

/** Thumbnail with a cover-fitted background image. */
export function Thumb({ src, position = "center", className, style, children }: { src: string; position?: string; className?: string; style?: React.CSSProperties; children?: ReactNode }) {
  return (
    <span className={cx(styles.thumb, className)} style={{ backgroundImage: `url("${src}")`, backgroundPosition: position, ...style }}>
      {children}
    </span>
  );
}
