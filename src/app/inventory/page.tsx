"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { getVehicles, type Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

function InventoryContent() {
    const searchParams = useSearchParams();
    const initialMode = searchParams.get("mode") === "buy" ? "buy" : "hire";
    const [mode, setMode] = useState<"hire" | "buy">(initialMode);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        getVehicles().then(setVehicles);
    }, []);

    // Filter states
    const [maxPrice, setMaxPrice] = useState<number>(10000000);
    const [maxMileage, setMaxMileage] = useState<number>(200000);
    const [minYear, setMinYear] = useState<number>(2010);

    const filteredVehicles = vehicles.filter((v) => {
        // Mode filtering
        const matchesMode = mode === "hire"
            ? v.hirePurchaseAvailable === true
            : true; // Everything is available for direct purchase

        const matchesPrice = v.price <= maxPrice;
        const matchesMileage = v.mileage <= maxMileage;
        const matchesYear = v.year >= minYear;

        return matchesMode && matchesPrice && matchesMileage && matchesYear;
    });

    return (
        <div className="min-h-screen bg-[#1A1A1A] flex flex-col">

            {/* Mode Toggle Header */}
            <div className="bg-[#111111] border-b border-[#2D2D2D] py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="font-heading text-2xl uppercase text-[#F5F5F5] hidden md:block">
                        {mode === "hire" ? "Hire Purchase Showroom" : "Direct Sales Inventory"}
                    </h1>

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

            <div className="container mx-auto px-4 py-8 flex items-start gap-8">
                <InventoryFilters
                    mode={mode}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    maxMileage={maxMileage}
                    setMaxMileage={setMaxMileage}
                    minYear={minYear}
                    setMinYear={setMinYear}
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
