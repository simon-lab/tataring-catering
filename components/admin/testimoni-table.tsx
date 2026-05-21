"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/lib/constants";
import {
  createTestimoni, updateTestimoni, deleteTestimoni, toggleTestimoniPublished,
  type TestimoniFormData,
} from "@/app/admin/testimoni/actions";

interface Testimoni {
  id: string; customer_name: string; customer_photo: string | null;
  event_type: string | null; rating: number | null; review: string; is_published: boolean;
}

const EMPTY: TestimoniFormData = {
  customer_name: "", event_type: "", rating: 5, review: "", customer_photo: "", is_published: false,
};

function toForm(t: Testimoni): TestimoniFormData {
  return {
    customer_name: t.customer_name, event_type: t.event_type ?? "",
    rating: t.rating ?? 5, review: t.review, customer_photo: t.customer_photo ?? "",
    is_published: t.is_published,
  };
}

const eventLabel = (v: string | null) => EVENT_TYPES.find((t) => t.value === v)?.label ?? "—";

export function TestimoniTable({ testimonials }: { testimonials: Testimoni[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimoniFormData>(EMPTY);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit   = (t: Testimoni) => { setForm(toForm(t)); setEditId(t.id); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditId(null); };
  const f = (field: keyof TestimoniFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editId) await updateTestimoni(editId, form);
      else await createTestimoni(form);
      closeForm();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="size-4" /> Tambah Testimoni
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
          <h3 className="font-semibold">{editId ? "Edit Testimoni" : "Tambah Testimoni"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Nama Customer *</label>
              <input value={form.customer_name} onChange={(e) => f("customer_name", e.target.value)} required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Jenis Acara</label>
              <select value={form.event_type} onChange={(e) => f("event_type", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">Pilih jenis acara</option>
                {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Rating (1–5)</label>
              <select value={form.rating} onChange={(e) => f("rating", Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{"★".repeat(r)} ({r})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">URL Foto (opsional)</label>
              <input value={form.customer_photo} onChange={(e) => f("customer_photo", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Ulasan *</label>
              <textarea value={form.review} onChange={(e) => f("review", e.target.value)} required rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="testi-pub" checked={form.is_published}
                onChange={(e) => f("is_published", e.target.checked)} className="accent-primary" />
              <label htmlFor="testi-pub" className="text-sm font-medium">Tampilkan di website</label>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" disabled={isPending}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
                {isPending ? "Menyimpan..." : "Simpan"}
              </button>
              <button type="button" onClick={closeForm}
                className="rounded-xl border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Customer</span><span>Acara</span><span>Rating</span><span>Status</span><span>Aksi</span>
        </div>
        {testimonials.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">Belum ada testimoni.</p>
        ) : (
          <div className="divide-y divide-border">
            {testimonials.map((t) => (
              <div key={t.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{t.customer_name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{t.review}</p>
                </div>
                <p className="text-xs text-muted-foreground">{eventLabel(t.event_type)}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating ?? 0 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-secondary text-secondary" />
                  ))}
                </div>
                <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  t.is_published ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground")}>
                  {t.is_published ? "Tampil" : "Tersembunyi"}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => startTransition(() => toggleTestimoniPublished(t.id, !t.is_published))}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
                    {t.is_published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                  <button onClick={() => openEdit(t)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => { if (confirm(`Hapus testimoni dari "${t.customer_name}"?`)) startTransition(() => deleteTestimoni(t.id)); }}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
