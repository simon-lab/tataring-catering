"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export interface TestimoniFormData {
  customer_name: string;
  event_type: string;
  rating: number;
  review: string;
  customer_photo: string;
  is_published: boolean;
}

export async function createTestimoni(form: TestimoniFormData) {
  await db().from("testimonials").insert({
    customer_name: form.customer_name,
    event_type: form.event_type || null,
    rating: form.rating,
    review: form.review,
    customer_photo: form.customer_photo || null,
    is_published: form.is_published,
  });
  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");
}

export async function updateTestimoni(id: string, form: TestimoniFormData) {
  await db()
    .from("testimonials")
    .update({
      customer_name: form.customer_name,
      event_type: form.event_type || null,
      rating: form.rating,
      review: form.review,
      customer_photo: form.customer_photo || null,
      is_published: form.is_published,
    })
    .eq("id", id);
  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");
}

export async function deleteTestimoni(id: string) {
  await db().from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");
}

export async function toggleTestimoniPublished(id: string, is_published: boolean) {
  await db().from("testimonials").update({ is_published }).eq("id", id);
  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");
}
