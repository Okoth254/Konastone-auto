"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface KpiCardProps {
  index: number;
  children: ReactNode;
  className?: string;
}

/**
 * Client-side wrapper for admin KPI blocks.
 * Provides unified staggered entrance + subtle whileHover lift.
 * index 0 → 0ms, 1 → 120ms, 2 → 240ms
 */
export default function KpiCard({ index, children, className = "" }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.12,
      }}
      whileHover={{ y: -2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
