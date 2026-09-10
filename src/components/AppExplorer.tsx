"use client";

import { useEffect, useState } from "react";
import type { AppEntry, AppStoreData } from "@/lib/types";
import { loadData } from "@/lib/store";
import AppCard from "./AppCard";
import { Search, ShieldCheck, X } from "lucide-react";

export default function AppExplorer() {
  const [data, setData] = useState<AppStoreData | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = data.apps.filter((app: AppEntry) => {
    if (featuredOnly && !app.featured) return false;
    if (category && app.category !== category) return false;
    if (!q) return true;
    const haystack = `${app.name} ${app.tagline} ${app.description} ${app.tags.join(" ")} ${app.developer}`.toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, tags, developers..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-primary-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={
            category === null
              ? "rounded-full bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white"
              : "rounded-full border border-slate-300 px-3.5 py-1.5 text-sm text-slate-600 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary-400"
          }
        >
          All
        </button>
        {data.categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? null : c)}
            className={
              category === c
                ? "rounded-full bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white"
                : "rounded-full border border-slate-300 px-3.5 py-1.5 text-sm text-slate-600 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary-400"
            }
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFeaturedOnly((v) => !v)}
          className={
            featuredOnly
              ? "inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-sm font-medium text-white"
              : "inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-sm text-slate-600 hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-amber-400"
          }
        >
          <ShieldCheck className="h-4 w-4" /> Featured
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>
          {filtered.length} {filtered.length === 1 ? "app" : "apps"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <p className="text-lg font-medium">No apps found</p>
          <p className="mt-1 text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}