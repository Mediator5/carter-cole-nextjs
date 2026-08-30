/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Legacy WordPress URLs from the old site → new structure.
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
      { source: "/blog/:slug", destination: "/resources/:slug", permanent: true },
      { source: "/pricing", destination: "/services", permanent: true },
      { source: "/join-us", destination: "/contact", permanent: true },
      { source: "/client-sign-up", destination: "/book", permanent: true },
      { source: "/offers", destination: "/services", permanent: true },
      { source: "/e-books", destination: "/resources", permanent: true },
      { source: "/ebooks", destination: "/resources", permanent: true },
      // SmartTaxIQ.com landing paths → tax division section.
      { source: "/smart-tax-iq", destination: "/smarttaxiq", permanent: true },
      { source: "/tax", destination: "/smarttaxiq", permanent: true },
      { source: "/taxes", destination: "/smarttaxiq", permanent: true },
      { source: "/how-it-works", destination: "/smarttaxiq", permanent: true },
      { source: "/faq", destination: "/smarttaxiq#start", permanent: true },
      { source: "/get-started", destination: "/book", permanent: true },
      { source: "/testimonials", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
