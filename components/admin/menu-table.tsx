"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Layers, ImagePlus } from "lucide-react";
import { cn, formatRupiah, slugify } from "@/lib/utils";
import { PACKAGE_CATEGORIES } from "@/lib/constants";
import { MenuImageUploader } from "./menu-image-uploader";
import {
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageActive,
  type PackageFormData,
} from "@/app/admin/menu/actions";
import { VariantModal, type PackageVariant } from "./variant-modal";

interface Package {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price_per_portion: number;
  min_portion: number;
  max_portion: number;
  contents: string[] | null;
  variants: unknown | null;
  badge: string | null;
  images: string[] | null;
  is_active: boolean;
}

const BADGE_OPTIONS = [
  { value: "", label: "Tidak ada" },
  { value: "best_seller", label: "Best Seller" },
  { value: "new", label: "New" },
  { value: "promo", label: "Promo" },
];

const EMPTY_FORM: PackageFormData = {
  name: "", description: "", category: "pesta_adat",
  price_per_portion: 50000, min_portion: 20, max_portion: 500,
  contents: "", badge: "", images: [], is_active: true,
};

function pkgToForm(p: Package): PackageFormData {
  return {
    name: p.name,
    description: p.description ?? "",
    category: p.category,
    price_per_portion: p.price_per_portion,
    min_portion: p.min_portion,
    max_portion: p.max_portion,
    contents: (p.contents ?? []).join("\n"),
    badge: p.badge ?? "",
    images: p.images ?? [],
    is_active: p.is_active,
  };
}


function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="sm:col-span-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </div>
  );
}

export function MenuTable({ packages }: { packages: Package[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageFormData>(EMPTY_FORM);
  const [variantPkg, setVariantPkg] = useState<Package | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setFormError(null); setShowForm(true); };
  const openEdit   = (p: Package) => { setForm(pkgToForm(p)); setEditId(p.id); setFormError(null); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditId(null); setFormError(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = editId
        ? await updatePackage(editId, form)
        : await createPackage(form);
      if (result.error) {
        setFormError(result.error);
      } else {
        closeForm();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus paket "${name}"?`)) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deletePackage(id);
      if (result.error) setActionError(result.error);
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    setActionError(null);
    startTransition(async () => {
      const result = await togglePackageActive(id, !current);
      if (result.error) setActionError(result.error);
    });
  };

  const f = (field: keyof PackageFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const catLabel = (v: string) =>
    PACKAGE_CATEGORIES.find((c) => c.value === v)?.label ?? v;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Tambah Paket
        </button>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {/* Form panel */}
      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
          <h3 className="font-semibold text-foreground">
            {editId ? "Edit Paket" : "Tambah Paket Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nama Paket *</label>
              <input value={form.name} onChange={(e) => f("name", e.target.value)} required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              {form.name && <p className="text-xs text-muted-foreground">Slug: {slugify(form.name)}</p>}
            </div>
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Kategori *</label>
              <select value={form.category} onChange={(e) => f("category", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                {PACKAGE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Harga/Porsi (Rp) *</label>
              <input type="number" value={form.price_per_portion}
                onChange={(e) => f("price_per_portion", Number(e.target.value))} required min={1}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {/* Portions */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Min Porsi</label>
                <input type="number" value={form.min_portion}
                  onChange={(e) => f("min_portion", Number(e.target.value))} min={1}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Maks Porsi</label>
                <input type="number" value={form.max_portion}
                  onChange={(e) => f("max_portion", Number(e.target.value))} min={1}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            {/* Badge */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Badge</label>
              <select value={form.badge} onChange={(e) => f("badge", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => f("description", e.target.value)}
                rows={2} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {/* Contents */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">Isi Paket (1 item per baris)</label>
              <textarea value={form.contents} onChange={(e) => f("contents", e.target.value)}
                rows={4} placeholder="Saksang&#10;Arsik&#10;Na Niura"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {/* Image upload */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">Foto Paket</label>
              <MenuImageUploader
                images={form.images}
                onChange={(urls) => f("images", urls)}
              />
            </div>
            {/* Active */}
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="pkg-active" checked={form.is_active}
                onChange={(e) => f("is_active", e.target.checked)} className="accent-primary" />
              <label htmlFor="pkg-active" className="text-sm font-medium text-foreground">
                Aktif (tampil di halaman menu)
              </label>
            </div>
            {/* Error */}
            {formError && <ErrorBanner message={formError} />}
            {/* Buttons */}
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" disabled={isPending}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
                {isPending ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
              <button type="button" onClick={closeForm}
                className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Variant Modal */}
      {variantPkg && (
        <VariantModal
          packageId={variantPkg.id}
          packageName={variantPkg.name}
          initialVariants={(variantPkg.variants as PackageVariant[] | null) ?? []}
          onClose={() => setVariantPkg(null)}
        />
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Paket</span><span>Kategori</span><span>Harga/Porsi</span><span>Porsi</span><span>Aksi</span>
        </div>
        {packages.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">Belum ada paket.</p>
        ) : (
          <div className="divide-y divide-border">
            {packages.map((pkg) => (
              <div key={pkg.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {pkg.images && pkg.images.length > 0 ? (
                    <img src={pkg.images[0]} alt={pkg.name}
                      className="size-10 flex-shrink-0 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="size-10 flex-shrink-0 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center">
                      <ImagePlus className="size-3.5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={cn("font-medium truncate", pkg.is_active ? "text-foreground" : "text-muted-foreground line-through")}>
                      {pkg.name}
                    </p>
                    {pkg.badge && (
                      <span className="text-xs text-secondary-foreground">{pkg.badge}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{catLabel(pkg.category)}</p>
                <p>{formatRupiah(pkg.price_per_portion)}</p>
                <p className="text-xs text-muted-foreground">{pkg.min_portion}–{pkg.max_portion}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(pkg.id, pkg.is_active)}
                    title={pkg.is_active ? "Nonaktifkan" : "Aktifkan"}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted">
                    {pkg.is_active ? <ToggleRight className="size-4 text-primary" /> : <ToggleLeft className="size-4" />}
                  </button>
                  <button
                    onClick={() => setVariantPkg(pkg)}
                    title="Kelola varian"
                    className="relative flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <Layers className="size-3.5" />
                    {Array.isArray(pkg.variants) && pkg.variants.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {(pkg.variants as PackageVariant[]).length}
                      </span>
                    )}
                  </button>
                  <button onClick={() => openEdit(pkg)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id, pkg.name)}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
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
