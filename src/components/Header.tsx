import Link from "next/link";
import { Package } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header({
  title = "My App Store"
}: {
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Package className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">{title}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/#apps"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Apps
          </Link>
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}