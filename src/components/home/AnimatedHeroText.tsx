"use client";
import { motion } from "framer-motion";

export function AnimatedHeroText() {
    return (
        <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-6xl lg:text-8xl text-white leading-none tracking-tight drop-shadow-lg"
        >
            <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
            >
                DRIVE YOUR
            </motion.span><br />
            <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
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
