export default function Footer({
  title = "My App Store"
}: {
  title?: string;
}) {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {title}. Apps shared by the developer.</p>
        <p>
          <a href="/admin" className="hover:underline">
            Site admin
          </a>
        </p>
      </div>
    </footer>
  );
}