import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PackageBadge } from "@/components/ui/package-badge";
import { formatRupiah } from "@/lib/utils";
import type { Package } from "@/types/database";

export function PackageCard({ pkg }: { pkg: Package }) {
  const image = pkg.images?.[0] ?? `https://picsum.photos/seed/${pkg.slug}/800/600`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {pkg.badge && (
          <div className="absolute left-3 top-3">
            <PackageBadge variant={pkg.badge as "best_seller" | "new" | "promo"} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-heading text-xl text-foreground">{pkg.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {pkg.description}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold text-primary">
              Mulai {formatRupiah(pkg.price_per_portion)}
              <span className="font-normal text-muted-foreground"> / porsi</span>
            </span>
            <span className="text-muted-foreground">
              Min. {pkg.min_portion} porsi
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/menu/${pkg.slug}`}
              className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1 justify-center" })}
            >
              Detail
            </Link>
            <Link
              href={`/order?paket=${pkg.slug}`}
              className={buttonVariants({ size: "sm", className: "flex-1 justify-center" })}
            >
              Pesan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
