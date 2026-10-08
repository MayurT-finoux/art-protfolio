"use client";

import { useState } from "react";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { arrayMove, SortableList } from "../ui/Sortable";
import { AddRow, DragHandle, ReorderButtons, Toggle } from "../ui/AdminUI";
import styles from "./MusicPlaylist.module.css";

// Playlist editor. Preview buttons only toggle their state for now:
// audio files arrive with uploads (Cloudflare R2).
export function MusicPlaylist() {
  const { tracks, setTracks, musicOn, setMusicOn } = useAdmin();
  const [playing, setPlaying] = useState(-1);

  const reorder = (next: typeof tracks) => {
    setTracks(next);
    setPlaying(-1);
  };

  return (
    <div data-component="MusicPlaylist" className={styles.playlist}>
      <div className={styles.player}>
        <div className={styles.playerText}>
          <span className={styles.playerTitle}>Music player</span>
          <span className={styles.playerNote}>
            {musicOn ? "On · shows on the Home hero and the mobile menu, plays tracks in this order" : "Off · player hidden everywhere"}
          </span>
        </div>
        <Toggle on={musicOn} onChange={setMusicOn} label="Toggle music player" />
      </div>

      <div className={styles.rows}>
        <SortableList
          items={tracks}
          getId={(t) => t.file}
          onReorder={reorder}
          className={styles.rows}
          renderItem={(t, i, handleProps) => {
            const on = playing === i;
            return (
              <div className={styles.row} data-playing={on || undefined}>
                <DragHandle {...handleProps} />
                <button type="button" aria-label="Preview track" className={styles.play} onClick={() => setPlaying(on ? -1 : i)}>
                  {on ? "❚❚" : "▶"}
                </button>
                <span className={styles.trackText}>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.file}>
                    {t.file} · {i === 0 ? "plays first" : `track ${i + 1}`}
                  </span>
                </span>
                <span className={styles.duration}>{t.duration}</span>
                <ReorderButtons index={i} length={tracks.length} onMove={(from, to) => reorder(arrayMove(tracks, from, to))} />
              </div>
            );
          }}
        />
        <AddRow>+ add track · MP3 or M4A</AddRow>
      </div>
    </div>
  );
}
