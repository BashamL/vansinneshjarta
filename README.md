# Vansinneshjärta

Swedish book website for **Vansinneshjärta** by **Irma Tegge**. Built with Next.js App Router, React and TypeScript. Responsive, accessible starter with SEO metadata, social preview, favicon, robots, sitemap and GitHub Actions checks.

## Development

Use Node.js 22 (`nvm use`).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run check` for lint, type checking and a production build.

## Vercel

1. Import `BashamL/vansinneshjarta` in Vercel.
2. Select the **Next.js** preset, repository root, Node.js **22.x**. Default build and output settings work; no `vercel.json` required.
3. Set `SITE_URL` to the final public HTTPS origin (no path) to enable canonical links and sitemap entries. Redeploy after changing it.
4. Add the production domain in Vercel and configure its DNS as instructed there.

No environment variables are required to build. Copy `.env.example` to `.env.local` for local URL configuration.

## Content and design

Edit `app/page.tsx` for copy and `app/globals.css` for styles. The CSS heart is original decorative artwork, not an official book cover. Only the supplied title and author are presented as book facts; synopsis, author biography, excerpts, publication details, cover and purchase links await approved material. Add real purchase destinations when supplied.

`app/layout.tsx` contains metadata; `app/opengraph-image.tsx` generates the social image. No analytics, cookies, database or third-party fonts are included. Rights to the book and author material remain with their respective owners.

## Dependency audit

The initial audit reports no production vulnerabilities. Development-only advisories affect the Next.js ESLint dependency chain (`braces` via `micromatch` / `fast-glob`); no patched `braces` release is available at setup time. Recheck with `npm audit` when updating dependencies.
