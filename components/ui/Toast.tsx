"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "info", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const styles: Record<ToastType, string> = {
    success: "bg-emerald-600 text-white",
    error:   "bg-red-600 text-white",
    info:    "bg-brand-dark text-white",
  };

  const icons: Record<ToastType, string> = {
    success: "✅",
    error:   "❌",
    info:    "ℹ️",
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium max-w-sm w-full mx-auto ${styles[type]}`}
      role="alert"
    >
      <span className="text-base flex-shrink-0">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}

// ── useToast hook ─────────────────────────────────────────────────────────

import { useState, useCallback } from "react";

interface ToastState {
  message: string;
  type: ToastType;
  key: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return { toast, show, hide };
}
