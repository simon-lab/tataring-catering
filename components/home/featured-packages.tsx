import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { PackageCard } from "./package-card";
import type { Package } from "@/types/database";

export function FeaturedPackages({ packages }: { packages: Package[] }) {
  if (packages.length === 0) return null;

  return (
    <SectionWrapper>
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Paket Unggulan
          </p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">
            Menu Pilihan Terbaik
          </h2>
          <p className="mt-2 text-muted-foreground">
            Paket yang paling banyak dipesan untuk berbagai jenis acara.
          </p>
        </div>
        <Link
          href="/menu"
          className={buttonVariants({ variant: "outline" })}
        >
          Lihat Semua Menu
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </SectionWrapper>
  );
}
