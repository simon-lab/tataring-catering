import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  const [postsResult, packagesResult, storiesResult] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("is_published", true),
    supabase
      .from("packages")
      .select("slug, updated_at")
      .eq("is_active", true),
    supabase
      .from("menu_stories")
      .select("slug, created_at")
      .eq("is_published", true),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/order`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/cerita-menu`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/ketersediaan`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/galeri`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/testimoni`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/tentang-kami`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = (
    (postsResult.data ?? []) as { slug: string; updated_at: string }[]
  ).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const menuRoutes: MetadataRoute.Sitemap = (
    (packagesResult.data ?? []) as { slug: string; updated_at: string }[]
  ).map((p) => ({
    url: `${SITE_URL}/menu/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const storyRoutes: MetadataRoute.Sitemap = (
    (storiesResult.data ?? []) as { slug: string; created_at: string }[]
  ).map((s) => ({
    url: `${SITE_URL}/cerita-menu/${s.slug}`,
    lastModified: new Date(s.created_at),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...menuRoutes, ...blogRoutes, ...storyRoutes];
}
