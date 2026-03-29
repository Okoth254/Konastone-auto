"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AnimatedHeroText() {
    const ref = useRef<HTMLHeadingElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    // Low-amplitude parallax — desktop only; capped at -18px
    const y = useTransform(scrollYProgress, [0, 1], [0, -18]);

    return (
        <motion.h1
            ref={ref}
            style={{ y }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative font-display text-6xl lg:text-8xl text-white leading-none tracking-tight drop-shadow-lg max-sm:text-5xl"
        >
            <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
            >
                DRIVE YOUR
            </motion.span><br />
            {/* DREAM shimmer — subtle opacity pulse every ~8s */}
            <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [1, 0.72, 1], scale: 1 }}
                transition={{
                    scale: { duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 },
                    opacity: { duration: 0.6, delay: 0.6, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 7.4 }
                }}
                className="text-primary inline-block origin-left"
            >
                DREAM.
            </motion.span><br />
            <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-block"
            >
                OWN IT TODAY.
            </motion.span>
        </motion.h1>
    );
}

