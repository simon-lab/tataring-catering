import { SectionWrapper } from "@/components/ui/section-wrapper";

export function InstagramFeed() {
  return (
    <SectionWrapper>
      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Instagram
        </p>
        <h2 className="mt-2 font-heading text-4xl text-foreground">
          @tataringcatering
        </h2>
        <p className="mt-2 text-muted-foreground">
          Follow kami untuk inspirasi menu dan momen pesta terbaru.
        </p>
      </div>

      {/* Grid placeholder — diganti Instagram embed setelah API siap */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href="https://instagram.com/tataringcatering"
            target="_blank"
            rel="noopener noreferrer"
            className="group aspect-square overflow-hidden rounded-xl bg-muted transition-opacity hover:opacity-80"
            aria-label={`Foto Instagram ${i + 1}`}
          >
            {/* Placeholder warna berbeda per sel */}
            <div
              className="h-full w-full"
              style={{
                background: i % 2 === 0
                  ? "oklch(0.37 0.149 25 / 0.08)"
                  : "oklch(0.72 0.12 72 / 0.08)",
              }}
            />
          </a>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Instagram feed akan ditampilkan setelah API terhubung (Step 12 — Polish).
      </p>
    </SectionWrapper>
  );
}
