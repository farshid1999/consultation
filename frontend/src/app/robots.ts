import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/staff", "/member", "/login", "/register"],
    },
    sitemap: "https://zehnavard.com/sitemap.xml",
  };
}