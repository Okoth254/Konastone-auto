import type { Metadata } from "next";
import { Inter, Bebas_Neue, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://konastoneautos.com'),
  title: {
    default: 'Konastone Autos | Premium Car Dealership in Mombasa, Kenya',
    template: '%s | Konastone Autos',
  },
  description: 'Konastone Autos is Mombasa\'s most trusted car dealership. Browse quality used & new cars — SUVs, sedans, hybrids — with flexible hire purchase and bank finance options.',
  keywords: ['car dealership Mombasa', 'used cars Kenya', 'buy car Mombasa', 'hire purchase Kenya', 'Toyota Mombasa', 'SUV Kenya', 'Konastone Autos'],
  authors: [{ name: 'Konastone Autos' }],
  creator: 'Konastone Autos',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://konastoneautos.com',
    siteName: 'Konastone Autos',
    title: 'Konastone Autos | Premium Car Dealership in Mombasa',
    description: 'Browse quality used & new cars in Mombasa, Kenya. Hire purchase & bank finance available.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Konastone Autos — Premium Cars in Mombasa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konastone Autos | Mombasa Car Dealership',
    description: 'Browse quality cars in Mombasa, Kenya. Flexible finance options available.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoDealer',
              name: 'Konastone Autos',
              url: 'https://konastoneautos.com',
              telephone: '+254722511803',
              email: 'sales@konastoneautos.co.ke',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Moi avenue Mombasa kenya',
                addressLocality: 'Mombasa',
                addressCountry: 'KE',
              },
              openingHours: 'Mo-Sa 08:00-18:00',
              priceRange: 'KES 1M - KES 15M',
            }),
          }}
        />
      </head>
      <body className={`
        ${inter.variable} ${bebasNeue.variable} ${robotoSlab.variable} 
        bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-body antialiased
      `}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
