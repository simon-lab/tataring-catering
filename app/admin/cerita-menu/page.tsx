import { createAdminClient } from "@/lib/supabase/admin";
import { CeritaMenuTable } from "@/components/admin/cerita-menu-table";

export const metadata = { title: "Cerita Menu — Admin TATARING" };

export default async function AdminCeritaMenuPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const { data } = await db
    .from("menu_stories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Cerita Menu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tulis kisah di balik hidangan — filosofi, tradisi, dan keunikan setiap menu Batak.
        </p>
      </div>
      <CeritaMenuTable stories={data ?? []} />
    </div>
  );
}
