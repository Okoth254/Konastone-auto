"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AdminVehicle {
    id: string;
    title: string;
    price: number;
    year: number;
    status: string;
    created_at: string;
    primary_image?: string;
    model_name: string;
    brand_name: string;
}

export default function AdminVehicleList() {
    const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchVehicles = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("cars")
            .select(`
                id, title, price, year, status, created_at,
                models ( name, brands ( name ) ),
                car_images ( image_url )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching vehicles:", error);
        } else if (data) {
            const mapped = data.map((car: any) => {
                // Find primary image or fallback to first
                const primaryImage = car.car_images?.find((img: any) => img.is_primary)?.image_url
                    || car.car_images?.[0]?.image_url
                    || "/images/placeholder.jpg";

                return {
                    id: car.id,
                    title: car.title,
                    price: car.price,
                    year: car.year,
                    status: car.status || "available",
                    created_at: car.created_at,
                    primary_image: primaryImage,
                    model_name: car.models?.name || "Unknown",
                    brand_name: car.models?.brands?.name || "Unknown",
                };
            });
            setVehicles(mapped);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "available" ? "sold" : "available";
        const { error } = await supabase.from("cars").update({ status: newStatus }).eq("id", id);
        if (!error) {
            fetchVehicles();
        } else {
            alert("Failed to update status.");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you completely sure you want to permanently delete '${title}'?`)) return;

        // Supabase foreign keys (ON DELETE CASCADE) will automatically clean up car_images records.
        // We leave the actual bucket files alone for now, or you could loop and delete them here first using lib/storage.ts.
        const { error } = await supabase.from("cars").delete().eq("id", id);
        if (!error) {
            fetchVehicles();
        } else {
            alert("Failed to delete vehicle.");
        }
    };

    const filteredVehicles = vehicles.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-heading tracking-widest text-[#F5F5F5] uppercase">
                        Inventory List
                    </h1>
                    <p className="font-mono text-sm text-[#9CA3AF] mt-2">
                        Manage your active and sold vehicles.
                    </p>
                </div>
                <Link
                    href="/admin/vehicles/add"
                    className="bg-[#FFC107] text-[#111111] px-6 py-3 rounded-lg font-mono uppercase tracking-widest text-sm font-bold hover:bg-[#FFD54F] transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Vehicle
                </Link>
            </header>

            {/* Controls */}
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                        type="text"
                        placeholder="Search by title or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111111] border border-[#333333] rounded-lg pl-10 pr-4 py-3 text-[#F5F5F5] font-mono focus:border-[#FFC107] outline-none"
                    />
                </div>
                <div className="flex bg-[#111111] border border-[#333333] rounded-lg p-1">
                    <div className="px-4 py-2 font-mono text-sm text-[#9CA3AF] border-r border-[#333333]">
                        Total: <span className="text-[#F5F5F5]">{filteredVehicles.length}</span>
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#222222] border-b border-[#333333] font-mono text-[11px] uppercase tracking-widest text-[#9CA3AF]">
                                <th className="p-4 font-normal">Vehicle</th>
                                <th className="p-4 font-normal">Details</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333333]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[#6B7280] font-mono text-sm animate-pulse">Loading inventory...</td>
                                </tr>
                            ) : filteredVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[#6B7280] font-mono text-sm">No vehicles found.</td>
                                </tr>
                            ) : (
                                filteredVehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="hover:bg-[#222222]/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 relative rounded overflow-hidden bg-[#111111] shrink-0 border border-[#333333]">
                                                    {vehicle.primary_image && (
                                                        <Image src={vehicle.primary_image} alt={vehicle.title} fill className="object-cover" unoptimized />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-slab font-bold text-[#F5F5F5] mb-1">{vehicle.title}</p>
                                                    <p className="font-mono text-xs text-[#9CA3AF] uppercase">{vehicle.brand_name} · {vehicle.year}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-mono text-sm text-[#FFC107]">
                                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(vehicle.price)}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleStatus(vehicle.id, vehicle.status)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded font-mono text-xs uppercase tracking-wider transition-colors border ${vehicle.status === "available"
                                                        ? "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20"
                                                        : "bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30 hover:bg-[#E53935]/20"
                                                    }`}
                                            >
                                                {vehicle.status === "available" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {vehicle.status}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/vehicles/${vehicle.id}/edit`}
                                                className="inline-block p-2 text-[#9CA3AF] hover:text-[#26C6DA] hover:bg-[#26C6DA]/10 rounded transition-colors"
                                                title="Edit Vehicle"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(vehicle.id, vehicle.title)}
                                                className="inline-block p-2 text-[#9CA3AF] hover:text-[#E53935] hover:bg-[#E53935]/10 rounded transition-colors"
                                                title="Delete Vehicle"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
