import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { SITE_NAME } from "@/lib/constants";
import type { MenuStory } from "@/types/database";

export const metadata: Metadata = {
  title: `Cerita di Balik Menu — ${SITE_NAME}`,
  description:
    "Kenali filosofi dan makna di balik setiap masakan Batak TATARING — dari saksang hingga arsik, setiap hidangan menyimpan cerita dan tradisi.",
};

export default async function CeritaMenuPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_stories")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const stories = (data ?? []) as MenuStory[];

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Filosofi & Makna
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">
            Cerita di Balik Menu
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Setiap hidangan Batak bukan sekadar makanan — ia adalah tradisi, filosofi, dan
            kasih sayang yang disajikan di atas piring. Kenali lebih dalam.
          </p>
        </div>
      </div>

      <SectionWrapper>
        {stories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-2xl text-foreground">Cerita segera hadir</p>
            <p className="text-muted-foreground">
              Kami sedang menyiapkan konten storytelling terbaik untuk kamu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/cerita-menu/${story.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                {/* Hero image */}
                <div className="aspect-video bg-muted overflow-hidden">
                  {story.hero_image ? (
                    <img
                      src={story.hero_image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <span className="font-heading text-4xl text-primary/30">T</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-heading text-xl text-foreground group-hover:text-primary transition-colors">
                    {story.title}
                  </h2>
                  {story.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {story.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                    Baca selengkapnya
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
