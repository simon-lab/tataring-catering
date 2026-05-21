import { createAdminClient } from "@/lib/supabase/admin";
import { GaleriManager } from "@/components/admin/galeri-manager";

export const metadata = { title: "Galeri — Admin TATARING" };

export default async function AdminGaleriPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const { data } = await db
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Galeri</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload dan kelola foto event untuk portfolio TATARING.
        </p>
      </div>
      <GaleriManager items={data ?? []} />
    </div>
  );
}
