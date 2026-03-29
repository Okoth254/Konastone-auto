"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 via-(--color-background) to-teal-500/10" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/30 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1] 
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px]"
      />

      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-8"
          >
            <span className="text-4xl">🚗</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Ready to Find Your{" "}
            <span className="text-gradient-gold">Perfect Drive?</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Schedule a private viewing or consultation with our automotive specialists today. Your dream car awaits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/inventory" 
              className="btn-premium text-lg group"
            >
              Browse Inventory
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex gap-4">
              <a 
                href="https://wa.me/254722511803"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass group"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <a 
                href="tel:+254722511803"
                className="btn-glass group"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-sm text-gray-500"
          >
            Or visit our showroom at Moi Avenue, Mombasa • Open Mon-Sat 8AM-6PM
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}