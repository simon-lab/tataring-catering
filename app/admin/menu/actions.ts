"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { translateDbError, OK, type ActionResult } from "@/lib/supabase/errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export interface PackageFormData {
  name: string;
  description: string;
  category: string;
  price_per_portion: number;
  min_portion: number;
  max_portion: number;
  contents: string;   // newline-separated → akan di-split jadi array
  badge: string;
  images: string[];   // URL array, diupload dari client
  is_active: boolean;
}

function parseContents(raw: string): string[] {
  return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

export async function createPackage(form: PackageFormData): Promise<ActionResult> {
  const { error } = await db().from("packages").insert({
    name: form.name,
    slug: slugify(form.name),
    description: form.description || null,
    category: form.category,
    price_per_portion: form.price_per_portion,
    min_portion: form.min_portion,
    max_portion: form.max_portion,
    contents: parseContents(form.contents),
    badge: form.badge || null,
    images: form.images,
    is_active: form.is_active,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/menu");
  revalidatePath("/menu", "layout");
  return OK;
}

export async function updatePackage(id: string, form: PackageFormData): Promise<ActionResult> {
  const { error } = await db()
    .from("packages")
    .update({
      name: form.name,
      slug: slugify(form.name),
      description: form.description || null,
      category: form.category,
      price_per_portion: form.price_per_portion,
      min_portion: form.min_portion,
      max_portion: form.max_portion,
      contents: parseContents(form.contents),
      badge: form.badge || null,
      images: form.images,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/menu");
  revalidatePath("/menu", "layout");
  return OK;
}

export async function deletePackage(id: string): Promise<ActionResult> {
  const { error } = await db().from("packages").delete().eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/menu");
  revalidatePath("/menu", "layout");
  return OK;
}

export async function saveVariants(packageId: string, variants: unknown[]): Promise<ActionResult> {
  const { error } = await db()
    .from("packages")
    .update({ variants, updated_at: new Date().toISOString() })
    .eq("id", packageId);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/menu");
  revalidatePath("/menu", "layout");
  return OK;
}

export async function togglePackageActive(id: string, is_active: boolean): Promise<ActionResult> {
  const { error } = await db()
    .from("packages")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: translateDbError(error.message) };
  revalidatePath("/admin/menu");
  revalidatePath("/menu", "layout");
  return OK;
}
