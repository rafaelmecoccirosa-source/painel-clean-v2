"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that watches every element with
 * the class `animate-on-scroll` and adds `animate-visible` when 15% of
 * the element enters the viewport (once — never repeats).
 *
 * Renders nothing visible — pure side-effect component.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".animate-on-scroll");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            observer.unobserve(entry.target); // once: true
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
