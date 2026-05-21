"use client";

import { useState } from "react";
import { MessageCircle, Link as LinkIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ArticleShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const shareWA = () => {
    const text = `${title}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Bagikan:</span>
      <button
        onClick={shareWA}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <MessageCircle className="size-3.5" />
        WhatsApp
      </button>
      <button
        onClick={copyLink}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
          copied
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-foreground hover:bg-muted"
        )}
      >
        {copied ? <Check className="size-3.5" /> : <LinkIcon className="size-3.5" />}
        {copied ? "Disalin!" : "Salin Link"}
      </button>
    </div>
  );
}
