import { createAdminClient } from "@/lib/supabase/admin";
import { AvailabilityManager } from "@/components/admin/availability-manager";
import { DefaultCapacityEditor } from "@/components/admin/default-capacity-editor";
import { DEFAULT_SLOT_CAPACITY } from "@/lib/constants";
import type { Availability } from "@/types/database";
import type { AvailRecord } from "@/components/ketersediaan/availability-calendar";

export const metadata = {
  title: "Kelola Ketersediaan — Admin TATARING",
};

export default async function AdminKetersediaanPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

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

  const defaultSlotCapacity = configRes.data?.value
    ? parseInt(configRes.data.value) || DEFAULT_SLOT_CAPACITY
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Kelola Ketersediaan</h1>
        <p className="mt-1 text-muted-foreground">
          Tandai tanggal libur, atur kapasitas slot, dan pantau ketersediaan event harian.
        </p>
      </div>

      {/* Pengaturan kapasitas default */}
      <DefaultCapacityEditor current={defaultSlotCapacity} />

      {/* Kalender */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <AvailabilityManager
          availabilityMap={availabilityMap}
          defaultSlotCapacity={defaultSlotCapacity}
        />
      </div>
    </div>
  );
}
