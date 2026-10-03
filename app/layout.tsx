import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const garamond = localFont({
  src: [
    {
      path: "../public/fonts/EBGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/EBGaramond-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-garamond",
  display: "swap",
});
const siteUrl = process.env.SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(
    siteUrl ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  title: "vansinnehjärta — Irma Tegge",
  description:
    "En diktsamling av Irma Tegge om kärlek, saknad och att hitta tillbaka till sig själv. Läs några dikter ur vansinnehjärta.",
  openGraph: {
    title: "vansinnehjärta — Irma Tegge",
    description:
      "En diktsamling av Irma Tegge. Om kärlek, saknad och att hitta tillbaka till sig själv.",
    locale: "sv_SE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className={garamond.variable}>
      <body>{children}</body>
    </html>
  );
}
