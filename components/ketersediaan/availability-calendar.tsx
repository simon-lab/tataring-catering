"use client";

import { useState, useCallback } from "react";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import Link from "next/link";
import { cn, formatDate, toLocalDateStr } from "@/lib/utils";

export interface AvailRecord {
  max_slots: number;
  booked_slots: number;
  is_blocked: boolean;
  block_reason: string | null;
}

export type DateStatus = "available" | "full" | "blocked" | "past";

export function getDateStatus(
  date: Date,
  availMap: Record<string, AvailRecord>,
  defaultCap: number
): DateStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "past";

  const key = toLocalDateStr(date);
  const rec = availMap[key];
  if (!rec) return "available";
  if (rec.is_blocked) return "blocked";
  const remaining = rec.max_slots - rec.booked_slots;
  if (remaining <= 0) return "full";
  return "available";
}

function getRemainingSlots(
  date: Date,
  availMap: Record<string, AvailRecord>,
  defaultCap: number
): number {
  const key = toLocalDateStr(date);
  const rec = availMap[key];
  if (!rec) return defaultCap;
  return Math.max(0, rec.max_slots - rec.booked_slots);
}

const ID_MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const ID_DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

const formatters = {
  // Nama bulan di header caption (fallback)
  formatCaption: (d: Date) => `${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  // Nama bulan di dropdown pilihan
  formatMonthDropdown: (month: Date) => ID_MONTHS[month.getMonth()],
  // Nama hari di header kolom
  formatWeekdayName: (d: Date) => ID_DAYS[d.getDay()],
};

// Struktur Dropdown (dari react-day-picker v10 source):
//   dropdown_root (span relative)
//     select.dropdown.months_dropdown  → invisible overlay, tetap clickable
//     span.caption_label               → tampilan visible: teks bulan/tahun + chevron ↓
//
// navLayout="around" → prev/next di dalam `month`.
// month pakai CSS grid: [prev | dropdowns | next] baris 1, [grid kalender] baris 2.
const CAL_CLASSNAMES = {
  root: "w-full",
  months: "w-full",
  month: "grid grid-cols-[2rem_1fr_2rem] items-center gap-x-1 gap-y-3",
  month_caption: "flex items-center justify-center",
  // caption_label = label VISUAL di dalam setiap dropdown (teks + chevron ↓)
  caption_label:
    "inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 h-10 min-w-[7.5rem] text-sm font-medium text-foreground pointer-events-none select-none",
  chevron: "size-3.5 text-muted-foreground",
  nav: "hidden",
  button_previous:
    "flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30",
  button_next:
    "flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30",
  dropdowns: "flex items-center gap-2",
  // dropdown_root = wrapper per-dropdown; harus relative agar select overlay bisa absolute
  dropdown_root: "relative inline-flex items-center",
  // <select> di-overlay transparan di atas caption_label — invisible tapi masih clickable
  dropdown: "absolute inset-0 w-full opacity-0 cursor-pointer",
  months_dropdown: "",
  years_dropdown: "",
  month_grid: "col-span-3 w-full",
  weekdays: "flex",
  weekday: "flex-1 py-2 text-center text-xs font-medium text-muted-foreground",
  weeks: "mt-1 space-y-1",
  week: "flex",
  day: "flex flex-1 justify-center",
  day_button:
    "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-all",
  today: "",
  outside: "invisible pointer-events-none",
  disabled: "",
  hidden: "invisible",
  selected: "",
};

interface Props {
  availabilityMap: Record<string, AvailRecord>;
  defaultSlotCapacity: number;
}

export function AvailabilityCalendar({ availabilityMap, defaultSlotCapacity }: Props) {
  const [selected, setSelected] = useState<Date | undefined>();

  const CustomDayButton = useCallback(
    ({ day, modifiers, ...btnProps }: DayButtonProps) => {
      const status = getDateStatus(day.date, availabilityMap, defaultSlotCapacity);
      const isSelected = !!modifiers.selected;
      const isToday = !!modifiers.today;
      const isOutside = !!modifiers.outside;

      return (
        <button
          {...btnProps}
          disabled={
            status === "past" || status === "full" || status === "blocked"
          }
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-all",
            isOutside && "invisible pointer-events-none",
            !isOutside && status === "past" && "cursor-not-allowed text-muted-foreground/40",
            !isOutside && status === "available" && "text-foreground hover:bg-accent/20",
            !isOutside && status === "full" &&
              "cursor-not-allowed bg-destructive/10 text-destructive/50",
            !isOutside && status === "blocked" &&
              "cursor-not-allowed bg-muted text-muted-foreground/50 line-through",
            isSelected && "!bg-primary !text-primary-foreground hover:!bg-primary/90",
            isToday && !isSelected && "ring-2 ring-primary/50"
          )}
        />
      );
    },
    [availabilityMap, defaultSlotCapacity]
  );

  const status = selected
    ? getDateStatus(selected, availabilityMap, defaultSlotCapacity)
    : null;
  const remaining = selected
    ? getRemainingSlots(selected, availabilityMap, defaultSlotCapacity)
    : 0;
  const dateKey = selected ? toLocalDateStr(selected) : null;
  const rec = dateKey ? availabilityMap[dateKey] : null;
  const isOrderable = status === "available";

  return (
    <div className="space-y-8">
      {/* Calendar */}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        captionLayout="dropdown"
        navLayout="around"
        defaultMonth={new Date()}
        startMonth={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
        endMonth={new Date(new Date().getFullYear() + 2, 11, 31)}
        disabled={{ before: new Date() }}
        classNames={CAL_CLASSNAMES}
        components={{ DayButton: CustomDayButton }}
        formatters={formatters}
      />

      {/* Selected date info panel */}
      {selected && status && (
        <div
          className={cn(
            "rounded-xl border p-5",
            status === "available" && "border-accent/30 bg-accent/5",
            (status === "full" || status === "blocked") &&
              "border-border bg-muted/40"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{formatDate(selected)}</p>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  status === "available" && "bg-accent/15 text-accent",
                  status === "full" && "bg-destructive/15 text-destructive",
                  status === "blocked" && "bg-muted text-muted-foreground"
                )}
              >
                {status === "available" && "✓ Tersedia"}
                {status === "full" && "✗ Tanggal penuh"}
                {status === "blocked" &&
                  `🌴 Libur${rec?.block_reason ? ` — ${rec.block_reason}` : ""}`}
              </span>
            </div>

            {isOrderable && (
              <Link
                href={`/order?date=${toLocalDateStr(selected)}`}
                className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Pesan Tanggal Ini
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
        {[
          { cls: "bg-accent/20 ring-1 ring-accent/40", label: "Tersedia" },
          { cls: "bg-destructive/15", label: "Penuh" },
          { cls: "bg-muted", label: "Libur" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("size-4 rounded-full", item.cls)} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
