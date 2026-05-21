"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export async function updateOrderStatus(id: string, status: string) {
  await db()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function updateOrderNote(id: string, adminNote: string) {
  await db()
    .from("orders")
    .update({ admin_note: adminNote, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/orders");
}
