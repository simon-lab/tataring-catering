"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn, formatDate, slugify } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/lib/constants";
import {
  createPost, updatePost, deletePost, togglePostPublished,
  type BlogFormData,
} from "@/app/admin/blog/actions";

interface BlogPost {
  id: string; title: string; slug: string; category: string;
  excerpt: string | null; author_name: string | null; thumbnail: string | null;
  body: string; meta_title: string | null; meta_description: string | null;
  is_published: boolean; published_at: string | null; created_at: string;
}

const EMPTY: BlogFormData = {
  title: "", category: "resep", excerpt: "", body: "",
  author_name: "", thumbnail: "", meta_title: "", meta_description: "",
  is_published: false,
};

function postToForm(p: BlogPost): BlogFormData {
  return {
    title: p.title, category: p.category, excerpt: p.excerpt ?? "",
    body: p.body, author_name: p.author_name ?? "", thumbnail: p.thumbnail ?? "",
    meta_title: p.meta_title ?? "", meta_description: p.meta_description ?? "",
    is_published: p.is_published,
  };
}

const catLabel = (v: string) => BLOG_CATEGORIES.find((c) => c.value === v)?.label ?? v;

export function BlogTable({ posts }: { posts: BlogPost[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormData>(EMPTY);
  const [isPending, startTransition] = useTransition();
  const [excerptLen, setExcerptLen] = useState(0);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setExcerptLen(0); };
  const openEdit   = (p: BlogPost) => { setForm(postToForm(p)); setEditId(p.id); setShowForm(true); setExcerptLen(p.excerpt?.length ?? 0); };
  const closeForm  = () => { setShowForm(false); setEditId(null); };

  const f = (field: keyof BlogFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editId) await updatePost(editId, form);
      else await createPost(form);
      closeForm();
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    startTransition(() => deletePost(id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="size-4" /> Tulis Artikel
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editId ? "Edit Artikel" : "Artikel Baru"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Judul *</label>
              <input value={form.title} onChange={(e) => f("title", e.target.value)} required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              {form.title && <p className="text-xs text-muted-foreground">Slug: {slugify(form.title)}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Kategori</label>
              <select value={form.category} onChange={(e) => f("category", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Penulis</label>
              <input value={form.author_name} onChange={(e) => f("author_name", e.target.value)}
                placeholder="Nama penulis"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">URL Thumbnail</label>
              <input value={form.thumbnail} onChange={(e) => f("thumbnail", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex justify-between">
                Excerpt <span className={cn("text-muted-foreground", excerptLen > 160 && "text-destructive")}>{excerptLen}/160</span>
              </label>
              <textarea value={form.excerpt} rows={2}
                onChange={(e) => { f("excerpt", e.target.value); setExcerptLen(e.target.value.length); }}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Isi Artikel (HTML / Markdown) *</label>
              <textarea value={form.body} onChange={(e) => f("body", e.target.value)} required rows={10}
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Meta Title (SEO)</label>
              <input value={form.meta_title} onChange={(e) => f("meta_title", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Meta Description (SEO)</label>
              <input value={form.meta_description} onChange={(e) => f("meta_description", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="post-pub" checked={form.is_published}
                onChange={(e) => f("is_published", e.target.checked)} className="accent-primary" />
              <label htmlFor="post-pub" className="text-sm font-medium">Publish sekarang</label>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" disabled={isPending}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
                {isPending ? "Menyimpan..." : editId ? "Simpan" : "Publikasikan"}
              </button>
              <button type="button" onClick={closeForm}
                className="rounded-xl border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Judul</span><span>Kategori</span><span>Status</span><span>Aksi</span>
        </div>
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">Belum ada artikel.</p>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((p) => (
              <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div>
                  <p className={cn("font-medium truncate", !p.is_published && "text-muted-foreground")}>
                    {p.title}
                  </p>
                  {p.published_at && <p className="text-xs text-muted-foreground">{formatDate(p.published_at)}</p>}
                </div>
                <p className="text-xs text-muted-foreground">{catLabel(p.category)}</p>
                <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  p.is_published ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground")}>
                  {p.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => startTransition(() => togglePostPublished(p.id, !p.is_published))}
                    title={p.is_published ? "Jadikan draft" : "Publish"}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
                    {p.is_published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                  <button onClick={() => openEdit(p)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => handleDelete(p.id, p.title)}
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
