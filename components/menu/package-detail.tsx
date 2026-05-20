"use client";

import { useState, useMemo } from "react";
import { Users, Calculator } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Package, Addon } from "@/types/database";

const PORTION_PRESETS = [20, 50, 100, 200, 500];

export function PackageDetail({
  pkg,
  addons,
}: {
  pkg: Package;
  addons: Addon[];
}) {
  const [portion, setPortion] = useState(pkg.min_portion);
  const [customPortion, setCustomPortion] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [guestCount, setGuestCount] = useState("");

  const activePortion = useCustom
    ? Math.max(pkg.min_portion, Math.min(parseInt(customPortion) || pkg.min_portion, pkg.max_portion))
    : portion;

  const selectedAddonItems = addons.filter((a) => selectedAddons.has(a.id));
  const addonTotal = selectedAddonItems.reduce((sum, a) => sum + a.price * activePortion, 0);
  const baseTotal = activePortion * pkg.price_per_portion;
  const grandTotal = baseTotal + addonTotal;

  const suggestedPortion = useMemo(() => {
    const n = parseInt(guestCount);
    if (!n || n <= 0) return null;
    return Math.ceil(n * 1.1);
  }, [guestCount]);

  const validPresets = PORTION_PRESETS.filter(
    (p) => p >= pkg.min_portion && p <= pkg.max_portion
  );

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleOrder = () => {
    const addonNames =
      selectedAddonItems.length > 0
        ? selectedAddonItems.map((a) => a.name).join(", ")
        : "-";

    const message = `Halo TATARING CATERING, saya tertarik dengan:

Paket: ${pkg.name}
Porsi: ${activePortion} porsi
Add-on: ${addonNames}

Estimasi Total: ${formatRupiah(grandTotal)}

Mohon info lebih lanjut ya. Terima kasih! Horas!`;

    window.open(buildWhatsAppUrl(message, WHATSAPP_NUMBER), "_blank");
  };

  const contents = (pkg.contents as string[] | null) ?? [];

  return (
    <div className="space-y-8">
      {/* Isi paket */}
      {contents.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Isi Paket</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {contents.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pilih porsi */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Pilih Jumlah Porsi
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (min. {pkg.min_portion} — maks. {pkg.max_portion})
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {validPresets.map((p) => (
            <button
              key={p}
              onClick={() => { setPortion(p); setUseCustom(false); }}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                !useCustom && portion === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
              )}
            >
              {p} porsi
            </button>
          ))}
          <button
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
            min={pkg.min_portion}
            max={pkg.max_portion}
            placeholder={`${pkg.min_portion}–${pkg.max_portion} porsi`}
            className="mt-3 w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}
      </div>

      {/* Kalkulator porsi */}
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="size-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Kalkulator Porsi</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="Jumlah tamu..."
              min={1}
              className="w-40 rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {suggestedPortion && (
            <div className="text-sm">
              <span className="text-muted-foreground">Saran: </span>
              <button
                onClick={() => {
                  if (suggestedPortion <= pkg.max_portion) {
                    setCustomPortion(String(suggestedPortion));
                    setUseCustom(true);
                  }
                }}
                className="font-semibold text-primary hover:underline"
              >
                {suggestedPortion} porsi
              </button>
              <span className="text-muted-foreground text-xs ml-1">(+10% buffer)</span>
              {suggestedPortion > pkg.max_portion && (
                <p className="text-xs text-destructive mt-1">
                  Melebihi kapasitas maks. hubungi kami untuk custom.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add-on */}
      {addons.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Add-on</h3>
          <div className="space-y-2">
            {addons.map((addon) => (
              <label
                key={addon.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="checkbox"
                  checked={selectedAddons.has(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="mt-0.5 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{addon.name}</p>
                  {addon.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{addon.description}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-primary shrink-0">
                  +{formatRupiah(addon.price)}/porsi
                </p>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price summary */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{activePortion} porsi × {formatRupiah(pkg.price_per_portion)}</span>
          <span>{formatRupiah(baseTotal)}</span>
        </div>
        {selectedAddonItems.map((a) => (
          <div key={a.id} className="flex justify-between text-sm text-muted-foreground">
            <span>{a.name} ({activePortion} porsi)</span>
            <span>+{formatRupiah(a.price * activePortion)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3 flex justify-between items-baseline">
          <span className="text-sm font-medium text-foreground">Estimasi Total</span>
          <span className="font-heading text-2xl text-primary">{formatRupiah(grandTotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Harga estimasi. Konfirmasi final via WhatsApp.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleOrder}
        className="w-full rounded-xl py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#25D366" }}
      >
        Pesan via WhatsApp
      </button>
    </div>
  );
}
