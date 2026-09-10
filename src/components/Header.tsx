import Link from "next/link";
import { Package, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { isAdminEnabled } from "@/lib/auth";

export default function Header({
  title = "My App Store"
}: {
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/30 transition group-hover:scale-105">
            <Package className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">{title}</span>
        </Link>
        <nav className="flex items-center gap-1.5">
          <Link
            href="/#apps"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            Apps
          </Link>
          {isAdminEnabled() && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}