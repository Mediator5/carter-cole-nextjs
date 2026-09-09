import type { Metadata } from "next";
// Self-hosted fonts — no external requests, no Google Fonts dependency.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { site, streetLine } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Tax, Credit & Business Services in Detroit`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "tax preparation Detroit",
    "SmartTaxIQ",
    "credit repair Detroit",
    "business formation Michigan",
    "bookkeeping and payroll",
    "small business consulting Detroit",
    "Carter Cole & Associates",
    "Lashanda Carter",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Clarity. Transformation. Legacy.`,
    description: site.description,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/og-image.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

/**
 * Local business schema.
 *
 * `AccountingService` is a subtype of `LocalBusiness`, so this satisfies every
 * LocalBusiness requirement while telling Google specifically what kind of
 * business this is — which is worth more in local results than the generic
 * type. The name, address and phone here must match the SmartTaxIQ site and
 * the Google Business Profile character for character; inconsistent NAP is one
 * of the few things that measurably suppresses local ranking.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  alternateName: [site.dba, site.legalName],
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  founder: { "@type": "Person", name: site.founder },
  foundingDate: String(site.founded),
  areaServed: [
    { "@type": "City", name: "Detroit" },
    { "@type": "State", name: "Michigan" },
    { "@type": "Country", name: "United States" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: streetLine,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: site.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.3853,
    longitude: -82.9401,
  },
  hasMap: site.googleMapsUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:30",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "USD",
  department: {
    "@type": "AccountingService",
    name: site.dba,
    description: `${site.dba} is the tax division of ${site.legalName}.`,
    url: `${site.url}/smarttaxiq`,
    // The business line, not the direct line. Publishing two numbers for one
    // business gives Google two things to reconcile and weakens both.
    telephone: site.phone,
    email: site.taxEmail,
    parentOrganization: { "@type": "Organization", name: site.legalName },
  },
  serviceType: [
    "Tax Preparation",
    "Tax Strategy",
    "Credit Repair",
    "Business Formation",
    "Bookkeeping",
    "Payroll",
    "Small Business Consulting",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
