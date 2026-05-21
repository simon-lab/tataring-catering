"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import { EVENT_TYPES, PACKAGE_CATEGORIES } from "@/lib/constants";
import type { Package, Addon, PackageVariant } from "@/types/database";

// Mapping eventType → package category (null = tampilkan semua)
const EVENT_TO_CATEGORY: Record<string, string | null> = {
  pesta_adat: "pesta_adat",
  wedding:    "wedding",
  arisan:     "arisan",
  birthday:   "birthday",
  kantor:     "kantor",
  lainnya:    null,
};

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
}

export interface Step2Data {
  packageId: string;
  packageName: string;
  variantId?: string;
  variantName?: string;
  pricePerPortion: number;
  minPortion: number;
  maxPortion: number;
  portionCount: number;
  selectedAddons: SelectedAddon[];
  notes: string;
}

interface Props {
  packages: Package[];
  addons: Addon[];
  eventType?: string;
  defaultValues?: Partial<Step2Data>;
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
}

const PORTION_PRESETS = [20, 50, 100, 200, 500];

export function StepPackage({ packages, addons, eventType, defaultValues, onComplete, onBack }: Props) {
  const [selectedPkgId, setSelectedPkgId] = useState(defaultValues?.packageId ?? "");
  const [selectedVariantId, setSelectedVariantId] = useState(defaultValues?.variantId ?? "");
  const [portionCount, setPortionCount] = useState(defaultValues?.portionCount ?? 0);
  const [customPortion, setCustomPortion] = useState(
    defaultValues?.portionCount ? String(defaultValues.portionCount) : ""
  );
  const [useCustom, setUseCustom] = useState(false);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(
    new Set(defaultValues?.selectedAddons?.map((a) => a.id) ?? [])
  );
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const [error, setError] = useState("");

  // Filter paket berdasarkan kategori dari jenis acara yang dipilih di Step 1
  const targetCategory = eventType ? (EVENT_TO_CATEGORY[eventType] ?? null) : null;
  const filteredPackages = useMemo(() => {
    if (!targetCategory) return packages;
    const result = packages.filter((p) => p.category === targetCategory);
    return result.length > 0 ? result : packages; // fallback ke semua jika kosong
  }, [packages, targetCategory]);

  const categoryLabel =
    PACKAGE_CATEGORIES.find((c) => c.value === targetCategory)?.label ??
    EVENT_TYPES.find((e) => e.value === eventType)?.label ?? "";
  const isFiltered = targetCategory !== null && filteredPackages.length < packages.length;

  const selectedPkg = filteredPackages.find((p) => p.id === selectedPkgId) ?? null;
  const variants = (selectedPkg?.variants as PackageVariant[] | null) ?? [];
  const hasVariants = variants.length > 0;

  const activeVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const pricePerPortion = activeVariant?.price_per_portion ?? selectedPkg?.price_per_portion ?? 0;

  const activePortion = useCustom
    ? Math.max(
        selectedPkg?.min_portion ?? 1,
        Math.min(parseInt(customPortion) || 0, selectedPkg?.max_portion ?? 9999)
      )
    : portionCount;

  const validPresets = useMemo(
    () =>
      PORTION_PRESETS.filter((p) =>
        selectedPkg ? p >= selectedPkg.min_portion && p <= selectedPkg.max_portion : true
      ),
    [selectedPkg]
  );

  const toggleAddon = (id: string) =>
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPkgId(pkg.id);
    setPortionCount(pkg.min_portion);
    setUseCustom(false);
    setCustomPortion("");
    setError("");
    // Auto-select variant terpopuler jika ada
    const pkgVariants = (pkg.variants as PackageVariant[] | null) ?? [];
    const defaultVariant = pkgVariants.find((v) => v.is_popular) ?? pkgVariants[0];
    setSelectedVariantId(defaultVariant?.id ?? "");
  };

  const handleNext = () => {
    if (!selectedPkgId) {
      setError("Pilih paket terlebih dahulu");
      return;
    }
    if (hasVariants && !selectedVariantId) {
      setError("Pilih varian paket terlebih dahulu");
      return;
    }
    if (!activePortion || activePortion < (selectedPkg?.min_portion ?? 1)) {
      setError(`Jumlah porsi minimal ${selectedPkg?.min_portion ?? 1}`);
      return;
    }
    if (selectedPkg && activePortion > selectedPkg.max_portion) {
      setError(`Jumlah porsi maksimal ${selectedPkg.max_portion}`);
      return;
    }
    setError("");

    const activeAddons = addons
      .filter((a) => selectedAddonIds.has(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));

    onComplete({
      packageId: selectedPkgId,
      packageName: selectedPkg!.name,
      variantId: activeVariant?.id,
      variantName: activeVariant?.name,
      pricePerPortion,
      minPortion: selectedPkg!.min_portion,
      maxPortion: selectedPkg!.max_portion,
      portionCount: activePortion,
      selectedAddons: activeAddons,
      notes,
    });
  };

  return (
    <div className="space-y-8">
      {/* ── 1. Pilih Paket ── */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <h3 className="font-semibold text-foreground">
            Pilih Paket <span className="text-destructive">*</span>
          </h3>
          {isFiltered && categoryLabel && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {categoryLabel}
            </span>
          )}
        </div>
        {filteredPackages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada paket tersedia saat ini.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredPackages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => handleSelectPackage(pkg)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  selectedPkgId === pkg.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                )}
              >
                <p
                  className={cn(
                    "font-heading text-base",
                    selectedPkgId === pkg.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {pkg.name}
                </p>
                {pkg.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </p>
                )}
                <p
                  className={cn(
                    "mt-2 text-sm font-bold",
                    selectedPkgId === pkg.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {formatRupiah(pkg.price_per_portion)}
                  <span className="font-normal text-muted-foreground">/porsi</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {pkg.min_portion}–{pkg.max_portion} porsi
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 2. Pilih Varian (muncul jika paket dipilih & ada varian) ── */}
      {selectedPkg && hasVariants && (
        <div>
          <h3 className="mb-3 font-semibold text-foreground">
            Pilih Varian <span className="text-destructive">*</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {variants.map((v) => {
              const isActive = selectedVariantId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantId(v.id);
                    setError("");
                  }}
                  className={cn(
                    "relative rounded-xl border p-4 text-left transition-all",
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  {v.is_popular && (
                    <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-foreground">
                      <Flame className="size-2.5" />
                      Terpopuler
                    </span>
                  )}
                  <p
                    className={cn(
                      "font-heading text-sm leading-snug",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {v.name}
                  </p>
                  {v.tagline && (
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {v.tagline}
                    </p>
                  )}
                  <p
                    className={cn(
                      "mt-2 text-sm font-bold",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {formatRupiah(v.price_per_portion)}
                    <span className="font-normal text-muted-foreground">/porsi</span>
                  </p>
                  {/* Isi varian */}
                  {v.contents && v.contents.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {v.contents.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-xs text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Jumlah Porsi ── */}
      {selectedPkg && (
        <div>
          <h3 className="mb-3 font-semibold text-foreground">
            Jumlah Porsi{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (min. {selectedPkg.min_portion} — maks. {selectedPkg.max_portion})
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {validPresets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPortionCount(p);
                  setUseCustom(false);
                }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  !useCustom && portionCount === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                )}
              >
                {p} porsi
              </button>
            ))}
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                useCustom
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
              )}
            >
              Custom
            </button>
          </div>
          {useCustom && (
            <input
              type="number"
              value={customPortion}
              onChange={(e) => setCustomPortion(e.target.value)}
              min={selectedPkg.min_portion}
              max={selectedPkg.max_portion}
              placeholder={`${selectedPkg.min_portion}–${selectedPkg.max_portion} porsi`}
              className="mt-3 w-44 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          )}

          {/* Live price preview */}
          {(activePortion > 0 || useCustom) && pricePerPortion > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Estimasi:{" "}
              <span className="font-semibold text-foreground">
                {formatRupiah(activePortion * pricePerPortion)}
              </span>{" "}
              ({activePortion} × {formatRupiah(pricePerPortion)})
            </p>
          )}
        </div>
      )}

      {/* ── 4. Add-on ── */}
      {addons.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold text-foreground">
            Add-on{" "}
            <span className="text-xs font-normal text-muted-foreground">(opsional)</span>
          </h3>
          <div className="space-y-2">
            {addons.map((addon) => (
              <label
                key={addon.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="checkbox"
                  checked={selectedAddonIds.has(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="mt-0.5 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{addon.name}</p>
                  {addon.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{addon.description}</p>
                  )}
                </div>
                <p className="shrink-0 text-sm font-semibold text-primary">
                  +{formatRupiah(addon.price)}/porsi
                </p>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Catatan ── */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Catatan Khusus{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (alergi, request menu, dll)
          </span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Misal: ada tamu vegetarian, tidak suka pedas, dll."
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
          Kembali
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Lanjut ke Lokasi
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
