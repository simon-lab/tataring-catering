import { Button } from "@/components/ui/button";
import { PackageBadge } from "@/components/ui/package-badge";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">

        <header>
          <h1 className="font-heading text-4xl text-primary">TATARING — Design System</h1>
          <p className="mt-2 text-muted-foreground">Preview komponen & token visual sebelum dipakai di halaman nyata.</p>
        </header>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ColorChip label="Primary — Maroon" bg="bg-primary" text="text-primary-foreground" hex="#8B1A1A" />
            <ColorChip label="Secondary — Gold" bg="bg-secondary" text="text-secondary-foreground" hex="#D4A24C" />
            <ColorChip label="Accent — Hijau" bg="bg-accent" text="text-accent-foreground" hex="#0F4C3A" />
            <ColorChip label="Background" bg="bg-background border border-border" text="text-foreground" hex="#FAFAF7" />
            <ColorChip label="Foreground" bg="bg-foreground" text="text-background" hex="#1A1A1A" />
            <ColorChip label="Muted" bg="bg-muted" text="text-muted-foreground" hex="muted" />
            <ColorChip label="Card" bg="bg-card border border-border" text="text-card-foreground" hex="card" />
            <ColorChip label="Destructive" bg="bg-destructive" text="text-white" hex="destructive" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Typography</h2>
          <div className="space-y-3 p-6 bg-card rounded-xl border border-border">
            <p className="font-heading text-5xl text-primary">Instrument Serif — Heading</p>
            <p className="font-heading text-3xl">Cita Rasa Batak, Buat Setiap Momen Jadi Pesta.</p>
            <p className="font-heading text-xl text-muted-foreground italic">Horas! Mauliate Godang.</p>
            <hr className="border-border my-2" />
            <p className="text-base">Plus Jakarta Sans — Body text. Catering Batak otentik untuk acara adat, wedding, arisan marga, sampai hangout sama tim kantor.</p>
            <p className="text-sm text-muted-foreground">Small text / caption — 14px. Digunakan untuk metadata, label form, dan info sekunder.</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">OVERLINE / LABEL — XS</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Buttons</h2>
          <div className="p-6 bg-card rounded-xl border border-border space-y-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="lg">Pesan Sekarang (default)</Button>
                <Button variant="secondary" size="lg">Chat WhatsApp</Button>
                <Button variant="outline" size="lg">Lihat Menu</Button>
                <Button variant="ghost" size="lg">Ghost</Button>
                <Button variant="destructive" size="lg">Destructive</Button>
                <Button variant="link" size="lg">Link</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Large</Button>
                <Button size="default">Default</Button>
                <Button size="sm">Small</Button>
                <Button size="xs">XS</Button>
                <Button variant="outline" size="icon">+</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">States</p>
              <div className="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Package Badges */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Package Badges</h2>
          <div className="p-6 bg-card rounded-xl border border-border">
            <div className="flex flex-wrap gap-3">
              <PackageBadge variant="best_seller" />
              <PackageBadge variant="new" />
              <PackageBadge variant="promo" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Digunakan di card paket menu — muncul di pojok kiri atas card.
            </p>
          </div>
        </section>

        {/* Card */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Cards</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {["Saksang", "Arsik", "Na Niura"].map((menu) => (
              <div
                key={menu}
                className="bg-card border border-border rounded-xl p-5 space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="h-32 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  Foto {menu}
                </div>
                <PackageBadge variant="best_seller" />
                <h3 className="font-heading text-xl text-foreground">Paket {menu}</h3>
                <p className="text-sm text-muted-foreground">Mulai dari Rp 75.000 / porsi · Min. 50 porsi</p>
                <Button size="sm" className="w-full">Pesan Sekarang</Button>
              </div>
            ))}
          </div>
        </section>

        {/* SectionWrapper */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">SectionWrapper</h2>
          <SectionWrapper className="bg-primary rounded-xl" innerClassName="">
            <p className="text-primary-foreground text-center font-heading text-2xl">
              Siap bikin acara lo jadi tak terlupakan?
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="secondary" size="lg">Mulai Pesan</Button>
              <Button variant="outline" size="lg" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Konsultasi via WA
              </Button>
            </div>
          </SectionWrapper>
        </section>

      </div>
    </div>
  );
}

function ColorChip({
  label,
  bg,
  text,
  hex,
}: {
  label: string;
  bg: string;
  text: string;
  hex: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className={`h-16 rounded-lg ${bg} ${text} flex items-center justify-center text-xs font-medium`}>
        {hex}
      </div>
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}
