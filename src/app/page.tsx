import AppExplorer from "@/components/AppExplorer";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:border-slate-800 dark:from-primary-950/40 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            My own apps,{" "}
            <span className="text-primary-600 dark:text-primary-400">
              straight from the source
            </span>
            .
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            No mirrors, no junk, no mods. Every download is built and shipped by
            me.
          </p>
        </div>
      </section>

      <section id="apps" className="mx-auto max-w-6xl px-4 py-10">
        <AppExplorer />
      </section>
    </div>
  );
}