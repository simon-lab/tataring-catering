import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FAQ_DATA } from "@/lib/faq-data";
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `FAQ Catering Batak Bandung — ${SITE_NAME}`,
  description:
    "Pertanyaan yang sering diajukan seputar pemesanan, pengiriman, menu, dan pembayaran TATARING CATERING Bandung. Tidak menemukan jawaban? Chat langsung dengan admin kami.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

// FAQPage JSON-LD — dibangun dari data yang sama dengan accordion
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function FaqPage() {
  const waUrl = buildWhatsAppUrl(
    "Halo TATARING CATERING, saya punya pertanyaan tentang layanan catering.",
    WHATSAPP_NUMBER
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Bantuan
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">
            Pertanyaan yang Sering Ditanyakan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tidak menemukan jawaban?{" "}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Chat langsung dengan admin kami.
            </a>
          </p>
        </div>
      </div>

      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion />

          {/* CTA bottom */}
          <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
            <p className="font-heading text-xl text-foreground">
              Masih ada pertanyaan?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tim kami siap menjawab pertanyaanmu via WhatsApp, setiap hari pukul 08.00–20.00 WIB.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl py-3 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              Chat Admin Sekarang
            </a>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
