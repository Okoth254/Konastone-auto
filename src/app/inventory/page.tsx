"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { getVehicles, type Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Search, X } from "lucide-react";

function InventoryContent() {
    const searchParams = useSearchParams();
    const initialMode = searchParams.get("mode") === "buy" ? "buy" : "hire";
    const initialBrand = searchParams.get("brand") || "";

    const [mode, setMode] = useState<"hire" | "buy">(initialMode);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        getVehicles().then(setVehicles);
    }, []);

    // ── Filter states ──
    const [maxPrice, setMaxPrice] = useState<number>(10000000);
    const [maxMileage, setMaxMileage] = useState<number>(200000);
    const [minYear, setMinYear] = useState<number>(2010);
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        initialBrand ? [initialBrand] : []
    );
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Advanced & Tertiary Filters
    const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
    const [selectedFuelType, setSelectedFuelType] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

    const [searchText, setSearchText] = useState("");

    // Derive unique brands from fetched vehicles
    const availableBrands = useMemo(
        () => [...new Set(vehicles.map((v) => v.make))].sort(),
        [vehicles]
    );

    // Derive available models based on selected brand
    const availableModels = useMemo(() => {
        if (selectedBrands.length === 0) return [];
        const filteredByBrand = vehicles.filter(v => selectedBrands.includes(v.make));
        return [...new Set(filteredByBrand.map(v => v.model))].sort();
    }, [vehicles, selectedBrands]);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const matchesMode =
                mode === "hire" ? v.hirePurchaseAvailable === true : true;

            const matchesPrice = v.price <= maxPrice;
            const matchesMileage = v.mileage <= maxMileage;
            const matchesYear = v.year >= minYear;

            const matchesBrand =
                selectedBrands.length === 0 || selectedBrands.includes(v.make);

            const matchesModel =
                selectedModel === "" || selectedModel === v.model;

            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(v.category);

            const matchesCondition =
                selectedCondition.length === 0 || selectedCondition.includes(v.condition);

            const matchesTransmission =
                selectedTransmission.length === 0 || selectedTransmission.includes(v.transmission);

            const matchesFuelType =
                selectedFuelType.length === 0 || selectedFuelType.includes(v.fuelType);

            const matchesLocation =
                selectedLocation.length === 0 || selectedLocation.includes(v.location);

            const matchesSearch =
                searchText.trim() === "" ||
                `${v.make} ${v.model} ${v.year}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase());

            return (
                matchesMode &&
                matchesPrice &&
                matchesMileage &&
                matchesYear &&
                matchesBrand &&
                matchesModel &&
                matchesCategory &&
                matchesCondition &&
                matchesTransmission &&
                matchesFuelType &&
                matchesLocation &&
                matchesSearch
            );
        });
    }, [
        vehicles, mode, maxPrice, maxMileage, minYear,
        selectedBrands, selectedModel, selectedCategories,
        selectedCondition, selectedTransmission,
        selectedFuelType, selectedLocation, searchText
    ]);

    return (
        <div className="min-h-screen bg-[#1A1A1A] flex flex-col">

            {/* Mode Toggle + Search Header */}
            <div className="bg-[#111111] border-b border-[#2D2D2D] py-4">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="font-heading text-2xl uppercase text-[#F5F5F5] hidden md:block">
                        {mode === "hire" ? "Hire Purchase Showroom" : "Direct Sales Inventory"}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        {/* Inline search bar */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search by make, model…"
                                className="w-full h-10 bg-[#0D0D0D] border border-[#2D2D2D] pl-9 pr-8 font-mono text-xs text-[#D1D5DB] placeholder:text-[#4B5563] focus:outline-none focus:border-[#FFC107] transition-colors"
                            />
                            {searchText && (
                                <button
                                    onClick={() => setSearchText("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF]"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Mode toggle */}
                        <div className="flex bg-[#0D0D0D] border border-[#2D2D2D] p-0.5">
                            <button
                                className={cn(
                                    "px-6 py-2 font-heading uppercase text-sm tracking-widest transition-all",
                                    mode === "hire"
                                        ? "bg-[#FFC107] text-black"
                                        : "text-[#4B5563] hover:text-[#9CA3AF]"
                                )}
                                onClick={() => setMode("hire")}
                            >
                                Hire Purchase
                            </button>
                            <button
                                className={cn(
                                    "px-6 py-2 font-heading uppercase text-sm tracking-widest transition-all",
                                    mode === "buy"
                                        ? "bg-[#E53935] text-white"
                                        : "text-[#4B5563] hover:text-[#9CA3AF]"
                                )}
                                onClick={() => setMode("buy")}
                            >
                                Direct Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex items-start gap-8">
                <InventoryFilters
                    mode={mode}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    maxMileage={maxMileage}
                    setMaxMileage={setMaxMileage}
                    minYear={minYear}
                    setMinYear={setMinYear}
                    availableBrands={availableBrands}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={(brands) => {
                        setSelectedBrands(brands);
                        setSelectedModel(""); // Reset model when brand changes
                    }}
                    availableModels={availableModels}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedCondition={selectedCondition}
                    setSelectedCondition={setSelectedCondition}
                    selectedTransmission={selectedTransmission}
                    setSelectedTransmission={setSelectedTransmission}
                    selectedFuelType={selectedFuelType}
                    setSelectedFuelType={setSelectedFuelType}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                />
                <InventoryGrid vehicles={filteredVehicles} mode={mode} />
            </div>
        </div>
    );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <p className="font-heading text-2xl uppercase text-[#3D3D3D] animate-pulse">Loading Inventory...</p>
            </div>
        }>
            <InventoryContent />
        </Suspense>
    );
}
