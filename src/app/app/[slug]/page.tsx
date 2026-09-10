import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBundledServer } from "@/lib/bundled";
import { formatDownloads } from "@/lib/store";
import type { AppEntry } from "@/lib/types";
import DownloadSection from "@/components/DownloadSection";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import { ArrowLeft, Download, User, Tag } from "lucide-react";

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
  return { title: app.name, description: app.tagline || app.description };
}

export default async function AppPage({ params }: Props) {
  const data = getBundledServer();
  const app: AppEntry | undefined = data.apps.find((a) => a.slug === params.slug);

  if (!app) notFound();

  const latest = app.releases[app.releases.length - 1];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/#apps"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to apps
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            {app.icon ? (
              <img
                src={app.icon}
                alt={app.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-4xl font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-400">
                {app.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {app.name}
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                {app.tagline}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <User className="h-4 w-4" /> {app.developer || "Unknown"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Download className="h-4 w-4" /> {formatDownloads(app.downloads)} downloads
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ScreenshotGallery screenshots={app.screenshots} />
          </div>

          <div className="mt-8 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About</h2>
            <div className="prose-app whitespace-pre-line">
              <p className="mb-0">{app.description}</p>
            </div>
          </div>

          {app.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Tag className="h-4 w-4 self-center text-slate-400" />
              {app.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <DownloadSection app={app} />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">What's new</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              v{latest.version} · {latest.date}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {(latest.changelog.length ? latest.changelog : ["Initial release."]).map(
                (item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}