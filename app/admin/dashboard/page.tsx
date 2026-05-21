import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatRupiah, formatDate, toLocalDateStr } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

export const metadata = { title: "Dashboard — Admin TATARING" };

const STATUS_STYLE: Record<string, string> = {
  new:       "bg-secondary/20 text-secondary-foreground",
  contacted: "bg-muted text-foreground",
  confirmed: "bg-accent/15 text-accent",
  done:      "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

export default async function AdminDashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [recentRes, monthRes, pkgRes, postRes] = await Promise.all([
    db.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
    db.from("orders").select("id,status,estimated_total").gte("created_at", firstOfMonth),
    db.from("packages").select("id").eq("is_active", true),
    db.from("blog_posts").select("id").eq("is_published", true),
  ]);

  const recentOrders = recentRes.data ?? [];
  const monthOrders = monthRes.data ?? [];
  const totalPkg = pkgRes.data?.length ?? 0;
  const totalPost = postRes.data?.length ?? 0;

  const totalMonth = monthOrders.length;
  const pending   = monthOrders.filter((o: any) => o.status === "new").length;
  const confirmed = monthOrders.filter((o: any) => o.status === "confirmed").length;
  const revenue   = monthOrders
    .filter((o: any) => ["confirmed", "done"].includes(o.status))
    .reduce((s: number, o: any) => s + (o.estimated_total ?? 0), 0);

  const stats = [
    { label: "Order Bulan Ini",      value: String(totalMonth),      sub: "total masuk" },
    { label: "Menunggu Konfirmasi",  value: String(pending),         sub: "status baru" },
    { label: "Dikonfirmasi",         value: String(confirmed),       sub: "bulan ini" },
    { label: "Est. Revenue",         value: formatRupiah(revenue),   sub: "confirmed+done" },
  ];

  const secondary = [
    { label: "Paket Aktif",     value: totalPkg,  href: "/admin/menu" },
    { label: "Artikel Published", value: totalPost, href: "/admin/blog" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {now.toLocaleString("id-ID", { month: "long", year: "numeric", day: "numeric" })}
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-heading text-2xl text-foreground">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {secondary.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-card p-4 text-center transition-colors hover:bg-muted/50"
          >
            <p className="font-heading text-xl text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Order Terbaru</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-primary hover:underline"
          >
            Lihat semua →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            Belum ada pesanan masuk.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.order_number}
                    {order.event_date && ` · ${formatDate(order.event_date)}`}
                    {order.estimated_total && ` · ${formatRupiah(order.estimated_total)}`}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[order.status] ?? "bg-muted text-foreground"}`}
                >
                  {ORDER_STATUSES.find((s) => s.value === order.status)?.label ??
                    order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
