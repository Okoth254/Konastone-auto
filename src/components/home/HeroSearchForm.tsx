"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HeroSearchForm() {
    const router = useRouter();
    const [make, setMake] = useState("all");
    const [model, setModel] = useState("all");
    const [maxPrice, setMaxPrice] = useState("15000000");

    // Dynamic Lists from DB
    const [availableMakes, setAvailableMakes] = useState<string[]>([]);
    const [availableModels, setAvailableModels] = useState<string[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (!isSupabaseConfigured) return;

            const { data, error } = await supabase.from('vehicles').select('make, model');

            if (data && !error) {
                const uniqueMakes = Array.from(new Set(data.map(v => v.make))).sort();
                setAvailableMakes(uniqueMakes);

                // Filter models based on the selected make, if any
                const filteredData = make === 'all' ? data : data.filter(v => v.make === make);
                const uniqueModels = Array.from(new Set(filteredData.map(v => v.model))).sort();
                setAvailableModels(uniqueModels);
            }
        };

        fetchFilters();
    }, [make]);

    useEffect(() => {
        if (make !== 'all' && availableModels.length > 0 && model !== 'all' && !availableModels.includes(model)) {
            setModel('all');
        }
    }, [make, availableModels, model]);

    const formatPrice = (price: string) => {
        const val = parseInt(price);
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M+`;
        return `${(val / 1000).toFixed(0)}K+`;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        let params = new URLSearchParams();
        if (make !== 'all') params.set('make', make);
        if (model !== 'all') params.set('model', model);
        if (maxPrice !== '15000000') params.set('maxPrice', maxPrice);

        router.push(`/inventory?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="make">Make</label>
                <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-header-dark dark:text-white transition-colors"
                    id="make"
                >
                    <option value="all">All Makes</option>
                    {availableMakes.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="model">Model</label>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-header-dark dark:text-white transition-colors"
                    id="model"
                >
                    <option value="all">All Models</option>
                    {availableModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="flex justify-between block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="price">
                    <span>Max Price</span>
                    <span className="text-primary font-bold">Ksh {formatPrice(maxPrice)}</span>
                </label>
                <input
                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                    id="price"
                    max="15000000"
                    min="1000000"
                    step="500000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    type="range"
                />
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-display tracking-widest text-gray-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
                SEARCH INVENTORY
            </button>
        </form>
    );
}
