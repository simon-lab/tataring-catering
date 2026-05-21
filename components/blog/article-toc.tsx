"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      let current = headings[0]?.id ?? "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.offsetTop <= scrollY) current = h.id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Daftar Isi
        </p>
        <nav>
          <ul className="space-y-1.5 border-l-2 border-border pl-3">
            {headings.map((h) => (
              <li
                key={h.id}
                style={{ paddingLeft: `${(h.level - 2) * 10}px` }}
              >
                <a
                  href={`#${h.id}`}
                  className={cn(
                    "block text-sm leading-snug transition-colors hover:text-primary",
                    activeId === h.id
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
