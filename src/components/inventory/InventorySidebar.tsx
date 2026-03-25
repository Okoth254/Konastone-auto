"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import MotionBadge from "@/components/ui/MotionBadge";
import MotionSheet from "@/components/ui/MotionSheet";
import MotionButton from "@/components/ui/MotionButton";
import Tooltip from "@/components/ui/Tooltip";


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

    const activeFilterCount = [
        status !== 'all',
        make !== 'all',
        model !== 'all',
        minYear !== '2015',
        maxPrice !== '15000000',
    ].filter(Boolean).length;

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

    const clearFilters = () => {
        setStatus('all');
        setMake('all');
        setModel('all');
        setMinYear('2015');
        setMaxPrice('15000000');
        router.push('/inventory');
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
            <div className="lg:hidden sticky top-[72px] z-30 bg-background-dark/95 backdrop-blur-md py-4 border-b border-border-subtle mb-2 flex justify-between items-center px-4">
                <div className="flex flex-col">
                  <span className="font-headline tracking-widest text-[#666] text-[10px] uppercase font-bold">Refine</span>
                  <span className="font-headline tracking-wide text-slate-200 flex items-center gap-2 text-sm uppercase">Search {activeFilterCount > 0 && <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold">{activeFilterCount}</span>}</span>
                </div>
                <MotionButton 
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-subtle rounded-full text-slate-300 shadow-lg"
                >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span className="text-xs tracking-widest">FILTERS</span>
                </MotionButton>
            </div>

            {/* Active Filter Chips Summary (Desktop/Mobile) */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 lg:hidden px-4 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pb-2">
                    {status !== 'all' && <MotionBadge color="primary" className="gap-1">{status} <button onClick={() => setStatus('all')} className="hover:text-white">×</button></MotionBadge>}
                    {make !== 'all' && <MotionBadge color="primary" className="gap-1">{make} <button onClick={() => setMake('all')} className="hover:text-white">×</button></MotionBadge>}
                    {model !== 'all' && <MotionBadge color="primary" className="gap-1">{model} <button onClick={() => setModel('all')} className="hover:text-white">×</button></MotionBadge>}
                    {minYear !== '2015' && <MotionBadge color="primary" className="gap-1">{minYear}+ <button onClick={() => setMinYear('2015')} className="hover:text-white">×</button></MotionBadge>}
                    {maxPrice !== '15000000' && <MotionBadge color="primary" className="gap-1">Up to {formatPrice(maxPrice)} <button onClick={() => setMaxPrice('15000000')} className="hover:text-white">×</button></MotionBadge>}
                    <button onClick={clearFilters} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide">Clear All</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            <aside className="hidden lg:flex w-full lg:w-[280px] shrink-0 flex-col gap-6">
                <div className="ui-card bg-card-bg lg:border lg:border-border-color lg:rounded-lg p-5 flex flex-col gap-5 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-headline text-lg tracking-widest uppercase">FILTERS</h3>
                        {activeFilterCount > 0 && (
                          <button onClick={clearFilters} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide">Reset</button>
                        )}
                    </div>

                    {/* Desktop Active Chips */}
                    <AnimatePresence>
                      {activeFilterCount > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                           {status !== 'all' && <MotionBadge color="primary" className="h-6">{status}</MotionBadge>}
                           {make !== 'all' && <MotionBadge color="primary" className="h-6">{make}</MotionBadge>}
                           {model !== 'all' && <MotionBadge color="primary" className="h-6">{model}</MotionBadge>}
                        </div>
                      )}
                    </AnimatePresence>
                    
                    <div className="h-px bg-border-color/50 mb-2"></div>

                    <h3 className="text-zinc-500 font-headline text-[10px] tracking-[0.2em] uppercase font-bold">Status</h3>
                    
                    <div className="flex flex-col gap-2">
                        {['all', 'new', 'foreign', 'shipment'].map((s) => (
                           <label key={s} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${status === s ? 'bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(255,182,0,0.05)]' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
                               <input checked={status === s} onChange={() => setStatus(s)} className="hidden" name="status" type="radio" value={s} />
                               <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${status === s ? 'border-primary' : 'border-zinc-700'}`}>
                                   {status === s && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                               </div>
                               <span className={`${status === s ? 'text-white' : 'text-zinc-400'} font-headline tracking-widest uppercase text-xs font-bold`}>
                                 {s === 'all' ? 'All' : s === 'new' ? 'New Arrivals' : s === 'foreign' ? 'Foreign Used' : 'On Shipment'}
                               </span>
                           </label>
                        ))}
                    </div>
                    <div className="h-px bg-border-color/50 my-2"></div>

                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Make</span>
                            <select
                                value={make}
                                onChange={(e) => setMake(e.target.value)}
                                className="w-full rounded-lg text-white bg-zinc-900/80 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3 text-xs font-medium appearance-none cursor-pointer"
                            >
                                <option value="all">All Makes</option>
                                {availableMakes.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Model</span>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full rounded-lg text-white bg-zinc-900/80 border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3 text-xs font-medium appearance-none cursor-pointer"
                            >
                                <option value="all">All Models</option>
                                {availableModels.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="h-px bg-border-color/50 my-2"></div>

                    {/* Year Selection */}
                    <div className="flex flex-col gap-3">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Min Year</span>
                        <div className="flex items-center justify-between text-white text-[11px] font-mono bg-zinc-900/80 px-2 py-1.5 rounded border border-zinc-800">
                            <span>{minYear}</span>
                            <span className="text-primary/50">→</span>
                            <span>{maxYear}</span>
                        </div>
                        <Tooltip content={`Min Year: ${minYear}`} side="top">
                            <input
                                className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                type="range"
                                min="2010"
                                max="2025"
                                step="1"
                                value={minYear}
                                onChange={(e) => setMinYear(e.target.value)}
                            />
                        </Tooltip>
                    </div>

                    <div className="h-px bg-border-color/50 my-2"></div>

                    {/* Max Price Selection */}
                    <div className="flex flex-col gap-3">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Max Price (KES)</span>
                        <div className="flex items-center justify-between text-white text-[11px] font-mono bg-zinc-900/80 px-2 py-1.5 rounded border border-zinc-800">
                            <span>0</span>
                            <span className="text-primary/50">→</span>
                            <span>{formatPrice(maxPrice)}</span>
                        </div>
                        <Tooltip content={`Max: KES ${formatPrice(maxPrice)}`} side="top">
                            <input
                                className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                type="range"
                                min="1000000"
                                max="15000000"
                                step="500000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </Tooltip>
                    </div>

                    <MotionButton
                        onClick={applyFilters}
                        className="w-full mt-4 h-12 rounded-xl"
                    >
                        APPLY FILTERS
                    </MotionButton>
                </div>
            </aside>


            <MotionSheet open={isOpen} onClose={() => setIsOpen(false)}>
              <div className="p-5 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-headline text-xl tracking-widest uppercase">FILTERS</h3>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-500 font-headline text-[10px] tracking-[0.2em] uppercase font-bold">Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'new', 'foreign', 'shipment'].map((s) => (
                       <label key={s} className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-all border ${status === s ? 'bg-primary/10 border-primary/30' : 'bg-zinc-900 border-zinc-800'}`}>
                           <input checked={status === s} onChange={() => setStatus(s)} className="hidden" name="status-mobile" type="radio" value={s} />
                           <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${status === s ? 'border-primary' : 'border-zinc-700'}`}>
                               {status === s && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                           </div>
                           <span className={`${status === s ? 'text-white' : 'text-zinc-400'} font-headline tracking-widest uppercase text-xs font-bold`}>
                             {s === 'all' ? 'All' : s === 'new' ? 'New' : s === 'foreign' ? 'Used' : 'In Transit'}
                           </span>
                       </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border-color/50"></div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Make</span>
                        <select value={make} onChange={(e) => setMake(e.target.value)} className="w-full rounded-xl text-white bg-zinc-900 border border-zinc-800 h-12 px-3 text-sm">
                            <option value="all">All Makes</option>
                            {availableMakes.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Model</span>
                        <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-xl text-white bg-zinc-900 border border-zinc-800 h-12 px-3 text-sm">
                            <option value="all">All Models</option>
                            {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </label>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Year Range</span>
                  <input className="w-full accent-primary h-2 bg-zinc-800 rounded-lg appearance-none" type="range" min="2010" max="2025" step="1" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
                  <div className="flex justify-between text-zinc-400 text-[10px] font-mono"><span>2010</span><span>{minYear}+</span><span>2025</span></div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Max Price</span>
                  <input className="w-full accent-primary h-2 bg-zinc-800 rounded-lg appearance-none" type="range" min="1000000" max="15000000" step="500000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  <div className="flex justify-between text-white text-sm font-display tracking-widest uppercase"><span>KES 1M</span><span className="text-primary font-bold">≤ {formatPrice(maxPrice)}</span></div>
                </div>

                <div className="sticky bottom-0 bg-surface-container pt-4 pb-2 mt-auto">
                    <MotionButton onClick={applyFilters} className="w-full h-14 rounded-2xl">
                      APPLY {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                    </MotionButton>
                </div>
              </div>
            </MotionSheet>

        </>
    );
}
