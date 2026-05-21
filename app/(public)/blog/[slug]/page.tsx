import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Calendar, Clock, User } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArticleCard } from "@/components/blog/article-card";
import { ArticleToc, type TocHeading } from "@/components/blog/article-toc";
import { ArticleShare } from "@/components/blog/article-share";
import { BodyRenderer } from "@/components/blog/body-renderer";
import { BLOG_CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/database";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Heading utilities ────────────────────────────────────────────────────────

function toId(text: string) {
  return text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[2-4])([^>]*)>([\s\S]*?)<\/h[2-4]>/gi,
    (_, tag, attrs, content) => {
      if (/id=/.test(attrs)) return `<${tag}${attrs}>${content}</${tag}>`;
      return `<${tag}${attrs} id="${toId(content)}">${content}</${tag}>`;
    }
  );
}

function extractHeadings(html: string): TocHeading[] {
  const result: TocHeading[] = [];
  const re = /<h([2-4])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h[2-4]>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    result.push({
      level: parseInt(m[1]),
      id: m[2],
      text: m[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return result;
}

// ── generateStaticParams ─────────────────────────────────────────────────────

export async function generateStaticParams() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return ((data ?? []) as { slug: string }[]).map((p) => ({ slug: p.slug }));
}

// ── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const post = data as BlogPost | null;
  if (!post) return { title: "Artikel tidak ditemukan" };

  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt ?? undefined;
  const image = post.og_image ?? post.thumbnail ?? undefined;

  return {
    title: `${title} — ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const [postResult, relatedResult] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single(),
    // Fetch related after getting the post — resolved below
    Promise.resolve(null),
  ]);

  const post = postResult.data as BlogPost | null;
  if (!post) notFound();

  // Related articles (same category, exclude current)
  const { data: relatedData } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);
  const related = (relatedData ?? []) as BlogPost[];

  // Process body for headings & ToC
  const isHtml = /<[a-z][\s\S]*>/i.test(post.body);
  const processedBody = isHtml ? addHeadingIds(post.body) : post.body;
  const headings = isHtml ? extractHeadings(processedBody) : [];

  const categoryLabel =
    BLOG_CATEGORIES.find((c) => c.value === post.category)?.label ?? post.category;

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  // Schema.org Article JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.og_image ?? post.thumbnail ?? undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author_name ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronDown className="size-3.5 -rotate-90" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronDown className="size-3.5 -rotate-90" />
          <span className="truncate text-foreground font-medium">{post.title}</span>
        </nav>

        {/* Hero image */}
        {post.thumbnail && (
          <div className="mb-10 aspect-video overflow-hidden rounded-2xl bg-muted">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Article header */}
        <header className="mb-8 max-w-3xl">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {categoryLabel}
          </span>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}

          {/* Meta info */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.author_name && (
              <span className="flex items-center gap-1.5">
                {post.author_photo ? (
                  <img
                    src={post.author_photo}
                    alt={post.author_name}
                    className="size-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="size-4" />
                )}
                {post.author_name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.read_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {post.read_time_minutes} menit baca
              </span>
            )}
          </div>

          <div className="mt-5">
            <ArticleShare url={canonicalUrl} title={post.title} />
          </div>

          <div className="mt-6 h-px bg-border" />
        </header>

        {/* Body + ToC */}
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_220px]">
          <div>
            <BodyRenderer body={processedBody} className="max-w-3xl" />

            {/* Share (bottom) */}
            <div className="mt-10 border-t border-border pt-6">
              <ArticleShare url={canonicalUrl} title={post.title} />
            </div>
          </div>

          {/* ToC sidebar */}
          {headings.length > 0 && <ArticleToc headings={headings} />}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <p className="font-heading text-2xl text-foreground">
            Siap hadirkan cita rasa Batak di acaramu?
          </p>
          <p className="mt-2 text-muted-foreground">
            Pesan catering TATARING sekarang dan buat momen jadi tak terlupakan.
          </p>
          <Link
            href="/order"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Pesan Catering Sekarang
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-heading text-2xl text-foreground">Artikel Terkait</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.id} post={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
