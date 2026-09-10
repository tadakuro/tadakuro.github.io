export default function Footer({
  title = "My App Store"
}: {
  title?: string;
}) {
  return (
    <footer className="border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} {title}. All apps built and published by the
          developer.
        </p>
        <p className="text-slate-400 dark:text-slate-500">
          Made with Next.js · 100% static
        </p>
      </div>
    </footer>
  );
}