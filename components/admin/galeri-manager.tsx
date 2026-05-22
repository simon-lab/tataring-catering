"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/lib/constants";
import { addGalleryItem, deleteGalleryItem } from "@/app/admin/galeri/actions";
import { StoryHeroUploader } from "@/components/admin/story-hero-uploader";

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
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [saveError, setSaveError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setSaveError("");
    startTransition(async () => {
      const result = await addGalleryItem(imageUrl, caption, eventType, eventDate);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setImageUrl(""); setCaption(""); setEventType(""); setEventDate("");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    setDeleteError("");
    startTransition(async () => {
      const result = await deleteGalleryItem(id);
      if (result.error) setDeleteError(result.error);
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Tambah Foto</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-foreground">Foto *</label>
            <StoryHeroUploader
              value={imageUrl}
              onChange={setImageUrl}
              storagePath="gallery"
            />
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
          {saveError && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">
              {saveError}
            </p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" disabled={!imageUrl || isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
              <Plus className="size-4" />
              {isPending ? "Menyimpan..." : "Tambah ke Galeri"}
            </button>
          </div>
        </form>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {deleteError}
        </div>
      )}

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
              <div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="text-xs text-white space-y-0.5">
                  {item.caption && <p className="font-medium">{item.caption}</p>}
                  {item.event_type && <p className="opacity-75">{eventLabel(item.event_type)}</p>}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={cn(
                    "self-end flex size-7 items-center justify-center rounded-lg bg-destructive/80 text-white hover:bg-destructive transition-colors",
                    isPending && "opacity-50 pointer-events-none"
                  )}
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
