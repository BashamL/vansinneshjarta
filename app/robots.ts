import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const url = process.env.SITE_URL;
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(url ? { sitemap: new URL("/sitemap.xml", url).href } : {}),
  };
}
