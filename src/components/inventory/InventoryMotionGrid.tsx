"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import VehicleImage from "@/components/inventory/VehicleImage";
import { Vehicle } from "@/types/database";
import MotionBadge from "@/components/ui/MotionBadge";


interface Props {
    vehicles: Vehicle[];
    isSupabaseConfigured: boolean;
}

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
};

const card = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show:   { opacity: 1, scale: 1,    y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 18 } }
};

export function InventoryMotionGrid({ vehicles, isSupabaseConfigured }: Props) {
    return (
        <motion.div
            className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {!isSupabaseConfigured && (
                <div className="col-span-full border border-yellow-500/50 bg-yellow-500/10 p-6 rounded-lg text-yellow-500 text-center flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-4xl">warning</span>
                    <h3 className="text-xl font-bold font-display uppercase tracking-wider">Database Not Configured</h3>
                    <p className="text-sm">Please follow the implementation plan to set up Supabase and add the credentials to <code>.env.local</code>.</p>
                </div>
            )}

            {vehicles.length === 0 && isSupabaseConfigured && (
                <div className="col-span-full p-12 text-center text-slate-500 font-display text-xl uppercase tracking-wider border border-border-color border-dashed rounded-lg bg-card-bg/30">
                    No vehicles found matching those criteria.
                </div>
            )}

            <AnimatePresence mode="popLayout">
                {vehicles.map((vehicle) => {
                    const isNewArrival = vehicle.status === 'available' && vehicle.is_featured;
                    const inTransit = vehicle.status === 'in_transit';
                    const imagePath = `/images/inventory/${vehicle.folder_name}/1.jpeg`;
                    const secondaryImagePath = `/images/inventory/${vehicle.folder_name}/2.jpeg`;

                    const [isRevealed, setIsRevealed] = useState(false);

                    return (
                        <motion.div
                            key={vehicle.id}
                            layout
                            variants={card}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setIsRevealed(!isRevealed)}
                            className={`ui-card group bg-card-bg rounded-xl overflow-hidden ${isNewArrival ? 'border-t-4 border-primary border-x border-b hover:border-primary/50' : inTransit ? 'border border-border-color hover:border-accent/50 relative' : 'border border-border-color hover:border-slate-400'} transition-all duration-300 flex flex-col h-full shadow-lg cursor-pointer lg:cursor-default`}
                        >

                            {inTransit && <div className="absolute top-0 left-0 w-full h-1 bg-accent z-20" />}
                            <div className="relative aspect-4/3 overflow-hidden bg-background-dark">
                                <VehicleImage
                                    src={imagePath}
                                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                    className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${inTransit ? 'opacity-90' : ''} ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
                                />
                                <VehicleImage
                                    src={secondaryImagePath}
                                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} alternate view`}
                                    hideOnError
                                    className={`absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-500 group-hover:scale-100 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0'}`}
                                />


                                {inTransit && <div className="absolute inset-0 bg-background-dark/20 group-hover:bg-transparent transition-colors" />}

                                {isNewArrival && (
                                    <div className="absolute top-3 left-3 z-10">
                                      <MotionBadge color="primary" className="text-lg! py-1! px-3! h-auto!">NEW ARRIVAL</MotionBadge>
                                    </div>
                                )}
                                {inTransit && (
                                    <>
                                        <div className="absolute top-3 left-3 z-10">
                                          <MotionBadge color="secondary" className="text-lg! py-1! px-3! h-auto! animate-pulse">IN TRANSIT</MotionBadge>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-background-dark/90 text-accent px-2 py-1 rounded font-mono text-[10px] font-bold border border-accent/30 shadow-md z-10">ETA: 14D</div>
                                    </>
                                )}

                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-4">
                                <div>
                                    <h3 className={`text-white font-display text-2xl tracking-wide uppercase line-clamp-1 group-hover:${inTransit ? 'text-accent' : isNewArrival ? 'text-primary' : 'text-white'} transition-colors`}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                                    <p className="text-slate-400 text-sm">{vehicle.body_type || 'Vehicle'} · {vehicle.fuel_type}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 border-y border-border-color py-3">
                                    <div className="flex items-center gap-2"><span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>speed</span><span>{vehicle.mileage.toLocaleString()} km</span></div>
                                    <div className="flex items-center gap-2"><span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>local_gas_station</span><span>{vehicle.fuel_type}</span></div>
                                    <div className="flex items-center gap-2"><span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>settings</span><span>{vehicle.transmission}</span></div>
                                    <div className="flex items-center gap-2"><span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>palette</span><span>{vehicle.color || 'Standard'}</span></div>
                                </div>
                                <div className="mt-auto pt-2 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">{inTransit ? 'Landed Price' : 'Price'}</span>
                                        <span className={`${inTransit ? 'text-white' : 'text-primary'} font-display text-3xl tracking-wide`}>KES {vehicle.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2 mt-auto">
                                    <Link href={`/vehicle/${vehicle.id}`} className="btn-premium tap-highlight-none flex items-center justify-center flex-1 h-12 rounded-xl border border-zinc-800 hover:border-white text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-[0.2em]">View Details</Link>
                                </div>

                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
}

// Simple Skeleton state for query transitions (can be used when loading)
export function InventorySkeleton() {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="ui-card bg-card-bg rounded-xl border border-border-color overflow-hidden animate-pulse">
          <div className="aspect-4/3 bg-zinc-900" />
          <div className="p-5 space-y-4">
            <div className="h-6 bg-zinc-800 rounded w-3/4" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-800 rounded w-full" />
            </div>
            <div className="h-10 bg-zinc-800 rounded w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

