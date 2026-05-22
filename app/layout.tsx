import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import {
  SITE_NAME, SITE_TAGLINE, SITE_URL,
  SITE_CITY, SITE_PROVINCE, SITE_COUNTRY,
  SITE_STREET_ADDRESS, SITE_POSTAL_CODE,
  SITE_GEO_LAT, SITE_GEO_LNG, SITE_PHONE,
} from "@/lib/constants";

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#8B1A1A",
};

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tataringcatering",
    creator: "@tataringcatering",
  },
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  keywords: [
    "catering batak bandung",
    "catering batak",
    "catering bandung",
    "catering adat batak bandung",
    "catering wedding batak bandung",
    "catering pernikahan batak bandung",
    "catering arisan marga bandung",
    "catering pesta adat bandung",
    "saksang bandung",
    "arsik bandung",
    "masakan batak bandung",
    "tataring catering",
    "catering batak jawa barat",
  ],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Organization JSON-LD — muncul di semua halaman
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/og-default.jpg`,
  telephone: SITE_PHONE,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_STREET_ADDRESS,
    addressLocality: SITE_CITY,
    addressRegion: SITE_PROVINCE,
    postalCode: SITE_POSTAL_CODE,
    addressCountry: "ID",
  },
  sameAs: [
    "https://instagram.com/tataringcatering",
    "https://wa.me/" + SITE_PHONE.replace(/\D/g, ""),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${instrumentSerif.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}

        {/* Vercel Analytics + Speed Insights */}
        <Analytics />
        <SpeedInsights />

        {/* Google Analytics 4 — hanya jika NEXT_PUBLIC_GA_ID diset */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
