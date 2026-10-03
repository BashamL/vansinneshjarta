# vansinnehjärta

Swedish poetry website for **vansinnehjärta** by **Irma Tegge**. Built with Next.js App Router, React and TypeScript. Responsive, accessible starter with SEO metadata, social preview, favicon, robots, sitemap and GitHub Actions checks.

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

The design follows the latest supplied InDesign manuscript, `vansinnehjarta boken 3 okt.indd` (3 October 2026): lowercase title **vansinnehjärta**, restrained typography, left-aligned verse, generous margins and quiet folios.

The manuscript uses **Garamond Premier Pro**. The website self-hosts **EB Garamond** regular and italic, a related open-source Garamond, for consistent rendering without third-party font requests. It is a visual substitute, not the identical typeface. Exact Garamond Premier Pro web rendering can be added with an Adobe Fonts web project. The included font files come from Google Fonts and are covered by `public/fonts/OFL.txt`.

- `app/page.tsx`: page copy and short quotations from manuscript pages 69 and 177.
- `app/poems.json`: poems from pages 7, 12 and 95, transcribed from a fresh IDML export of the latest manuscript. Preserve the original wording and explicit line breaks.
- `app/poem-reader.tsx`: accessible poem navigation, keyboard arrows, page selection and Motion transitions.
- `app/book/`: responsive book spreads, single-page mobile reading and StPageFlip corner folds. The renderer uses cloned page templates so its DOM changes remain separate from React. Reduced motion uses immediate page changes.
- `scripts/patch-page-flip.mjs`: idempotent installation patch for StPageFlip 2.0.7. It cleans up animation loops and resize listeners, eases automatic turns, starts at a small corner fold, marks the mobile reverse face as blank paper, and replaces the double gray shadow with a single warm crease. Review this patch before upgrading the pinned dependency.
- `app/globals.css`: responsive paper-like layout and reduced-motion support.
- `app/layout.tsx` and `app/opengraph-image.tsx`: metadata and matching social image.

The introduction is website copy based on the collection's themes, not a quotation or author biography. The manuscript and complete book remain outside the repository. Publication date, purchase links and contact details should be added once confirmed. Rights to the poetry remain with Irma Tegge.

## Dependency audit

The initial audit reports no production vulnerabilities. Development-only advisories affect the Next.js ESLint dependency chain (`braces` via `micromatch` / `fast-glob`); no patched `braces` release is available at setup time. Recheck with `npm audit` when updating dependencies.
