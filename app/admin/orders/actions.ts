"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateDbError, OK, type ActionResult } from "@/lib/supabase/errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export async function updateOrderStatus(id: string, status: string): Promise<ActionResult> {
  const { error } = await db()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  return OK;
}

export async function updateOrderNote(id: string, adminNote: string): Promise<ActionResult> {
  const { error } = await db()
    .from("orders")
    .update({ admin_note: adminNote, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/orders");
  return OK;
}
