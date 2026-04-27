import type { MetadataRoute } from "next";

const BASE = "https://autocmo.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`,           lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/install`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/onboarding`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`,    lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`,      lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
