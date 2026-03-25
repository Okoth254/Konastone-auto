"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/home/AnimatedCounter";

interface KpiCardProps {
    label: string;
    value: number;
    subValue?: string;
    icon: string;
    variant?: "primary" | "secondary" | "neutral";
    delay?: number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function KpiCard({ 
    label, 
    value, 
    subValue, 
    icon, 
    variant = "primary", 
    delay = 0,
    trend 
}: KpiCardProps) {
    const colors = {
        primary: "border-primary text-primary",
        secondary: "border-accent-teal text-accent-teal",
        neutral: "border-white/10 text-slate-400"
    };

    const glows = {
        primary: "bg-primary/5",
        secondary: "bg-accent-teal/5",
        neutral: "bg-white/[0.02]"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden bg-surface-dark/40 backdrop-blur-xl border-l-4 p-8 rounded-[2rem] group transition-all duration-500 hover:bg-surface-dark/60 ${colors[variant]}`}
        >
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-32 h-32 blur-3xl transition-colors duration-500 opacity-20 group-hover:opacity-40 ${glows[variant]}`} />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black font-mono tracking-[0.4em] uppercase opacity-60 mb-1">{label}</p>
                        {trend && (
                            <div className="flex items-center gap-1.5">
                                <span className={`material-symbols-outlined text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {trend.isPositive ? 'trending_up' : 'trending_down'}
                                </span>
                                <span className={`text-[10px] font-black font-mono ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {trend.isPositive ? '+' : ''}{trend.value}%
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                </div>

                <div className="flex items-end gap-3">
                    <h3 className="text-5xl font-heading font-black tracking-tighter text-white">
                        <AnimatedCounter text={value.toString()} />
                    </h3>
                    {subValue && (
                        <span className="text-xs font-black font-mono uppercase tracking-[0.2em] mb-2 opacity-40">{subValue}</span>
                    )}
                </div>

                {/* Telemetry Bars */}
                <div className="mt-8 flex gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 4, opacity: 0.2 }}
                            animate={{ 
                                height: [4, 12, 4],
                                opacity: [0.2, 0.5, 0.2]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                delay: i * 0.15 + (delay % 1)
                            }}
                            className={`w-1 rounded-full ${variant === 'primary' ? 'bg-primary' : variant === 'secondary' ? 'bg-accent-teal' : 'bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
