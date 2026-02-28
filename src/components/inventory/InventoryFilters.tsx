"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { value: "suv", label: "SUV" },
    { value: "sedan", label: "Sedan" },
    { value: "hatchback", label: "Hatchback" },
    { value: "truck", label: "Truck" },
] as const;

interface InventoryFiltersProps {
    mode: "hire" | "buy";
    maxPrice: number;
    setMaxPrice: (val: number) => void;
    maxMileage: number;
    setMaxMileage: (val: number) => void;
    minYear: number;
    setMinYear: (val: number) => void;
    // Brand filter
    availableBrands: string[];
    selectedBrands: string[];
    setSelectedBrands: (brands: string[]) => void;
    // Category filter
    selectedCategories: string[];
    setSelectedCategories: (cats: string[]) => void;
}

export function InventoryFilters({
    mode,
    maxPrice,
    setMaxPrice,
    maxMileage,
    setMaxMileage,
    minYear,
    setMinYear,
    availableBrands,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
}: InventoryFiltersProps) {
    const rangeClass = "w-full h-1 bg-[#2D2D2D] appearance-none cursor-pointer accent-[#FFC107] transition-all";
    const labelClass = "font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-3 block";
    const subLabelClass = "font-mono text-[9px] text-[#4B5563] uppercase tracking-widest";

    const formatPrice = (val: number) =>
        new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(val).replace(".00", "");

    const toggleBrand = (brand: string) => {
        setSelectedBrands(
            selectedBrands.includes(brand)
                ? selectedBrands.filter((b) => b !== brand)
                : [...selectedBrands, brand]
        );
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(
            selectedCategories.includes(cat)
                ? selectedCategories.filter((c) => c !== cat)
                : [...selectedCategories, cat]
        );
    };

    const hasActiveFilters =
        selectedBrands.length > 0 ||
        selectedCategories.length > 0 ||
        maxPrice < 10000000 ||
        maxMileage < 200000 ||
        minYear > 2010;

    return (
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 pr-8 border-r border-[#2D2D2D]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#FFC107]" />
                    <h3 className="font-heading text-xl uppercase text-[#F5F5F5]">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            setSelectedBrands([]);
                            setSelectedCategories([]);
                            setMaxPrice(10000000);
                            setMaxMileage(200000);
                            setMinYear(2010);
                        }}
                        className="font-mono text-[9px] text-[#E53935] uppercase tracking-widest hover:text-[#FFC107] transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Clear All
                    </button>
                )}
            </div>

            {/* ── CATEGORY CHIPS ── */}
            <div>
                <label className={labelClass}>Body Type</label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => toggleCategory(value)}
                            className={cn(
                                "px-3 py-1.5 font-heading text-[10px] uppercase tracking-widest border transition-all",
                                selectedCategories.includes(value)
                                    ? "bg-[#FFC107] border-[#FFC107] text-black"
                                    : "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] hover:border-[#FFC107]/40 hover:text-[#9CA3AF]"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── BRAND PILLS ── */}
            {availableBrands.length > 0 && (
                <div>
                    <label className={labelClass}>Brand</label>
                    <div className="flex flex-wrap gap-2">
                        {availableBrands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => toggleBrand(brand)}
                                className={cn(
                                    "px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all",
                                    selectedBrands.includes(brand)
                                        ? "bg-[#E53935] border-[#E53935] text-white"
                                        : "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] hover:border-[#FFC107]/40 hover:text-[#9CA3AF]"
                                )}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── PRICE / MILEAGE / YEAR (existing, mode-gated) ── */}
            {mode === "hire" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Monthly Budget</label>
                        <input type="range" className={rangeClass} />
                        <div className="flex justify-between mt-1">
                            <span className={subLabelClass}>20k</span>
                            <span className={subLabelClass}>150k+</span>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Deposit Available</label>
                        <input type="range" className={rangeClass} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="hp-insurance" className="rounded-none accent-[#FFC107]" />
                        <label htmlFor="hp-insurance" className="font-mono text-xs text-[#9CA3AF]">Insurance Included</label>
                    </div>
                </div>
            )}

            {mode === "buy" && (
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className={labelClass}>Max Price</label>
                            <span className="font-mono text-[11px] text-[#FFC107]">{formatPrice(maxPrice)}</span>
                        </div>
                        <input
                            type="range"
                            min={1000000}
                            max={10000000}
                            step={100000}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className={rangeClass}
                        />
                        <div className="flex justify-between mt-1">
                            <span className={subLabelClass}>1M</span>
                            <span className={subLabelClass}>10M</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className={labelClass}>Max Mileage</label>
                            <span className="font-mono text-[11px] text-[#FFC107]">{maxMileage.toLocaleString()} km</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={200000}
                            step={5000}
                            value={maxMileage}
                            onChange={(e) => setMaxMileage(Number(e.target.value))}
                            className={rangeClass}
                        />
                        <div className="flex justify-between mt-1">
                            <span className={subLabelClass}>0</span>
                            <span className={subLabelClass}>200k+</span>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Min Year</label>
                        <select
                            value={minYear}
                            onChange={(e) => setMinYear(Number(e.target.value))}
                            className="w-full bg-[#111111] border border-[#2D2D2D] text-[#D1D5DB] font-mono text-xs p-2 focus:outline-none focus:border-[#FFC107] transition-colors"
                        >
                            <option value={2010}>Any Year</option>
                            <option value={2022}>2022+</option>
                            <option value={2020}>2020+</option>
                            <option value={2018}>2018+</option>
                            <option value={2015}>2015+</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
