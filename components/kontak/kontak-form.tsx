"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function KontakForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const text = `Halo TATARING CATERING!\n\nNama: ${name.trim()}\nPesan: ${message.trim()}`;
    window.open(buildWhatsAppUrl(text, WHATSAPP_NUMBER), "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="kontak-name" className="text-sm font-medium text-foreground">
          Nama
        </label>
        <input
          id="kontak-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="kontak-message" className="text-sm font-medium text-foreground">
          Pesan
        </label>
        <textarea
          id="kontak-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Tulis pesanmu di sini..."
          required
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="size-4" />
        Kirim via WhatsApp
      </button>
    </form>
  );
}
