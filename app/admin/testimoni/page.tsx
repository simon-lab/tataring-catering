import { createAdminClient } from "@/lib/supabase/admin";
import { TestimoniTable } from "@/components/admin/testimoni-table";

export const metadata = { title: "Testimoni — Admin TATARING" };

export default async function AdminTestimoniPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const { data } = await db
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Testimoni</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola ulasan customer yang tampil di halaman publik.
        </p>
      </div>
      <TestimoniTable testimonials={data ?? []} />
    </div>
  );
}
