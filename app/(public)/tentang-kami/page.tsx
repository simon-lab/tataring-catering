import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export const metadata: Metadata = {
  title: `Tentang Kami — Catering Batak Bandung | ${SITE_NAME}`,
  description:
    "Kenali cerita di balik TATARING CATERING, catering Batak otentik di Bandung — dari dapur rumahan ke ratusan acara sukses. Bangga membawa cita rasa Batak ke meja pestamu.",
};

const VALUES = [
  {
    icon: "🍲",
    title: "Otentik",
    desc: "Resep turun-temurun, bahan pilihan langsung dari sumber terpercaya. Rasa tidak pernah dikompromikan.",
  },
  {
    icon: "⏰",
    title: "Tepat Waktu",
    desc: "Acara kamu adalah prioritas kami. Kami berkomitmen hadir sesuai jadwal, setiap saat.",
  },
  {
    icon: "❤️",
    title: "Dibuat dengan Hati",
    desc: "Setiap hidangan adalah ungkapan kasih sayang. Kami memasak seperti untuk keluarga sendiri.",
  },
];

const TIMELINE = [
  { year: "2018", event: "TATARING CATERING berdiri dari dapur rumahan dengan resep keluarga." },
  { year: "2019", event: "50+ event pertama berhasil dilayani dengan kepuasan penuh." },
  { year: "2020", event: "Ekspansi ke layanan wedding Batak dan pesta adat skala besar." },
  { year: "2022", event: "300+ event sukses. Rating pelanggan 4.9/5 dari berbagai platform." },
  { year: "2023", event: "Launching pemesanan online dan website TATARING." },
  { year: "2024", event: "500+ event, tim profesional, dan komitmen terus berkembang." },
];

const TEAM = [
  { name: "Boru Sirait", role: "Owner & Head Chef", desc: "Penjaga resep asli keluarga sejak generasi pertama." },
  { name: "Pardamean", role: "Sous Chef", desc: "Spesialis masakan adat Batak Toba dengan 10 tahun pengalaman." },
  { name: "Tim Pelayanan", role: "3 Orang", desc: "Ramah, sigap, dan memastikan setiap tamu merasa disambut." },
  { name: "Tim Logistik", role: "2 Orang", desc: "Memastikan seluruh perlengkapan dan hidangan tiba tepat waktu." },
];

export default function TentangKamiPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-primary py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.12 72) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
            Horas! — Kenali Kami
          </p>
          <h1 className="mt-3 font-heading text-5xl text-primary-foreground">
            Catering Batak Otentik di Bandung
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/75">{SITE_TAGLINE}</p>
        </div>
      </div>

      {/* Cerita Owner */}
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Foto placeholder */}
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <span className="font-heading text-8xl text-primary/20">T</span>
          </div>

          {/* Teks */}
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Cerita Kami
            </p>
            <h2 className="font-heading text-4xl text-foreground">
              Dari Dapur Rumahan ke Ratusan Acara Spesial
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                TATARING CATERING lahir dari cinta yang mendalam terhadap masakan Batak. Bermula
                dari dapur rumahan yang penuh aroma rempah dan resep-resep turun-temurun yang
                dijaga dengan teliti, kami terus tumbuh melayani satu acara demi satu acara.
              </p>
              <p>
                Nama <strong className="text-foreground">TATARING</strong> berasal dari bahasa
                Batak yang berarti "dapur" — tempat di mana cerita diciptakan, keluarga berkumpul,
                dan kenangan terbentuk lewat aroma dan rasa.
              </p>
              <p>
                Kini berbasis di <strong className="text-foreground">Bandung</strong>, dengan
                ratusan event sukses dan kepercayaan ribuan keluarga, kami terus berkomitmen
                untuk menghadirkan cita rasa Batak yang otentik di setiap momen spesialmu —
                dari pesta adat, wedding Batak, arisan marga, hingga berbagai perayaan spesial
                di seluruh area Bandung dan sekitarnya.
              </p>
            </div>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Mulai Pesan Sekarang
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="bg-muted/30">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Filosofi Kami</p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">Nilai yang Kami Pegang</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <span className="text-4xl">{v.icon}</span>
              <h3 className="mt-3 font-heading text-xl text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Tim */}
      <SectionWrapper>
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Di Balik Layar</p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">Tim TATARING</h2>
          <p className="mt-2 text-muted-foreground">
            Orang-orang berdedikasi yang memastikan setiap acara berjalan sempurna.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-border bg-card p-5 text-center"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <span className="font-heading text-2xl text-primary">
                  {member.name.charAt(0)}
                </span>
              </div>
              <p className="mt-3 font-semibold text-foreground">{member.name}</p>
              <p className="text-xs font-medium text-primary">{member.role}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{member.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <SectionWrapper className="bg-muted/30">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Perjalanan Kami</p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">Milestone</h2>
        </div>
        <div className="mx-auto max-w-2xl">
          <ol className="relative border-l-2 border-border pl-8 space-y-8">
            {TIMELINE.map((item, i) => (
              <li key={i} className="relative">
                <div className="absolute -left-[2.6rem] flex size-8 items-center justify-center rounded-full border-2 border-border bg-background">
                  <div className="size-2.5 rounded-full bg-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{item.year}</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">{item.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </SectionWrapper>
    </>
  );
}
