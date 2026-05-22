import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/lib/i18n/context";
import {
  SITE_NAME, SITE_TAGLINE, SITE_URL, WHATSAPP_NUMBER,
  SITE_CITY, SITE_PROVINCE, SITE_STREET_ADDRESS, SITE_POSTAL_CODE,
  SITE_GEO_LAT, SITE_GEO_LNG, SITE_PHONE,
} from "@/lib/constants";

// Schema.org LocalBusiness — sitewide untuk halaman publik
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["FoodEstablishment", "LocalBusiness"],
  name: SITE_NAME,
  description: `${SITE_TAGLINE} Catering Batak otentik untuk acara adat, wedding, arisan marga, dan perayaan di Bandung.`,
  url: SITE_URL,
  telephone: SITE_PHONE,
  servesCuisine: ["Batak", "Indonesian"],
  priceRange: "$$",
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
  areaServed: [
    { "@type": "City", name: "Bandung" },
    { "@type": "City", name: "Cimahi" },
    { "@type": "AdministrativeArea", name: "Bandung Barat" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [
    "https://instagram.com/tataringcatering",
    "https://tiktok.com/@tataringcatering",
  ],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      {/* LocalBusiness JSON-LD — dirender di <head> oleh Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
