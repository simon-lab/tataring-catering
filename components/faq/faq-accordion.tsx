"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ_DATA } from "@/lib/faq-data";

export function FaqAccordion() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="space-y-10">
      {FAQ_DATA.map((cat) => (
        <div key={cat.label}>
          <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl text-foreground">
            <span aria-hidden>{cat.icon}</span>
            {cat.label}
          </h2>
          <div className="space-y-2">
            {cat.items.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-border transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border bg-muted/20 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
