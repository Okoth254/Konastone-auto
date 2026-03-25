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
  primary: "bg-primary-container/15 text-primary-container border-primary-container/30",
  secondary: "bg-admin-secondary/15 text-admin-secondary border-admin-secondary/30",
  neutral: "bg-zinc-800 text-zinc-400 border-zinc-700",
  danger: "bg-red-900/20 text-red-400 border-red-800/40",
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
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-headline font-black tracking-widest uppercase border rounded-xs",
        colorMap[color],
        className,
      ].join(" ")}
    >
      {icon && <span className="material-symbols-outlined text-[12px] leading-none">{icon}</span>}
      {children}
    </motion.span>
  );
}
