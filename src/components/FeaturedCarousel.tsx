"use client";

import { useState, useRef, useEffect } from "react";
import type { AppEntry } from "@/lib/types";
import { formatDownloads } from "@/lib/store";
import Link from "next/link";
import { BadgeCheck, Download, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function FeaturedCarousel({ apps }: { apps: AppEntry[] }) {
  const [featured] = useState<AppEntry[]>(() => apps.filter((a) => a.featured));
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [featured]);

  if (featured.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-primary-50 via-white to-amber-50 p-5 dark:border-slate-800 dark:from-primary-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Featured picks
        </h2>
        {canScroll && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {featured.map((app) => (
          <Link
            key={app.id}
            href={`/app/${app.slug}/`}
            className="group w-64 shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-primary-700"
          >
            <div className="flex items-center gap-3">
              {app.icon ? (
                <img
                  src={app.icon}
                  alt={app.name}
                  loading="lazy"
                  className="h-11 w-11 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-lg font-bold uppercase text-primary-700 dark:bg-primary-950 dark:text-primary-400">
                  {app.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate font-semibold text-slate-900 dark:text-white">
                  {app.name}
                  {app.verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary-500" />
                  )}
                </p>
                <p className="truncate text-xs text-slate-400">{app.tagline}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">v{app.latestVersion}</span>
              <span className="inline-flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {formatDownloads(app.downloads)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}