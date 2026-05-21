"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { addGalleryItem, deleteGalleryItem } from "@/app/admin/galeri/actions";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  event_type: string | null;
  event_date: string | null;
}

const eventLabel = (v: string | null) =>
  EVENT_TYPES.find((t) => t.value === v)?.label ?? "—";

export function GaleriManager({ items }: { items: GalleryItem[] }) {
  const [caption, setCaption] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `gallery/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("tataring")
        .upload(path, file, { upsert: false });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: urlData } = supabase.storage
        .from("tataring")
        .getPublicUrl(path);

      await addGalleryItem(urlData.publicUrl, caption, eventType, eventDate);

      setCaption(""); setEventType(""); setEventDate("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : "Upload gagal. Pastikan Supabase Storage bucket 'tataring' sudah dibuat."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Upload Foto Baru</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* File input */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-foreground">Pilih Foto *</label>
            <input ref={fileRef} type="file" accept="image/*" required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)}
              placeholder="Nama event / keterangan foto"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Jenis Acara</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
              <option value="">Pilih jenis acara</option>
              {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Tanggal Event</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {uploadError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive sm:col-span-2">
              {uploadError}
            </p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" disabled={uploading || isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {uploading ? "Mengupload..." : "Upload Foto"}
            </button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground">
          Pastikan bucket <code className="rounded bg-muted px-1">tataring</code> sudah dibuat di Supabase Storage dengan akses publik.
        </p>
      </div>

      {/* Gallery grid */}
      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Belum ada foto di galeri.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-muted">
              <div className="aspect-[4/3]">
                <img src={item.image_url} alt={item.caption ?? ""}
                  className="h-full w-full object-cover" loading="lazy" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="text-xs text-white space-y-0.5">
                  {item.caption && <p className="font-medium">{item.caption}</p>}
                  {item.event_type && <p className="opacity-75">{eventLabel(item.event_type)}</p>}
                </div>
                <button
                  onClick={() => { if (confirm("Hapus foto ini?")) startTransition(() => deleteGalleryItem(item.id)); }}
                  className="self-end flex size-7 items-center justify-center rounded-lg bg-destructive/80 text-white hover:bg-destructive transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
