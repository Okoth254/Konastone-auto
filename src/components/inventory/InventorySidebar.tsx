"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function InventorySidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for instant UI feedback before navigation
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [make, setMake] = useState(searchParams.get("make") || "all");
    const [model, setModel] = useState(searchParams.get("model") || "all");
    const [minYear, setMinYear] = useState(searchParams.get("minYear") || "2015");
    const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") || "2024");

    // Instead of a true double-slider which is complex to build custom,
    // we use a simpler set of ranges for price
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "15000000");

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value === "all" || value === "") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const applyFilters = () => {
        let params = new URLSearchParams();
        if (status !== 'all') params.set('status', status);
        if (make !== 'all') params.set('make', make);
        if (model !== 'all') params.set('model', model);
        if (minYear !== '2015') params.set('minYear', minYear);
        if (maxYear !== '2024') params.set('maxYear', maxYear);
        if (maxPrice !== '15000000') params.set('maxPrice', maxPrice);

        router.push(`/inventory?${params.toString()}`);
    };

    // Auto-apply filters when simple select changes (optional, but good for UX)
    useEffect(() => {
        // Debounce or apply immediately based on preference.
        // For sliders, it's better to wait for the user to lift their finger,
        // so we keep the "Apply Filters" button, or we can auto apply.
    }, [status, make, model]);


    const formatPrice = (price: string) => {
        const val = parseInt(price);
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        return `${(val / 1000).toFixed(0)}K`;
    };

    return (
        <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
            <div className="bg-card-bg border border-border-color rounded-lg p-5 flex flex-col gap-5">
                <h3 className="text-white font-display text-xl tracking-wider uppercase mb-2">Filter By Status</h3>
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
                            <option className="text-black" value="Toyota">Toyota</option>
                            <option className="text-black" value="Honda">Honda</option>
                            <option className="text-black" value="Mercedes-Benz">Mercedes-Benz</option>
                            <option className="text-black" value="BMW">BMW</option>
                            <option className="text-black" value="Mazda">Mazda</option>
                            <option className="text-black" value="Subaru">Subaru</option>
                            <option className="text-black" value="Volvo">Volvo</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Model</span>
                        <input
                            type="text"
                            placeholder="e.g. Prado, CX-5"
                            value={model === 'all' ? '' : model}
                            onChange={(e) => setModel(e.target.value || 'all')}
                            className="form-input flex w-full resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-1 border border-border-color bg-card-bg-hover focus:border-primary focus:ring-primary h-12 p-3 text-sm font-medium placeholder:text-slate-600"
                        />
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
                    className="w-full mt-4 h-12 rounded bg-primary text-card-bg hover:bg-yellow-500 transition-colors font-display tracking-widest uppercase text-lg font-bold shadow-[0_4px_14px_rgba(234,179,8,0.3)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)]"
                >
                    Apply Filters
                </button>
            </div>
        </aside>
    );
}
