import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { PackageCard } from "@/components/home/package-card";
import { FilterBar } from "@/components/menu/filter-bar";
import { SITE_NAME } from "@/lib/constants";
import type { Package } from "@/types/database";

export const metadata: Metadata = {
  title: `Paket Catering Batak Bandung — ${SITE_NAME}`,
  description:
    "Pilihan lengkap paket catering Batak di Bandung — Pesta Adat, Wedding Batak, Arisan Marga, Birthday, hingga Acara Kantor. Saksang, Arsik, Na Niura & lebih.",
  alternates: { canonical: "https://tataring.id/menu" },
};

interface PageProps {
  searchParams: Promise<{ kategori?: string; sort?: string }>;
}

export default async function MenuPage({ searchParams }: PageProps) {
  const { kategori = "semua", sort = "default" } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("packages")
    .select("*")
    .eq("is_active", true);

  if (kategori !== "semua") {
    query = query.eq("category", kategori);
  }

  if (sort === "termurah") {
    query = query.order("price_per_portion", { ascending: true });
  } else if (sort === "termahal") {
    query = query.order("price_per_portion", { ascending: false });
  } else {
    // Terlaris: best_seller first, then new, then promo, then null
    query = query.order("badge", { ascending: true, nullsFirst: false });
  }

  const { data: packages } = await query;
  const list = (packages ?? []) as Package[];

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pilihan Lengkap
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">
            Paket Catering Batak Bandung
          </h1>
          <p className="mt-2 text-muted-foreground">
            Dari pesta adat, wedding, arisan, hingga perayaan — ada paket yang pas buat semua acara di Bandung.
          </p>
        </div>
      </div>

      {/* Filter bar — needs Suspense karena useSearchParams di dalamnya */}
      <Suspense>
        <FilterBar
          activeKategori={kategori}
          activeSort={sort}
          total={list.length}
        />
      </Suspense>

      {/* Grid */}
      <SectionWrapper>
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="font-heading text-2xl text-foreground">
              Tidak ada paket ditemukan
            </p>
            <p className="text-muted-foreground">
              Coba pilih kategori lain atau{" "}
              <a href="/kontak" className="text-primary hover:underline">
                hubungi kami
              </a>{" "}
              untuk paket custom.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
