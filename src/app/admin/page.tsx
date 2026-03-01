"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CarFront, Tags, Image as ImageIcon, PlusCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCars: 0,
        availableCars: 0,
        totalBrands: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch Cars count
                const { count: totalCars, error: carError } = await supabase
                    .from("cars")
                    .select("*", { count: "exact", head: true });

                const { count: availableCars, error: availError } = await supabase
                    .from("cars")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "available");

                // Fetch Brands count
                const { count: totalBrands, error: brandError } = await supabase
                    .from("brands")
                    .select("*", { count: "exact", head: true });

                if (carError || availError || brandError) throw carError;

                setStats({
                    totalCars: totalCars || 0,
                    availableCars: availableCars || 0,
                    totalBrands: totalBrands || 0,
                });
            } catch (error) {
                console.error("Failed to load dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    const cards = [
        {
            title: "Total Inventory",
            value: isLoading ? "-" : stats.totalCars,
            desc: `${stats.availableCars} currently available`,
            icon: <CarFront className="w-6 h-6 text-[#FFC107]" />,
            link: "/admin/vehicles",
        },
        {
            title: "Active Brands",
            value: isLoading ? "-" : stats.totalBrands,
            desc: "Managed in taxonomy",
            icon: <Tags className="w-6 h-6 text-[#26C6DA]" />,
            link: "/admin/taxonomy",
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-heading tracking-widest text-[#F5F5F5] uppercase">
                    Dashboard Overview
                </h1>
                <p className="font-mono text-sm text-[#9CA3AF] mt-2">
                    Manage your showroom inventory and vehicle data.
                </p>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#111111] rounded-lg border border-[#333333]">
                                {card.icon}
                            </div>
                            <Link href={card.link} className="p-2 text-[#6B7280] hover:text-[#F5F5F5] transition-colors rounded-full hover:bg-[#333333]">
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div>
                            <p className="font-mono text-xs tracking-widest text-[#9CA3AF] uppercase mb-1">
                                {card.title}
                            </p>
                            <h3 className="text-4xl font-slab font-bold text-[#F5F5F5] mb-2 tracking-wider drop-shadow-sm">
                                {card.value}
                            </h3>
                            <p className="font-mono text-sm text-[#4B5563]">
                                {card.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-heading tracking-widest text-[#F5F5F5] uppercase mb-6">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/admin/vehicles/add" className="flex items-center gap-4 bg-[#FFC107] hover:bg-[#FFD54F] text-[#111111] p-4 rounded-xl transition-colors group">
                        <div className="bg-[#111111]/10 p-2 rounded-lg">
                            <PlusCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-slab font-bold tracking-widest text-lg">Add Vehicle</h4>
                            <p className="font-mono text-xs opacity-80 mt-1">Upload a new car to inventory</p>
                        </div>
                    </Link>

                    <Link href="/admin/taxonomy" className="flex items-center gap-4 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-[#F5F5F5] p-4 rounded-xl transition-colors group">
                        <div className="bg-[#111111] p-2 rounded-lg border border-[#333333]">
                            <Tags className="w-6 h-6 text-[#26C6DA]" />
                        </div>
                        <div>
                            <h4 className="font-mono tracking-widest text-sm text-[#F5F5F5]">Manage Brands</h4>
                            <p className="font-mono text-xs text-[#6B7280] mt-1">Add or edit vehicle makes</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
