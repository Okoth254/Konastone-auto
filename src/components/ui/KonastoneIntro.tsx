"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface KonastoneIntroProps {
    onFinish?: () => void;
}

export default function KonastoneIntro({ onFinish }: KonastoneIntroProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onFinish?.();
        }, 4200); // Total duration before exit
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#1A1A1A] overflow-hidden scanline"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    {/* ── LOGO SVG ── */}
                    <motion.div
                        className="w-full max-w-2xl px-6"
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                        }}
                    >
                        {/* Glow halo behind logo */}
                        <motion.div
                            className="absolute inset-0 rounded-full blur-3xl opacity-0 pointer-events-none"
                            style={{
                                background: "radial-gradient(ellipse, rgba(255,193,7,0.15) 0%, transparent 70%)",
                            }}
                            animate={{ opacity: [0, 0.6, 0.3] }}
                            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                        />

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.svg"
                            alt="Konastone Motors"
                            className="w-full h-auto drop-shadow-2xl"
                        />
                    </motion.div>

                    {/* ── TAGLINE ── */}
                    <motion.p
                        className="mt-6 font-slab text-[#E53935] text-2xl md:text-3xl font-bold tracking-[0.25em] uppercase"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 2.4, duration: 0.8, ease: "easeOut" },
                        }}
                    >
                        +254 722 511 803
                    </motion.p>

                    {/* ── LOADING BAR ── */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#FFC107] via-yellow-300 to-[#FFC107]"
                        initial={{ width: "0%" }}
                        animate={{
                            width: "100%",
                            transition: { duration: 3.8, ease: "linear" },
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
