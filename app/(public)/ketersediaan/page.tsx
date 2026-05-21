import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import {
  AvailabilityCalendar,
  type AvailRecord,
} from "@/components/ketersediaan/availability-calendar";
import { SITE_NAME, DEFAULT_SLOT_CAPACITY } from "@/lib/constants";
import type { Availability } from "@/types/database";

export const metadata: Metadata = {
  title: `Cek Ketersediaan Tanggal — ${SITE_NAME}`,
  description:
    "Cek ketersediaan tanggal sebelum memesan catering TATARING. Pilih tanggal acaramu dan lihat apakah slot masih tersedia.",
};

export default async function KetersediaanPage() {
  const supabase = await createClient();

  const today = new Date();
  const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const endDate3mo = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
  const endDate = `${endDate3mo.getFullYear()}-${String(endDate3mo.getMonth() + 1).padStart(2, "0")}-${String(endDate3mo.getDate()).padStart(2, "0")}`;

  const [availRes, configRes] = await Promise.all([
    supabase
      .from("availability")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "default_slot_capacity")
      .maybeSingle(),
  ]);

  const configValue = (configRes.data as unknown as { value: string } | null)?.value;
  const defaultSlotCapacity = configValue
    ? parseInt(configValue) || DEFAULT_SLOT_CAPACITY
    : DEFAULT_SLOT_CAPACITY;

  const availabilityMap: Record<string, AvailRecord> = {};
  for (const rec of (availRes.data ?? []) as Availability[]) {
    availabilityMap[rec.date] = {
      max_slots: rec.max_slots,
      booked_slots: rec.booked_slots,
      is_blocked: rec.is_blocked,
      block_reason: rec.block_reason,
    };
  }

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Jadwal & Pemesanan
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">
            Cek Ketersediaan Tanggal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pilih tanggal acara dan lihat apakah slot masih tersedia. Kami menerima
            maksimum{" "}
            <span className="font-semibold text-foreground">
              {defaultSlotCapacity} event per hari
            </span>
            .
          </p>
        </div>
      </div>

      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <AvailabilityCalendar
            availabilityMap={availabilityMap}
            defaultSlotCapacity={defaultSlotCapacity}
          />
        </div>
      </SectionWrapper>
    </>
  );
}
