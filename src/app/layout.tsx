import type { Metadata } from "next";
import { Inter, Bebas_Neue, Roboto_Slab, Courier_Prime } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Chatbot } from "@/components/layout/Chatbot";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konastone Autos — Premium Car Dealership in Mombasa, Kenya",
  description: "Buy premium cars in Mombasa at Konastone Autos. Cash, hire purchase & trade-ins available. Wide range of SUV, Sedan, and Hatchbacks in Kenya. Call +254 722 511 803.",
  alternates: {
    canonical: "https://konastoneautos.com",
  },
  keywords: [
    "Konastone Autos",
    "mombasa cars",
    "kenya cars",
    "hire purchase cars",
    "cars for sale Mombasa",
    "car dealership Kenya",
    "used cars Kenya",
    "Mombasa car showroom",
    "best car dealer mombasa",
    "buy cars in kenya"
  ],
  authors: [{ name: "Konastone Autos" }],
  openGraph: {
    title: "Konastone Autos — Best Cars for Sale in Mombasa, Kenya",
    description: "Premium car dealership in Mombasa. Flexible hire purchase and cash deals.",
    url: "https://konastoneautos.com",
    siteName: "Konastone Autos",
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarDealer",
    "name": "Konastone Autos",
    "image": "https://konastoneautos.com/logo.svg",
    "@id": "https://konastoneautos.com",
    "url": "https://konastoneautos.com",
    "telephone": "+254722511803",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mombasa Island",
      "addressLocality": "Mombasa",
      "addressRegion": "Coast",
      "postalCode": "80100",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -4.0435,
      "longitude": 39.6682
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://facebook.com",
      "https://instagram.com",
      "https://tiktok.com",
      "https://youtube.com"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`
          ${inter.variable}
          ${bebasNeue.variable}
          ${robotoSlab.variable}
          ${courierPrime.variable}
          font-sans bg-[#1A1A1A] text-[#F5F5F5]
        `}
      >
        <Header />
        <main className="min-h-screen pt-20 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <Chatbot />
        <ActivityFeed />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
