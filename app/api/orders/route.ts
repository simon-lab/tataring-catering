import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `TTR-${date}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const orderNumber = generateOrderNumber();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("orders").insert({
      order_number: orderNumber,
      customer_name: body.customerName,
      customer_phone: body.customerPhone,
      customer_email: body.customerEmail || null,
      event_type: body.eventType,
      event_date: body.eventDate || null,
      event_time: body.eventTime || null,
      package_id: body.packageId || null,
      portion_count: body.portionCount || null,
      addons: body.addons ?? null,
      delivery_address: body.deliveryAddress || null,
      notes: body.notes || null,
      estimated_total: body.estimatedTotal || null,
      status: "new",
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ orderNumber });
  } catch {
    return Response.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
  }
}
