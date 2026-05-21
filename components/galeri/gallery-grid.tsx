"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { EVENT_TYPES } from "@/lib/constants";
import type { GalleryItem } from "@/types/database";

const FILTERS = [{ value: "semua", label: "Semua" }, ...EVENT_TYPES];

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeFilter === "semua"
      ? items
      : items.filter((i) => i.event_type === activeFilter);

  const eventLabel = (v: string) =>
    EVENT_TYPES.find((t) => t.value === v)?.label ?? v;

  return (
    <>
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

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          Belum ada foto untuk kategori ini.
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="group relative mb-4 block w-full overflow-hidden rounded-xl break-inside-avoid"
            >
              <div className="aspect-[4/3] bg-muted">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.caption ?? "Foto event TATARING CATERING"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>
              {/* Caption overlay */}
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 px-4 pb-4 pt-8 transition-transform duration-200 group-hover:translate-y-0">
                  <p className="text-sm font-medium text-white">{item.caption}</p>
                  {item.event_type && (
                    <p className="mt-0.5 text-xs text-white/70">
                      {eventLabel(item.event_type)}
                      {item.event_date && ` · ${formatDate(item.event_date)}`}
                    </p>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            type="button"
            aria-label="Tutup"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.image_url}
              alt={lightboxItem.caption ?? ""}
              className="max-h-[82vh] max-w-full rounded-xl object-contain"
            />
            {(lightboxItem.caption || lightboxItem.event_date) && (
              <div className="mt-3 text-center">
                {lightboxItem.caption && (
                  <p className="font-medium text-white">{lightboxItem.caption}</p>
                )}
                {lightboxItem.event_type && (
                  <p className="text-sm text-white/60">
                    {eventLabel(lightboxItem.event_type)}
                    {lightboxItem.event_date && ` · ${formatDate(lightboxItem.event_date)}`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
