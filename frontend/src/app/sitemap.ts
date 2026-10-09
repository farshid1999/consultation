import type { MetadataRoute } from "next";

const siteUrl = "https://zehnavard.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/publicStaff`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];
}