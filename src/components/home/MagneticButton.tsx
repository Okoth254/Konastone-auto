"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import type { MouseEvent } from "react";

interface MagneticButtonProps {
    href: string;
    label: string;
    className?: string;
}

export function MagneticButton({ href, label, className = "" }: MagneticButtonProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.3 });
    const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.3 });

    const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const localX = e.clientX - rect.left - rect.width / 2;
        const localY = e.clientY - rect.top - rect.height / 2;
        x.set(localX * 0.18);
        y.set(localY * 0.18);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div style={{ x: springX, y: springY }}>
            <Link
                href={href}
                onMouseMove={onMove}
                onMouseLeave={reset}
                onBlur={reset}
                className={`inline-flex items-center gap-2 rounded-full bg-primary text-gray-900 px-7 py-3 font-display tracking-widest text-base shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:bg-yellow-400 transition-colors ${className}`}
            >
                {label}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
        </motion.div>
    );
}
