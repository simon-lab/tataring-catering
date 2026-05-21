import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SLOT_CAPACITY } from "@/lib/constants";
import type { Availability } from "@/types/database";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/availability/[date]">
) {
  const { date } = await ctx.params;

  // Validate date format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Format tanggal tidak valid" }, { status: 400 });
  }

  // Don't allow past dates
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (date < today) {
    return Response.json({
      status: "past",
      remaining: 0,
      message: "Tanggal sudah lewat",
    });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("availability")
    .select("*")
    .eq("date", date)
    .single();

  const rec = data as Availability | null;

  if (!rec) {
    return Response.json({
      status: "available",
      remaining: DEFAULT_SLOT_CAPACITY,
      message: `${DEFAULT_SLOT_CAPACITY} slot tersedia`,
    });
  }

  if (rec.is_blocked) {
    return Response.json({
      status: "blocked",
      remaining: 0,
      message: rec.block_reason
        ? `Libur — ${rec.block_reason}`
        : "Tanggal libur",
    });
  }

  const remaining = Math.max(0, rec.max_slots - rec.booked_slots);

  if (remaining === 0) {
    return Response.json({
      status: "full",
      remaining: 0,
      message: "Tanggal sudah penuh",
    });
  }

  return Response.json({
    status: "available",
    remaining,
    message: "Tersedia",
  });
}
