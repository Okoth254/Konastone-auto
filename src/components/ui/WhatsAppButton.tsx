"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppButton() {
    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <Link
                href="https://wa.me/254722511803"
                target="_blank"
                className="group relative flex items-center justify-center"
                aria-label="Chat on WhatsApp"
            >
                {/* Ping animation */}
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30"></span>

                {/* Main Button */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95">
                    <MessageCircle className="h-7 w-7 fill-current" />
                </div>

                {/* Tooltip */}
                <div className="absolute right-full mr-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block">
                    <div className="whitespace-nowrap rounded bg-[#111111] border border-[#2D2D2D] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#25D366]">
                        Instant Chat
                    </div>
                </div>
            </Link>
        </div>
    );
}
