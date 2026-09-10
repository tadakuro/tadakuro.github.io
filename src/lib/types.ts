export interface AppRelease {
  version: string;
  date: string;
  size: string;
  changelog: string[];
  downloadUrl: string;
}

export interface AppEntry {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  screenshots: string[];
  category: string;
  tags: string[];
  developer: string;
  latestVersion: string;
  size: string;
  updatedAt: string;
  downloads: number;
  featured: boolean;
  releases: AppRelease[];
}

export interface AppStoreData {
  siteTitle: string;
  siteTagline: string;
  categories: string[];
  apps: AppEntry[];
}

export const CATEGORY_FALLBACK = "Other";