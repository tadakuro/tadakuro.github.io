"use client";

import { useEffect, useRef, useState } from "react";
import type { AppEntry, AppStoreData, AppRelease } from "@/lib/types";
import { CATEGORY_FALLBACK } from "@/lib/types";
import {
  loadData,
  saveData,
  clearOverride,
  slugify,
  makeApp,
  normalizeData
} from "@/lib/store";
import {
  Plus,
  Trash2,
  Pencil,
  Download,
  Upload,
  RotateCcw,
  Lock,
  LogOut,
  Save,
  X
} from "lucide-react";

const ADMIN_PASSWORD =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_PASSWORD) ||
  "admin123";

function inputClass(extra = "") {
  return `rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${extra}`;
}

const emptyApp = (): AppEntry =>
  makeApp({
    id: "",
    downloads: 0,
    featured: false,
    releases: []
  });

function AppForm({
  initial,
  onSave,
  onCancel
}: {
  initial: AppEntry;
  onSave: (app: AppEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AppEntry>(initial);
  const [slugDirty, setSlugDirty] = useState(false);

  const set = (patch: Partial<AppEntry>) =>
    setForm((f) => {
      const next = { ...f, ...patch };
      if (!slugDirty && patch.name !== undefined) {
        next.slug = slugify(patch.name);
      }
      return next;
    });

  const setRelease = (idx: number, patch: Partial<AppRelease>) =>
    setForm((f) => ({
      ...f,
      releases: f.releases.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    }));

  const submit = () => {
    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }
    onSave({ ...form, slug: form.slug || slugify(form.name) });
  };

  const [screenshots, setScreenshots] = useState<string>(form.screenshots.join("\n"));
  const [tagsText, setTagsText] = useState<string>(form.tags.join(", "));

  return (
    <form
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Name *</span>
          <input
            className={inputClass("w-full")}
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Slug</span>
          <input
            className={inputClass("w-full")}
            value={form.slug}
            onChange={(e) => {
              setSlugDirty(true);
              set({ slug: slugify(e.target.value) });
            }}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tagline</span>
        <input
          className={inputClass("w-full")}
          value={form.tagline}
          onChange={(e) => set({ tagline: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Description</span>
        <textarea
          className={inputClass("w-full min-h-[120px]")}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Icon URL</span>
          <input
            className={inputClass("w-full")}
            value={form.icon}
            onChange={(e) => set({ icon: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Category</span>
          <input
            className={inputClass("w-full")}
            value={form.category}
            onChange={(e) => set({ category: e.target.value })}
            list="category-options"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Developer</span>
          <input
            className={inputClass("w-full")}
            value={form.developer}
            onChange={(e) => set({ developer: e.target.value })}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          Screenshot URLs (one per line)
        </span>
        <textarea
          className={inputClass("w-full min-h-[80px]")}
          value={screenshots}
          onChange={(e) => {
            setScreenshots(e.target.value);
            set({
              screenshots: e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
            });
          }}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tags (comma separated)</span>
        <input
          className={inputClass("w-full")}
          value={tagsText}
          onChange={(e) => {
            setTagsText(e.target.value);
            set({
              tags: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            });
          }}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Latest version</span>
          <input
            className={inputClass("w-full")}
            value={form.latestVersion}
            onChange={(e) => set({ latestVersion: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Size</span>
          <input
            className={inputClass("w-full")}
            value={form.size}
            onChange={(e) => set({ size: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Downloads</span>
          <input
            type="number"
            className={inputClass("w-full")}
            value={form.downloads}
            onChange={(e) => set({ downloads: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Updated</span>
          <input
            type="date"
            className={inputClass("w-full")}
            value={form.updatedAt}
            onChange={(e) => set({ updatedAt: e.target.value })}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set({ featured: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        Featured app
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Releases</span>
          <button
            type="button"
            onClick={() => {
              const now = new Date().toISOString().slice(0, 10);
              set({
                releases: [
                  ...form.releases,
                  {
                    version: "0.1.0",
                    date: now,
                    size: form.size,
                    downloadUrl: "",
                    changelog: []
                  }
                ]
              });
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300"
          >
            <Plus className="h-3.5 w-3.5" /> Add release
          </button>
        </div>
        <div className="space-y-3">
          {form.releases.map((r, i) => (
            <div
              key={`${r.version}-${i}`}
              className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
            >
              <div className="grid gap-3 sm:grid-cols-4">
                <input
                  className={inputClass("w-full")}
                  placeholder="Version"
                  value={r.version}
                  onChange={(e) => setRelease(i, { version: e.target.value })}
                />
                <input
                  type="date"
                  className={inputClass("w-full")}
                  value={r.date}
                  onChange={(e) => setRelease(i, { date: e.target.value })}
                />
                <input
                  className={inputClass("w-full")}
                  placeholder="Size"
                  value={r.size}
                  onChange={(e) => setRelease(i, { size: e.target.value })}
                />
                <div className="flex gap-1">
                  <input
                    className={inputClass("w-full")}
                    placeholder="Changelog (semicolon separated)"
                    value={r.changelog.join("; ")}
                    onChange={(e) =>
                      setRelease(i, {
                        changelog: e.target.value.split(";").map((s) => s.trim()).filter(Boolean)
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set({ releases: form.releases.filter((_, j) => j !== i) })
                    }
                    aria-label="Remove release"
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <input
                className={inputClass("w-full mt-2")}
                placeholder="Download URL"
                value={r.downloadUrl}
                onChange={(e) => setRelease(i, { downloadUrl: e.target.value })}
              />
            </div>
          ))}
          {form.releases.length === 0 && (
            <p className="text-sm text-slate-400">No releases yet — add one to publish.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Save className="h-4 w-4" /> Save app
        </button>
      </div>
    </form>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [data, setData] = useState<AppStoreData | null>(null);
  const [editing, setEditing] = useState<AppEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authed) {
      loadData().then((d) => setData(d));
    }
  }, [authed]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <Lock className="mx-auto h-10 w-10 text-primary-600 dark:text-primary-400" />
          <h1 className="mt-4 text-xl font-bold">Admin login</h1>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setAuthed(token === ADMIN_PASSWORD);
            }}
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Password"
              className={inputClass("w-full")}
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  const notify = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const persist = (next: AppStoreData) => {
    const normalized = normalizeData(next);
    saveData(normalized);
    setData(normalized);
  };

  const addApp = (app: AppEntry) => {
    const next = makeApp(app);
    persist({
      ...data!,
      apps: [...data!.apps, next],
      categories: data!.categories.includes(next.category)
        ? data!.categories
        : [...data!.categories, next.category]
    });
    setEditing(null);
    setIsNew(false);
    notify("App added.");
  };

  const updateApp = (app: AppEntry) => {
    persist({
      ...data!,
      apps: data!.apps.map((a) => (a.id === app.id ? makeApp(app) : a))
    });
    setEditing(null);
    setIsNew(false);
    notify("App updated.");
  };

  const deleteApp = (id: string) => {
    if (!confirm("Delete this app?")) return;
    persist({ ...data!, apps: data!.apps.filter((a) => a.id !== id) });
    notify("App deleted.");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apps.json";
    a.click();
    URL.revokeObjectURL(url);
    notify("Exported apps.json — commit it to public/data/ and rebuild to publish.");
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed.apps)) throw new Error("bad format");
        persist(normalizeData(parsed));
        notify("Imported successfully.");
      } catch {
        alert("Invalid apps.json file.");
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (!confirm("Reset to the bundled apps.json? All local changes will be lost.")) return;
    clearOverride();
    loadData().then((d) => setData(d));
    notify("Reset to bundled data.");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin panel</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(emptyApp());
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" /> Add app
          </button>
          <button
            type="button"
            onClick={exportData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Upload className="h-4 w-4" /> Import
          </button>
          <button
            type="button"
            onClick={resetData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            onClick={() => setAuthed(false)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importData(f);
          e.target.value = "";
        }}
      />

      {notice && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {notice}
        </p>
      )}

      {!data ? (
        <p className="mt-10 text-slate-500 dark:text-slate-400">Loading…</p>
      ) : (
        <>
          {(editing && (
            <div className="mt-6">
              <AppForm
                key={editing.id || "new"}
                initial={editing}
                onCancel={() => {
                  setEditing(null);
                  setIsNew(false);
                }}
                onSave={isNew ? addApp : updateApp}
              />
            </div>
          )) || (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {data.apps.length === 0 && (
                <p className="p-8 text-center text-slate-400">
                  No apps yet. Click "Add app" to get started.
                </p>
              )}
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.apps.map((app) => (
                  <li key={app.id} className="flex items-center gap-3 p-4">
                    {app.icon ? (
                      <img
                        src={app.icon}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400">
                        {app.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {app.name}
                        {app.featured && (
                          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                            Featured
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {app.category} · v{app.latestVersion} · {app.size || "no size"}
                      </p>
                    </div>
                    <a
                      href={`/app/${app.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing({ ...app });
                        setIsNew(false);
                      }}
                      aria-label={`Edit ${app.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteApp(app.id)}
                      aria-label={`Delete ${app.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <p className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        How publishing works: changes you make here are stored in your browser so
        you can preview them instantly. To ship them to all visitors, click
        <strong> Export</strong>, place the file at <code>public/data/apps.json</code>,
        and rebuild/deploy your site.
      </p>
    </div>
  );
}