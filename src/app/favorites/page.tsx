"use client";

import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { vehicles } from "@/lib/data";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    const { favorites } = useStore();
    const savedVehicles = vehicles.filter(v => favorites.includes(v.id));

    return (
        <div className="min-h-screen bg-[#1A1A1A] py-12">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <p className="font-mono text-xs text-[#26C6DA] uppercase tracking-widest mb-2">Saved</p>
                        <h1 className="font-heading text-5xl uppercase text-[#F5F5F5]">My Favourites</h1>
                    </div>
                    {savedVehicles.length > 0 && (
                        <span className="font-mono text-xs text-[#FFC107] uppercase tracking-widest border border-[#FFC107]/30 px-3 py-1">
                            {savedVehicles.length} saved
                        </span>
                    )}
                </div>

                {savedVehicles.length > 0 ? (
                    <InventoryGrid vehicles={savedVehicles} mode="buy" />
                ) : (
                    <div className="text-center py-24 space-y-4">
                        <Heart className="w-12 h-12 text-[#2D2D2D] mx-auto" />
                        <p className="font-heading text-3xl uppercase text-[#3D3D3D]">No Saved Vehicles</p>
                        <p className="font-mono text-xs text-[#4B5563] uppercase tracking-widest">
                            Tap the heart on any vehicle to save it here.
                        </p>
                        <Link href="/inventory" className="inline-block mt-4 font-mono text-xs text-[#FFC107] uppercase tracking-widest hover:underline">
                            Browse Inventory →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
