"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const activities = [
    "John K. started a Hire Purchase plan on a Toyota Prado",
    "Sarah M. just purchased a Mercedes C200",
    "David O. booked a test drive for a Mazda CX-5",
    "Emily W. approved for financing in 15 minutes",
    "Michael N. completed ownership of his Subaru Outback"
];

export function ActivityFeed() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const showTimeout = setTimeout(() => setVisible(true), 2000);
        const cycleInterval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % activities.length);
                setVisible(true);
            }, 500);
        }, 8000);
        return () => {
            clearTimeout(showTimeout);
            clearInterval(cycleInterval);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-24 left-6 bg-[#1E1E1E]/95 backdrop-blur-sm p-4 border border-[#FFC107]/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-40 max-w-xs transition-all duration-500",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
        >
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#FFC107] animate-pulse flex-shrink-0" />
                <p className="font-mono text-xs text-[#D1D5DB] leading-relaxed">
                    {activities[index]}
                </p>
            </div>
        </div>
    );
}
