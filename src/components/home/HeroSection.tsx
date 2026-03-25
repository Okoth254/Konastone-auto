"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ChevronRight, Search, Phone } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { siteConfig } from "@/config/site";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="container-luxury relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-400 w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Premium Automotive Collection
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.1]">
            Drive Your{" "}
            <span className="text-gradient-gold block mt-2">Dreams</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
            Discover our curated collection of luxury vehicles. Every car tells a story of engineering excellence and unparalleled craftsmanship.
          </p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-2 flex flex-col sm:flex-row gap-2 max-w-xl"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by make, model..."
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
              />
            </div>
            <Link href="/inventory" className="btn-premium justify-center whitespace-nowrap bg-primary text-black hover:bg-yellow-400 px-6 py-3 rounded-full font-semibold">
              Search
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Link href="/inventory" className="btn-premium bg-primary text-black hover:bg-yellow-400 px-8 py-4 rounded-full font-semibold group">
              Explore Inventory
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <motion.a
              href={`tel:${siteConfig.contact.phoneFormatted}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-glass px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/10 hover:border-primary/30"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </motion.a>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card animate-float">
            <Image
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=80"
              alt="Luxury Vehicle"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-white font-display">KES 1.5M</p>
                </div>
                <Link href="/inventory" className="px-6 py-3 bg-primary text-black rounded-full font-semibold hover:bg-yellow-400 transition-colors">
                  View Details
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}