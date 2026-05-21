import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/lib/i18n/context";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";

// Schema.org LocalBusiness + Restaurant — sitewide untuk halaman publik
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "FoodEstablishment", "LocalBusiness"],
  name: SITE_NAME,
  description: `${SITE_TAGLINE} Catering Batak otentik untuk acara adat, wedding, arisan marga, birthday, dan acara kantor di Medan.`,
  url: SITE_URL,
  telephone: WHATSAPP_NUMBER ? `+${WHATSAPP_NUMBER}` : undefined,
  servesCuisine: ["Batak", "Indonesian"],
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Medan" },
    { "@type": "State", name: "Sumatera Utara" },
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
