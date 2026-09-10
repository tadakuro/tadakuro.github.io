"use client";

import { useState } from "react";
import type { AppEntry } from "@/lib/types";
import { Download, GitBranch, HardDrive, Calendar, Copy, ChevronDown } from "lucide-react";
import { notify } from "./Toaster";

export default function DownloadSection({ app }: { app: AppEntry }) {
  const [selectedIdx, setSelectedIdx] = useState(app.releases.length - 1);

  const release = app.releases[selectedIdx] ?? app.releases[app.releases.length - 1];

  const triggerDownload = async () => {
    if (!release.downloadUrl) {
      notify("error", "No download link set yet for this release.");
      return;
    }
    const a = document.createElement("a");
    a.href = release.downloadUrl;
    a.download = "";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyLink = async () => {
    if (!release.downloadUrl) {
      notify("error", "No download link for this release.");
      return;
    }
    try {
      await navigator.clipboard.writeText(release.downloadUrl);
      notify("success", "Download link copied");
    } catch {
      notify("error", "Couldn't copy link");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <GitBranch className="h-4 w-4" />
        Version history
      </div>

      <div className="relative mt-3">
        <select
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          aria-label="Select version"
          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-9 text-sm font-medium text-slate-900 outline-none transition focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          {app.releases.map((r, i) => (
            <option key={`${r.version}-${i}`} value={i}>
              v{r.version} · {r.date}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <HardDrive className="h-4 w-4" /> Size
          </dt>
          <dd className="font-semibold">{release.size || "—"}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" /> Released
          </dt>
          <dd className="font-semibold">{release.date || "—"}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={triggerDownload}
        disabled={!release.downloadUrl}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        Download v{release.version}
        {release.size && <span className="font-normal opacity-75">· {release.size}</span>}
      </button>

      <button
        type="button"
        onClick={copyLink}
        disabled={!release.downloadUrl}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Copy className="h-4 w-4" />
        Copy direct link
      </button>
    </div>
  );
}