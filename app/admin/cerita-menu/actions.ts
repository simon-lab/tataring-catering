"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { translateDbError, OK, type ActionResult } from "@/lib/supabase/errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export interface CeritaMenuFormData {
  title: string;
  excerpt: string;
  body: string;
  hero_image: string;
  is_published: boolean;
}

export async function createCerita(form: CeritaMenuFormData): Promise<ActionResult> {
  const { error } = await db().from("menu_stories").insert({
    title: form.title,
    slug: slugify(form.title),
    excerpt: form.excerpt || null,
    body: form.body || null,
    hero_image: form.hero_image || null,
    is_published: form.is_published,
  });
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/cerita-menu");
  revalidatePath("/cerita-menu");
  return OK;
}

export async function updateCerita(id: string, form: CeritaMenuFormData): Promise<ActionResult> {
  const { error } = await db()
    .from("menu_stories")
    .update({
      title: form.title,
      slug: slugify(form.title),
      excerpt: form.excerpt || null,
      body: form.body || null,
      hero_image: form.hero_image || null,
      is_published: form.is_published,
    })
    .eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/cerita-menu");
  revalidatePath("/cerita-menu");
  return OK;
}

export async function deleteCerita(id: string): Promise<ActionResult> {
  const { error } = await db().from("menu_stories").delete().eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/cerita-menu");
  revalidatePath("/cerita-menu");
  return OK;
}

export async function toggleCeritaPublished(id: string, is_published: boolean): Promise<ActionResult> {
  const { error } = await db().from("menu_stories").update({ is_published }).eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/cerita-menu");
  revalidatePath("/cerita-menu");
  return OK;
}
