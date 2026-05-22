import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { MenuStory } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_stories")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  const story = data as MenuStory | null;
  if (!story) return { title: "Cerita tidak ditemukan" };

  return {
    title: `${story.title} — ${SITE_NAME}`,
    description: story.excerpt ?? undefined,
    openGraph: {
      title: story.title,
      description: story.excerpt ?? undefined,
      images: story.hero_image ? [{ url: story.hero_image }] : [],
    },
  };
}

export default async function CeritaMenuDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("menu_stories")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  const story = data as MenuStory | null;
  if (!story) notFound();

  // Split body by double newline for paragraph rendering
  const paragraphs = story.body
    ? story.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
        <ChevronDown className="size-3.5 -rotate-90" />
        <Link href="/cerita-menu" className="hover:text-primary transition-colors">Cerita Menu</Link>
        <ChevronDown className="size-3.5 -rotate-90" />
        <span className="truncate text-foreground font-medium">{story.title}</span>
      </nav>

      {/* Hero image */}
      {story.hero_image && (
        <div className="mb-8 overflow-hidden rounded-2xl aspect-video bg-muted">
          <img
            src={story.hero_image}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <header className="mb-8">
        <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
          {story.title}
        </h1>
        {story.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{story.excerpt}</p>
        )}
        <div className="mt-6 h-0.5 w-16 bg-primary" />
      </header>

      {/* Body */}
      {paragraphs.length > 0 ? (
        <div className="prose-tataring space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/85">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Konten sedang disiapkan.</p>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
        <p className="font-heading text-xl text-foreground">
          Ingin mencicipi langsung?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Pesan catering TATARING dan hadirkan cita rasa Batak otentik di acaramu.
        </p>
        <Link
          href="/order"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Pesan Catering Sekarang
        </Link>
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/cerita-menu"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Cerita Menu
        </Link>
      </div>
    </article>
  );
}
