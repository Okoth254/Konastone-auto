import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatCurrency } from "@/utils/format";
import * as motion from "framer-motion/client";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";

export default async function VehicleSpecsView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const [vehicleResult, imagesResult] = await Promise.all([
        supabase.from('vehicles').select('*').eq('id', id).single(),
        supabase.from('vehicle_images').select('public_url, is_main, sort_order').eq('vehicle_id', id).order('sort_order', { ascending: true }),
    ]);
    const vehicle = vehicleResult.data;
    const vehicleImages = imagesResult.data || [];

    if (!vehicle) {
        notFound();
    }

    const heroImage = vehicleImages.find(i => i.is_main)?.public_url
        || vehicleImages[0]?.public_url
        || vehicle.main_image_url
        || (vehicle.folder_name ? `/images/inventory/${vehicle.folder_name}/1.jpeg` : null)
        || 'https://placehold.co/1600x900/1a1a1a/444444?text=No+Image';

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Command Header */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 flex justify-between items-center w-full px-10 py-6 bg-surface-dark/40 backdrop-blur-xl border-b border-white/5"
            >
                <div className="flex items-center gap-10">
                    <Link href="/admin/vehicles" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">west</span>
                    </Link>
                    <div className="space-y-1">
                        <h2 className="text-xl font-heading font-black text-white uppercase tracking-tighter italic">
                            {vehicle.year} {vehicle.make} <span className="text-primary">{vehicle.model}</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">ASSET_ID: {vehicle.id.substring(0, 8)}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">CORE_STATE: {vehicle.status.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <MotionButton variant="ghost" className="w-12 h-12 p-0 rounded-xl border-white/5">
                        <span className="material-symbols-outlined">print</span>
                    </MotionButton>
                    <MotionButton variant="outline" href={`/admin/vehicles/edit/${vehicle.id}`} className="px-8 h-12 rounded-xl border-primary/20 text-primary">
                        EDIT_ASSET
                    </MotionButton>
                </div>
            </motion.header>

            <div className="p-10 space-y-12">
                {/* Cinematic Hero */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-[550px] w-full rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl"
                >
                    <Image 
                        fill 
                        className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100" 
                        src={heroImage} 
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-16 left-16 space-y-6 max-w-2xl">
                        <div className="flex gap-3">
                            <MotionBadge color="primary" className="px-6 py-2 tracking-[0.2em]">OPERATIONAL</MotionBadge>
                            <MotionBadge color="secondary" className="px-6 py-2 tracking-[0.2em]">{vehicle.status.toUpperCase()}</MotionBadge>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-heading font-black tracking-tighter text-white uppercase leading-[0.85] italic">
                            THE <span className="text-primary">{vehicle.model.split(' ')[0]}</span> <br /> 
                            {vehicle.make.toUpperCase()}
                        </h1>
                    </div>

                    {/* Telemetry Annex */}
                    <div className="absolute bottom-16 right-16 bg-surface-dark/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 hidden lg:block">
                        <div className="flex flex-col gap-6 w-48">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">VALUATION</p>
                                <p className="text-2xl font-heading font-black text-white italic">KSH {formatCurrency(vehicle.price || 0).split('KSh')[1]}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">DRIVETRAIN</p>
                                <p className="text-lg font-heading font-black text-primary uppercase">{vehicle.drivetrain || 'ALL-WHEEL'}</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Tech Cards Staggered */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'ENGINE & TELEMETRY', icon: 'settings_prolong', value: vehicle.engine_type, sub: vehicle.power || 'ACTIVE', color: 'primary' },
                        { label: 'TRANSMISSION_ID', icon: 'grid_guides', value: vehicle.transmission, sub: `MIL: ${vehicle.mileage || 0} KM`, color: 'secondary' },
                        { label: 'AESTHETIC_PROFILE', icon: 'palette', value: vehicle.exterior_color, sub: `INT: ${vehicle.interior_color || 'SLATE'}`, color: 'neutral' },
                        { label: 'PROTOCOL_TAGS', icon: 'token', value: vehicle.tags?.[0] || 'STND', sub: `${vehicle.tags?.length || 0} MODULES`, color: 'primary' }
                    ].map((card, i) => (
                        <motion.div 
                            key={card.label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="bg-surface-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 group hover:border-white/20 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">{card.icon}</span>
                                </div>
                                <div className="h-[1px] w-12 bg-white/10 mt-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">{card.label}</p>
                                <h3 className="text-2xl font-heading font-black text-white uppercase truncate">{card.value || 'NOMINAL'}</h3>
                                <p className="text-[11px] font-black font-mono text-slate-500 uppercase tracking-widest">{card.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Identification Matrix */}
                <motion.section 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-surface-dark/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden"
                >
                    <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h2 className="font-heading font-black text-2xl tracking-tighter uppercase text-white">Technical identification Matrix</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">DB_ID: CORE_{vehicle.id.substring(0,6)}</span>
                            <span className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_10px_#26C6DA]" />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="text-sm">
                                {[
                                    { label: 'VIN_PROTOCOL', value: vehicle.vin || 'PENDING_ASSIGNMENT' },
                                    { label: 'ASSET_GRADE', value: vehicle.condition || 'NOMINAL' },
                                    { label: 'BODY_STRUCTURE', value: vehicle.body_style || 'STANDARD' },
                                    { label: 'FUEL_PROFILE', value: vehicle.fuel_type || 'PETROL' },
                                    { label: 'REG_COUNTRY', value: 'KENYA (OPERATIONAL)' },
                                    { label: 'CHASSIS_CODE', value: vehicle.chassis_no || 'TBD' }
                                ].map((row, i) => (
                                    <tr key={row.label} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] w-1/3">{row.label}</td>
                                        <td className="px-10 py-6 text-white font-mono font-black tracking-widest group-hover:text-primary transition-colors">{row.value}</td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="inline-flex gap-1">
                                                {[0, 1, 2].map(dot => (
                                                    <div key={dot} className="w-1 h-3 rounded-full bg-slate-800 group-hover:bg-primary transition-all" />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
