"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Vehicle } from "@/types/database";
import VehicleCard from "@/components/inventory/VehicleCard";


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
                {vehicles.map((vehicle, index) => (
                    <motion.div
                        key={vehicle.id}
                        variants={card}
                    >
                        <VehicleCard vehicle={vehicle} priority={index < 3} />
                    </motion.div>
                ))}
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

