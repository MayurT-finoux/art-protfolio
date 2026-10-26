"use client";

import { useState } from "react";
import styles from "./MusicPlayer.module.css";

type Props = {
  track: string;
  /** No track name: always, or only on mobile (the Home hero dock). */
  compact?: boolean | "mobile";
};

const BAR_DELAYS = [0, 0.18, 0.36, 0.1];
const BAR_REST = [0.35, 0.6, 0.45, 0.25];

// UI only for now: playback, tracks and the CMS playlist come later.
export function MusicPlayer({ track, compact = false }: Props) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggleLabel = playing ? "pause" : "play";
  const muteLabel = muted ? "unmute" : "mute";
  const status = playing ? "now playing" : muted ? "muted" : "paused";

  return (
    <div data-component="MusicPlayer" className={styles.player}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setPlaying((p) => !p)}
        data-cursor={toggleLabel}
        aria-label={toggleLabel}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className={styles.bars} aria-hidden>
        {BAR_DELAYS.map((delay, i) => (
          <span
            key={i}
            className={styles.bar}
            data-muted={muted || undefined}
            style={
              playing
                ? { animation: `mp-eq ${0.7 + i * 0.12}s ease-in-out ${delay}s infinite` }
                : { transform: `scaleY(${muted ? 0.15 : BAR_REST[i]})` }
            }
          />
        ))}
      </div>

      {compact !== true && (
        <div className={styles.track} data-compact={compact === "mobile" || undefined}>
          <span className={styles.status}>{status}</span>
          <span className={styles.name}>{track}</span>
        </div>
      )}

      <button
        type="button"
        className={styles.mute}
        data-muted={muted || undefined}
        onClick={() => setMuted((m) => !m)}
        data-cursor={muteLabel}
        aria-label={muteLabel}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2.5 6h2.2L8 3v10L4.7 10H2.5z" />
            <path d="M11 6l3.5 4M14.5 6L11 10" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2.5 6h2.2L8 3v10L4.7 10H2.5z" />
            <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9" />
          </svg>
        )}
      </button>
    </div>
  );
}
