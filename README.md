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
- `app/poem-reader.tsx`: original single-page poem previews with previous/next navigation and a gentle fade.
- `app/globals.css`: responsive paper-like layout and reduced-motion support.
- `app/layout.tsx` and `app/opengraph-image.tsx`: metadata and matching social image.

The introduction is website copy based on the collection's themes, not a quotation or author biography. The manuscript and complete book remain outside the repository. Publication date, purchase links and contact details should be added once confirmed. Rights to the poetry remain with Irma Tegge.

## Dependency audit

The initial audit reports no production vulnerabilities. Development-only advisories affect the Next.js ESLint dependency chain (`braces` via `micromatch` / `fast-glob`); no patched `braces` release is available at setup time. Recheck with `npm audit` when updating dependencies.

## Stripe sandbox checkout

The current integration accepts **sandbox keys only** and explicitly labels every order as a test. The book costs **150 SEK**, shipping costs **30 SEK**, quantity is fixed at one, and shipping addresses are restricted to Sweden. The checkout total is **180 SEK**. Taxes are not calculated separately; no VAT registration or tax rate is assumed.

Implementation plan and flow:

1. `/bestall` shows the printed book and complete price before redirecting to Stripe-hosted Checkout.
2. `POST /api/checkout` takes only a UUID retry token. Product, quantity, price, currency and shipping rules are controlled by the server. Stripe chooses eligible payment methods from Dashboard settings.
3. `/api/stripe/webhook` verifies the raw-body signature, handles completed and asynchronous success/failure events, and retrieves the latest session. Only a paid, matching sandbox order can receive `book_payment_verified=true` on its Checkout Session and PaymentIntent. Duplicate delivery writes the same markers; upstream errors return 500 for retry.
4. `/bestall/tack` reads payment status from Stripe and displays a result without triggering fulfillment or exposing customer details.
5. Stripe holds the durable payment, contact and shipping details. Fulfillment is manual. For a future live shop, check payment/refund status before shipping and track shipping separately; the payment verification marker does not mean an order has shipped. **Never ship sandbox orders.**

Local setup:

- Store a sandbox API key as `STRIPE_SECRET_KEY` in ignored `.env.local`. A restricted key is preferable; the runtime needs Checkout Sessions read/write, Prices read and PaymentIntents read/write. The setup script additionally creates Products and Prices.
- `npm run stripe:setup` creates/reuses the 150 SEK sandbox price and saves its ID privately.
- `npm run stripe:listen` forwards the three Checkout events to port 3001 and writes the local signing secret without displaying it. Keep it running, then start `npm run dev -- --port 3001`.
- `npm run check` runs lint, type checking, payment tests and a production build.
- `git config core.hooksPath .githooks` enables the included staged-file Stripe credential check.

Vercel requires `STRIPE_SECRET_KEY`, `STRIPE_BOOK_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CHECKOUT_ENABLED=true` and `CHECKOUT_BASE_URL=https://vansinnehjarta.vercel.app`. Store keys/signing secrets as **sensitive** environment variables. The hosted webhook uses its own signing secret, not the local listener's. Register the sandbox endpoint at `https://vansinnehjarta.vercel.app/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`, on API version `2026-09-30.endive`.

Before a real launch, confirm VAT treatment, stock, delivery timing, customer support/returns information and fulfillment operations; deliberately implement live-mode support and use separate live credentials, price and webhook endpoint. Simply adding a live key will not enable payments in this sandbox-only build.

Stripe guidance: [Checkout](https://docs.stripe.com/payments/checkout), [fulfillment and webhooks](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted), [sandboxes](https://docs.stripe.com/sandboxes). The official Stripe plugin is installed locally; its planner was unavailable in this chat, so this implementation follows the user-requested official Stripe skills fallback. Installed agent skills remain local to the workspace.
