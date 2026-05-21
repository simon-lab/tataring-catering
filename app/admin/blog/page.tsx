import { createAdminClient } from "@/lib/supabase/admin";
import { BlogTable } from "@/components/admin/blog-table";

export const metadata = { title: "Blog — Admin TATARING" };

export default async function AdminBlogPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const { data } = await db
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Blog & Artikel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tulis dan kelola artikel untuk mendatangkan organic traffic.
        </p>
      </div>
      <BlogTable posts={data ?? []} />
    </div>
  );
}
