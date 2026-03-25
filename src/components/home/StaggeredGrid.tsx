"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import VehicleImage from "@/components/inventory/VehicleImage";
import { Vehicle } from "@/types/database";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12 }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 16 } }
};

interface StaggeredGridProps {
    vehicles: Vehicle[];
    isSupabaseConfigured: boolean;
    featuredError: string | null;
    children?: React.ReactNode;
}

export function StaggeredGrid({ vehicles, isSupabaseConfigured, featuredError, children }: StaggeredGridProps) {
    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
        >
            {children}

            {isSupabaseConfigured && !featuredError && vehicles.map((car) => {
                const imagePath = `/images/inventory/${car.folder_name}/1.jpeg`;
                return (
                    <motion.div 
                        key={car.id}
                        variants={item}
                        className="bg-gray-50 dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <div className="relative h-64 overflow-hidden bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                            <VehicleImage src={imagePath} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {car.status === 'available' && (
                                <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">Excellent</div>
                            )}
                            {car.status === 'in_transit' && (
                                <div className="absolute top-4 left-4 bg-accent text-background-dark text-xs font-bold px-3 py-1 rounded uppercase tracking-wider animate-pulse">In Transit</div>
                            )}
                        </div>
                        <div className="p-6 flex flex-col">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">{car.year} {car.make} {car.model}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                <div className="flex items-center"><span className="material-icons text-[16px] mr-1">speed</span>{car.mileage.toLocaleString()} km</div>
                                <div className="flex items-center"><span className="material-icons text-[16px] mr-1">local_gas_station</span>{car.fuel_type}</div>
                                <div className="flex items-center"><span className="material-icons text-[16px] mr-1">settings</span>{car.transmission}</div>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</p>
                                    <p className="font-display text-3xl text-primary">KES {car.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <Link className="mt-4 flex items-center justify-center w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3 px-4 rounded font-medium transition-colors" href={`/vehicle/${car.id}`}>
                                <span className="material-icons mr-2">auto_awesome</span> View Details
                            </Link>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
