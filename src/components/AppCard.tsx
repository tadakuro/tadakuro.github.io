import Link from "next/link";
import type { AppEntry } from "@/lib/types";
import { formatDownloads } from "@/lib/store";
import { Download, AppWindow } from "lucide-react";

export default function AppCard({ app }: { app: AppEntry }) {
  return (
    <Link
      href={`/app/${app.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700"
    >
      <div className="flex items-start gap-3">
        {app.icon ? (
          <img
            src={app.icon}
            alt={app.name}
            className="h-12 w-12 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400">
            <AppWindow className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900 dark:text-white">
            {app.name}
          </h3>
          <p className="truncate text-xs text-primary-600 dark:text-primary-400">
            {app.category}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {app.tagline || app.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>v{app.latestVersion}</span>
        <span className="inline-flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          {formatDownloads(app.downloads)}
        </span>
        <span>{app.updatedAt.slice(0, 7)}</span>
      </div>
    </Link>
  );
}