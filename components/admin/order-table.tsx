"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { ORDER_STATUSES, EVENT_TYPES } from "@/lib/constants";
import { updateOrderStatus, updateOrderNote } from "@/app/admin/orders/actions";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  event_type: string | null;
  event_date: string | null;
  portion_count: number | null;
  estimated_total: number | null;
  status: string;
  admin_note: string | null;
  notes: string | null;
  delivery_address: string | null;
  created_at: string;
}

const STATUS_STYLE: Record<string, string> = {
  new:       "bg-secondary/20 text-secondary-foreground",
  contacted: "bg-muted text-foreground",
  confirmed: "bg-accent/15 text-accent",
  done:      "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

export function OrderTable({ orders }: { orders: Order[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteValues, setNoteValues] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((o) => [o.id, o.admin_note ?? ""]))
  );
  const [isPending, startTransition] = useTransition();

  const eventLabel = (v: string | null) =>
    EVENT_TYPES.find((t) => t.value === v)?.label ?? v ?? "—";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>Pelanggan</span>
        <span>Acara</span>
        <span>Porsi</span>
        <span>Total Est.</span>
        <span>Status</span>
        <span />
      </div>

      {orders.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          Belum ada pesanan.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id}>
                {/* Row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_auto] items-center gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.order_number} · {order.customer_phone}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>{eventLabel(order.event_type)}</p>
                    {order.event_date && <p>{formatDate(order.event_date)}</p>}
                  </div>
                  <p className="text-sm">
                    {order.portion_count ? `${order.portion_count} porsi` : "—"}
                  </p>
                  <p className="text-sm">
                    {order.estimated_total
                      ? formatRupiah(order.estimated_total)
                      : "—"}
                  </p>
                  {/* Status dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      startTransition(() =>
                        updateOrderStatus(order.id, e.target.value)
                      )
                    }
                    disabled={isPending}
                    className={cn(
                      "w-full cursor-pointer rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
                      STATUS_STYLE[order.status]
                    )}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : order.id)
                    }
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 px-4 py-4 space-y-4 text-sm">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {order.delivery_address && (
                        <div>
                          <p className="text-xs text-muted-foreground">Lokasi</p>
                          <p className="font-medium">{order.delivery_address}</p>
                        </div>
                      )}
                      {order.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground">Catatan Customer</p>
                          <p>{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Admin note */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-foreground">Catatan Admin</p>
                      <div className="flex gap-2">
                        <input
                          value={noteValues[order.id] ?? ""}
                          onChange={(e) =>
                            setNoteValues((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                          placeholder="Tambah catatan internal..."
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                        <button
                          onClick={() =>
                            startTransition(() =>
                              updateOrderNote(order.id, noteValues[order.id] ?? "")
                            )
                          }
                          disabled={isPending}
                          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                        >
                          <Save className="size-3.5" />
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
