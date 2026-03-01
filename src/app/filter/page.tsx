"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
    { value: "suv", label: "SUV" },
    { value: "sedan", label: "Sedan" },
    { value: "hatchback", label: "Hatchback" },
    { value: "truck", label: "Truck" },
] as const;

function FilterWizardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const modeParam = searchParams.get("mode") || "buy";

    const [brands, setBrands] = useState<string[]>([]);

    // Selections
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(10000000);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchBrands() {
            const { data } = await supabase.from("brands").select("name").order("name") as { data: { name: string }[] | null };
            if (data) {
                setBrands(data.map((b) => b.name));
            }
        }
        fetchBrands();
    }, []);

    const formatPrice = (val: number) =>
        new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(val).replace(".00", "");

    const handleSubmit = () => {
        setIsSubmitting(true);
        const params = new URLSearchParams();
        params.set("mode", modeParam);
        if (selectedBrand) params.set("brand", selectedBrand);
        if (selectedCategory) params.set("category", selectedCategory);
        if (maxPrice < 10000000) params.set("maxPrice", maxPrice.toString());

        // Artificial delay for smooth UX transition
        setTimeout(() => {
            router.push(`/inventory?${params.toString()}`);
        }, 500);
    };

    return (
        <main className="min-h-screen bg-[#1A1A1A] pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FFC107]/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-2xl">
                <div className="text-center mb-10">
                    <p className="font-mono text-xs text-[#26C6DA] uppercase tracking-[0.25em] mb-4">
                        {modeParam === "hire" ? "Hire Purchase Setup" : "Inventory Search"}
                    </p>
                    <h1 className="font-heading text-4xl md:text-5xl uppercase text-[#F5F5F5] mb-4">
                        Find Your Perfect Fit
                    </h1>
                    <p className="font-mono text-sm text-[#9CA3AF]">
                        Tell us what you're looking for to narrow down our premium inventory.
                    </p>
                </div>

                <div className="bg-[#111111] border border-[#2D2D2D] p-8 md:p-12 shadow-2xl relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FFC107]" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#FFC107]" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#FFC107]" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FFC107]" />

                    <div className="space-y-10">
                        {/* 1. Brand */}
                        <div>
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-4 block flex justify-between">
                                <span>1. Select Make (Optional)</span>
                                <span>{selectedBrand || "Any"}</span>
                            </label>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full bg-[#1A1A1A] border-b-2 border-[#2D2D2D] text-[#F5F5F5] font-heading text-xl uppercase p-4 focus:outline-none focus:border-[#FFC107] transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">Any Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Body Type */}
                        <div>
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-4 block">
                                2. Preferred Body Type
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value)}
                                        className={cn(
                                            "py-4 px-2 font-heading uppercase text-sm tracking-widest border transition-all",
                                            selectedCategory === cat.value
                                                ? "bg-[#FFC107] border-[#FFC107] text-black shadow-[0_0_15px_rgba(255,193,7,0.3)]"
                                                : "bg-[#1A1A1A] border-[#2D2D2D] text-[#9CA3AF] hover:border-[#FFC107]/50"
                                        )}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Budget */}
                        {modeParam === "buy" ? (
                            <div>
                                <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-4 flex justify-between">
                                    <span>3. Maximum Budget</span>
                                    <span className="text-[#FFC107] font-bold text-sm">{formatPrice(maxPrice)}</span>
                                </label>
                                <input
                                    type="range"
                                    min={1000000}
                                    max={10000000}
                                    step={100000}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full h-1 bg-[#2D2D2D] appearance-none cursor-pointer accent-[#FFC107]"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="font-mono text-[9px] text-[#4B5563] uppercase">Ksh 1M</span>
                                    <span className="font-mono text-[9px] text-[#4B5563] uppercase">Ksh 10M+</span>
                                </div>
                            </div>
                        ) : null}

                        {/* Submit */}
                        <div className="pt-6 border-t border-[#2D2D2D]">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-6 text-lg relative overflow-hidden group"
                            >
                                <span className={cn("flex items-center gap-2", isSubmitting && "opacity-0")}>
                                    <SlidersHorizontal className="w-5 h-5" />
                                    Show Matching Vehicles
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {isSubmitting && (
                                    <span className="absolute inset-0 flex items-center justify-center font-mono text-sm tracking-widest uppercase">
                                        Searching Database...
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function FilterWizardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-[#FFC107] font-mono tracking-widest uppercase text-sm animate-pulse">Loading...</div>}>
            <FilterWizardContent />
        </Suspense>
    );
}
