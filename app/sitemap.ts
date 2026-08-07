import type { MetadataRoute } from "next";
import { SEO_PAGES, absoluteUrl } from "@/lib/site-data";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "weekly", priority: 0.96 },
    ...SEO_PAGES.map((page) => ({
      url: absoluteUrl(page.pageSlug),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.priority === "Top Priority" ? 0.92 : page.priority === "High" ? 0.84 : 0.76,
    })),
  ];

  const seen = new Set<string>();
  return entries
    .filter((entry) => {
      const url = String(entry.url);
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .sort((a, b) => String(a.url).localeCompare(String(b.url)));
}
