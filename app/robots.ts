import type { MetadataRoute } from "next";

const BASE = "https://portofolio-fotografer.vercel.app";

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
