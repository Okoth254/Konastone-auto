"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import VehicleImage from "@/components/inventory/VehicleImage";
import { Vehicle } from "@/types/database";
import MotionBadge from "@/components/ui/MotionBadge";

interface VehicleCardProps {
  vehicle: Vehicle;
  priority?: boolean;
}

export default function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const isNewArrival = vehicle.status === 'available' && vehicle.is_featured;
  const inTransit = vehicle.status === 'in_transit';
  const imagePath = `/images/inventory/${vehicle.folder_name}/1.jpeg`;
  const secondaryImagePath = `/images/inventory/${vehicle.folder_name}/2.jpeg`;

  return (
    <motion.div
      layout
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => setIsRevealed(!isRevealed)}
      className={`card-luxury shine-effect group bg-card-bg rounded-2xl overflow-hidden ${isNewArrival ? 'border border-primary/30' : inTransit ? 'border border-accent/30 relative' : 'border border-border-color'} transition-all duration-300 flex flex-col h-full cursor-pointer lg:cursor-default`}
    >
      {inTransit && <div className="absolute top-0 left-0 w-full h-1 bg-accent z-20" />}
      <div className="relative aspect-4/3 overflow-hidden bg-background-dark">
        <VehicleImage
          src={imagePath}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${inTransit ? 'opacity-90' : ''} ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
          priority={priority}
        />
        <VehicleImage
          src={secondaryImagePath}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} alternate view`}
          hideOnError
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-500 group-hover:scale-100 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0'}`}
          priority={priority}
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
}