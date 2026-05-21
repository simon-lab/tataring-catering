"use client";

import { useState, useTransition } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { updateDefaultCapacity } from "@/app/admin/ketersediaan/actions";

export function DefaultCapacityEditor({ current }: { current: number }) {
  const [capacity, setCapacity] = useState(current);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (capacity < 1) return;
    startTransition(async () => {
      await updateDefaultCapacity(capacity);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Kapasitas Default Harian</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Jumlah maksimum event yang bisa diterima per hari. Berlaku untuk semua tanggal
          yang belum diatur kapasitasnya secara manual. Perubahan langsung terlihat di
          halaman publik.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={capacity}
            onChange={(e) =>
              setCapacity(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
            }
            min={1}
            max={20}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-center text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-sm text-muted-foreground">event per hari</span>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || capacity === current}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saved ? (
            <>
              <CheckCircle2 className="size-4" />
              Tersimpan!
            </>
          ) : (
            <>
              <Save className="size-4" />
              {isPending ? "Menyimpan..." : "Simpan"}
            </>
          )}
        </button>
      </div>

      {/* Preview caption */}
      <p className="mt-4 rounded-lg bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground">
        Preview caption publik:{" "}
        <span className="font-medium text-foreground">
          "Kami menerima maksimum{" "}
          <span className="text-primary">{capacity} event per hari</span>."
        </span>
      </p>
    </div>
  );
}
