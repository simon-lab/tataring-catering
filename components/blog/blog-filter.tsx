"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/lib/constants";

const FILTERS = [{ value: "semua", label: "Semua" }, ...BLOG_CATEGORIES];

export function BlogFilter({ active, total }: { active: string; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "semua") {
        params.delete("kategori");
      } else {
        params.set("kategori", value);
      }
      params.delete("page");
      router.push(`/blog?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground/70 hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{total} artikel</p>
      </div>
    </div>
  );
}
