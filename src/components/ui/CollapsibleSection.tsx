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
  iconColor = "text-primary-container",
  borderColor = "border-l-primary-container",
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={`bg-surface-container p-8 border-l-4 ${borderColor} space-y-6`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer group"
      >
        <h2 className="font-headline font-black text-xs tracking-widest uppercase flex items-center gap-2">
          <span className={`material-symbols-outlined ${iconColor} text-sm`}>
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