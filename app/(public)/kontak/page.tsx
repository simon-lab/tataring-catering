import type { Metadata } from "next";
import {
  Phone,
  Mail,
  AtSign,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { KontakForm } from "@/components/kontak/kontak-form";
import {
  SITE_NAME, SITE_URL,
  SITE_CITY, SITE_PROVINCE, SITE_STREET_ADDRESS,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Kontak — ${SITE_NAME}`,
  description:
    `Hubungi TATARING CATERING via WhatsApp, email, atau kunjungi dapur kami di ${SITE_CITY}. Kami siap menjawab setiap pertanyaan tentang catering Batak untuk acaramu.`,
  alternates: { canonical: `${SITE_URL}/kontak` },
};

const CONTACTS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: WHATSAPP_NUMBER || "628xxxxxxxxx",
    href: buildWhatsAppUrl(
      "Halo TATARING CATERING, saya ingin tanya-tanya tentang catering.",
      WHATSAPP_NUMBER
    ),
    highlight: true,
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "+62 8xx-xxxx-xxxx",
    href: "tel:+628xxxxxxxxx",
    highlight: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@tataring.id",
    href: "mailto:hello@tataring.id",
    highlight: false,
  },
  {
    icon: AtSign,
    label: "Instagram",
    value: "@tataringcatering",
    href: "https://instagram.com/tataringcatering",
    highlight: false,
  },
];

const HOURS = [
  { day: "Senin – Sabtu", time: "08.00 – 20.00 WIB" },
  { day: "Minggu", time: "09.00 – 17.00 WIB" },
];

export default function KontakPage() {
  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Hubungi Kami
          </p>
          <h1 className="mt-2 font-heading text-4xl text-foreground">Kontak</h1>
          <p className="mt-2 text-muted-foreground">
            Ada pertanyaan, mau diskusi paket, atau ingin konsultasi acara catering Batak di Bandung? Kami siap membantu.
          </p>
        </div>
      </div>

      <SectionWrapper>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Kiri: Info kontak + jam + maps */}
          <div className="space-y-8">
            {/* Kontak info */}
            <div>
              <h2 className="mb-4 font-heading text-2xl text-foreground">Informasi Kontak</h2>
              <div className="space-y-3">
                {CONTACTS.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50 ${
                      c.highlight
                        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                        : "border-border bg-card"
                    }`}
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${
                        c.highlight ? "bg-green-100 dark:bg-green-900/40" : "bg-muted"
                      }`}
                    >
                      <c.icon
                        className={`size-4 ${c.highlight ? "text-green-600" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      <p className={`font-medium ${c.highlight ? "text-green-700 dark:text-green-400" : "text-foreground"}`}>
                        {c.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Jam operasional */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl text-foreground">
                <Clock className="size-5 text-primary" />
                Jam Operasional
              </h2>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {HOURS.map((h, i) => (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between px-5 py-3 text-sm ${
                      i < HOURS.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-medium text-foreground">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alamat */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl text-foreground">
                <MapPin className="size-5 text-primary" />
                Lokasi
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {SITE_STREET_ADDRESS}
                <br />
                {SITE_CITY}, {SITE_PROVINCE} — Indonesia
              </p>
              {/* Maps embed placeholder */}
              <div className="overflow-hidden rounded-xl border border-border bg-muted aspect-video flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center px-4">
                  Peta Google Maps akan ditampilkan di sini.
                  <br />
                  <span className="text-xs">(Ganti dengan iframe Google Maps sesuai alamat)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Kanan: Form */}
          <div>
            <h2 className="mb-4 font-heading text-2xl text-foreground">Kirim Pesan</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Isi form di bawah dan pesan akan langsung dikirim ke WhatsApp admin kami.
            </p>
            <KontakForm />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
