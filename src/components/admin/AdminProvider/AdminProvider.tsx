"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  PROJECTS,
} from "@/lib/placeholder/admin";

// Client-side admin state for screens not yet in the database (projects,
// categories, nav, music, about, Instagram), seeded from placeholder data.
// Artworks and the Home page are saved to the database (src/app/admin/actions.ts).

export type IgState = "ok" | "syncing" | "fail";

type AdminState = {
  projectOrder: number[];
  projectDraft: Record<string, boolean>;
  ig: IgState;
  saved: boolean;
};

type AdminActions = {
  setProjectDraft: (slug: string, draft: boolean) => void;
  setProjectOrder: (order: number[]) => void;
  syncInstagram: () => void;
  save: () => void;
};

const AdminContext = createContext<(AdminState & AdminActions) | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>({
    projectOrder: PROJECTS.map((_, i) => i),
    projectDraft: Object.fromEntries(PROJECTS.map((p) => [p.slug, p.draft])),
    ig: "ok",
    saved: false,
  });
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const igTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const patch = useCallback((p: Partial<AdminState>) => setState((s) => ({ ...s, ...p })), []);

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
      setProjectDraft: (slug: string, draft: boolean) =>
        setState((s) => ({ ...s, projectDraft: { ...s.projectDraft, [slug]: draft } })),
      setProjectOrder: (projectOrder: number[]) => patch({ projectOrder }),
      syncInstagram,
      save,
    }),
    [state, patch, syncInstagram, save],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
