"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { notify } from "./Toaster";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = window.location.href;
    if ("share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      notify("success", "Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify("error", "Couldn't copy link");
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-primary-400"
    >
      {copied ? <Check className="h-4 w-4" /> : "share" in navigator ? <Share2 className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}