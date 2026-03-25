"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Gauge, Fuel, Settings2, MessageCircle } from "lucide-react";
import { Vehicle } from "@/types/database";
import VehicleImage from "@/components/inventory/VehicleImage";

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
  isSupabaseConfigured: boolean;
  featuredError: string | null;
}

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  const imagePath = `/images/inventory/${vehicle.folder_name}/1.jpeg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative card-luxury overflow-hidden bg-[#2A2412] border border-[#4b4020] rounded-2xl shine-effect"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <VehicleImage
          src={imagePath}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2412] via-transparent to-transparent opacity-80" />
        
        {/* Badge */}
        <div className="absolute top-4 left-4">
          {vehicle.status === 'available' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-black">
              Available
            </span>
          )}
          {vehicle.status === 'in_transit' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-black">
              In Transit
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 p-2.5 rounded-full glass text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-black"
        >
          <Heart className="w-4 h-4" />
        </motion.button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/vehicle/${vehicle.id}`}
            className="px-8 py-3 bg-white text-black rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors font-display">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500">{vehicle.fuel_type}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">KES {vehicle.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-gray-400">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-xs">{vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-xs">{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Settings2 className="w-4 h-4 text-primary" />
            <span className="text-xs">{vehicle.transmission}</span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/254722511803?text=Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Inquire on WhatsApp
        </a>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
      </div>
    </motion.div>
  );
}

export default function FeaturedVehicles({ vehicles, isSupabaseConfigured, featuredError }: FeaturedVehiclesProps) {
  return (
    <section className="section-padding bg-background-dark">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 mx-auto" />
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-400 text-lg">
            Handpicked luxury vehicles for the discerning driver
          </p>
        </motion.div>

        {/* Grid */}
        {!isSupabaseConfigured && (
          <div className="col-span-full border border-yellow-500/50 bg-yellow-500/10 p-6 rounded-lg text-yellow-500 text-center flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl">warning</span>
            <h3 className="text-xl font-bold font-display uppercase tracking-wider">Database Not Configured</h3>
            <p className="text-sm">Please provide Supabase credentials in <code>.env.local</code> to fetch live featured vehicles.</p>
          </div>
        )}

        {isSupabaseConfigured && featuredError && (
          <div className="col-span-full border border-red-500/50 bg-red-500/10 p-6 rounded-lg text-red-500 text-center flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl">error</span>
            <h3 className="text-xl font-bold font-display uppercase tracking-wider">Loading Error</h3>
            <p className="text-sm">{featuredError}</p>
          </div>
        )}

        {isSupabaseConfigured && !featuredError && vehicles.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-10">
            No featured vehicles found at the moment.
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 hover:border-primary/30 transition-all group"
          >
            View All Inventory
            <motion.span
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}