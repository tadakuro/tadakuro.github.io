import bundled from "../../public/data/apps.json";
import type { AppStoreData } from "./types";
import { normalizeData } from "./store";

let cached: AppStoreData | null = null;

export function getBundledServer(): AppStoreData {
  if (!cached) {
    cached = normalizeData(bundled as unknown as AppStoreData);
  }
  return cached;
}