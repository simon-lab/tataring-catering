"use client";

import { useState, useTransition } from "react";
import { X, Plus, Trash2, Star, CheckCircle2 } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { saveVariants } from "@/app/admin/menu/actions";

export interface PackageVariant {
  id: string;
  name: string;
  tagline: string;
  price_per_portion: number;
  contents: string[];
  is_popular?: boolean;
}

interface Props {
  packageId: string;
  packageName: string;
  initialVariants: PackageVariant[];
  onClose: () => void;
}

function emptyVariant(): PackageVariant {
  return {
    id: crypto.randomUUID(),
    name: "",
    tagline: "",
    price_per_portion: 0,
    contents: [],
    is_popular: false,
  };
}

export function VariantModal({
  packageId,
  packageName,
  initialVariants,
  onClose,
}: Props) {
  const [variants, setVariants] = useState<PackageVariant[]>(initialVariants);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const add = () => setVariants((prev) => [...prev, emptyVariant()]);

  const remove = (id: string) =>
    setVariants((prev) => prev.filter((v) => v.id !== id));

  const update = (id: string, patch: Partial<PackageVariant>) =>
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } : v))
    );

  const setPopular = (id: string) =>
    setVariants((prev) =>
      prev.map((v) => ({ ...v, is_popular: v.id === id }))
    );

  const handleSave = () => {
    startTransition(async () => {
      await saveVariants(packageId, variants);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 900);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-heading text-xl text-foreground">Varian Paket</h2>
            <p className="text-sm text-muted-foreground">{packageName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {variants.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Paket ini belum punya varian. Klik "+ Tambah Varian" untuk mulai.
            </p>
          ) : (
            variants.map((v, i) => (
              <div
                key={v.id}
                className={cn(
                  "rounded-xl border p-4 space-y-3 transition-colors",
                  v.is_popular
                    ? "border-secondary/50 bg-secondary/5"
                    : "border-border"
                )}
              >
                {/* Row header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Varian {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPopular(v.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        v.is_popular
                          ? "bg-secondary/20 text-secondary-foreground"
                          : "border border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Star
                        className={cn(
                          "size-3",
                          v.is_popular && "fill-secondary text-secondary"
                        )}
                      />
                      {v.is_popular ? "Terpopuler" : "Tandai Terpopuler"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(v.id)}
                      className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Nama Varian *
                    </label>
                    <input
                      value={v.name}
                      onChange={(e) => update(v.id, { name: e.target.value })}
                      placeholder="cth: Basic, Premium, Royal"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Harga/Porsi (Rp) *
                    </label>
                    <input
                      type="number"
                      value={v.price_per_portion}
                      onChange={(e) =>
                        update(v.id, {
                          price_per_portion: Number(e.target.value),
                        })
                      }
                      min={0}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Tagline
                    </label>
                    <input
                      value={v.tagline}
                      onChange={(e) =>
                        update(v.id, { tagline: e.target.value })
                      }
                      placeholder="cth: Pilihan hemat untuk acara sederhana"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Isi Varian{" "}
                      <span className="font-normal text-muted-foreground">
                        (1 item per baris)
                      </span>
                    </label>
                    <textarea
                      value={v.contents.join("\n")}
                      onChange={(e) =>
                        update(v.id, {
                          contents: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      rows={3}
                      placeholder={"Saksang\nArsik\nNa Niura"}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Price preview */}
                {v.price_per_portion > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Preview:{" "}
                    <span className="font-semibold text-foreground">
                      {formatRupiah(v.price_per_portion)}/porsi
                    </span>
                  </p>
                )}
              </div>
            ))
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={add}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" />
            Tambah Varian
          </button>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {variants.length} varian &middot; hanya 1 bisa ditandai Terpopuler
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="size-4" /> Tersimpan!
                </>
              ) : (
                <>{isPending ? "Menyimpan..." : "Simpan Varian"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
