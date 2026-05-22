"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn, slugify, formatDate } from "@/lib/utils";
import {
  createCerita, updateCerita, deleteCerita, toggleCeritaPublished,
  type CeritaMenuFormData,
} from "@/app/admin/cerita-menu/actions";
import { StoryHeroUploader } from "@/components/admin/story-hero-uploader";

interface MenuStory {
  id: string;
  title: string;
  slug: string;
  hero_image: string | null;
  excerpt: string | null;
  body: string | null;
  is_published: boolean;
  created_at: string;
}

const EMPTY: CeritaMenuFormData = {
  title: "", excerpt: "", body: "", hero_image: "", is_published: false,
};

function toForm(s: MenuStory): CeritaMenuFormData {
  return {
    title: s.title, excerpt: s.excerpt ?? "", body: s.body ?? "",
    hero_image: s.hero_image ?? "", is_published: s.is_published,
  };
}

export function CeritaMenuTable({ stories }: { stories: MenuStory[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CeritaMenuFormData>(EMPTY);
  const [isPending, startTransition] = useTransition();
  const [excerptLen, setExcerptLen] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => {
    setForm(EMPTY); setEditId(null); setFormError(null);
    setExcerptLen(0); setShowForm(true);
  };
  const openEdit = (s: MenuStory) => {
    setForm(toForm(s)); setEditId(s.id); setFormError(null);
    setExcerptLen(s.excerpt?.length ?? 0); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setFormError(null); };

  const f = (field: keyof CeritaMenuFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = editId
        ? await updateCerita(editId, form)
        : await createCerita(form);
      if (result.error) {
        setFormError(result.error);
      } else {
        closeForm();
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus cerita "${title}"?`)) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteCerita(id);
      if (result.error) setActionError(result.error);
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    setActionError(null);
    startTransition(async () => {
      const result = await toggleCeritaPublished(id, !current);
      if (result.error) setActionError(result.error);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> Tulis Cerita
        </button>
      </div>

      {actionError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
          <h3 className="font-semibold text-foreground">
            {editId ? "Edit Cerita" : "Cerita Baru"}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Judul */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Judul *</label>
              <input
                value={form.title}
                onChange={(e) => f("title", e.target.value)}
                required
                placeholder="Cth: Saksang: Lebih dari Sekadar Masakan"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              {form.title && (
                <p className="text-xs text-muted-foreground">Slug: /cerita-menu/{slugify(form.title)}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium flex justify-between">
                Ringkasan
                <span className={cn("text-muted-foreground", excerptLen > 160 && "text-destructive")}>
                  {excerptLen}/160
                </span>
              </label>
              <textarea
                value={form.excerpt}
                rows={2}
                onChange={(e) => { f("excerpt", e.target.value); setExcerptLen(e.target.value.length); }}
                placeholder="Deskripsi singkat yang muncul di kartu cerita dan halaman daftar"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Hero Image */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Foto Hero (opsional)</label>
              <StoryHeroUploader
                value={form.hero_image}
                onChange={(url) => f("hero_image", url)}
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Isi Cerita</label>
              <textarea
                value={form.body}
                onChange={(e) => f("body", e.target.value)}
                rows={12}
                placeholder={"Tulis cerita di sini...\n\nBuat paragraf baru dengan baris kosong di antara paragraf."}
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Pisahkan paragraf dengan baris kosong (tekan Enter dua kali).
              </p>
            </div>

            {/* Publish */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cerita-pub"
                checked={form.is_published}
                onChange={(e) => f("is_published", e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="cerita-pub" className="text-sm font-medium">Publikasikan sekarang</label>
            </div>

            {formError && (
              <div className="sm:col-span-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : editId ? "Simpan" : "Publikasikan"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Judul</span><span>Status</span><span>Aksi</span>
        </div>
        {stories.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Belum ada cerita menu.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {stories.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[2fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className={cn("font-medium truncate", !s.is_published && "text-muted-foreground")}>
                    {s.title}
                  </p>
                  {s.excerpt ? (
                    <p className="text-xs text-muted-foreground truncate">{s.excerpt}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">{formatDate(s.created_at)}</p>
                  )}
                </div>
                <span className={cn(
                  "w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  s.is_published ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                )}>
                  {s.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(s.id, s.is_published)}
                    title={s.is_published ? "Jadikan draft" : "Publish"}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {s.is_published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
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
