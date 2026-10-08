"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Scroll distance of the hero transition (from the design).
const RANGE_DESKTOP = 600;
const RANGE_MOBILE = 480;
const SNAP_DEBOUNCE_MS = 140;
// Snap rule: from the start, p ≥ 0.2 completes; from done, p < 0.8 returns.
const FORWARD_THRESHOLD = 0.2;
const BACK_THRESHOLD = 0.8;

const mobileQuery = "(max-width: 767px)";
const reducedQuery = "(prefers-reduced-motion: reduce)";

/**
 * Drives the Home hero from one progress value p (0→1) over the first
 * RANGE px of scroll, written to CSS variables on <html>:
 *   --p     hero progress (blur, intro, nav)
 *   --w     wash to white below the hero
 *   --hide  MusicPlayer hidden once p > 0.05
 * and snaps so the hero never rests half-blurred.
 */
export function HeroScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const isMobile = () => window.matchMedia(mobileQuery).matches;
    const isReduced = () => window.matchMedia(reducedQuery).matches;
    const range = () => (isMobile() ? RANGE_MOBILE : RANGE_DESKTOP);
    const navHeight = () => (isMobile() ? 68 : 84);

    // Resting state: "top" (hero intro) or "done" (Selected Work under the nav).
    let rest: "top" | "done" = "top";
    let snapTween: gsap.core.Tween | null = null;
    let snapTimer: ReturnType<typeof setTimeout> | undefined;

    const setP = () => {
      const R = range();
      const y = window.scrollY;
      const p = gsap.utils.clamp(0, 1, y / R);
      const washSpan = Math.max(1, (ScrollTrigger.maxScroll(window) - R) * 0.6);
      const w = gsap.utils.clamp(0, 1, (y - R) / washSpan);
      const hide = p > 0.05;
      root.style.setProperty("--p", p.toFixed(3));
      root.style.setProperty("--w", w.toFixed(3));
      root.style.setProperty("--hide", hide ? "1" : "0");
      root.dataset.player = hide ? "hide" : "show";
    };

    // "Done" = Selected Work risen to just under the nav.
    const doneY = () => {
      const selected = document.querySelector<HTMLElement>('[data-anchor="selected"]');
      if (!selected) return range();
      const top = selected.getBoundingClientRect().top + window.scrollY;
      return Math.max(range(), top - navHeight());
    };

    const cancelSnap = () => {
      clearTimeout(snapTimer);
      if (snapTween) {
        snapTween.kill();
        snapTween = null;
      }
    };

    const animateTo = (target: number) => {
      const finish = () => {
        snapTween = null;
        rest = target === 0 ? "top" : "done";
        setP();
      };
      cancelSnap();
      if (isReduced()) {
        window.scrollTo(0, target);
        finish();
        return;
      }
      const ms = gsap.utils.clamp(300, 800, Math.abs(target - window.scrollY) * 0.9);
      snapTween = gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: ms / 1000,
        ease: "power2.out", // ease-out-cubic
        onComplete: finish,
      });
    };

    const maybeSnap = () => {
      if (snapTween) return;
      const R = range();
      const y = window.scrollY;
      if (y <= 1) {
        rest = "top";
        return;
      }
      if (y >= R - 1) {
        rest = "done";
        return;
      }
      const p = y / R;
      const toDone = rest === "done" ? p >= BACK_THRESHOLD : p >= FORWARD_THRESHOLD;
      animateTo(toDone ? doneY() : 0);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => {
        setP();
        if (snapTween) return;
        clearTimeout(snapTimer);
        snapTimer = setTimeout(maybeSnap, SNAP_DEBOUNCE_MS);
      },
      onRefresh: setP,
    });

    // Any wheel or touch input cancels a running snap.
    window.addEventListener("wheel", cancelSnap, { passive: true });
    window.addEventListener("touchstart", cancelSnap, { passive: true });

    // Page may load mid-scroll (scroll restoration).
    rest = window.scrollY >= range() - 1 ? "done" : "top";
    setP();
    snapTimer = setTimeout(maybeSnap, SNAP_DEBOUNCE_MS);

    return () => {
      cancelSnap();
      trigger.kill();
      window.removeEventListener("wheel", cancelSnap);
      window.removeEventListener("touchstart", cancelSnap);
      for (const name of ["--p", "--w", "--hide"]) root.style.removeProperty(name);
      delete root.dataset.player;
    };
  }, []);

  return null;
}
