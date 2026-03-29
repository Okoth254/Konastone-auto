"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Share2, 
  Phone, 
  MessageCircle,
  Calendar,
  Gauge,
  Settings,
  Fuel,
  Palette,
  Box,
  CheckCircle2,
  Shield,
  Clock,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { siteConfig } from "@/config/site";
import FinanceCalculator from "./FinanceCalculator";
import LeadForm from "./LeadForm";
import ImageGallery from "./ImageGallery";

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
    description?: string;
}

interface VehicleDetailClientProps {
    vehicle: Vehicle;
    images: string[];
    features: string[];
    similarVehicles: Vehicle[];
    whatsappLink: string;
}

export default function VehicleDetailClient({ 
    vehicle, 
    images, 
    features,
    similarVehicles,
    whatsappLink
}: VehicleDetailClientProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [showMobileCTA, setShowMobileCTA] = useState(false);

    // Show mobile CTA on scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowMobileCTA(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `KES ${(price / 1000000).toFixed(2)}M`;
        }
        return `KES ${price.toLocaleString()}`;
    };

    const specs = [
        { label: "Year", value: vehicle.year, icon: Calendar },
        { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km`, icon: Gauge },
        { label: "Transmission", value: vehicle.transmission, icon: Settings },
        { label: "Fuel Type", value: vehicle.fuel_type, icon: Fuel },
        { label: "Color", value: vehicle.color || "N/A", icon: Palette },
        { label: "Body Type", value: vehicle.body_type || "N/A", icon: Box },
    ];

    const technicalSpecs = [
        { label: "Drive Type", value: vehicle.drive_type || "2WD" },
        { label: "Status", value: vehicle.status.replace("_", " ") },
        { label: "Reference", value: vehicle.id.slice(0, 8).toUpperCase() },
    ];

    return (
        <div className="min-h-screen bg-(--color-background) pb-32 lg:pb-0">
            {/* Breadcrumb */}
            <div className="container-luxury pt-6 pb-4">
                <motion.nav 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-500"
                >
                    <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <Link href="/inventory" className="hover:text-amber-500 transition-colors">Inventory</Link>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span className="text-white truncate max-w-[200px]">{vehicle.make} {vehicle.model}</span>
                </motion.nav>
            </div>

            <div className="container-luxury">
                <div className="grid lg:grid-cols-[1fr,400px] gap-8">
                    {/* Left Column - Gallery & Details */}
                    <div className="space-y-8">
                        {/* Image Gallery */}
                        <ImageGallery 
                            images={images}
                            vehicleName={`${vehicle.make} ${vehicle.model}`}
                            status={vehicle.status}
                            isFeatured={vehicle.is_featured}
                        />

                        {/* Vehicle Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                                            {vehicle.make}
                                        </span>
                                        {vehicle.is_featured && (
                                            <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                                        {vehicle.make} {vehicle.model}
                                    </h1>
                                    <p className="text-gray-400 text-lg mt-1">{vehicle.year} • {vehicle.body_type || 'Vehicle'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl md:text-4xl font-bold text-amber-500 font-display">
                                        {formatPrice(vehicle.price)}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">Negotiable</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                                        isFavorite 
                                            ? "bg-red-500/10 border-red-500/50 text-red-500" 
                                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                                    {isFavorite ? "Saved" : "Save"}
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Specs Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {specs.map((spec, idx) => (
                                <motion.div
                                    key={spec.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + idx * 0.05 }}
                                    className="p-4 rounded-2xl bg-(--color-card) border border-white/5 hover:border-amber-500/20 transition-all duration-300 group"
                                >
                                    <spec.icon className="w-6 h-6 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{spec.label}</p>
                                    <p className="text-white font-semibold">{spec.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Tabs Navigation */}
                        <div className="border-b border-white/10">
                            <div className="flex gap-8">
                                {['overview', 'features', 'specs'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-sm font-medium capitalize transition-all duration-300 relative ${
                                            activeTab === tab 
                                                ? "text-amber-500" 
                                                : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {activeTab === 'overview' && (
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {vehicle.description || `Experience luxury and performance with this exceptional ${vehicle.year} ${vehicle.make} ${vehicle.model}. Meticulously maintained and ready for its new owner. Contact us today to schedule a viewing or test drive.`}
                                        </p>
                                        
                                        <div className="mt-8 p-6 rounded-2xl bg-linear-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Shield className="w-6 h-6 text-amber-500" />
                                                <h3 className="text-white font-semibold text-lg">Konastone Autos Promise</h3>
                                            </div>
                                            <ul className="space-y-2 text-gray-300">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                                    100% transparent vehicle history
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                                    Professional inspection & certification
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                                    Flexible financing options available
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'features' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {features.length > 0 ? features.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </motion.div>
                                        )) : (
                                            <p className="text-gray-500 col-span-full">Features information coming soon.</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className="space-y-4">
                                        {technicalSpecs.map((spec, idx) => (
                                            <motion.div
                                                key={spec.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
                                            >
                                                <span className="text-gray-500">{spec.label}</span>
                                                <span className="text-white font-medium capitalize">{spec.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Finance Calculator */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-8 border-t border-white/10"
                        >
                            <FinanceCalculator price={vehicle.price} />
                        </motion.div>

                        {/* Lead Form Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-8 border-t border-white/10"
                        >
                            <h2 className="text-2xl font-display font-bold text-white mb-6">
                                Interested in this vehicle?
                            </h2>
                            <LeadForm vehicleId={vehicle.id} />
                        </motion.div>

                        {/* Similar Vehicles */}
                        {similarVehicles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="pt-8 border-t border-white/10"
                            >
                                <h2 className="text-2xl font-display font-bold text-white mb-6">
                                    Similar Vehicles
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {similarVehicles.map((v) => (
                                        <Link key={v.id} href={`/vehicle/${v.id}`}>
                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                className="group bg-(--color-card) rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/20 transition-all duration-300"
                                            >
                                                <div className="relative aspect-4/3">
                                                    <Image
                                                        src={`/images/inventory/${v.folder_name}/1.jpeg`}
                                                        alt={`${v.make} ${v.model}`}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-white font-semibold group-hover:text-amber-500 transition-colors">
                                                        {v.make} {v.model}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">{v.year}</p>
                                                    <p className="text-amber-500 font-bold mt-2">{formatPrice(v.price)}</p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Sticky CTA Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            {/* Price Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-6 space-y-6"
                            >
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Price</p>
                                    <p className="text-4xl font-bold text-amber-500 font-display">
                                        {formatPrice(vehicle.price)}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">Negotiable • Includes transfer</p>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-premium w-full justify-center group"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp Executive
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    
                                    <a
                                        href={`tel:${siteConfig.contact.phone}`}
                                        className="btn-glass w-full justify-center"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call Now
                                    </a>
                                </div>

                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        <span>Usually responds in 10 minutes</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Shield className="w-4 h-4 text-amber-500" />
                                        <span>Verified dealer</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Finance Preview */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card p-6"
                            >
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-amber-500" />
                                    Estimated Finance
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Monthly from</span>
                                        <span className="text-white font-semibold">KES {(vehicle.price * 0.02).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Down payment (30%)</span>
                                        <span className="text-white font-semibold">{formatPrice(vehicle.price * 0.3)}</span>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className="w-full py-2 text-amber-500 text-sm font-medium hover:text-amber-400 transition-colors"
                                    >
                                        Calculate exact rates →
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <AnimatePresence>
                {showMobileCTA && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 lg:hidden z-50"
                    >
                        <div className="flex gap-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 btn-premium justify-center py-3 text-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </a>
                            <a
                                href={`tel:${siteConfig.contact.phone}`}
                                className="flex-1 btn-glass justify-center py-3 text-sm"
                            >
                                <Phone className="w-4 h-4" />
                                Call
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
