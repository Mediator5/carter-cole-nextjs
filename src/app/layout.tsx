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
import { site } from "@/lib/site";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: site.name,
  alternateName: "SmartTaxIQ",
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  founder: { "@type": "Person", name: site.founder },
  foundingDate: String(site.founded),
  areaServed: { "@type": "City", name: "Detroit" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Detroit",
    addressRegion: "MI",
    addressCountry: "US",
  },
  openingHours: "Mo-Th 09:30-17:00",
  priceRange: "$$",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
