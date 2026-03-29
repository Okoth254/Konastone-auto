"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowUp,
  CreditCard,
  ShieldCheck,
  Award
} from "lucide-react";
import { useState, useEffect } from "react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Careers", href: "/careers" },
    { label: "Press & Media", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  services: [
    { label: "Buy a Car", href: "/inventory" },
    { label: "Sell Your Car", href: "/sell" },
    { label: "Car Finance", href: "/finance" },
    { label: "Car Insurance", href: "/insurance" },
    { label: "Vehicle Service", href: "/service" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Book Test Drive", href: "/test-drive" },
    { label: "Warranty Info", href: "/warranty" },
    { label: "Returns Policy", href: "/returns" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/konastoneautos", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/konastoneautos", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/konastoneautos", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/konastoneautos", label: "LinkedIn" },
];

const businessHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-(--color-surface) border-t border-white/5 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Footer Content */}
      <div className="container-luxury relative z-10 pt-20 pb-12">
        {/* Top Section - Newsletter & Brand */}
        <div className="grid lg:grid-cols-2 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link href="/" className="inline-block group">
              <h2 className="text-4xl font-family-(--font-playfair) font-bold text-white group-hover:text-amber-500 transition-colors duration-300">
                KONA<span className="text-amber-500">STONE</span>
                <span className="text-gray-400 font-normal ml-2">AUTOS</span>
              </h2>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Kenya's premier destination for luxury vehicles. We curate exceptional automobiles 
              and provide unmatched customer service for the discerning driver.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a 
                href="tel:+254722511803" 
                className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+254 722 511 803</span>
              </a>
              
              <a 
                href="mailto:sales@konastoneautos.co.ke" 
                className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>sales@konastoneautos.co.ke</span>
              </a>

              <div className="flex items-start gap-3 text-gray-400 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Moi Avenue, Mombasa, Kenya</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-family-(--font-playfair) font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-400 mb-6">
                Subscribe to receive exclusive offers, new arrivals, and automotive insights.
              </p>

              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Send className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Successfully Subscribed!</p>
                    <p className="text-sm text-gray-400">Check your inbox for confirmation.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn-premium justify-center"
                  >
                    <Send className="w-5 h-5" />
                    Subscribe Newsletter
                  </motion.button>
                </form>
              )}

              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Middle Section - Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16 border-b border-white/10">
          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-amber-500 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-amber-500 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-amber-500 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="col-span-2 md:col-span-1"
          >
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Opening Hours
            </h4>
            <ul className="space-y-3">
              {businessHours.map((schedule) => (
                <li key={schedule.day} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{schedule.day}</span>
                  <span className={`${
                    schedule.hours === "Closed" ? "text-red-400" : "text-amber-500"
                  } font-medium`}>
                    {schedule.hours}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="col-span-2 md:col-span-4 lg:col-span-1"
          >
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Trust & Security
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-colors">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-white text-sm font-medium">Verified Dealer</p>
                  <p className="text-xs text-gray-500">Licensed & Registered</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-colors">
                <Award className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-white text-sm font-medium">Quality Assured</p>
                  <p className="text-xs text-gray-500">150-Point Inspection</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-colors">
                <Clock className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-white text-sm font-medium">15+ Years</p>
                  <p className="text-xs text-gray-500">Industry Experience</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Payment & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <span className="text-gray-500 text-sm">We accept:</span>
            <div className="flex gap-3">
              {["Visa", "Mastercard", "M-Pesa", "Bank Transfer"].map((method) => (
                <div 
                  key={method}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-1.5"
                >
                  <CreditCard className="w-3 h-3" />
                  {method}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Konastone Autos. All rights reserved.
            </p>
            <div className="flex gap-4 mt-2 justify-center md:justify-end text-xs">
              {footerLinks.legal.map((link, index) => (
                <span key={link.label} className="flex items-center gap-4">
                  <Link 
                    href={link.href}
                    className="text-gray-500 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-gray-700">|</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0, 
          scale: showBackToTop ? 1 : 0,
          y: showBackToTop ? 0 : 20
        }}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </footer>
  );
}