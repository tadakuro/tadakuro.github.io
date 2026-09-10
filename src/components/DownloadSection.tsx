"use client";

import { useState } from "react";
import type { AppEntry } from "@/lib/types";
import { Download, Check, GitBranch, HardDrive, Calendar } from "lucide-react";

export default function DownloadSection({ app }: { app: AppEntry }) {
  const [selectedIdx, setSelectedIdx] = useState(app.releases.length - 1);
  const [copied, setCopied] = useState(false);

  const release = app.releases[selectedIdx] ?? app.releases[app.releases.length - 1];

  const onDownload = async () => {
    if (!release.downloadUrl) {
      alert("No download link set yet for this release.");
      return;
    }
    const a = document.createElement("a");
    a.href = release.downloadUrl;
    a.download = "";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    try {
      await navigator.clipboard.writeText(release.downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable; ignore
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <GitBranch className="h-4 w-4" />
        <span>Version history</span>
      </div>

      <select
        value={selectedIdx}
        onChange={(e) => setSelectedIdx(Number(e.target.value))}
        aria-label="Select version"
        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {app.releases.map((r, i) => (
          <option key={`${r.version}-${i}`} value={i}>
            v{r.version} — {r.date}
          </option>
        ))}
      </select>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <HardDrive className="h-4 w-4" /> Size
          </dt>
          <dd className="font-medium">{release.size || "—"}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" /> Released
          </dt>
          <dd className="font-medium">{release.date || "—"}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onDownload}
        disabled={!release.downloadUrl}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        Download v{release.version}
      </button>
      {copied && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <Check className="h-3.5 w-3.5" /> Download link copied
        </p>
      )}
    </div>
  );
}