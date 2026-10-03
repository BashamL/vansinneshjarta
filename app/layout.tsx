import type { Metadata } from "next";
import "./globals.css";
const siteUrl = process.env.SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(
    siteUrl ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  title: "Vansinneshjärta — Irma Tegge",
  description: "Vansinneshjärta. En bok av Irma Tegge. Här börjar berättelsen.",
  openGraph: {
    title: "Vansinneshjärta — Irma Tegge",
    description: "En bok av Irma Tegge. Här börjar berättelsen.",
    locale: "sv_SE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
