"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/lib/constants";
import type { Testimonial } from "@/types/database";

const FILTERS = [{ value: "semua", label: "Semua" }, ...EVENT_TYPES];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "size-5" : "size-3.5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            cls,
            i < rating ? "fill-secondary text-secondary" : "fill-border text-border"
          )}
        />
      ))}
    </div>
  );
}

export function TestimoniGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeFilter, setActiveFilter] = useState("semua");

  const filtered =
    activeFilter === "semua"
      ? testimonials
      : testimonials.filter((t) => t.event_type === activeFilter);

  const totalWithRating = testimonials.filter((t) => t.rating != null).length;
  const avgRating =
    totalWithRating > 0
      ? testimonials.reduce((s, t) => s + (t.rating ?? 0), 0) / totalWithRating
      : null;

  const eventLabel = (v: string) =>
    EVENT_TYPES.find((t) => t.value === v)?.label ?? v;

  return (
    <>
      {/* Rating summary */}
      {avgRating != null && (
        <div className="mb-10 flex items-center gap-5 rounded-xl border border-border bg-card p-6 w-fit">
          <span className="font-heading text-5xl text-primary leading-none">
            {avgRating.toFixed(1)}
          </span>
          <div>
            <StarRating rating={Math.round(avgRating)} size="lg" />
            <p className="mt-1.5 text-sm text-muted-foreground">
              dari {totalWithRating} ulasan
            </p>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary hover:text-primary"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Belum ada testimoni untuk kategori ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <article
              key={t.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              {/* Customer header */}
              <div className="mb-4 flex items-start gap-3">
                {t.customer_photo ? (
                  <img
                    src={t.customer_photo}
                    alt={t.customer_name}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-semibold text-primary">
                      {t.customer_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{t.customer_name}</p>
                  {t.event_type && (
                    <p className="text-xs text-muted-foreground">{eventLabel(t.event_type)}</p>
                  )}
                  {t.rating != null && (
                    <div className="mt-1">
                      <StarRating rating={t.rating} />
                    </div>
                  )}
                </div>
              </div>

              {/* Review text */}
              <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.review}&rdquo;
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
