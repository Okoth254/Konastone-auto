"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InventorySidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Dynamic Lists from DB
    const [availableMakes, setAvailableMakes] = useState<string[]>([]);
    const [availableModels, setAvailableModels] = useState<string[]>([]);

    // Local state for instant UI feedback before navigation
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [make, setMake] = useState(searchParams.get("make") || "all");
    const [model, setModel] = useState(searchParams.get("model") || "all");
    const [minYear, setMinYear] = useState(searchParams.get("minYear") || "2015");
    const [maxYear] = useState(searchParams.get("maxYear") || "2024");

    // Instead of a true double-slider which is complex to build custom,
    // we use a simpler set of ranges for price
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "15000000");

    // createQueryString was removed because it was unused

    const [isOpen, setIsOpen] = useState(false);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (status !== 'all') params.set('status', status);
        if (make !== 'all') params.set('make', make);
        if (model !== 'all') params.set('model', model);
        if (minYear !== '2015') params.set('minYear', minYear);
        if (maxYear !== '2024') params.set('maxYear', maxYear);
        if (maxPrice !== '15000000') params.set('maxPrice', maxPrice);

        router.push(`/inventory?${params.toString()}`);
        setIsOpen(false);
    };

    // Fetch distinct makes and models from Supabase
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
    }, [make]); // Re-fetch when make changes to update models

    const formatPrice = (price: string) => {
        const val = parseInt(price);
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        return `${(val / 1000).toFixed(0)}K`;
    };

    // Auto-apply if a dependency changes?
    useEffect(() => {
        // If the selected make changes and the current model is not applicable, reset model
        if (make !== 'all' && availableModels.length > 0 && model !== 'all' && !availableModels.includes(model)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setModel('all');
        }
    }, [make, availableModels, model]);

    // Prevent body scroll when mobile sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Toggle Button (Sticky) */}
            <div className="lg:hidden sticky top-[72px] z-30 bg-background-dark/95 backdrop-blur-md py-4 border-b border-border-subtle mb-2 flex justify-between items-center px-2">
                <span className="font-heading tracking-wide text-slate-200">Refine Search</span>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-surface-dark border border-border-subtle rounded-full text-slate-300 btn-sweep shadow-lg"
                >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    Filters
                </button>
            </div>

            {/* Desktop Sidebar OR Mobile Bottom Sheet */}
            <aside className={`
                w-full lg:w-[280px] shrink-0 flex-col gap-6
                ${isOpen ? 'fixed inset-0 z-50 flex bg-background-dark/80 backdrop-blur-sm lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:backdrop-filter-none' : 'hidden lg:flex'}
            `}>
                {/* Overlay click to close on mobile */}
                {isOpen && (
                    <div className="absolute inset-0 lg:hidden" onClick={() => setIsOpen(false)}></div>
                )}

                <div className={`
                    bg-card-bg lg:border lg:border-border-color lg:rounded-lg p-5 flex flex-col gap-5 shadow-2xl relative
                    ${isOpen ? 'mt-auto max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border-subtle lg:mt-0 lg:max-h-none lg:rounded-lg lg:border-t-0' : ''}
                `}>
                    {/* Mobile Header & Close Button */}
                    <div className="flex justify-between items-center lg:hidden mb-2">
                        <h3 className="text-white font-display text-xl tracking-wider uppercase">Filters</h3>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white bg-surface-dark rounded-full transition-colors border border-border-subtle">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <h3 className="text-white font-display text-xl tracking-wider uppercase mb-2 hidden lg:block">Filter By Status</h3>
                    
                    <div className="flex flex-col gap-3">
                        <label className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${status === 'all' ? 'bg-primary/10 border border-primary/30' : 'bg-card-bg-hover border border-border-color hover:border-primary/50'}`}>
                            <input checked={status === 'all'} onChange={() => setStatus('all')} className="hidden" name="status" type="radio" value="all" />
                            <div className={`w-4 h-4 rounded-full border-2 ${status === 'all' ? 'border-primary' : 'border-slate-500'} flex items-center justify-center`}>
                                {status === 'all' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                            </div>
                            <span className={`${status === 'all' ? 'text-white' : 'text-slate-300'} font-display tracking-wider uppercase text-lg`}>ALL</span>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${status === 'new' ? 'bg-primary/10 border border-primary/30' : 'bg-card-bg-hover border border-border-color hover:border-primary/50'}`}>
                            <input checked={status === 'new'} onChange={() => setStatus('new')} className="hidden" name="status" type="radio" value="new" />
                            <div className={`w-4 h-4 rounded-full border-2 ${status === 'new' ? 'border-primary' : 'border-slate-500'} flex items-center justify-center`}>
                                {status === 'new' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                            </div>
                            <span className={`${status === 'new' ? 'text-white' : 'text-slate-300'} font-display tracking-wider uppercase text-lg`}>NEW ARRIVALS!!!</span>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${status === 'foreign' ? 'bg-primary/10 border border-primary/30' : 'bg-card-bg-hover border border-border-color hover:border-primary/50'}`}>
                            <input checked={status === 'foreign'} onChange={() => setStatus('foreign')} className="hidden" name="status" type="radio" value="foreign" />
                            <div className={`w-4 h-4 rounded-full border-2 ${status === 'foreign' ? 'border-primary' : 'border-slate-500'} flex items-center justify-center`}>
                                {status === 'foreign' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                            </div>
                            <span className={`${status === 'foreign' ? 'text-white' : 'text-slate-300'} font-display tracking-wider uppercase text-lg`}>FOREIGN USED</span>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${status === 'shipment' ? 'bg-primary/10 border border-primary/30' : 'bg-card-bg-hover border border-border-color hover:border-primary/50'}`}>
                            <input checked={status === 'shipment'} onChange={() => setStatus('shipment')} className="hidden" name="status" type="radio" value="shipment" />
                            <div className={`w-4 h-4 rounded-full border-2 ${status === 'shipment' ? 'border-primary' : 'border-slate-500'} flex items-center justify-center`}>
                                {status === 'shipment' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                            </div>
                            <span className={`${status === 'shipment' ? 'text-white' : 'text-slate-300'} font-display tracking-wider uppercase text-lg`}>ON SHIPMENT</span>
                        </label>
                    </div>
                    <div className="h-px bg-border-color my-2"></div>

                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Make</span>
                            <select
                                value={make}
                                onChange={(e) => setMake(e.target.value)}
                                className="form-input flex w-full resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-1 border border-border-color bg-card-bg-hover focus:border-primary focus:ring-primary h-12 p-3 text-sm font-medium"
                            >
                                <option className="text-black" value="all">All Makes</option>
                                {availableMakes.map((m) => (
                                    <option key={m} className="text-black" value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Model</span>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="form-input flex w-full resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-1 border border-border-color bg-card-bg-hover focus:border-primary focus:ring-primary h-12 p-3 text-sm font-medium"
                            >
                                <option className="text-black" value="all">All Models</option>
                                {availableModels.map((m) => (
                                    <option key={m} className="text-black" value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="h-px bg-border-color my-2"></div>

                    {/* Year Selection */}
                    <div className="flex flex-col gap-4">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Min Year</span>
                        <div className="flex items-center justify-between text-white text-sm font-mono bg-card-bg-hover px-2 py-1 rounded">
                            <span>{minYear}</span>
                            <span className="text-primary">-</span>
                            <span>{maxYear}</span>
                        </div>
                        <input
                            className="w-full accent-primary mt-2"
                            type="range"
                            min="2010"
                            max="2025"
                            step="1"
                            value={minYear}
                            onChange={(e) => setMinYear(e.target.value)}
                        />
                    </div>

                    <div className="h-px bg-border-color my-2"></div>

                    {/* Max Price Selection */}
                    <div className="flex flex-col gap-4">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Max Price (KES)</span>
                        <div className="flex items-center justify-between text-white text-sm font-mono bg-card-bg-hover px-2 py-1 rounded">
                            <span>0</span>
                            <span className="text-primary">-</span>
                            <span>{formatPrice(maxPrice)}</span>
                        </div>
                        <input
                            className="w-full accent-primary mt-2"
                            type="range"
                            min="1000000"
                            max="15000000"
                            step="500000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={applyFilters}
                        className="w-full mt-4 h-12 rounded bg-primary text-card-bg transition-colors font-display tracking-widest uppercase text-lg font-bold shadow-lg hover:shadow-primary/50 btn-sweep"
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>
        </>
    );
}
