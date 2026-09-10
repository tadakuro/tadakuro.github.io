import type { AppEntry, AppStoreData } from "./types";
import { CATEGORY_FALLBACK } from "./types";

const STORAGE_KEY = "appstore-override-v1";

export async function loadBundled(): Promise<AppStoreData> {
  const res = await fetch("/data/apps.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not load apps.json");
  }
  return res.json();
}

export function normalizeData(data: AppStoreData): AppStoreData {
  const categories: string[] = [];
  const seen = new Set<string>();
  for (const app of data.apps ?? []) {
    const cat = app.category && app.category.trim() ? app.category : CATEGORY_FALLBACK;
    app.category = cat;
    if (!seen.has(cat)) {
      seen.add(cat);
      categories.push(cat);
    }
  }
  const cats = data.categories ?? [];
  for (const c of cats) {
    if (!seen.has(c)) {
      seen.add(c);
      categories.push(c);
    }
  }
  return { ...data, categories, apps: data.apps ?? [] };
}

function isStoreData(value: unknown): value is AppStoreData {
  const v = value as AppStoreData;
  return (
    !!v &&
    typeof v === "object" &&
    Array.isArray(v.apps) &&
    v.apps.every(
      (a) =>
        !!a &&
        typeof a.slug === "string" &&
        typeof a.name === "string" &&
        a.slug.length > 0 &&
        a.name.length > 0
    )
  );
}

export async function loadData(): Promise<AppStoreData> {
  let override: string | null = null;
  if (typeof window !== "undefined") {
    try {
      override = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      override = null;
    }
  }
  if (override) {
    try {
      const parsed = JSON.parse(override);
      if (isStoreData(parsed)) {
        return normalizeData(parsed);
      }
    } catch {
      // fall through to bundled
    }
  }
  return normalizeData(await loadBundled());
}

export function saveData(data: AppStoreData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearOverride(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeApp(partial: Partial<AppEntry>): AppEntry {
  const now = new Date().toISOString().slice(0, 10);
  return {
    id: partial.id ?? uniqueId(),
    slug: partial.slug ?? slugify(partial.name ?? "untitled"),
    name: partial.name ?? "Untitled",
    tagline: partial.tagline ?? "",
    description: partial.description ?? "",
    icon: partial.icon ?? "",
    screenshots: partial.screenshots ?? [],
    category: partial.category ?? CATEGORY_FALLBACK,
    tags: partial.tags ?? [],
    developer: partial.developer ?? "",
    latestVersion: partial.latestVersion ?? "1.0.0",
    size: partial.size ?? "",
    updatedAt: partial.updatedAt ?? now,
    downloads: partial.downloads ?? 0,
    featured: partial.featured ?? false,
    verified: partial.verified ?? true,
    releases: partial.releases ??
      [
        {
          version: partial.latestVersion ?? "1.0.0",
          date: now,
          size: partial.size ?? "",
          changelog: [],
          downloadUrl: ""
        }
      ] as AppEntry["releases"]
  };
}

export function formatDownloads(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}