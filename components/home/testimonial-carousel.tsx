"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/database";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-secondary text-secondary" : "fill-muted text-muted"
          )}
          style={i < rating ? { color: "oklch(0.72 0.12 72)" } : undefined}
        />
      ))}
    </div>
  );
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
            >
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6">
                {/* Rating */}
                <StarRating rating={t.rating ?? 5} />

                {/* Review */}
                <p className="flex-1 text-sm leading-relaxed text-foreground/80 italic">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Customer */}
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="relative size-10 overflow-hidden rounded-full bg-muted shrink-0">
                    {t.customer_photo && (
                      <Image
                        src={t.customer_photo}
                        alt={t.customer_name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.customer_name}
                    </p>
                    {t.event_type && (
                      <p className="text-xs capitalize text-muted-foreground">
                        {t.event_type.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={scrollPrev}
          aria-label="Sebelumnya"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronDown className="size-4 rotate-90" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Berikutnya"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronDown className="size-4 -rotate-90" />
        </button>
      </div>
    </div>
  );
}
