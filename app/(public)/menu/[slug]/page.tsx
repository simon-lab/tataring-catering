import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PackageBadge } from "@/components/ui/package-badge";
import { ImageGallery } from "@/components/menu/image-gallery";
import { PackageDetail } from "@/components/menu/package-detail";
import { formatRupiah } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Package, Addon } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const result = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  const pkg = result.data as Package | null;

  if (!pkg) return { title: "Paket tidak ditemukan" };

  return {
    title: `${pkg.name} — Catering Batak Bandung | ${SITE_NAME}`,
    description: pkg.description
      ? `${pkg.description} Tersedia di Bandung.`
      : `Paket catering Batak ${pkg.name} di Bandung. Hubungi TATARING CATERING untuk pemesanan.`,
    alternates: { canonical: `${SITE_URL}/menu/${pkg.slug}` },
    openGraph: {
      title: `${pkg.name} — Catering Batak Bandung`,
      description: pkg.description ?? undefined,
      images: pkg.images?.[0] ? [pkg.images[0]] : [],
    },
  };
}

export default async function MenuDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [pkgResult, addonsResult] = await Promise.all([
    supabase.from("packages").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("addons").select("*").eq("is_active", true),
  ]);
  const pkg = pkgResult.data as Package | null;
  const addons = (addonsResult.data ?? []) as Addon[];

  if (!pkg) notFound();

  const images = pkg.images ?? [];

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Menu", item: `${SITE_URL}/menu` },
      { "@type": "ListItem", position: 3, name: pkg.name, item: `${SITE_URL}/menu/${pkg.slug}` },
    ],
  };

  // Schema.org Product JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.description ?? undefined,
    image: images[0] ?? undefined,
    url: `${SITE_URL}/menu/${pkg.slug}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: pkg.price_per_portion,
      availability: pkg.is_active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
        <ChevronDown className="size-3.5 -rotate-90" />
        <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
        <ChevronDown className="size-3.5 -rotate-90" />
        <span className="text-foreground font-medium truncate">{pkg.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Kiri: Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ImageGallery images={images} alt={pkg.name} />
        </div>

        {/* Kanan: Info + Order panel */}
        <div className="mt-8 lg:mt-0 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading text-3xl text-foreground">{pkg.name}</h1>
              {pkg.badge && (
                <PackageBadge
                  variant={pkg.badge as "best_seller" | "new" | "promo"}
                  className="shrink-0 mt-1"
                />
              )}
            </div>

            {/* Harga dasar */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-2xl text-primary">
                {formatRupiah(pkg.price_per_portion)}
              </span>
              <span className="text-sm text-muted-foreground">/ porsi</span>
            </div>

            {/* Kapasitas */}
            <p className="mt-1 text-sm text-muted-foreground">
              Kapasitas: {pkg.min_portion}–{pkg.max_portion} porsi
            </p>

            {/* Deskripsi */}
            {pkg.description && (
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                {pkg.description}
              </p>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Detail, porsi, add-on, kalkulasi, CTA */}
          <PackageDetail pkg={pkg} addons={addons ?? []} />
        </div>
      </div>
    </div>
    </>
  );
}
