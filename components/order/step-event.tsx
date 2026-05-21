"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { EVENT_TYPES } from "@/lib/constants";
import { cn, toLocalDateStr } from "@/lib/utils";

type AvailStatus = "available" | "full" | "blocked" | "past" | null;

async function checkAvailability(date: string): Promise<{ status: AvailStatus; message: string }> {
  try {
    const res = await fetch(`/api/availability/${date}`);
    if (!res.ok) return { status: null, message: "" };
    return await res.json();
  } catch {
    return { status: null, message: "" };
  }
}

const schema = z.object({
  customerName: z.string().min(1, "Nama wajib diisi"),
  customerPhone: z.string().min(9, "Nomor WhatsApp wajib diisi"),
  customerEmail: z.string().optional(),
  eventType: z.string().min(1, "Jenis acara wajib dipilih"),
  eventDate: z.string().min(1, "Tanggal acara wajib diisi"),
  eventTime: z.string().min(1, "Waktu acara wajib diisi"),
});

export type Step1Data = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Step1Data>;
  onComplete: (data: Step1Data) => void;
}

export function StepEvent({ defaultValues, onComplete }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      ...defaultValues,
    },
  });

  const [availStatus, setAvailStatus] = useState<AvailStatus>(null);
  const [availMessage, setAvailMessage] = useState("");
  const watchedDate = useWatch({ control, name: "eventDate" });

  useEffect(() => {
    if (!watchedDate) { setAvailStatus(null); return; }
    checkAvailability(watchedDate).then(({ status, message }) => {
      setAvailStatus(status);
      setAvailMessage(message);
    });
  }, [watchedDate]);

  const today = toLocalDateStr(new Date());

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Nama */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Nama Lengkap <span className="text-destructive">*</span>
          </label>
          <input
            {...register("customerName")}
            placeholder="Nama lengkap Anda"
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
              errors.customerName ? "border-destructive" : "border-border"
            )}
          />
          {errors.customerName && (
            <p className="text-xs text-destructive">{errors.customerName.message}</p>
          )}
        </div>

        {/* Nomor WA */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Nomor WhatsApp <span className="text-destructive">*</span>
          </label>
          <input
            {...register("customerPhone")}
            type="tel"
            placeholder="08xxxxxxxxxx"
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
              errors.customerPhone ? "border-destructive" : "border-border"
            )}
          />
          {errors.customerPhone && (
            <p className="text-xs text-destructive">{errors.customerPhone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Email <span className="text-xs text-muted-foreground">(opsional)</span>
          </label>
          <input
            {...register("customerEmail")}
            type="email"
            placeholder="email@contoh.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Jenis Acara */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Jenis Acara <span className="text-destructive">*</span>
          </label>
          <select
            {...register("eventType")}
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
              errors.eventType ? "border-destructive" : "border-border"
            )}
          >
            <option value="">Pilih jenis acara...</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.eventType && (
            <p className="text-xs text-destructive">{errors.eventType.message}</p>
          )}
        </div>

        {/* Tanggal Acara */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Tanggal Acara <span className="text-destructive">*</span>
          </label>
          <input
            {...register("eventDate")}
            type="date"
            min={today}
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
              errors.eventDate ? "border-destructive" : "border-border"
            )}
          />
          {errors.eventDate && (
            <p className="text-xs text-destructive">{errors.eventDate.message}</p>
          )}
          {availStatus && availMessage && (
            <p
              className={cn(
                "text-xs font-medium",
                availStatus === "available" && "text-accent",
                availStatus === "full" && "text-destructive",
                availStatus === "blocked" && "text-muted-foreground"
              )}
            >
              {availStatus === "available" && "✓ "}
              {availStatus === "full" && "✗ "}
              {availStatus === "blocked" && "🌴 "}
              {availMessage}
            </p>
          )}
        </div>

        {/* Waktu Acara */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Waktu Acara <span className="text-destructive">*</span>
          </label>
          <input
            {...register("eventTime")}
            type="time"
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
              errors.eventTime ? "border-destructive" : "border-border"
            )}
          />
          {errors.eventTime && (
            <p className="text-xs text-destructive">{errors.eventTime.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Lanjut ke Pilih Paket
          <ChevronRight className="size-4" />
        </button>
      </div>
    </form>
  );
}
