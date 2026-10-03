"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import type { PageFlip } from "page-flip";

const SPREAD_QUERY = "(min-width: 900px)";

function subscribeToLayout(onChange: () => void) {
  const query = window.matchMedia(SPREAD_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getLayout() {
  return window.matchMedia(SPREAD_QUERY).matches;
}

/** Owns the imperative renderer; React owns the untouched source templates. */
export function useBook(poemCount: number) {
  const mountRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PageFlip | null>(null);
  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const wide = useSyncExternalStore(subscribeToLayout, getLayout, () => false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    const templates = templatesRef.current;
    if (!mount || !templates) return;

    let disposed = false;
    let engine: PageFlip | null = null;
    let resize: ResizeObserver | null = null;
    let resizeFrame = 0;

    async function mountBook() {
      const { PageFlip } = await import("page-flip");
      await document.fonts.ready;
      if (disposed || !mount || !templates) return;

      // The library moves, clips, and clones nodes. Giving it its own DOM tree
      // prevents React reconciliation from fighting the paper geometry.
      const host = document.createElement("div");
      host.className = "book-engine";
      mount.appendChild(host);
      const pages = Array.from(templates.children)
        .filter((page) => wide || page.getAttribute("data-kind") === "poem")
        .map((page) => page.cloneNode(true) as HTMLElement);

      engine = new PageFlip(host, {
        width: 540,
        height: 650,
        size: "stretch",
        minWidth: wide ? 360 : 600,
        maxWidth: 540,
        minHeight: 100,
        maxHeight: 700,
        startPage: currentRef.current * (wide ? 2 : 1),
        autoSize: true,
        usePortrait: true,
        showCover: false,
        drawShadow: true,
        maxShadowOpacity: 0.16,
        flippingTime: 1100,
        mobileScrollSupport: true,
        useMouseEvents: !reducedMotion,
        showPageCorners: false,
        disableFlipByClick: true,
        swipeDistance: 45,
        startZIndex: 1,
      });

      engine.on("init", () => {
        if (disposed) return;
        setReady(true);
        busyRef.current = false;
        setBusy(false);
      });

      engine.on("flip", ({ data }) => {
        if (disposed) return;
        const next = Math.max(0, Math.min(poemCount - 1, wide ? Math.floor(data / 2) : data));
        currentRef.current = next;
        setIndex(next);
      });

      engine.on("changeState", ({ data }) => {
        if (disposed) return;
        const turning = data === "flipping" || data === "user_fold";
        busyRef.current = turning;
        setBusy(turning);
      });

      engine.loadFromHTML(pages);
      // An odd final leaf is treated as a hard cover by the library. These
      // excerpts are all paper, including the third poem in portrait mode.
      pages.forEach((_, page) => engine?.getPage(page).setDensity("soft"));
      engineRef.current = engine;

      // Also handle changes caused by surrounding layout, not only window resize.
      resize = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          if (!disposed && !busyRef.current) engine?.update();
        });
      });
      resize.observe(mount);
    }

    mountBook().catch((error: unknown) => {
      if (disposed) return;
      console.error("The book renderer could not load; using the reading view.", error);
      setReady(false);
    });

    return () => {
      disposed = true;
      resize?.disconnect();
      cancelAnimationFrame(resizeFrame);
      if (engine) {
        engine.off("init");
        engine.off("flip");
        engine.off("changeState");
        engine.destroy();
      }
      engineRef.current = null;
      busyRef.current = false;
      mount.replaceChildren();
    };
  }, [wide, reducedMotion, poemCount]);

  const goTo = useCallback((target: number) => {
    if (busyRef.current || target < 0 || target >= poemCount || target === currentRef.current) return;

    const engine = engineRef.current;
    if (!engine) {
      currentRef.current = target;
      setIndex(target);
      return;
    }

    const page = target * (wide ? 2 : 1);
    if (reducedMotion) {
      engine.turnToPage(page);
      return;
    }

    // Lock before the engine's first event, so double taps cannot overlap turns.
    busyRef.current = true;
    setBusy(true);
    engine.flip(page, "bottom");
    if (engine.getState() === "read") {
      // A resize can invalidate a corner between input and the first frame.
      // Keep navigation usable even when the engine declines that turn.
      engine.turnToPage(page);
      busyRef.current = false;
      setBusy(false);
    }
  }, [poemCount, wide, reducedMotion]);

  return { mountRef, templatesRef, index, ready, busy, wide, reducedMotion, goTo };
}
