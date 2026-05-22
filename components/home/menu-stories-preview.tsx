"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { useLanguage } from "@/lib/i18n/context";
import type { MenuStory } from "@/types/database";

function StoryCard({ story }: { story: MenuStory }) {
  const { t } = useLanguage();
  const image = story.hero_image ?? `https://picsum.photos/seed/${story.slug}/800/500`;

  return (
    <Link
      href={`/cerita-menu/${story.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={image}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {t("stories.card_label")}
        </p>
        <h3 className="font-heading text-xl text-foreground group-hover:text-primary transition-colors">
          {story.title}
        </h3>
        {story.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{story.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export function MenuStoriesPreview({ stories }: { stories: MenuStory[] }) {
  const { t } = useLanguage();
  if (stories.length === 0) return null;

  return (
    <SectionWrapper className="bg-muted/50">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t("stories.overline")}
          </p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">
            {t("stories.headline")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("stories.subtext")}
          </p>
        </div>
        <Link href="/cerita-menu" className={buttonVariants({ variant: "outline" })}>
          {t("stories.view_all")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </SectionWrapper>
  );
}
