import AppExplorer from "@/components/AppExplorer";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { getBundledServer } from "@/lib/bundled";
import { ShieldCheck } from "lucide-react";

export default function HomePage() {
  const data = getBundledServer();

  return (
    <div>
      <section className="hero-mesh border-b border-slate-200 from-primary-50 via-white to-slate-50 dark:border-slate-800 dark:from-primary-950/40 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Original builds · No mirrors
          </span>
          <h1 className="animate-fade-up mx-auto mt-5 max-w-2xl text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            My own apps,{" "}
            <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-violet-400">
              straight from the source
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Every download is built and shipped by me. No junk, no trackers, no
            modified packages — just apps that work.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#apps"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700"
            >
              Browse apps
            </a>
            <a
              href="#featured"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-primary-400"
            >
              Featured picks
            </a>
          </div>
        </div>
      </section>

      <section id="apps" className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div id="featured" className="scroll-mt-20">
          <FeaturedCarousel apps={data.apps} />
        </div>
        <AppExplorer initialData={data} />
      </section>
    </div>
  );
}