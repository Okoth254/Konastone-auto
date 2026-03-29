"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Gauge, Fuel, Settings2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  status: string;
  folder_name: string;
  is_featured: boolean;
  vehicle_images?: { public_url: string }[];
}

interface FeaturedVehiclesProps {
  vehicles: VehicleData[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(2)}M`;
    }
    return `KES ${price.toLocaleString()}`;
  };

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-(--color-background)">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-px w-24 bg-linear-to-r from-amber-500 to-transparent mb-6 origin-left"
            />
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Handpicked premium vehicles ready for immediate delivery. Each vehicle undergoes our rigorous inspection process.
            </p>
          </div>
          
          <Link 
            href="/inventory" 
            className="btn-glass group whitespace-nowrap"
          >
            View All Inventory
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Vehicle Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => {
            const imageUrl = vehicle.vehicle_images?.[0]?.public_url || 
              `/images/inventory/${vehicle.folder_name}/1.jpeg`;
            const isFavorite = favorites.has(vehicle.id);

            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(vehicle.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative"
              >
                <Link href={`/vehicle/${vehicle.id}`}>
                  <div className="card-luxury overflow-hidden">
                    {/* Image Container */}
                    <div className="relative aspect-4/3 overflow-hidden">
                      <motion.div
                        animate={{ scale: hoveredId === vehicle.id ? 1.08 : 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={imageUrl}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3}
                        />
                      </motion.div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-(--color-card) via-transparent to-transparent opacity-80" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {vehicle.is_featured && (
                          <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-semibold">
                            Featured
                          </span>
                        )}
                        {vehicle.status === 'in_transit' && (
                          <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                            In Transit
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleFavorite(e, vehicle.id)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 ${
                          isFavorite 
                            ? "bg-red-500 text-white" 
                            : "bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                      </motion.button>

                      {/* Quick View Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredId === vehicle.id ? 1 : 0 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                      >
                        <motion.span
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: hoveredId === vehicle.id ? 0 : 20, opacity: hoveredId === vehicle.id ? 1 : 0 }}
                          className="px-6 py-3 bg-white text-black rounded-full font-semibold text-sm"
                        >
                          View Details
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-amber-500 transition-colors font-display">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-500">{vehicle.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-amber-500">{formatPrice(vehicle.price)}</p>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5">
                          <Gauge className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-gray-400">{vehicle.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5">
                          <Fuel className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-gray-400">{vehicle.fuel_type}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5">
                          <Settings2 className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-gray-400">{vehicle.transmission}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}