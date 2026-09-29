import type { MetadataRoute } from "next";

const BASE = "https://portofolio.muramsyah.biz.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/galeri", "/video", "/tentang", "/kontak", "/masuk"];
  const now = new Date();
  return pages.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
