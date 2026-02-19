"use client";

import { Vehicle } from "@/lib/data";
import { VehicleCard } from "./VehicleCard";

interface InventoryGridProps {
    vehicles: Vehicle[];
    mode: "hire" | "buy";
}

export function InventoryGrid({ vehicles, mode }: InventoryGridProps) {
    return (
        <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="font-heading text-3xl uppercase text-[#F5F5F5] tracking-tight">
                    {mode === "hire" ? "Hire Purchase Inventory" : "Cars for Sale"}
                </h2>
                <span className="font-mono text-xs text-[#FFC107] uppercase tracking-widest border border-[#FFC107]/30 px-3 py-1">
                    {vehicles.length} vehicles
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} mode={mode} />
                ))}
            </div>
        </div>
    );
}
