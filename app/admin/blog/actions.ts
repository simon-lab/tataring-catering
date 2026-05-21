"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, estimateReadTime } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createAdminClient() as any;

export interface BlogFormData {
  title: string;
  category: string;
  excerpt: string;
  body: string;
  author_name: string;
  thumbnail: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
}

export async function createPost(form: BlogFormData) {
  await db().from("blog_posts").insert({
    title: form.title,
    slug: slugify(form.title),
    category: form.category,
    excerpt: form.excerpt || null,
    body: form.body,
    author_name: form.author_name || null,
    thumbnail: form.thumbnail || null,
    read_time_minutes: estimateReadTime(form.body),
    meta_title: form.meta_title || null,
    meta_description: form.meta_description || null,
    is_published: form.is_published,
    published_at: form.is_published ? new Date().toISOString() : null,
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(id: string, form: BlogFormData) {
  await db()
    .from("blog_posts")
    .update({
      title: form.title,
      slug: slugify(form.title),
      category: form.category,
      excerpt: form.excerpt || null,
      body: form.body,
      author_name: form.author_name || null,
      thumbnail: form.thumbnail || null,
      read_time_minutes: estimateReadTime(form.body),
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deletePost(id: string) {
  await db().from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePostPublished(id: string, is_published: boolean) {
  await db()
    .from("blog_posts")
    .update({
      is_published,
      published_at: is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
