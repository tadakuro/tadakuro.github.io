"use client";

import type { AppStoreData } from "@/lib/types";
import { formatDownloads } from "@/lib/store";
import { Package, Download, Layers, BadgeCheck } from "lucide-react";

export default function TopperBar({ data }: { data: AppStoreData }) {
  const totalDownloads = data.apps.reduce((sum, a) => sum + a.downloads, 0);
  const verified = data.apps.filter((a) => a.verified).length;

  const stats = [
    { icon: Package, label: "Apps", value: String(data.apps.length) },
    { icon: Download, label: "Downloads", value: formatDownloads(totalDownloads) },
    { icon: Layers, label: "Categories", value: String(data.categories.length) },
    { icon: BadgeCheck, label: "Verified", value: String(verified) }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            <s.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
              {s.value}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}