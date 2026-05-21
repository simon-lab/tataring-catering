import { createAdminClient } from "@/lib/supabase/admin";
import { MenuTable } from "@/components/admin/menu-table";

export const metadata = { title: "Menu & Paket — Admin TATARING" };

export default async function AdminMenuPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const { data } = await db
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Menu & Paket</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola paket catering yang tampil di halaman publik.
        </p>
      </div>
      <MenuTable packages={data ?? []} />
    </div>
  );
}
