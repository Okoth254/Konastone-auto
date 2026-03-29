"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Brand logo mapping - using local SVG files downloaded from Wikimedia
const brandLogos: Record<string, string> = {
  'Toyota': "/images/brands/toyota.svg",
  'Mercedes-Benz': "/images/brands/mercedes-benz.svg",
  'BMW': "/images/brands/bmw.svg",
  'Audi': "/images/brands/audi.svg",
  'Porsche': "/images/brands/porsche.svg",
  'Nissan': "/images/brands/nissan.svg",
  'Mazda': "/images/brands/mazda.svg",
  'Subaru': "/images/brands/subaru.svg",
  'Honda': "/images/brands/honda.svg",
  'Land Rover': "/images/brands/land-rover.svg",
  'Volvo': "/images/brands/volvo.svg",
  'Lexus': "/images/brands/lexus.svg",
  'Lamborghini': "/images/brands/lamborghini.svg",
  'Mitsubishi': "/images/brands/mitsubishi.svg",
  'Suzuki': "/images/brands/suzuki.svg",
  'Ford': "/images/brands/ford.svg",
  'Daihatsu': "/images/brands/daihatsu.svg",
  'Volkswagen': "/images/brands/volkswagen.svg",
  'Range Rover': "/images/brands/range-rover.svg",
};

interface BrandCarouselProps {
  makes?: string[];
}

export default function BrandCarousel({ makes = [] }: BrandCarouselProps) {
  // Get all brand names and their logos
  const allBrands = Object.entries(brandLogos);
  
  // Filter to brands that exist in database (case-insensitive match)
  let displayBrands: Array<{ name: string; logo: string }> = [];
  
  if (makes.length > 0) {
    const normalizedMakes = makes.map(m => m.toLowerCase().trim());
    displayBrands = allBrands
      .filter(([name]) => normalizedMakes.includes(name.toLowerCase()))
      .map(([name, logo]) => ({ name, logo }));
  }

  // If no matching brands from database, show all available brands
  if (displayBrands.length === 0) {
    displayBrands = allBrands.map(([name, logo]) => ({ name, logo }));
  }

  // Double the array for seamless infinite scroll
  const duplicatedBrands = [...displayBrands, ...displayBrands];

  return (
    <section className="py-20 bg-header-dark border-y border-white/5 overflow-hidden">
      <div className="container-luxury mb-12">
        <div className="text-center">
          <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-2">Trusted Partners</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
            Browse by Brand
          </h3>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-header-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-header-dark to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <motion.div
          animate={{ x: [0, -50 * displayBrands.length + "%"] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }
          }}
          className="flex gap-12 items-center"
        >
          {duplicatedBrands.map((brand, idx) => (
            <Link
              key={`${brand.name}-${idx}`}
              href={`/inventory?make=${encodeURIComponent(brand.name)}`}
              className="shrink-0 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-32 h-20 opacity-70 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </motion.div>
              <p className="text-center text-sm text-gray-400 group-hover:text-amber-500 transition-colors mt-2">
                {brand.name}
              </p>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* View All Brands Link */}
      <div className="container-luxury mt-12 text-center">
        <Link 
          href="/inventory" 
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors font-medium"
        >
          View All Brands
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </div>
    </section>
  );
}