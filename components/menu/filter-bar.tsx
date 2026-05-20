"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { PACKAGE_CATEGORIES } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "default",   label: "Terlaris" },
  { value: "termurah",  label: "Harga Termurah" },
  { value: "termahal",  label: "Harga Termahal" },
];

const ALL_CATEGORIES = [
  { value: "semua", label: "Semua" },
  ...PACKAGE_CATEGORIES,
];

export function FilterBar({
  activeKategori,
  activeSort,
  total,
}: {
  activeKategori: string;
  activeSort: string;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "semua" || value === "default") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/menu?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Kategori chips — scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeKategori === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateParam("kategori", cat.value)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground/70 hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            );
          })}

          {/* Sort — pushed to right */}
          <div className="ml-auto shrink-0">
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="mt-2 text-xs text-muted-foreground">
          {total} paket ditemukan
        </p>
      </div>
    </div>
  );
}
