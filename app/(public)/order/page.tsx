import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { OrderWizard } from "@/components/order/order-wizard";
import { SITE_NAME } from "@/lib/constants";
import type { Package, Addon } from "@/types/database";

export const metadata: Metadata = {
  title: `Pesan Catering — ${SITE_NAME}`,
  description:
    "Pesan catering Batak TATARING untuk acara adat, wedding, arisan, dan perayaan di Bandung. Isi form pemesanan dan admin kami akan menghubungi kamu via WhatsApp.",
};

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const { date } = await searchParams;
  const supabase = await createClient();

  const [pkgsResult, addonsResult] = await Promise.all([
    supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("badge", { ascending: true, nullsFirst: false }),
    supabase.from("addons").select("*").eq("is_active", true),
  ]);

  const packages = (pkgsResult.data ?? []) as Package[];
  const addons = (addonsResult.data ?? []) as Addon[];

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Formulir Pemesanan
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">Pesan Catering</h1>
          <p className="mt-2 text-muted-foreground">
            Isi form di bawah — setelah submit, kamu akan diarahkan ke WhatsApp admin untuk
            konfirmasi final. Horas! 🎉
          </p>
        </div>
      </div>

      <OrderWizard packages={packages} addons={addons} prefillDate={date} />
    </>
  );
}
