import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBundledServer } from "@/lib/bundled";
import { formatDownloads } from "@/lib/store";
import type { AppEntry } from "@/lib/types";
import DownloadSection from "@/components/DownloadSection";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import ShareButton from "@/components/ShareButton";
import AppCard from "@/components/AppCard";
import { ArrowLeft, BadgeCheck, User, Tag, CalendarDays, Download } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const data = getBundledServer();
  return data.apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getBundledServer();
  const app = data.apps.find((a) => a.slug === params.slug);
  if (!app) return { title: "Not found" };
  return {
    title: app.name,
    description: app.tagline || app.description,
    openGraph: {
      title: app.name,
      description: app.tagline || app.description,
      images: app.icon ? [{ url: app.icon }] : []
    }
  };
}

export default async function AppPage({ params }: Props) {
  const data = getBundledServer();
  const app: AppEntry | undefined = data.apps.find((a) => a.slug === params.slug);

  if (!app) notFound();

  const related = data.apps
    .filter((a) => a.id !== app.id && a.category === app.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/" className="transition hover:text-slate-900 dark:hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/#apps"
          className="transition hover:text-slate-900 dark:hover:text-white"
        >
          Apps
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-600 dark:text-slate-300">{app.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start gap-4">
            {app.icon ? (
              <img
                src={app.icon}
                alt={app.name}
                className="h-20 w-20 rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100 text-4xl font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-400">
                {app.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="flex flex-wrap items-center gap-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {app.name}
                {app.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{app.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {app.developer || "Unknown"}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Download className="h-4 w-4" />
                  {formatDownloads(app.downloads)} downloads
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Updated {app.updatedAt}
                </span>
              </div>
            </div>
            <ShareButton title={app.name} />
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Screenshots
            </h2>
            <ScreenshotGallery screenshots={app.screenshots} />
          </div>

          <div className="mt-8 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About</h2>
            <div className="prose-app mt-2 whitespace-pre-line">
              <p className="mb-0">{app.description}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
              What's new
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              {app.releases.length === 0 && (
                <p className="text-sm text-slate-400">No releases published yet.</p>
              )}
              {[...app.releases].reverse().map((r, ri) => (
                <div
                  key={`${r.version}-${ri}`}
                  className={ri > 0 ? "mt-5 border-t border-slate-100 pt-5 dark:border-slate-800" : ""}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-sm font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      v{r.version}
                    </span>
                    <span className="text-sm text-slate-400">{r.date || ""}</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400">
                      <Tag className="h-3.5 w-3.5" /> {r.size || "—"}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {(r.changelog.length ? r.changelog : ["Initial release."]).map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {app.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-slate-400" />
              {app.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DownloadSection app={app} />
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            More in {app.category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <AppCard key={a.id} app={a} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/#apps"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all apps
        </Link>
      </div>
    </div>
  );
}