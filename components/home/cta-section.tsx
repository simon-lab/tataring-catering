import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "oklch(0.72 0.12 72)" }}
        >
          Horas! Mari mulai
        </p>
        <h2 className="mt-3 font-heading text-4xl text-primary-foreground sm:text-5xl">
          Siap bikin acara lo jadi tak terlupakan?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/75">
          Konsultasi gratis, tanpa komitmen. Kami siap bantu dari pemilihan
          menu sampai pengiriman ke lokasi acara.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/order"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-secondary text-secondary-foreground hover:opacity-90"
            )}
          >
            Mulai Pesan
          </Link>
          <a
            href="https://wa.me/628123456789"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
            )}
          >
            Konsultasi via WA
          </a>
        </div>
      </div>
    </section>
  );
}
