import type { MetadataRoute } from "next";
import { mockContent } from "@/lib/mock-data";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = new URL(mockContent.home.seo.canonical).origin;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
