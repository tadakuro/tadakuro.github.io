import Link from "next/link";
import type { AppEntry } from "@/lib/types";
import { formatDownloads } from "@/lib/store";
import { Download, BadgeCheck, ArrowRight } from "lucide-react";

export default function AppCard({ app, index = 0 }: { app: AppEntry; index?: number }) {
  return (
    <Link
      href={`/app/${app.slug}/`}
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700"
    >
      <div className="flex items-start gap-3">
        {app.icon ? (
          <img
            src={app.icon}
            alt={app.name}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xl font-bold uppercase text-primary-700 transition group-hover:scale-105 dark:bg-primary-950 dark:text-primary-400">
            {app.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 truncate font-semibold text-slate-900 dark:text-white">
            {app.name}
            {app.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-primary-500"
                aria-label="Verified original build"
              />
            )}
          </h3>
          <p className="truncate text-xs font-medium text-primary-600 dark:text-primary-400">
            {app.category}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
        {app.tagline || app.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-baseline gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
            v
          </span>
          <span className="font-medium">{app.latestVersion}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Download className="h-3.5 w-3.5" />
          {formatDownloads(app.downloads)}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition group-hover:gap-2 dark:text-primary-400">
          Get
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}