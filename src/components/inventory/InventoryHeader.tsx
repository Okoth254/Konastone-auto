"use client";

import { motion } from "framer-motion";

interface InventoryHeaderProps {
  vehicleCount: number;
}

export default function InventoryHeader({ vehicleCount }: InventoryHeaderProps) {
  return (
    <>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="h-px w-24 bg-linear-to-r from-transparent via-primary to-transparent mb-8" />
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-display leading-tight tracking-wider uppercase mb-4">
          Vehicle <span className="text-gradient-gold">Inventory</span>
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-gray-400">{vehicleCount} Vehicles Available</span>
        </div>
      </motion.div>
    </>
  );
}