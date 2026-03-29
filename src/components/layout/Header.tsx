"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/inventory", label: "Inventory" },
  { href: "/about", label: "About Us" },
  { href: "/reviews", label: "Reviews" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container-luxury h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative group z-50" onClick={closeMenu}>
          <motion.span 
            className="text-2xl font-display font-bold tracking-tight text-white"
            whileHover={{ scale: 1.02 }}
          >
            KONA<span className="text-primary">STONE</span>
            <span className="text-gray-400 font-normal ml-1">AUTOS</span>
          </motion.span>
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-primary"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => {
            const isActive = pathname?.startsWith(link.href) || false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors group"
              >
                <span className={isActive ? "text-white" : ""}>{link.label}</span>
                <motion.span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all ${
                    isActive ? "w-full" : "w-0"
                  }`}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                />
              </Link>
            );
          })}
          
          <motion.a
            href={`tel:${siteConfig.contact.phoneFormatted}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <motion.div
            animate={mobileMenuOpen ? "open" : "closed"}
            className="w-6 h-5 flex flex-col justify-between"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 },
              }}
              className="w-full h-0.5 bg-white origin-left"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              className="w-full h-0.5 bg-white"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 },
              }}
              className="w-full h-0.5 bg-white origin-left"
            />
          </motion.div>
        </button>
      </nav>

    </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="safe-bottom fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl pt-24"
            >
              <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
                {/* Mobile Nav Links */}
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Inventory', href: '/inventory' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Reviews', href: '/reviews' },
                ].map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 260, damping: 26 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`tap-highlight-none block text-3xl font-display tracking-wider py-4 border-b border-white/10 transition-colors ${
                        pathname === link.href ? 'text-primary' : 'text-white hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.35 }}
                  className="mt-auto pb-6 flex flex-col gap-4"
                >
                  <a
                    href={`tel:${siteConfig.contact.phoneFormatted}`}
                    onClick={closeMenu}
                    className="btn-premium bg-primary text-black hover:bg-yellow-400 py-4 rounded-full text-center font-display tracking-widest text-lg transition-colors w-full shadow-lg flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>

                  <div className="mt-6 flex flex-col gap-3 text-sm text-gray-400">
                    <a href={`tel:${siteConfig.contact.phoneFormatted}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-primary">call</span>
                      {siteConfig.contact.phone}
                    </a>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      {siteConfig.contact.address}, {siteConfig.contact.city}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}