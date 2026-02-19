"use client";

import { Star, Users, ShieldCheck } from "lucide-react";

const stats = [
    {
        icon: Users,
        iconColor: "text-[#26C6DA]",
        iconBg: "bg-[#26C6DA]/10",
        value: "5,000+",
        label: "Happy Car Owners",
    },
    {
        icon: Star,
        iconColor: "text-[#FFC107]",
        iconBg: "bg-[#FFC107]/10",
        value: "4.8",
        suffix: "/5",
        label: "Average Customer Rating",
    },
    {
        icon: ShieldCheck,
        iconColor: "text-[#E53935]",
        iconBg: "bg-[#E53935]/10",
        value: "100%",
        label: "Verified Clean Titles",
    },
];

export function TrustBar() {
    return (
        <section className="relative bg-[#111111]">
            {/* Top yellow line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FFC107] to-transparent" />

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {stats.map(({ icon: Icon, iconColor, iconBg, value, suffix, label }) => (
                        <div key={label} className="flex flex-col items-center group">
                            {/* Icon ring */}
                            <div className={`p-4 ${iconBg} ${iconColor} mb-5 transition-transform duration-300 group-hover:scale-110`}>
                                <Icon className="w-8 h-8" />
                            </div>

                            {/* Big number */}
                            <h3 className="font-slab text-5xl font-bold text-[#FFC107] mb-1 tabular-nums">
                                {value}
                                {suffix && <span className="text-3xl text-[#4B5563]">{suffix}</span>}
                            </h3>

                            {/* Label */}
                            <p className="font-mono text-xs text-[#26C6DA] uppercase tracking-[0.2em] mt-1">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom yellow line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FFC107] to-transparent" />
        </section>
    );
}
