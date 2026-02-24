"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const } },
};

export function SplitScreenHero() {
    return (
        <section className="relative h-[calc(100vh)] flex flex-col lg:flex-row overflow-hidden">

            {/* ─── LEFT — HIRE PURCHASE (60%) ─────────────────────────── */}
            <div className="relative w-full lg:w-[60%] h-[60vh] lg:h-full bg-[#111111] text-white overflow-hidden group">

                {/* Diagonal yellow accent stripe (top-right corner) */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] opacity-10 pointer-events-none"
                    style={{ background: "repeating-linear-gradient(-45deg,#FFC107,#FFC107 4px,transparent 4px,transparent 14px)" }}
                />

                {/* Background lifestyle image */}
                <div className="absolute inset-0 bg-[url('/images/lifestyle-drive.svg')] bg-cover bg-center opacity-20 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                {/* Scanline overlay */}
                <div className="absolute inset-0 scanline pointer-events-none opacity-40" />
                {/* Edge gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-[#111111]/30" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
                    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">

                        {/* Eyebrow */}
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 border border-[#FFC107]/40 bg-[#FFC107]/5 text-[#FFC107] text-xs font-mono uppercase tracking-widest">
                            <span className="w-2 h-2 bg-[#FFC107] animate-pulse rounded-full" />
                            Flexible Ownership · Mombasa
                        </motion.div>

                        {/* Big Headline */}
                        <motion.h1 variants={itemVariants}
                            className="font-heading text-grunge text-7xl lg:text-[100px] leading-[0.95] tracking-tight text-[#F5F5F5] uppercase">
                            <span className="sr-only">Premium Cars for Sale in Mombasa - Konastone Autos Kenya</span>
                            Drive Now.{" "}
                            <br />
                            <span className="text-[#FFC107]">Pay Over</span>
                            <br />
                            Time.
                        </motion.h1>

                        <motion.p variants={itemVariants} className="font-mono text-sm text-[#9CA3AF] max-w-sm leading-relaxed tracking-wide">
                            Structured ownership with transparent monthly payments. No hidden fees. Instant digital approval.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link href="/inventory?mode=hire">
                                <Button size="lg" className="bg-[#FFC107] hover:bg-[#E6AC00] text-black font-heading uppercase tracking-widest text-base border-0 rounded-sm shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)] transition-all">
                                    Start Hire Purchase
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280] tracking-widest uppercase">
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#26C6DA]" /> Digital Approval</span>
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#26C6DA]" /> Insurance Included</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Calculator teaser card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="hidden lg:block absolute bottom-12 right-12 bg-[#1A1A1A]/90 backdrop-blur-md border border-[#FFC107]/20 p-6 max-w-xs"
                    >
                        <p className="text-[10px] font-mono text-[#6B7280] mb-2 uppercase tracking-widest">Estimated Monthly</p>
                        <div className="text-3xl font-slab font-bold tracking-tight text-[#FFC107]">KES 45,000</div>
                        <div className="w-full bg-[#2D2D2D] h-1.5 mt-4 mb-2">
                            <div className="bg-[#FFC107] h-full w-1/3" />
                        </div>
                        <p className="text-xs font-mono text-[#4B5563]">Based on 30% deposit &amp; 48 months</p>
                    </motion.div>
                </div>
            </div>

            {/* ─── RIGHT — DIRECT PURCHASE (40%) ─────────────────────── */}
            <div className="relative w-full lg:w-[40%] h-[40vh] lg:h-full bg-[#1A1A1A] text-white overflow-hidden group">

                {/* Car visual */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 transition-transform duration-700 group-hover:scale-105">
                    <div className="w-[80%] h-[60%] bg-contain bg-no-repeat bg-center bg-[url('/images/studio-car.svg')] opacity-60 mix-blend-luminosity" />
                </div>

                {/* Vertical Yellow line accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#FFC107]/60 to-transparent" />

                <div className="relative h-full flex flex-col justify-center px-8 md:px-12 z-10">
                    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>

                        <motion.div variants={itemVariants} className="inline-block px-3 py-1 border border-[#E53935]/40 bg-[#E53935]/10 text-[#E53935] text-xs font-mono uppercase tracking-widest">
                            Ready for Transfer
                        </motion.div>

                        <motion.h2 variants={itemVariants} className="font-heading text-grunge text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#F5F5F5] uppercase">
                            Own It <br />
                            <span className="text-[#FFC107]">Today.</span>
                        </motion.h2>

                        <motion.p variants={itemVariants} className="font-mono text-sm text-[#9CA3AF] max-w-xs leading-relaxed tracking-wide">
                            Premium inventory ready for immediate transfer. Competitive pricing. Clean titles.
                        </motion.p>

                        <motion.div variants={itemVariants}>
                            <Link href="/inventory?mode=buy">
                                <Button variant="outline" size="lg"
                                    className="border-[#FFC107] border-2 text-[#FFC107] bg-transparent hover:bg-[#FFC107] hover:text-black font-heading uppercase tracking-widest text-base rounded-sm transition-all">
                                    Browse Inventory
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
