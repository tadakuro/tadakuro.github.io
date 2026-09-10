"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppEntry, AppStoreData } from "@/lib/types";
import { loadData } from "@/lib/store";
import AppCard from "./AppCard";
import TopperBar from "./TopperBar";
import { Search, X, ArrowDownWideNarrow } from "lucide-react";

type SortKey = "newest" | "popular" | "az";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Most downloaded" },
  { key: "az", label: "A–Z" }
];

function sortApps(apps: AppEntry[], sort: SortKey): AppEntry[] {
  const copy = [...apps];
  switch (sort) {
    case "popular":
      return copy.sort((a, b) => b.downloads - a.downloads);
    case "az":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export default function AppExplorer({ initialData }: { initialData?: AppStoreData }) {
  const [data, setData] = useState<AppStoreData | null>(initialData ?? null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    let cancelled = false;
    loadData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of data?.apps ?? []) {
      map.set(app.category, (map.get(app.category) ?? 0) + 1);
    }
    return map;
  }, [data]);

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

  const sorted = sortApps(filtered, sort);

  return (
    <div className="space-y-6">
      <TopperBar data={data} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xl">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 self-end overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
          <ArrowDownWideNarrow className="h-4 w-4 pl-2.5 text-slate-400" />
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSort(opt.key)}
              className={
                sort === opt.key
                  ? "px-3 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400"
                  : "px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={
            category === null
              ? "rounded-full bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm"
              : "rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-primary-400"
          }
        >
          All
          <span
            className={
              category === null
                ? "ml-1.5 text-primary-100"
                : "ml-1.5 text-slate-400"
            }
          >
            {data.apps.length}
          </span>
        </button>
        {data.categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? null : c)}
            className={
              category === c
                ? "rounded-full bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm"
                : "rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-primary-400"
            }
          >
            {c}
            <span
              className={
                category === c ? "ml-1.5 text-primary-100" : "ml-1.5 text-slate-400"
              }
            >
              {counts.get(c) ?? 0}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFeaturedOnly((v) => !v)}
          className={
            featuredOnly
              ? "inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm"
              : "inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm text-slate-600 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-amber-400"
          }
        >
          ★ Featured
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p className="font-medium">
          {sorted.length} {sorted.length === 1 ? "app" : "apps"}
        </p>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            Clear search
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="animate-fade-up rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
            No apps found
          </p>
          <p className="mt-1 text-sm text-slate-400">Try a different search or category.</p>
        </div>
      ) : (
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}