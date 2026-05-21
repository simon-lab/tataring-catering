"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  deliveryAddress: z.string().min(5, "Alamat lengkap wajib diisi (minimal 5 karakter)"),
  city: z.string().min(2, "Kota wajib diisi"),
});

export type Step3Data = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Step3Data>;
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
}

export function StepLocation({ defaultValues, onComplete, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryAddress: "",
      city: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-5">
      {/* Kota */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Kota / Kabupaten <span className="text-destructive">*</span>
        </label>
        <input
          {...register("city")}
          placeholder="contoh: Medan, Deli Serdang"
          className={cn(
            "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
            errors.city ? "border-destructive" : "border-border"
          )}
        />
        {errors.city && (
          <p className="text-xs text-destructive">{errors.city.message}</p>
        )}
      </div>

      {/* Alamat */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Alamat Lengkap <span className="text-destructive">*</span>
        </label>
        <textarea
          {...register("deliveryAddress")}
          rows={4}
          placeholder="Nama jalan, nomor, kelurahan, kecamatan..."
          className={cn(
            "w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
            errors.deliveryAddress ? "border-destructive" : "border-border"
          )}
        />
        {errors.deliveryAddress && (
          <p className="text-xs text-destructive">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <p className="rounded-lg bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
        Estimasi biaya pengiriman akan dikonfirmasi oleh admin via WhatsApp setelah pesanan diterima.
      </p>

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
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Lanjut ke Review
          <ChevronRight className="size-4" />
        </button>
      </div>
    </form>
  );
}
