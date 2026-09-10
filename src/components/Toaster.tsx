"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
}

export function notify(kind: ToastKind, message: string) {
  window.dispatchEvent(
    new CustomEvent<ToastItem>("appstore-toast", {
      detail: { id: crypto.randomUUID(), kind, message }
    })
  );
}

const icons: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info
};

const palettes: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200"
};

const iconPalettes: Record<ToastKind, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-sky-500"
};

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastItem>).detail;
      setToasts((t) => [...t, detail]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== detail.id));
      }, 4000);
    };
    window.addEventListener("appstore-toast", onToast);
    return () => window.removeEventListener("appstore-toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            className={`animate-pop-in pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${palettes[t.kind]}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconPalettes[t.kind]}`} />
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              aria-label="Dismiss"
              className="shrink-0 opacity-60 transition hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}