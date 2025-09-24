# me-cli — Project Website — Website

This is a static documentation & landing website for **me-cli** built with Next.js (App Router) + TailwindCSS.

## Quick start (local)

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a new GitHub repo (public or private).
2. Import the repo in Vercel and deploy. No special settings needed; framework will be auto-detected.
3. Build command: `next build` (default). Output directory: `.next` (default).

## Structure

- `/app` — App Router pages
- `/components` — Reusable UI
- `/public` — Static assets
- `/content` — Project README copied in as docs

## Customize

- Edit `/app/(site)/page.tsx` for the hero/landing.
- Edit `/content/README.md` (copied from the original project) to update docs.
- Update site metadata in `/app/layout.tsx`.

---

Generated automatically from your uploaded archive.