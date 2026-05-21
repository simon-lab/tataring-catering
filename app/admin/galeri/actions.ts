"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export async function addGalleryItem(
  imageUrl: string,
  caption: string,
  eventType: string,
  eventDate: string
) {
  await db().from("gallery").insert({
    image_url: imageUrl,
    caption: caption || null,
    event_type: eventType || null,
    event_date: eventDate || null,
    display_order: 0,
  });
  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
}

export async function deleteGalleryItem(id: string) {
  await db().from("gallery").delete().eq("id", id);
  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
}

export async function updateGalleryItem(
  id: string,
  caption: string,
  eventType: string,
  eventDate: string
) {
  await db()
    .from("gallery")
    .update({
      caption: caption || null,
      event_type: eventType || null,
      event_date: eventDate || null,
    })
    .eq("id", id);
  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
}
