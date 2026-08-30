import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, freq: "weekly" as const },
    { path: "/about", priority: 0.8, freq: "monthly" as const },
    { path: "/services", priority: 0.9, freq: "monthly" as const },
    { path: "/smarttaxiq", priority: 0.95, freq: "weekly" as const },
    { path: "/business-services", priority: 0.85, freq: "monthly" as const },
    { path: "/book", priority: 0.9, freq: "monthly" as const },
    { path: "/checklist", priority: 0.9, freq: "monthly" as const },
    { path: "/workbook", priority: 0.85, freq: "monthly" as const },
    { path: "/resources", priority: 0.7, freq: "weekly" as const },
    { path: "/locations", priority: 0.6, freq: "monthly" as const },
    { path: "/contact", priority: 0.7, freq: "monthly" as const },
  ];

  return [
    ...routes.map((r) => ({
      url: `${site.url}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/resources/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
