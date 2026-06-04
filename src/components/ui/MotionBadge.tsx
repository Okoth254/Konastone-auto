"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionBadgeProps {
  children: ReactNode;
  color?: "primary" | "secondary" | "neutral" | "danger" | "accent";
  className?: string;
  delay?: number;
  icon?: string;
}

const colorMap = {
  primary: "bg-primary/15 text-primary border-primary/30",
  secondary: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  neutral: "bg-white/5 text-slate-400 border-white/10",
  danger: "bg-red-500/10 text-red-400 border-red-500/30",
  accent: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
};

export default function MotionBadge({
  children,
  color = "neutral",
  className = "",
  delay = 0,
  icon,
}: MotionBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "tween",
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1] as any,
        delay,
      }}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-heading font-black tracking-widest uppercase border rounded-full",
        colorMap[color],
        className,
      ].join(" ")}
    >
      {icon && <span className="material-symbols-outlined text-[12px] leading-none">{icon}</span>}
      {children}
    </motion.span>
  );
}
