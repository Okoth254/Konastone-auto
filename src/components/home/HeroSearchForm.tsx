"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";


interface VehicleOption {
    make: string;
    model: string;
}

export default function HeroSearchForm() {
    const router = useRouter();
    const [make, setMake] = useState("all");
    const [model, setModel] = useState("all");
    const [maxPrice, setMaxPrice] = useState("15000000");

    // Autocomplete states
    const [makeSearch, setMakeSearch] = useState("");
    const [modelSearch, setModelSearch] = useState("");
    const [showMakeDropdown, setShowMakeDropdown] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);

    // Dynamic Lists from DB
    const [availableVehicles, setAvailableVehicles] = useState<VehicleOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFilters = async () => {
            setIsLoading(true);
            setError(null);

            const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (!isSupabaseConfigured) {
                setError("Database not configured");
                setIsLoading(false);
                return;
            }

            try {
                const { data, error: fetchError } = await supabase
                    .from('vehicles')
                    .select('make, model')
                    .order('make')
                    .order('model');

                if (fetchError) {
                    setError("Failed to load vehicle data");
                    console.error('Vehicles fetch error:', fetchError);
                } else if (data) {
                    setAvailableVehicles(data);
                }
            } catch (err) {
                setError("Network error loading vehicles");
                console.error('Vehicles fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilters();
    }, []);

    // Computed filtered options
    const filteredMakes = useMemo(() => {
        if (!availableVehicles.length) return [];
        const makes = Array.from(new Set(availableVehicles.map(v => v.make)));
        return makes.filter(m => m.toLowerCase().includes(makeSearch.toLowerCase())).sort();
    }, [availableVehicles, makeSearch]);

    const filteredModels = useMemo(() => {
        if (!availableVehicles.length) return [];
        const models = Array.from(new Set(
            availableVehicles
                .filter(v => make === 'all' || v.make === make)
                .map(v => v.model)
        ));
        return models.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase())).sort();
    }, [availableVehicles, make, modelSearch]);

    useEffect(() => {
        if (make !== 'all' && filteredModels.length > 0 && model !== 'all' && !filteredModels.includes(model)) {
            setModel('all');
            setModelSearch('');
        }
    }, [make, filteredModels, model]);

    const formatPrice = (price: string) => {
        const val = parseInt(price);
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M+`;
        return `${(val / 1000).toFixed(0)}K+`;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (make !== 'all') params.set('make', make);
        if (model !== 'all') params.set('model', model);
        if (maxPrice !== '15000000') params.set('maxPrice', maxPrice);

        router.push(`/inventory?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="make">Make</label>
                <div className="relative">
                    <input
                        type="text"
                        value={make === 'all' ? makeSearch : make}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (make !== 'all') {
                                setMake('all');
                                setModel('all');
                                setModelSearch('');
                            }
                            setMakeSearch(value);
                            setShowMakeDropdown(true);
                        }}
                        onFocus={() => setShowMakeDropdown(true)}
                        onBlur={() => setTimeout(() => setShowMakeDropdown(false), 200)}
                        className="mt-1 block w-full min-h-[44px] pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-header-dark dark:text-white transition-colors"
                        placeholder="Search makes..."
                        id="make"
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        </div>
                    )}
                    {showMakeDropdown && filteredMakes.length > 0 && (
                        <AnimatePresence>
                        <motion.div
                            key="make-dropdown"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute z-10 mt-1 w-full bg-white dark:bg-header-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                        >

                            <div
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                    setMake('all');
                                    setMakeSearch('');
                                    setModel('all');
                                    setModelSearch('');
                                    setShowMakeDropdown(false);
                                }}
                            >
                                All Makes
                            </div>
                            {filteredMakes.map((m) => (
                                <div
                                    key={m}
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        setMake(m);
                                        setMakeSearch(m);
                                        setModel('all');
                                        setModelSearch('');
                                        setShowMakeDropdown(false);
                                    }}
                                >
                                    {m}
                                </div>
                            ))}
                        </motion.div>
                        </AnimatePresence>
                    )}

                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="model">Model</label>
                <div className="relative">
                    <input
                        type="text"
                        value={model === 'all' ? modelSearch : model}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (model !== 'all') {
                                setModel('all');
                            }
                            setModelSearch(value);
                            setShowModelDropdown(true);
                        }}
                        onFocus={() => setShowModelDropdown(true)}
                        onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                        className="mt-1 block w-full min-h-[44px] pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-header-dark dark:text-white transition-colors disabled:opacity-50"
                        placeholder="Search models..."
                        id="model"
                        disabled={isLoading || (make !== 'all' && filteredModels.length === 0)}
                    />
                    {showModelDropdown && filteredModels.length > 0 && (
                        <AnimatePresence>
                        <motion.div
                            key="model-dropdown"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute z-10 mt-1 w-full bg-white dark:bg-header-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                        >

                            <div
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                    setModel('all');
                                    setModelSearch('');
                                    setShowModelDropdown(false);
                                }}
                            >
                                All Models
                            </div>
                            {filteredModels.map((m) => (
                                <div
                                    key={m}
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        setModel(m);
                                        setModelSearch(m);
                                        setShowModelDropdown(false);
                                    }}
                                >
                                    {m}
                                </div>
                            ))}
                        </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
            <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="price">
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
                disabled={isLoading}
                style={{ minWidth: '100%' }}
                className="btn-premium w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-display tracking-widest text-gray-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                        LOADING...
                    </span>
                ) : (
                    'SEARCH INVENTORY'
                )}
            </button>

        </form>
    );
}
