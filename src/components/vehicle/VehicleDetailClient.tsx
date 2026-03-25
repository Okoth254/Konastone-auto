"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import ImageGallery from "./ImageGallery";
import FinanceCalculator from "./FinanceCalculator";
import LeadForm from "./LeadForm";
import ShareButton from "./ShareButton";
import VehicleImage from "@/components/inventory/VehicleImage";
import { useState } from "react";

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    transmission: string;
    fuel_type: string;
    body_type?: string;
    color?: string;
    drive_type?: string;
    status: string;
    is_featured: boolean;
    folder_name: string;
}

interface Feature {
    id: string;
    feature_name: string;
}

interface VehicleDetailClientProps {
    vehicle: Vehicle;
    features: Feature[];
    similarVehicles: Vehicle[];
    images: string[];
    whatsappLink: string;
    formatPrice: (price: number) => string;
}

export default function VehicleDetailClient({
    vehicle,
    features,
    similarVehicles,
    images,
    whatsappLink,
    formatPrice,
}: VehicleDetailClientProps) {
    const [isSpecsOpen, setIsSpecsOpen] = useState(true);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: "spring", 
                duration: 0.6,
                bounce: 0.3
            } 
        },
    };

    const specData = [
        { label: "Make", value: vehicle.make, icon: "branding_watermark" },
        { label: "Model", value: vehicle.model, icon: "model_training" },
        { label: "Body Type", value: vehicle.body_type || "N/A", icon: "directions_car" },
        { label: "Color", value: vehicle.color || "N/A", icon: "palette" },
        { label: "Drive Type", value: (vehicle.drive_type || "2WD").toUpperCase(), icon: "settings_input_component" },
        { label: "Condition", value: vehicle.status.replace("_", " "), icon: "verified" },
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 gap-8 relative z-10"
        >
            {/* Breadcrumbs */}
            <motion.nav variants={itemVariants} className="flex flex-wrap gap-2 text-sm text-slate-500">
                <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/inventory">Listings</Link>
                <span>/</span>
                <span className="text-slate-300 font-medium">{vehicle.make} {vehicle.model}</span>
            </motion.nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Gallery */}
                <motion.div variants={itemVariants} className="lg:col-span-8">
                    <ImageGallery images={images} />
                </motion.div>

                {/* Right Column: Key Info & CTA */}
                <motion.div variants={itemVariants} className="lg:col-span-4 bg-surface-dark rounded-2xl p-6 flex flex-col gap-6 border border-border-subtle shadow-2xl relative">
                    <div className="space-y-2">
                        {vehicle.is_featured && (
                            <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-primary/10 text-primary border border-primary/20 mb-2 uppercase"
                            >
                                <span className="material-symbols-outlined text-[14px]">stars</span>
                                Verified Premium
                            </motion.span>
                        )}
                        <h1 className="text-4xl md:text-5xl font-heading tracking-tight text-slate-100 uppercase leading-none">
                            {vehicle.make} <span className="text-primary">{vehicle.model}</span>
                        </h1>
                        <p className="text-3xl font-heading text-slate-300 tracking-tight">{formatPrice(vehicle.price)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-y border-border-subtle py-6">
                        {[
                            { label: "Year", value: vehicle.year, icon: "calendar_today" },
                            { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km`, icon: "speed" },
                            { label: "Transmission", value: vehicle.transmission, icon: "settings" },
                            { label: "Fuel", value: vehicle.fuel_type, icon: "local_gas_station" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-background-dark/50 p-4 rounded-xl border border-border-subtle flex flex-col gap-2 group hover:border-primary/30 transition-colors">
                                <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
                                    <p className="font-bold text-slate-100 capitalize">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex flex-col gap-3 mt-auto">
                        <motion.a 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            href={`tel:${siteConfig.contact.phoneFormatted}`} 
                            className="flex items-center justify-center gap-3 rounded-xl h-14 bg-accent-red text-white font-black uppercase tracking-widest shadow-lg transition-all btn-sweep"
                        >
                            <span className="material-symbols-outlined">call</span>
                            Direct Inquiry
                        </motion.a>
                        <motion.a 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            href={whatsappLink} 
                            target="_blank" 
                            className="flex items-center justify-center gap-3 rounded-xl h-14 bg-primary text-background-dark font-black uppercase tracking-widest shadow-lg transition-all btn-sweep"
                        >
                            <span className="material-symbols-outlined">chat</span>
                            WhatsApp Executive
                        </motion.a>
                        <ShareButton title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Brand Promises */}
                    <motion.div variants={itemVariants} className="bg-surface-dark/50 backdrop-blur-sm rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border border-border-subtle shadow-xl">
                        {siteConfig.promises.map((promise) => (
                            <div key={promise.id} className="flex flex-col items-center text-center gap-4 group">
                                <div className="w-14 h-14 rounded-2xl bg-background-dark flex items-center justify-center text-primary border border-border-subtle group-hover:border-primary/50 group-hover:bg-primary/5 transition-all rotate-3 group-hover:rotate-0">
                                    <span className="material-symbols-outlined text-2xl">{promise.icon}</span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-slate-100 tracking-wide uppercase">{promise.title}</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{promise.description}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Detailed Specs Accordion */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <button 
                            type="button"
                            onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                            className="w-full flex items-center justify-between text-2xl font-heading tracking-wide text-slate-100 group"
                        >
                            <span className="flex items-center gap-3 text-primary">
                                <span className="material-symbols-outlined">fact_check</span> 
                                <span className="text-slate-100">Full Specifications</span>
                            </span>
                            <motion.span 
                                animate={{ rotate: isSpecsOpen ? 0 : -90 }}
                                className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors"
                            >
                                expand_more
                            </motion.span>
                        </button>
                        
                        <motion.div 
                            initial={false}
                            animate={{ height: isSpecsOpen ? "auto" : 0, opacity: isSpecsOpen ? 1 : 0 }}
                            className="overflow-hidden bg-background-dark/30 rounded-2xl border border-border-subtle"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle">
                                {specData.map((spec) => (
                                    <div key={spec.label} className="bg-surface-dark p-5 flex items-center gap-4 hover:bg-surface-dark/80 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-primary/60">
                                            <span className="material-symbols-outlined text-xl">{spec.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{spec.label}</p>
                                            <p className="font-bold text-slate-100 uppercase text-xs">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Features Chips */}
                    {features && features.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-heading tracking-wide mb-6 flex items-center gap-3 text-slate-100">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span> Premium Build Features
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {features.map((feature, idx) => (
                                    <motion.span 
                                        key={feature.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="px-5 py-2.5 rounded-xl bg-surface-dark border border-border-subtle text-slate-200 text-xs font-bold flex items-center gap-2 hover:border-primary/50 transition-all shadow-md"
                                    >
                                        <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                                        {feature.feature_name}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Sidebar: Sticky interactions */}
                <div className="flex flex-col gap-8">
                    <motion.div variants={itemVariants} className="sticky top-24 space-y-8">
                        <FinanceCalculator price={vehicle.price} />
                        <LeadForm vehicleId={vehicle.id} />
                    </motion.div>
                </div>
            </div>

            {/* Similar Listings */}
            {similarVehicles && similarVehicles.length > 0 && (
                <motion.div variants={itemVariants} className="mt-12 border-t border-border-subtle pt-12">
                    <div className="flex justify-between items-end mb-8 px-2">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-heading tracking-wide text-slate-100 uppercase">You May Also <span className="text-primary">Admire</span></h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">Similar Luxury Inventory</p>
                        </div>
                        <Link className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all flex items-center gap-2" href="/inventory">
                            Explore All <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {similarVehicles.map((sim, idx) => (
                            <motion.div 
                                key={sim.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/vehicle/${sim.id}`} className="block bg-surface-dark rounded-2xl overflow-hidden group border border-border-subtle hover:border-primary/50 transition-all shadow-xl hover:shadow-primary/5">
                                    <div className="aspect-16/10 overflow-hidden relative">
                                        <VehicleImage
                                            alt={`${sim.make} ${sim.model}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            src={`/images/inventory/${sim.folder_name}/1.jpeg`}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary text-background-dark font-black tracking-tighter rounded-full text-xs shadow-2xl">
                                            {formatPrice(sim.price)}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-[0.2em]">{sim.year} • {(sim.mileage / 1000).toFixed(0)}K KM • {sim.transmission}</p>
                                        <h4 className="font-heading text-xl text-slate-100 group-hover:text-primary transition-colors tracking-tight uppercase leading-none">{sim.make} {sim.model}</h4>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Mobile Fixed CTA Bar */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 1, type: "spring", damping: 25 }}
                className="fixed bottom-0 left-0 w-full p-4 bg-background-dark/95 backdrop-blur-xl border-t border-white/5 z-60 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
                <div className="flex gap-3">
                    <a href={`tel:${siteConfig.contact.phoneFormatted}`} className="flex-1 flex items-center justify-center gap-2 rounded-xl h-14 bg-accent-red text-white font-black uppercase tracking-widest shadow-lg btn-sweep text-xs">
                        <span className="material-symbols-outlined text-lg">call</span>
                        Call Now
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 rounded-xl h-14 bg-primary text-background-dark font-black uppercase tracking-widest shadow-lg btn-sweep text-xs">
                        <span className="material-symbols-outlined text-lg">chat</span>
                        WhatsApp
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
}
