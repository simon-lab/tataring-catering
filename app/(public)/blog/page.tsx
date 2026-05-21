import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogFilter } from "@/components/blog/blog-filter";
import { SITE_NAME } from "@/lib/constants";
import type { BlogPost } from "@/types/database";

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description:
    "Artikel seputar budaya Batak, resep masakan, tips event, dan cerita di balik dapur TATARING CATERING. Baca, pelajari, dan rayakan budaya Batak bersama kami.",
};

const PER_PAGE = 9;

interface PageProps {
  searchParams: Promise<{ kategori?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { kategori = "semua", page: pageParam = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageParam) || 1);
  const offset = (page - 1) * PER_PAGE;

  const supabase = await createClient();

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (kategori !== "semua") query = query.eq("category", kategori);

  // Fetch one extra to detect next page
  const { data } = await query.range(offset, offset + PER_PAGE);
  const posts = (data ?? []) as BlogPost[];
  const hasNext = posts.length > PER_PAGE;
  const pagePosts = posts.slice(0, PER_PAGE);

  // Featured: first article on page 1 only
  const featured = page === 1 ? pagePosts[0] ?? null : null;
  const gridPosts = page === 1 ? pagePosts.slice(1) : pagePosts;

  // Total count for filter display
  let countQuery = supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);
  if (kategori !== "semua") countQuery = countQuery.eq("category", kategori);
  const { count } = await countQuery;

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Cerita & Inspirasi
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Resep Batak, tips event, budaya & tradisi, dan cerita di balik dapur TATARING.
          </p>
        </div>
      </div>

      {/* Filter — Suspense karena useSearchParams */}
      <Suspense>
        <BlogFilter active={kategori} total={count ?? 0} />
      </Suspense>

      <SectionWrapper>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-2xl text-foreground">
              Belum ada artikel untuk kategori ini
            </p>
            <p className="text-muted-foreground">
              Coba pilih kategori lain atau{" "}
              <Link href="/blog" className="text-primary hover:underline">
                lihat semua artikel
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured article (page 1 only) */}
            {featured && <ArticleCard post={featured} featured />}

            {/* Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {(page > 1 || hasNext) && (
              <div className="flex items-center justify-center gap-4 pt-4">
                {page > 1 && (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(kategori !== "semua" ? { kategori } : {}),
                      ...(page - 1 > 1 ? { page: String(page - 1) } : {}),
                    }).toString()}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="size-4" />
                    Sebelumnya
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">Halaman {page}</span>
                {hasNext && (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(kategori !== "semua" ? { kategori } : {}),
                      page: String(page + 1),
                    }).toString()}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Berikutnya
                    <ChevronRight className="size-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
