import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { GalleryGrid } from "@/components/galeri/gallery-grid";
import { SITE_NAME } from "@/lib/constants";
import type { GalleryItem } from "@/types/database";

export const metadata: Metadata = {
  title: `Galeri Event — ${SITE_NAME}`,
  description:
    "Lihat koleksi foto event catering TATARING — dari pesta adat, wedding Batak, arisan marga, hingga acara kantor. Ratusan momen spesial yang kami layani.",
};

export default async function GaleriPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const items = (data ?? []) as GalleryItem[];

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Portfolio Event
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">Galeri</h1>
          <p className="mt-2 text-muted-foreground">
            Ratusan momen spesial yang kami layani — dari adat, wedding, arisan, hingga
            hangout kantor.
          </p>
        </div>
      </div>

      <SectionWrapper>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-2xl text-foreground">Galeri segera hadir</p>
            <p className="text-muted-foreground">
              Foto-foto event akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}
      </SectionWrapper>
    </>
  );
}
