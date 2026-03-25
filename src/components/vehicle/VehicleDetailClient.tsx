"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import ImageGallery from "./ImageGallery";
import FinanceCalculator from "./FinanceCalculator";
import LeadForm from "./LeadForm";
import ShareButton from "./ShareButton";
import VehicleImage from "@/components/inventory/VehicleImage";
import { useState, useEffect } from "react";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";

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
}

export default function VehicleDetailClient({
    vehicle,
    features,
    similarVehicles,
    images,
    whatsappLink,
}: VehicleDetailClientProps) {
    const [isSpecsOpen, setIsSpecsOpen] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0,
        }).format(price).replace('KES', 'Ksh');

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
                bounce: 0.2
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
            className="page-shell flex-1 flex flex-col py-6 gap-8 relative z-10"
        >
            {/* Sticky Anchor Nav (Desktop) */}
            <AnimatePresence>
                {scrolled && (
                    <motion.div 
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-20 left-0 w-full z-50 pointer-events-none hidden lg:flex justify-center"
                    >
                        <div className="bg-background-dark/80 backdrop-blur-2xl border border-white/10 rounded-full p-1 shadow-2xl pointer-events-auto flex items-center gap-1">
                            {['Gallery', 'Specs', 'Finance', 'Inquiry'].map((label) => (
                                <button key={label} className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-white/5 transition-all">
                                    {label}
                                </button>
                            ))}
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <div className="pr-4 pl-2 text-primary font-heading uppercase text-sm">
                                {vehicle.make} <span className="text-white">{vehicle.model}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Breadcrumbs */}
            <motion.nav variants={itemVariants} className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                <span className="text-slate-700">/</span>
                <Link className="hover:text-primary transition-colors" href="/inventory">Inventory</Link>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">{vehicle.make} {vehicle.model}</span>
            </motion.nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Gallery */}
                <motion.div variants={itemVariants} className="lg:col-span-8">
                    <ImageGallery images={images} />
                </motion.div>

                {/* Right Column: Key Info & CTA */}
                <motion.div variants={itemVariants} className="lg:col-span-4 bg-surface-dark rounded-[2.5rem] p-8 flex flex-col gap-8 border border-border-subtle shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="space-y-4">
                        {vehicle.is_featured && (
                            <MotionBadge 
                                icon="stars" 
                                text="Verified Premium Selection"
                                className="bg-primary/10 text-primary border-primary/20"
                            />
                        )}
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-6xl font-heading tracking-tighter text-slate-100 uppercase leading-[0.9]">
                                {vehicle.make} <br />
                                <span className="text-primary">{vehicle.model}</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-heading text-slate-300 tracking-tight">{formatPrice(vehicle.price)}</p>
                                <div className="h-4 w-px bg-white/10" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{vehicle.year} Edition</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-border-subtle/50 py-8">
                        {[
                            { label: "Transmission", value: vehicle.transmission, icon: "settings" },
                            { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km`, icon: "speed" },
                            { label: "Fuel System", value: vehicle.fuel_type, icon: "local_gas_station" },
                            { label: "Drive Mode", value: vehicle.drive_type || "2WD", icon: "settings_input_component" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col gap-2 group/item">
                                <span className="material-symbols-outlined text-primary/60 text-lg group-hover/item:text-primary transition-colors">{stat.icon}</span>
                                <div>
                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">{stat.label}</p>
                                    <p className="font-bold text-slate-100 capitalize">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex flex-col gap-3 mt-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <MotionButton
                                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
                                variant="secondary"
                                className="h-14"
                            >
                                <span className="material-symbols-outlined text-xl">call</span>
                                Call Consultant
                            </MotionButton>
                            <MotionButton
                                href={siteConfig.contact.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-14"
                            >
                                <span className="material-symbols-outlined text-xl">chat</span>
                                WhatsApp
                            </MotionButton>
                        </div>
                        <ShareButton title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 flex flex-col gap-10">
                    {/* Brand Promises */}
                    <motion.div variants={itemVariants} className="bg-surface-dark/40 backdrop-blur-md rounded-3xl p-10 grid grid-cols-1 md:grid-cols-3 gap-10 border border-border-subtle shadow-xl">
                        {siteConfig.promises.map((promise) => (
                            <div key={promise.id} className="flex flex-col items-center text-center gap-4 group">
                                <div className="w-16 h-16 rounded-[1.25rem] bg-background-dark flex items-center justify-center text-primary border border-border-subtle group-hover:border-primary/50 group-hover:bg-primary/10 transition-all rotate-3 group-hover:rotate-0">
                                    <span className="material-symbols-outlined text-3xl">{promise.icon}</span>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-xs text-slate-100 tracking-[0.1em] uppercase">{promise.title}</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium px-4">{promise.description}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Detailed Specs Accordion */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <button 
                            type="button"
                            onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                            className="w-full flex items-center justify-between text-3xl font-heading tracking-tight text-slate-100 group px-2"
                        >
                            <span className="flex items-center gap-4">
                                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-xl">fact_check</span> 
                                </span>
                                Full Specifications
                            </span>
                            <motion.span 
                                animate={{ rotate: isSpecsOpen ? 0 : -90, scale: isSpecsOpen ? 1 : 0.8 }}
                                className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-4xl"
                            >
                                expand_more
                            </motion.span>
                        </button>
                        
                        <motion.div 
                            initial={false}
                            animate={{ height: isSpecsOpen ? "auto" : 0, opacity: isSpecsOpen ? 1 : 0 }}
                            className="overflow-hidden bg-background-dark/20 rounded-[2rem] border border-border-subtle"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border-subtle/30">
                                {specData.map((spec) => (
                                    <div key={spec.label} className="bg-surface-dark p-6 flex flex-col gap-3 hover:bg-surface-dark/60 transition-colors group/spec">
                                        <div className="w-10 h-10 rounded-xl bg-background-dark/50 flex items-center justify-center text-white/20 group-hover/spec:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-xl">{spec.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">{spec.label}</p>
                                            <p className="font-bold text-slate-100 uppercase text-xs tracking-wide">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Features Chips */}
                    {features && features.length > 0 && (
                        <motion.div variants={itemVariants} className="space-y-8">
                            <MotionBadge color="accent" icon="verified" className="px-4 py-1">
                                Direct Import
                            </MotionBadge>
                            <h3 className="text-3xl font-heading tracking-tight flex items-center gap-4 text-slate-100 px-2">
                                <span className="w-10 h-10 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                </span>
                                Premium Build Features
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {features.map((feature, idx) => (
                                    <motion.div 
                                        key={feature.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.03 }}
                                        whileHover={{ y: -3, borderColor: "rgba(255,191,41,0.5)" }}
                                        className="px-6 py-3 rounded-2xl bg-surface-dark/50 border border-border-subtle text-slate-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all cursor-default"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,191,41,0.8)]" />
                                        {feature.feature_name}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Sidebar: Sticky interactions */}
                <div className="flex flex-col gap-10">
                    <motion.div variants={itemVariants} className="sticky top-28 space-y-10">
                        <FinanceCalculator price={vehicle.price} />
                        <LeadForm vehicleId={vehicle.id} />
                    </motion.div>
                </div>
            </div>

            {/* Similar Listings */}
            {similarVehicles && similarVehicles.length > 0 && (
                <motion.div variants={itemVariants} className="mt-16 border-t border-border-subtle/50 pt-16">
                    <div className="flex justify-between items-end mb-10 px-4">
                        <div className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-heading tracking-tighter text-slate-100 uppercase">You May Also <span className="text-primary italic">Admire</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Curated Luxury Inventory</p>
                        </div>
                        <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-all flex items-center gap-3 pb-2 group" href="/inventory">
                            Explore Collection 
                            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar lg:overflow-visible lg:pb-0 lg:snap-none">
                        {similarVehicles.map((sim, idx) => (
                            <motion.div 
                                key={sim.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex-[0_0_85%] min-w-0 md:flex-[0_0_45%] lg:flex-none snap-center"
                            >
                                <Link href={`/vehicle/${sim.id}`} className="ui-card block bg-surface-dark rounded-[2rem] overflow-hidden group border border-border-subtle hover:border-primary/40 transition-all shadow-2xl h-full">
                                    <div className="aspect-[16/10] overflow-hidden relative">
                                        <VehicleImage
                                            alt={`${sim.make} ${sim.model}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                            src={`/images/inventory/${sim.folder_name}/1.jpeg`}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-primary text-background-dark font-black tracking-tighter rounded-full text-[10px] shadow-2xl">
                                            {formatPrice(sim.price)}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{sim.year}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{(sim.mileage / 1000).toFixed(0)}K KM</span>
                                        </div>
                                        <h4 className="font-heading text-2xl text-slate-100 group-hover:text-primary transition-colors tracking-tight uppercase leading-[0.9]">{sim.make} <br /> {sim.model}</h4>
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
                transition={{ delay: 1.2, type: "spring", damping: 25, stiffness: 200 }}
                className="safe-bottom fixed bottom-0 left-0 w-full p-6 bg-background-dark/95 backdrop-blur-2xl border-t border-white/5 z-60 md:hidden shadow-[0_-20px_60px_rgba(0,0,0,0.8)]"
            >
                <div className="flex gap-4">
                    <MotionButton 
                        href={`tel:${siteConfig.contact.phoneFormatted}`} 
                        variant="secondary"
                        className="flex-1 h-14 bg-accent-red text-white border-none text-[10px] font-black uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">call</span>
                        Call Agent
                    </MotionButton>
                    <MotionButton 
                        href={whatsappLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 h-14 text-[10px] font-black uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">chat</span>
                        WhatsApp
                    </MotionButton>
                </div>
            </motion.div>
        </motion.div>
    );
}
