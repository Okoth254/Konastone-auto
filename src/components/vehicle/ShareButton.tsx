"use client";

import { useState } from "react";
import MotionButton from "@/components/ui/MotionButton";
import { AnimatePresence, motion } from "framer-motion";

export default function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Konastone Autos - ${title}`,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Failed to share: ', err);
        }
    };

    return (
        <div className="relative w-full">
            <MotionButton 
                onClick={handleShare}
                variant="outline"
                className="w-full h-14 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest group"
            >
                <div className="flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-accent-teal group-hover:scale-110 transition-transform">
                        {copied ? "check_circle" : "ios_share"}
                    </span>
                    {copied ? "Link Copied" : "Share Listing"}
                </div>
            </MotionButton>
            
            <AnimatePresence>
                {copied && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-accent-teal text-background-dark rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-20 pointer-events-none"
                    >
                        Ready to Share
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
