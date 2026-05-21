import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/lib/constants";
import type { BlogPost } from "@/types/database";

const categoryLabel = (v: string) =>
  BLOG_CATEGORIES.find((c) => c.value === v)?.label ?? v;

export function ArticleCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md lg:grid-cols-2"
      >
        {/* Thumbnail */}
        <div className="aspect-video overflow-hidden bg-muted lg:aspect-auto lg:min-h-[280px]">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="font-heading text-6xl text-primary/20">T</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 lg:py-8">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {categoryLabel(post.category)}
            </span>
            <span className="text-xs font-semibold text-secondary">Featured</span>
          </div>
          <h2 className="mt-3 font-heading text-2xl leading-snug text-foreground group-hover:text-primary transition-colors lg:text-3xl">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {post.read_time_minutes} menit baca
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden bg-muted">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="font-heading text-4xl text-primary/20">T</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {categoryLabel(post.category)}
        </span>
        <h3 className="mt-2 font-heading text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(post.published_at)}
            </span>
          )}
          {post.read_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.read_time_minutes} mnt
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
