import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

/**
 * Reads as the visitor travels the page. One fixed element, updated on a single
 * rAF per scroll burst, so it costs nothing while scrolling.
 */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      el.style.setProperty("--progress", ratio.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

/**
 * Leans the CSS 3D scenes a few degrees toward the pointer. The tilt lands on
 * the perspective element itself, so the inner .stack keeps its own drift
 * animation untouched.
 */
function armSceneTilt(scenes: NodeListOf<HTMLElement>) {
  const cleanups: (() => void)[] = [];
  for (const el of scenes) {
    let frame = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      frame = 0;
      el.style.transform = `rotateX(${(-ny * 4).toFixed(2)}deg) rotateY(${(nx * 6).toFixed(2)}deg)`;
    };
    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) return;
      nx = Math.min(1, Math.max(-1, ((event.clientX - box.left) / box.width) * 2 - 1));
      ny = Math.min(1, Math.max(-1, ((event.clientY - box.top) / box.height) * 2 - 1));
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      onLeave();
    });
  }
  return cleanups;
}

/**
 * Mounted once in the root route, so every page gets the same pace without each
 * one repeating the wiring: reading progress plus a single fade-up as a section
 * is reached. Reduced motion and a missing IntersectionObserver both leave the
 * content exactly where the server put it — visible.
 */
export function MotionDriver() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (!reduced && window.matchMedia("(hover: hover)").matches) {
      cleanups.push(...armSceneTilt(document.querySelectorAll<HTMLElement>(".scene")));
    }

    let io: IntersectionObserver | undefined;
    if (!reduced && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
      );
      const sections = document.querySelectorAll("main > section");
      // Anything already at or above the fold on arrival — including after a
      // reload that restored a scroll position — shows immediately rather than
      // waiting to be scrolled back into.
      for (const section of sections) {
        if (section.getBoundingClientRect().top < window.innerHeight) {
          section.classList.add("is-in");
        } else {
          io.observe(section);
        }
      }
      if (sections.length) document.documentElement.classList.add("reveal-armed");
    }

    return () => {
      io?.disconnect();
      document.documentElement.classList.remove("reveal-armed");
      for (const off of cleanups) off();
    };
  }, [pathname]);

  return <ScrollProgress />;
}
