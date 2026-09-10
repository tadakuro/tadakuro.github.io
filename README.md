# My App Store

A self-hostable app store built with Next.js (static export) for sharing your own
Android/app builds — no mirrors, no pumps, just your apps.

## Features

- App grid with live search, category filters, and a "Featured" toggle
- App detail pages: screenshots gallery, version history, changelogs, download buttons
- Admin panel to add/edit/delete apps and manage releases
- Dark / light theme (follows system by default)
- Fully static output — deploy to Netlify, GitHub Pages, or any static host

## Quick start

```bash
npm install
npm run dev        # develop at http://localhost:3000
npm run build      # type-check + build
npm run start      # serve the dev/serve build locally
```

The production build writes a fully static site to `out/`.

## Adding your apps

1. Open `/admin` in the browser.
2. Sign in. The default password is `admin123` (change it, see below).
3. Click **Add app**, fill in the form. Add one or more releases with their
   `downloadUrl` (a direct `.apk`/download link), icon URL, and screenshots.
4. Click **Export** in the admin panel — this downloads an `apps.json`.

### How publishing works

- The site ships with `public/data/apps.json`. That file is the source of truth
  for all visitors and for the statically generated app pages.
- Changes you make in the admin panel are stored in the browser (localStorage)
  so you can preview them instantly.
- To publish your changes, replace `public/data/apps.json` with the exported file
  and rebuild/deploy the site:
  ```bash
  cp ~/Downloads/apps.json public/data/apps.json
  npm run build   # regenerates out/ with your apps + pages
  ```

Icons/screenshots can live anywhere reachable by URL (a public bucket, this repo's
`public/icons/`, etc.). No file uploads — apps are defined by URLs in the JSON.

## Changing the admin password

The password is a lightweight client-side gate (it ships in the public bundle, so
don't rely on it for real security). Set it at build time:

```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your-password npm run build
```

or create a `.env.local` file with `NEXT_PUBLIC_ADMIN_PASSWORD=your-password`.

## Deployment

### Netlify

- **Build command:** `npm run build`
- **Publish directory:** `out`

### GitHub Pages

Static exports use absolute paths, so a project page under
`USERNAME.github.io/REPO/` needs a base path:

1. Set `basePath: "/REPO"` in `next.config.js`:
   ```js
   const nextConfig = {
     output: "export",
     trailingSlash: true,
     basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
     images: { unoptimized: true }
   };
   ```
2. Build and push `out/` (or use an Actions workflow that runs `npm run build`
   then uploads `out/` with `actions/upload-pages-artifact`).

A user site (`USERNAME.github.io`) needs no base path.

## Project structure

```
public/data/apps.json        # all app data (source of truth)
public/icons/                # put app icons here
src/lib/types.ts             # AppEntry, AppStoreData types
src/lib/store.ts             # data loading + helpers
src/lib/bundled.ts           # server-side JSON import for static pages
src/components/              # header, cards, explorer, admin, etc.
src/app/                     # routes: /, /app/[slug], /admin
```

## Notes

- Apps added in the admin panel appear for everyone only after you export +
  rebuild. This is inherent to static hosting; for a live multi-user admin you'd
  need a backend (e.g. Supabase).
- The admin password is not cryptographically secure on a static site — anyone
  could read it from the bundle. Use a real auth layer if you host untrusted
  editors.