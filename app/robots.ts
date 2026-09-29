import type { MetadataRoute } from "next";

const BASE = "https://portofolio.muramsyah.biz.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/masuk", "/auth/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
