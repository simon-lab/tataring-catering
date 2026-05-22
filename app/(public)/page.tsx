import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  SITE_NAME, SITE_TAGLINE, SITE_URL,
  SITE_CITY, SITE_PROVINCE, SITE_POSTAL_CODE,
  SITE_STREET_ADDRESS, SITE_GEO_LAT, SITE_GEO_LNG, SITE_PHONE,
} from "@/lib/constants";
import { Hero } from "@/components/home/hero";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { MenuStoriesPreview } from "@/components/home/menu-stories-preview";
import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { CtaSection } from "@/components/home/cta-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import type { Package, MenuStory, Testimonial } from "@/types/database";

export const metadata: Metadata = {
  title: `Catering Batak Bandung — ${SITE_NAME}`,
  description:
    "Catering Batak otentik di Bandung untuk acara adat, wedding Batak, arisan marga, dan perayaan. Saksang, Arsik, Na Niura — cita rasa asli. Horas! Mauliate.",
  openGraph: {
    title: `Catering Batak Bandung — ${SITE_NAME}`,
    description: SITE_TAGLINE,
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630 }],
  },
  alternates: { canonical: SITE_URL },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "FoodEstablishment"],
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  description:
    "Catering Batak otentik di Bandung untuk acara adat, wedding Batak, arisan marga, dan perayaan.",
  url: SITE_URL,
  telephone: SITE_PHONE,
  image: `${SITE_URL}/og-home.jpg`,
  logo: `${SITE_URL}/og-default.jpg`,
  priceRange: "$$",
  servesCuisine: ["Batak", "Indonesian"],
  areaServed: [
    { "@type": "City", name: "Bandung" },
    { "@type": "City", name: "Cimahi" },
    { "@type": "AdministrativeArea", name: "Bandung Barat" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_STREET_ADDRESS,
    addressLocality: SITE_CITY,
    addressRegion: SITE_PROVINCE,
    postalCode: SITE_POSTAL_CODE,
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE_GEO_LAT,
    longitude: SITE_GEO_LNG,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  hasMap: `https://www.google.com/maps/search/${encodeURIComponent(SITE_NAME + " " + SITE_CITY)}`,
};

async function getFeaturedPackages(): Promise<Package[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("badge", { ascending: true, nullsFirst: false })
      .limit(4);
    return (data ?? []) as Package[];
  } catch {
    return [];
  }
}

async function getMenuStories(): Promise<MenuStory[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("menu_stories")
      .select("*")
      .eq("is_published", true)
      .limit(3);
    return (data ?? []) as MenuStory[];
  } catch {
    return [];
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return (data ?? []) as Testimonial[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [packages, stories, testimonials] = await Promise.all([
    getFeaturedPackages(),
    getMenuStories(),
    getTestimonials(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Hero />
      <FeaturedPackages packages={packages} />
      <MenuStoriesPreview stories={stories} />

      {testimonials.length > 0 && (
        <SectionWrapper className="bg-muted/30">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Testimoni
            </p>
            <h2 className="mt-2 font-heading text-4xl text-foreground">
              Kata Mereka
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ribuan acara sukses, ribuan kenangan yang tercipta bersama TATARING.
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </SectionWrapper>
      )}

      <CtaSection />
    </>
  );
}
