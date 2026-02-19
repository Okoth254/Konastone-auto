"use client";

import Link from "next/link";
import { Heart, Gauge, Calendar } from "lucide-react";
import { type Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

interface VehicleCardProps {
    vehicle: Vehicle;
    mode: "hire" | "buy";
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

export function VehicleCard({ vehicle, mode }: VehicleCardProps) {
    const { favorites, toggleFavorite } = useStore();
    const isFavorite = favorites.includes(vehicle.id);

    return (
        <div className="group relative bg-[#1E1E1E] border border-[#2D2D2D] hover:border-[#FFC107]/50 overflow-hidden flex flex-col h-full transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,193,7,0.12)]">

            {/* Yellow top accent bar on hover */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FFC107] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-10" />

            {/* Image Container */}
            <div className="relative h-52 w-full overflow-hidden bg-[#111111]">
                {/* Placeholder */}
                <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <div className="text-[#2D2D2D] font-heading text-4xl uppercase tracking-widest select-none">
                        {vehicle.make}
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {mode === "hire" && vehicle.hirePurchaseAvailable && (
                        <span className="bg-[#FFC107] text-black text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-widest">
                            Hire Purchase
                        </span>
                    )}
                    {mode === "buy" && (
                        <span className="bg-[#E53935] text-white text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-widest">
                            For Sale
                        </span>
                    )}
                </div>

                {/* Favourite Button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(vehicle.id); }}
                    className={cn(
                        "absolute top-3 right-3 p-2 transition-all z-20 border",
                        isFavorite
                            ? "bg-[#E53935]/10 border-[#E53935]/60 text-[#E53935]"
                            : "bg-[#1A1A1A]/80 border-[#2D2D2D] text-[#6B7280] hover:text-[#E53935] hover:border-[#E53935]/40"
                    )}
                >
                    <Heart className={cn("w-4 h-4 transition-all", isFavorite && "fill-current")} />
                </button>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Title + meta */}
                <div className="mb-4">
                    <h3 className="font-heading text-2xl uppercase text-[#F5F5F5] group-hover:text-[#FFC107] transition-colors leading-tight">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>

                    {/* Meta tags */}
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                        {[
                            { icon: Calendar, label: String(vehicle.year) },
                            { icon: Gauge, label: `${vehicle.mileage.toLocaleString()} km` },
                            { icon: null, label: vehicle.fuelType },
                            { icon: null, label: vehicle.transmission },
                        ].map(({ icon: Icon, label }) => (
                            <span key={label} className="flex items-center gap-1 bg-[#111111] border border-[#2D2D2D] px-2 py-1 text-[#9CA3AF]">
                                {Icon && <Icon className="w-3 h-3" />}
                                <span className="font-mono text-[10px] uppercase tracking-wider capitalize">{label}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="mt-auto">
                    {mode === "hire" ? (
                        vehicle.hirePurchaseAvailable ? (
                            <div className="bg-[#111111] border border-[#FFC107]/20 p-4 group-hover:border-[#FFC107]/50 transition-colors">
                                <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Monthly Installment</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="font-slab text-2xl font-bold text-[#FFC107] tabular-nums tracking-tight">
                                        {formatCurrency(vehicle.allowanceMonthly || 0).replace(".00", "")}
                                    </span>
                                    <span className="font-mono text-xs text-[#4B5563]">/mo</span>
                                </div>
                                <p className="font-mono text-[10px] text-[#4B5563] mt-1">
                                    Min. Deposit: <span className="text-[#9CA3AF]">{formatCurrency(vehicle.minDeposit || 0).replace(".00", "")}</span>
                                </p>
                            </div>
                        ) : (
                            <div className="py-4 text-center bg-[#111111] border border-dashed border-[#2D2D2D]">
                                <p className="font-mono text-xs text-[#4B5563] uppercase tracking-widest">Finance Unavailable</p>
                            </div>
                        )
                    ) : (
                        <div className="bg-[#111111] border border-[#2D2D2D] p-4 group-hover:border-[#E53935]/30 transition-colors">
                            <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Cash Price</p>
                            <p className="font-slab text-2xl font-bold text-[#E53935] tabular-nums tracking-tight">
                                {formatCurrency(vehicle.price).replace(".00", "")}
                            </p>
                            <p className="font-mono text-[10px] text-[#26C6DA] mt-1 uppercase tracking-widest">
                                ✓ Ready for Transfer
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Full card link */}
            <Link href={`/vehicle/${vehicle.id}`} className="absolute inset-0 z-20 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-inset">
                <span className="sr-only">View {vehicle.make} {vehicle.model}</span>
            </Link>
        </div>
    );
}
