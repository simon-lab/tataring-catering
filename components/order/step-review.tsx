"use client";

import { useState } from "react";
import { ChevronLeft, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { generateOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { EVENT_TYPES } from "@/lib/constants";
import type { Step1Data } from "./step-event";
import type { Step2Data } from "./step-package";
import type { Step3Data } from "./step-location";

interface Props {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  onBack: () => void;
  onSuccess: (orderNumber: string) => void;
}

export function StepReview({ step1, step2, step3, onBack, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const addonTotal = step2.selectedAddons.reduce(
    (sum, a) => sum + a.price * step2.portionCount,
    0
  );
  const baseTotal = step2.portionCount * step2.pricePerPortion;
  const grandTotal = baseTotal + addonTotal;

  const eventTypeLabel =
    EVENT_TYPES.find((t) => t.value === step1.eventType)?.label ?? step1.eventType;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: step1.customerName,
          customerPhone: step1.customerPhone,
          customerEmail: step1.customerEmail,
          eventType: step1.eventType,
          eventDate: step1.eventDate,
          eventTime: step1.eventTime,
          packageId: step2.packageId,
          portionCount: step2.portionCount,
          addons: step2.selectedAddons,
          deliveryAddress: `${step3.city} — ${step3.deliveryAddress}`,
          notes: step2.notes,
          estimatedTotal: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Gagal menyimpan pesanan. Coba lagi.");
        setSubmitting(false);
        return;
      }

      const packageLabel = step2.variantName
        ? `${step2.packageName} — ${step2.variantName}`
        : step2.packageName;

      const message = generateOrderMessage({
        customerName: step1.customerName,
        eventDate: formatDate(step1.eventDate),
        eventType: eventTypeLabel,
        packageName: packageLabel,
        portionCount: step2.portionCount,
        addons: step2.selectedAddons.map((a) => a.name),
        deliveryAddress: `${step3.city} — ${step3.deliveryAddress}`,
        notes: step2.notes,
        estimatedTotal: grandTotal,
      });

      const waUrl = buildWhatsAppUrl(message);
      window.open(waUrl, "_blank");

      onSuccess(data.orderNumber);
    } catch {
      setSubmitError("Koneksi bermasalah. Periksa internet dan coba lagi.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail Acara */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-semibold text-foreground">Detail Acara</h3>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Row label="Nama" value={step1.customerName} />
          <Row label="WhatsApp" value={step1.customerPhone} />
          {step1.customerEmail && <Row label="Email" value={step1.customerEmail} />}
          <Row label="Jenis Acara" value={eventTypeLabel} />
          <Row label="Tanggal" value={formatDate(step1.eventDate)} />
          <Row label="Waktu" value={step1.eventTime} />
        </dl>
      </section>

      {/* Detail Pesanan */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-semibold text-foreground">Detail Pesanan</h3>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Row label="Paket" value={step2.packageName} />
          {step2.variantName && <Row label="Varian" value={step2.variantName} />}
          <Row label="Jumlah Porsi" value={`${step2.portionCount} porsi`} />
          {step2.selectedAddons.length > 0 && (
            <Row
              label="Add-on"
              value={step2.selectedAddons.map((a) => a.name).join(", ")}
            />
          )}
          {step2.notes && <Row label="Catatan" value={step2.notes} />}
        </dl>
      </section>

      {/* Lokasi */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-semibold text-foreground">Lokasi Pengiriman</h3>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Row label="Kota" value={step3.city} />
          <Row label="Alamat" value={step3.deliveryAddress} />
        </dl>
      </section>

      {/* Estimasi Harga */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-semibold text-foreground">Estimasi Harga</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              {step2.portionCount} porsi × {formatRupiah(step2.pricePerPortion)}
              {step2.variantName && (
                <span className="ml-1 text-xs">({step2.variantName})</span>
              )}
            </span>
            <span>{formatRupiah(baseTotal)}</span>
          </div>
          {step2.selectedAddons.map((a) => (
            <div key={a.id} className="flex justify-between text-muted-foreground">
              <span>
                {a.name} ({step2.portionCount} porsi)
              </span>
              <span>+{formatRupiah(a.price * step2.portionCount)}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <span className="font-medium text-foreground">Estimasi Total</span>
            <span className="font-heading text-2xl text-primary">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Harga estimasi belum termasuk biaya pengiriman. Konfirmasi final via WhatsApp.
        </p>
      </section>

      {submitError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <ChevronLeft className="size-4" />
          Kembali
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#25D366" }}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <MessageCircle className="size-4" />
              Kirim ke WhatsApp Admin
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Dengan menekan tombol di atas, data pesananmu tersimpan dan WhatsApp admin akan terbuka
        secara otomatis.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
