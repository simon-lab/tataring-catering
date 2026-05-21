import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrderTable } from "@/components/admin/order-table";
import { ORDER_STATUSES } from "@/lib/constants";

export const metadata = { title: "Pesanan — Admin TATARING" };

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status = "semua" } = await searchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;

  let query = db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (status !== "semua") query = query.eq("status", status);

  const { data } = await query;
  const orders = data ?? [];

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Pesanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} pesanan ditemukan
        </p>
      </div>

      {/* Filter status */}
      <div className="flex flex-wrap gap-2">
        {[{ value: "semua", label: "Semua" }, ...ORDER_STATUSES].map((s) => (
          <a
            key={s.value}
            href={s.value === "semua" ? "/admin/orders" : `/admin/orders?status=${s.value}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              status === s.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat...</p>}>
        <OrderTable orders={orders} />
      </Suspense>
    </div>
  );
}
