"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_SLOT_CAPACITY } from "@/lib/constants";
import { translateDbError, OK, type ActionResult } from "@/lib/supabase/errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export async function updateDefaultCapacity(capacity: number): Promise<ActionResult> {
  const { error } = await db()
    .from("site_config")
    .upsert({ key: "default_slot_capacity", value: String(capacity) });
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
  return OK;
}

export async function blockDate(date: string, reason: string): Promise<ActionResult> {
  const supabase = db();
  const { data } = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  let error;
  if (data?.id) {
    ({ error } = await supabase
      .from("availability")
      .update({ is_blocked: true, block_reason: reason || null, updated_at: new Date().toISOString() })
      .eq("date", date));
  } else {
    ({ error } = await supabase.from("availability").insert({
      date,
      is_blocked: true,
      block_reason: reason || null,
      max_slots: DEFAULT_SLOT_CAPACITY,
      booked_slots: 0,
    }));
  }
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
  return OK;
}

export async function unblockDate(date: string): Promise<ActionResult> {
  const { error } = await db()
    .from("availability")
    .update({ is_blocked: false, block_reason: null, updated_at: new Date().toISOString() })
    .eq("date", date);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
  return OK;
}

export async function updateBookedSlots(
  date: string,
  bookedSlots: number,
  maxSlots: number
): Promise<ActionResult> {
  const supabase = db();
  const capped = Math.max(0, Math.min(bookedSlots, maxSlots));

  const { data } = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  let error;
  if (data?.id) {
    ({ error } = await supabase
      .from("availability")
      .update({ booked_slots: capped, updated_at: new Date().toISOString() })
      .eq("date", date));
  } else {
    ({ error } = await supabase.from("availability").insert({
      date,
      is_blocked: false,
      block_reason: null,
      max_slots: maxSlots,
      booked_slots: capped,
    }));
  }
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
  return OK;
}

export async function setCapacity(date: string, maxSlots: number): Promise<ActionResult> {
  const supabase = db();
  const { data } = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  let error;
  if (data?.id) {
    ({ error } = await supabase
      .from("availability")
      .update({ max_slots: maxSlots, updated_at: new Date().toISOString() })
      .eq("date", date));
  } else {
    ({ error } = await supabase.from("availability").insert({
      date,
      is_blocked: false,
      block_reason: null,
      max_slots: maxSlots,
      booked_slots: 0,
    }));
  }
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/ketersediaan");
  revalidatePath("/ketersediaan");
  return OK;
}
