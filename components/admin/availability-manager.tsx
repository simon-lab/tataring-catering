"use client";

import { useState, useCallback, useTransition } from "react";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import { X, Lock, Unlock, Settings } from "lucide-react";
import { cn, formatDate, toLocalDateStr } from "@/lib/utils";
import {
  getDateStatus,
  type AvailRecord,
  type DateStatus,
} from "@/components/ketersediaan/availability-calendar";
import {
  blockDate,
  unblockDate,
  setCapacity,
  updateBookedSlots,
} from "@/app/admin/ketersediaan/actions";
import { DEFAULT_SLOT_CAPACITY } from "@/lib/constants";

const ID_MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const ID_DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

const formatters = {
  formatCaption: (d: Date) => `${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  formatMonthDropdown: (month: Date) => ID_MONTHS[month.getMonth()],
  formatWeekdayName: (d: Date) => ID_DAYS[d.getDay()],
};

const CAL_CLASSNAMES = {
  root: "w-full",
  months: "w-full",
  month: "grid grid-cols-[2rem_1fr_2rem] items-center gap-x-1 gap-y-3",
  month_caption: "flex items-center justify-center",
  caption_label: "inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 h-10 min-w-[7.5rem] text-sm font-medium text-foreground pointer-events-none select-none",
  chevron: "size-3.5 text-muted-foreground",
  nav: "hidden",
  button_previous: "flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30",
  button_next: "flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30",
  dropdowns: "flex items-center gap-2",
  dropdown_root: "relative inline-flex items-center",
  dropdown: "absolute inset-0 w-full opacity-0 cursor-pointer",
  months_dropdown: "",
  years_dropdown: "",
  month_grid: "col-span-3 w-full",
  weekdays: "flex",
  weekday: "flex-1 py-2 text-center text-xs font-medium text-muted-foreground",
  weeks: "mt-1 space-y-1",
  week: "flex",
  day: "flex flex-1 justify-center",
  day_button: "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-all",
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

export function AvailabilityManager({ availabilityMap, defaultSlotCapacity }: Props) {
  const [localMap, setLocalMap] =
    useState<Record<string, AvailRecord>>(availabilityMap);
  const [selected, setSelected] = useState<Date | undefined>();
  const [blockReason, setBlockReason] = useState("");
  const [capacityInput, setCapacityInput] = useState("");
  const [bookedInput, setBookedInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const selectedKey = selected ? toLocalDateStr(selected) : null;
  const selectedRec = selectedKey ? localMap[selectedKey] : null;
  const selectedStatus = selected
    ? getDateStatus(selected, localMap, defaultSlotCapacity)
    : null;

  const updateLocalMap = (date: string, patch: Partial<AvailRecord>) => {
    setLocalMap((prev) => {
      const existing = prev[date] ?? {
        max_slots: defaultSlotCapacity,
        booked_slots: 0,
        is_blocked: false,
        block_reason: null,
      };
      return { ...prev, [date]: { ...existing, ...patch } };
    });
  };

  const handleBlock = () => {
    if (!selectedKey) return;
    startTransition(async () => {
      await blockDate(selectedKey, blockReason);
      updateLocalMap(selectedKey, { is_blocked: true, block_reason: blockReason || null });
      setMessage("Tanggal ditandai libur");
      setBlockReason("");
    });
  };

  const handleUnblock = () => {
    if (!selectedKey) return;
    startTransition(async () => {
      await unblockDate(selectedKey);
      updateLocalMap(selectedKey, { is_blocked: false, block_reason: null });
      setMessage("Tanggal berhasil dibuka");
    });
  };

  const handleSetCapacity = () => {
    if (!selectedKey) return;
    const cap = parseInt(capacityInput);
    if (!cap || cap < 1) return;
    startTransition(async () => {
      await setCapacity(selectedKey, cap);
      updateLocalMap(selectedKey, { max_slots: cap });
      setMessage(`Kapasitas diubah ke ${cap} slot`);
    });
  };

  const handleSetBooked = () => {
    if (!selectedKey) return;
    const booked = parseInt(bookedInput);
    if (isNaN(booked) || booked < 0) return;
    const currentMax = selectedRec?.max_slots ?? defaultSlotCapacity;
    if (booked > currentMax) return;
    startTransition(async () => {
      await updateBookedSlots(selectedKey, booked, currentMax);
      updateLocalMap(selectedKey, { booked_slots: booked });
      setMessage(`Terboking diperbarui ke ${booked} slot`);
      setBookedInput("");
    });
  };

  const CustomDayButton = useCallback(
    ({ day, modifiers, ...btnProps }: DayButtonProps) => {
      const status = getDateStatus(day.date, localMap, defaultSlotCapacity);
      const isSelected = !!modifiers.selected;
      const isToday = !!modifiers.today;
      const isOutside = !!modifiers.outside;

      return (
        <button
          {...btnProps}
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-all",
            isOutside && "invisible pointer-events-none",
            !isOutside && status === "past" && "text-muted-foreground/40",
            !isOutside && status === "available" && "text-foreground hover:bg-accent/20",
            !isOutside && status === "full" && "bg-destructive/10 text-destructive/60",
            !isOutside && status === "blocked" && "bg-muted text-muted-foreground/50 line-through",
            isSelected && "!bg-primary !text-primary-foreground",
            isToday && !isSelected && "ring-2 ring-primary/50"
          )}
        />
      );
    },
    [localMap, defaultSlotCapacity]
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      {/* Calendar */}
      <div>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => { setSelected(d); setMessage(""); setBookedInput(""); }}
          captionLayout="dropdown"
          navLayout="around"
          defaultMonth={new Date()}
          startMonth={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          endMonth={new Date(new Date().getFullYear() + 2, 11, 31)}
          classNames={CAL_CLASSNAMES}
          components={{ DayButton: CustomDayButton }}
          formatters={formatters}
        />

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {[
            { cls: "bg-accent/20", label: "Tersedia" },
            { cls: "bg-destructive/10", label: "Penuh" },
            { cls: "bg-muted", label: "Libur" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn("size-4 rounded-full", item.cls)} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      <div>
        {!selected ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            Pilih tanggal untuk mengelolanya
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{formatDate(selected)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Status:{" "}
                  <span className="font-medium text-foreground capitalize">
                    {selectedStatus === "available" && "Tersedia"}
                    {selectedStatus === "full" && "Penuh"}
                    {selectedStatus === "blocked" && "Libur"}
                    {selectedStatus === "past" && "Sudah lewat"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelected(undefined)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Capacity info */}
            <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Kapasitas</span>
                <span className="font-semibold text-foreground">
                  {selectedRec?.max_slots ?? defaultSlotCapacity} slot
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Terboking</span>
                <span className="font-semibold text-foreground">
                  {selectedRec?.booked_slots ?? 0} slot
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-1">
                <span className="text-muted-foreground">Sisa slot</span>
                <span className={`font-semibold ${
                  (selectedRec?.max_slots ?? defaultSlotCapacity) - (selectedRec?.booked_slots ?? 0) <= 0
                    ? "text-destructive"
                    : "text-accent"
                }`}>
                  {Math.max(0, (selectedRec?.max_slots ?? defaultSlotCapacity) - (selectedRec?.booked_slots ?? 0))} slot
                </span>
              </div>
            </div>

            {/* Atur Terboking */}
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs font-medium text-foreground">
                Atur Jumlah Terboking
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bookedInput}
                  onChange={(e) => setBookedInput(e.target.value)}
                  placeholder={String(selectedRec?.booked_slots ?? 0)}
                  min={0}
                  max={selectedRec?.max_slots ?? defaultSlotCapacity}
                  className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="flex items-center text-xs text-muted-foreground">
                  maks. {selectedRec?.max_slots ?? defaultSlotCapacity}
                </p>
                <button
                  onClick={handleSetBooked}
                  disabled={
                    isPending ||
                    !bookedInput ||
                    parseInt(bookedInput) > (selectedRec?.max_slots ?? defaultSlotCapacity) ||
                    parseInt(bookedInput) < 0
                  }
                  className="ml-auto rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
              {bookedInput && parseInt(bookedInput) > (selectedRec?.max_slots ?? defaultSlotCapacity) && (
                <p className="text-xs text-destructive">
                  Tidak boleh melebihi kapasitas ({selectedRec?.max_slots ?? defaultSlotCapacity} slot)
                </p>
              )}
            </div>

            {/* Block/Unblock */}
            {selectedRec?.is_blocked ? (
              <button
                onClick={handleUnblock}
                disabled={isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
              >
                <Unlock className="size-4" />
                Hapus Libur
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Keterangan libur (cth: Lebaran, libur nasional)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleBlock}
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                >
                  <Lock className="size-4" />
                  Tandai Libur
                </button>
              </div>
            )}

            {/* Set capacity */}
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Settings className="size-3.5" />
                Override Kapasitas
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={capacityInput}
                  onChange={(e) => setCapacityInput(e.target.value)}
                  placeholder={String(selectedRec?.max_slots ?? defaultSlotCapacity)}
                  min={1}
                  max={20}
                  className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleSetCapacity}
                  disabled={isPending || !capacityInput}
                  className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {message && (
              <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                ✓ {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
