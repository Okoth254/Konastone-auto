"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Play, 
  Search, 
  ArrowRight,
  ChevronDown 
} from "lucide-react";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&auto=format&fit=crop&q=80",
    title: "Drive Your",
    highlight: "Dreams",
    subtitle: "Discover our curated collection of luxury vehicles. Every car tells a story of engineering excellence.",
  },
  {
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&auto=format&fit=crop&q=80",
    title: "Experience",
    highlight: "Excellence",
    subtitle: "Premium vehicles handpicked for the discerning driver. Quality assured, satisfaction guaranteed.",
  },
  {
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&auto=format&fit=crop&q=80",
    title: "Find Your",
    highlight: "Perfect Match",
    subtitle: "From sleek sedans to powerful SUVs, find the vehicle that matches your lifestyle.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroSlides[currentSlide].image}
            alt="Luxury vehicle"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-linear-to-t from-(--color-background) via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 50, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Content */}
      <div className="container-luxury relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-400 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Premium Automotive Collection
            </motion.div>

            {/* Animated Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1]">
                  {heroSlides[currentSlide].title}
                </h1>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1] text-gradient-gold">
                  {heroSlides[currentSlide].highlight}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-2 max-w-xl"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus-within:border-amber-500/50 transition-colors">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by make, model, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full text-sm"
                  />
                </div>
                <Link 
                  href={`/inventory${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="btn-premium justify-center whitespace-nowrap group"
                >
                  Search
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/inventory" className="btn-premium group">
                Explore Inventory
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-glass group"
              >
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                Watch Video
              </motion.button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-8 border-t border-white/10"
            >
              {[
                { value: "500+", label: "Vehicles" },
                { value: "15+", label: "Years" },
                { value: "2,500+", label: "Happy Clients" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Slide Indicators & Featured Preview */}
          <div className="hidden lg:block relative">
            {/* Slide Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4"
            >
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`block w-12 h-1 rounded-full transition-all duration-500 ${
                    idx === currentSlide 
                      ? "bg-amber-500 w-16" 
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </motion.div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute bottom-0 right-0 glass-card p-6 max-w-xs animate-float"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">New Arrival</p>
                  <p className="text-gray-500 text-xs">Just added today</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                2024 Mercedes-Benz S-Class now available for viewing
              </p>
              <Link 
                href="/inventory" 
                className="text-amber-500 text-sm font-medium hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}