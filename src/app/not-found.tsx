import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-5xl font-black text-primary-600 dark:text-primary-400">404</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        That page doesn't exist. The app may have been moved or removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Back to the store
      </Link>
    </div>
  );
}