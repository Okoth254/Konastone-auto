import type { Metadata } from "next";
import { Inter, Bebas_Neue, Roboto_Slab, Courier_Prime } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Chatbot } from "@/components/layout/Chatbot";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Toaster } from "@/components/ui/sonner";

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
  title: "Konastone Motors — Mombasa's Premier Dealership",
  description: "Premium cars in Mombasa. Cash, hire purchase & trade-ins available. Call +254 722 511 803.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        <Toaster />
      </body>
    </html>
  );
}
