import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TestimoniGrid } from "@/components/testimoni/testimoni-grid";
import { SITE_NAME } from "@/lib/constants";
import type { Testimonial } from "@/types/database";

export const metadata: Metadata = {
  title: `Testimoni — ${SITE_NAME}`,
  description:
    "Apa kata mereka tentang TATARING CATERING? Baca ulasan nyata dari ratusan customer yang telah mempercayakan acara spesial mereka kepada kami.",
};

export default async function TestimoniPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const testimonials = (data ?? []) as Testimonial[];

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Kata Mereka
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">Testimoni</h1>
          <p className="mt-2 text-muted-foreground">
            Ulasan nyata dari customer yang telah mempercayakan momen spesial mereka
            kepada TATARING CATERING.
          </p>
        </div>
      </div>

      <SectionWrapper>
        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-2xl text-foreground">Testimoni segera hadir</p>
            <p className="text-muted-foreground">
              Ulasan customer akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <TestimoniGrid testimonials={testimonials} />
        )}
      </SectionWrapper>
    </>
  );
}
