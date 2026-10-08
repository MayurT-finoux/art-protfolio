"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  ABOUT_LISTS,
  ARTWORKS,
  CATEGORY_ROWS,
  FEATURED,
  MAX_FEATURED,
  NAV,
  PROJECTS,
  TRACKS,
  type AboutListKey,
  type ListItem,
  type NavRow,
  type Track,
} from "@/lib/placeholder/admin";

// Client-side admin state, seeded from placeholder data. It lives in the
// admin layout so it survives moving between screens, like the design's
// prototype. Replaced by the database (server actions) later.

export type IgState = "ok" | "syncing" | "fail";
export type AboutLayout = "Sketchbook" | "Editorial";

type AdminState = {
  featured: number[];
  artworkDraft: Record<string, boolean>;
  projectOrder: number[];
  projectDraft: Record<string, boolean>;
  categories: string[];
  nav: NavRow[];
  tracks: Track[];
  musicOn: boolean;
  aboutLists: Record<AboutListKey, ListItem[]>;
  aboutLayout: AboutLayout;
  freelance: boolean;
  ig: IgState;
  saved: boolean;
};

type AdminActions = {
  toggleFeatured: (artworkIndex: number) => void;
  setArtworkDraft: (slug: string, draft: boolean) => void;
  setProjectDraft: (slug: string, draft: boolean) => void;
  setProjectOrder: (order: number[]) => void;
  setCategories: (categories: string[]) => void;
  setNav: (nav: NavRow[]) => void;
  setTracks: (tracks: Track[]) => void;
  setMusicOn: (on: boolean) => void;
  setAboutList: (key: AboutListKey, items: ListItem[]) => void;
  setAboutLayout: (layout: AboutLayout) => void;
  setFreelance: (on: boolean) => void;
  syncInstagram: () => void;
  save: () => void;
};

const AdminContext = createContext<(AdminState & AdminActions) | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>({
    featured: FEATURED,
    artworkDraft: Object.fromEntries(ARTWORKS.map((a) => [a.slug, a.draft])),
    projectOrder: PROJECTS.map((_, i) => i),
    projectDraft: Object.fromEntries(PROJECTS.map((p) => [p.slug, p.draft])),
    categories: CATEGORY_ROWS,
    nav: NAV,
    tracks: TRACKS,
    musicOn: true,
    aboutLists: ABOUT_LISTS,
    aboutLayout: "Sketchbook",
    freelance: true,
    ig: "ok",
    saved: false,
  });
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const igTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const patch = useCallback((p: Partial<AdminState>) => setState((s) => ({ ...s, ...p })), []);

  const toggleFeatured = useCallback((i: number) => {
    setState((s) => {
      const on = s.featured.includes(i);
      // Max 8: refuse a 9th.
      if (!on && s.featured.length >= MAX_FEATURED) return s;
      return { ...s, featured: on ? s.featured.filter((x) => x !== i) : [...s.featured, i] };
    });
  }, []);

  const save = useCallback(() => {
    clearTimeout(savedTimer.current);
    patch({ saved: true });
    savedTimer.current = setTimeout(() => patch({ saved: false }), 2000);
  }, [patch]);

  const syncInstagram = useCallback(() => {
    patch({ ig: "syncing" });
    clearTimeout(igTimer.current);
    igTimer.current = setTimeout(() => patch({ ig: "ok" }), 900);
  }, [patch]);

  const value = useMemo(
    () => ({
      ...state,
      toggleFeatured,
      setArtworkDraft: (slug: string, draft: boolean) =>
        setState((s) => ({ ...s, artworkDraft: { ...s.artworkDraft, [slug]: draft } })),
      setProjectDraft: (slug: string, draft: boolean) =>
        setState((s) => ({ ...s, projectDraft: { ...s.projectDraft, [slug]: draft } })),
      setProjectOrder: (projectOrder: number[]) => patch({ projectOrder }),
      setCategories: (categories: string[]) => patch({ categories }),
      setNav: (nav: NavRow[]) => patch({ nav }),
      setTracks: (tracks: Track[]) => patch({ tracks }),
      setMusicOn: (musicOn: boolean) => patch({ musicOn }),
      setAboutList: (key: AboutListKey, items: ListItem[]) =>
        setState((s) => ({ ...s, aboutLists: { ...s.aboutLists, [key]: items } })),
      setAboutLayout: (aboutLayout: AboutLayout) => patch({ aboutLayout }),
      setFreelance: (freelance: boolean) => patch({ freelance }),
      syncInstagram,
      save,
    }),
    [state, toggleFeatured, patch, syncInstagram, save],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
