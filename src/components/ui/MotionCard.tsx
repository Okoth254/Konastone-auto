"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  elevate?: boolean;
}

export default function MotionCard({
  children,
  elevate = true,
  className = "",
  ...rest
}: MotionCardProps) {
  return (
    <motion.div
      whileHover={
        elevate
          ? {
              y: -2,
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
            }
          : {}
      }
      transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={["ui-card", className].join(" ")}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
