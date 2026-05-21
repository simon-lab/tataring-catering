"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_SLOT_CAPACITY } from "@/lib/constants";

export async function updateDefaultCapacity(capacity: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;
  await supabase
    .from("site_config")
    .upsert({ key: "default_slot_capacity", value: String(capacity) });
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export async function blockDate(date: string, reason: string) {
  const supabase = db();
  const { data } = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (data?.id) {
    await supabase
      .from("availability")
      .update({ is_blocked: true, block_reason: reason || null, updated_at: new Date().toISOString() })
      .eq("date", date);
  } else {
    await supabase.from("availability").insert({
      date,
      is_blocked: true,
      block_reason: reason || null,
      max_slots: DEFAULT_SLOT_CAPACITY,
      booked_slots: 0,
    });
  }
}

export async function unblockDate(date: string) {
  const supabase = db();
  await supabase
    .from("availability")
    .update({ is_blocked: false, block_reason: null, updated_at: new Date().toISOString() })
    .eq("date", date);
}

export async function updateBookedSlots(
  date: string,
  bookedSlots: number,
  maxSlots: number
) {
  const supabase = db();
  // Pastikan tidak melebihi kapasitas
  const capped = Math.max(0, Math.min(bookedSlots, maxSlots));

  const { data } = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (data?.id) {
    await supabase
      .from("availability")
      .update({ booked_slots: capped, updated_at: new Date().toISOString() })
      .eq("date", date);
  } else {
    await supabase.from("availability").insert({
      date,
      is_blocked: false,
      block_reason: null,
      max_slots: maxSlots,
      booked_slots: capped,
    });
  }
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
}

export async function setCapacity(date: string, maxSlots: number) {
  const supabase = db();
  const { data } = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (data?.id) {
    await supabase
      .from("availability")
      .update({ max_slots: maxSlots, updated_at: new Date().toISOString() })
      .eq("date", date);
  } else {
    await supabase.from("availability").insert({
      date,
      is_blocked: false,
      block_reason: null,
      max_slots: maxSlots,
      booked_slots: 0,
    });
  }
}
