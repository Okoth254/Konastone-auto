"use client";

import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { vehicles } from "@/lib/data";

export default function SavedPage() {
    const savedVehicles = vehicles.slice(0, 2);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-trust-900">Saved Vehicles</h2>
            <InventoryGrid vehicles={savedVehicles} mode="hire" />
        </div>
    );
}
