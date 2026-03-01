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
    // Core search
    availableBrands: string[];
    selectedBrands: string[];
    setSelectedBrands: (brands: string[]) => void;
    availableModels: string[];
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    selectedCategories: string[];
    setSelectedCategories: (cats: string[]) => void;
    selectedCondition: string[];
    setSelectedCondition: (conds: string[]) => void;
    // Tertiary
    selectedTransmission: string[];
    setSelectedTransmission: (trans: string[]) => void;
    selectedFuelType: string[];
    setSelectedFuelType: (fuels: string[]) => void;
    selectedLocation: string[];
    setSelectedLocation: (locs: string[]) => void;
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
    availableModels,
    selectedModel,
    setSelectedModel,
    selectedCategories,
    setSelectedCategories,
    selectedCondition,
    setSelectedCondition,
    selectedTransmission,
    setSelectedTransmission,
    selectedFuelType,
    setSelectedFuelType,
    selectedLocation,
    setSelectedLocation,
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

    const toggleArrayFilter = (
        val: string,
        current: string[],
        setter: (arr: string[]) => void
    ) => {
        setter(current.includes(val) ? current.filter((v) => v !== val) : [...current, val]);
    };

    const hasActiveFilters =
        selectedBrands.length > 0 ||
        selectedModel !== "" ||
        selectedCategories.length > 0 ||
        selectedCondition.length > 0 ||
        selectedTransmission.length > 0 ||
        selectedFuelType.length > 0 ||
        selectedLocation.length > 0 ||
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
                            setSelectedModel("");
                            setSelectedCategories([]);
                            setSelectedCondition([]);
                            setSelectedTransmission([]);
                            setSelectedFuelType([]);
                            setSelectedLocation([]);
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

            {/* ── CORE SEARCH FILTERS ── */}
            <div className="space-y-6 pb-6 border-b border-[#2D2D2D]">
                {/* Brand & Model Dropdowns */}
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Brand (Make)</label>
                        <select
                            value={selectedBrands[0] || ""}
                            onChange={(e) => setSelectedBrands(e.target.value ? [e.target.value] : [])}
                            className="w-full bg-[#111111] border border-[#2D2D2D] text-[#D1D5DB] font-mono text-xs p-2 focus:outline-none focus:border-[#FFC107] transition-colors"
                        >
                            <option value="">Any Brand</option>
                            {availableBrands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Model</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            disabled={selectedBrands.length === 0}
                            className={cn(
                                "w-full border font-mono text-xs p-2 focus:outline-none transition-colors",
                                selectedBrands.length === 0
                                    ? "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] cursor-not-allowed opacity-50"
                                    : "bg-[#111111] border-[#2D2D2D] text-[#D1D5DB] focus:border-[#FFC107]"
                            )}
                        >
                            <option value="">Any Model</option>
                            {availableModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                        {selectedBrands.length === 0 && (
                            <span className="text-[9px] font-mono text-[#E53935] mt-1 block">Select brand first</span>
                        )}
                    </div>
                </div>

                {/* Condition */}
                <div>
                    <label className={labelClass}>Condition</label>
                    <div className="flex flex-wrap gap-2">
                        {["New", "Used"].map((cond) => (
                            <button
                                key={cond}
                                onClick={() => toggleArrayFilter(cond, selectedCondition, setSelectedCondition)}
                                className={cn(
                                    "px-3 py-1.5 font-heading text-[10px] uppercase tracking-widest border transition-all",
                                    selectedCondition.includes(cond)
                                        ? "bg-[#FFC107] border-[#FFC107] text-black"
                                        : "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] hover:border-[#FFC107]/40 hover:text-[#9CA3AF]"
                                )}
                            >
                                {cond}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body Type (Categories) */}
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
            </div>

            {/* ── SECONDARY FILTERS (RANGES) ── */}
            <div className="space-y-6 pb-6 border-b border-[#2D2D2D]">
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

            {/* ── TERTIARY FILTERS ── */}
            <div className="space-y-6">
                <div>
                    <label className={labelClass}>Transmission</label>
                    <div className="flex flex-wrap gap-2">
                        {["Automatic", "Manual", "Tiptronic"].map((trans) => (
                            <button
                                key={trans}
                                onClick={() => toggleArrayFilter(trans.toLowerCase(), selectedTransmission, setSelectedTransmission)}
                                className={cn(
                                    "px-3 py-1.5 font-heading text-[10px] uppercase tracking-widest border transition-all",
                                    selectedTransmission.includes(trans.toLowerCase())
                                        ? "bg-[#FFC107] border-[#FFC107] text-black"
                                        : "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] hover:border-[#FFC107]/40 hover:text-[#9CA3AF]"
                                )}
                            >
                                {trans}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Fuel Type</label>
                    <div className="flex flex-wrap gap-2">
                        {["Petrol", "Diesel", "Hybrid", "Electric"].map((fuel) => (
                            <button
                                key={fuel}
                                onClick={() => toggleArrayFilter(fuel.toLowerCase(), selectedFuelType, setSelectedFuelType)}
                                className={cn(
                                    "px-3 py-1.5 font-heading text-[10px] uppercase tracking-widest border transition-all",
                                    selectedFuelType.includes(fuel.toLowerCase())
                                        ? "bg-[#FFC107] border-[#FFC107] text-black"
                                        : "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] hover:border-[#FFC107]/40 hover:text-[#9CA3AF]"
                                )}
                            >
                                {fuel}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Location</label>
                    <select
                        value={selectedLocation[0] || ""}
                        onChange={(e) => setSelectedLocation(e.target.value ? [e.target.value] : [])}
                        className="w-full bg-[#111111] border border-[#2D2D2D] text-[#D1D5DB] font-mono text-xs p-2 focus:outline-none focus:border-[#FFC107] transition-colors"
                    >
                        <option value="">Any Branch</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Nairobi">Nairobi</option>
                        <option value="Kisumu">Kisumu</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
