// Live Work projects from the database, shaped for the Work + project pages.
import { cacheLife, cacheTag } from "next/cache";
import type { Project } from "@/lib/placeholder/work";
import { CONTENT_TAG, getProjects } from "./queries";

/** Live projects in Work order. */
export async function liveProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  return (await getProjects())
    .filter((p) => p.status === "live")
    .map((p) => {
      const cover = { url: p.coverUrl, position: "center" };
      return {
        slug: p.slug,
        title: p.title,
        kind: p.kind,
        year: p.year,
        client: p.client,
        role: p.role,
        tools: p.tools,
        teaser: p.teaser,
        cover,
        thumb: cover,
        coverIsVideo: p.coverIsVideo,
        story: p.story.filter(Boolean),
        process: p.process.map((s) => ({ label: s.label, url: s.url, position: "center", filter: "none" })),
        // First piece runs wide (16/9), the rest are 4/5 — as in the design.
        finals: p.finals.map((url, i) =>
          i === 0 ? { url, position: "center", span: 2, ratio: "16/9" } : { url, position: "center", span: 1, ratio: "4/5" },
        ),
        youtubeId: p.youtubeId ?? undefined,
        behanceUrl: p.behanceUrl ?? undefined,
        behanceText: p.behanceText || undefined,
        seoTitle: p.seoTitle ?? undefined,
        seoDescription: p.seoDescription ?? undefined,
        order: p.position,
        status: p.status,
      };
    });
}
