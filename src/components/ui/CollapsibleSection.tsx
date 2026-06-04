"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  iconColor?: string;
  borderColor?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  iconColor = "text-primary",
  borderColor = "border-primary/20",
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={`bg-surface-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border ${borderColor} space-y-6`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer group"
      >
        <h2 className="font-heading font-black text-xs tracking-[0.3em] uppercase flex items-center gap-3 text-white">
          <span className={`material-symbols-outlined ${iconColor} text-lg`}>
            {icon}
          </span>
          {title}
        </h2>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="material-symbols-outlined text-zinc-600 group-hover:text-zinc-400 transition-colors"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}