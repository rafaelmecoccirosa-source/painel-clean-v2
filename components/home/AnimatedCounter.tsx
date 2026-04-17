"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  target: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  fadeOnly?: boolean;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 1500,
  delay = 0,
  fadeOnly = false,
}: Props) {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      setVisible(true);
      if (fadeOnly) return;
      let startTime: number | null = null;
      const animate = (ts: number) => {
        if (startTime === null) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, target, duration, delay, fadeOnly]);

  return (
    <span
      ref={ref}
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${fadeOnly ? 600 : 300}ms ease-out` }}
    >
      {fadeOnly ? `${target}${suffix}` : `${value}${suffix}`}
    </span>
  );
}
