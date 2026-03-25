"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

interface Lead {
    id: string;
    name: string;
    status: string;
    created_at: string;
    vehicles?: {
        year: number;
        make: string;
        model: string;
    } | {
        year: number;
        make: string;
        model: string;
    }[] | null;
}

interface LeadsTimelineProps {
    leads: Lead[];
}

export default function LeadsTimeline({ leads }: LeadsTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0, 
            transition: { 
                type: "spring", 
                damping: 20, 
                stiffness: 100 
            } 
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'new': return "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(255,191,41,0.2)]";
            case 'contacted': return "bg-blue-500/10 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]";
            case 'negotiating': return "bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
            case 'sold': return "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
            default: return "bg-zinc-800/50 border-zinc-700 text-zinc-500";
        }
    };

    if (!leads || leads.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 font-black uppercase tracking-widest">No active telemetry available</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative pl-8 md:pl-24 py-12">
            {/* Animated Timeline Stroke */}
            <div className="absolute left-[39px] md:left-[87px] top-0 bottom-0 w-px bg-zinc-800">
                <motion.div 
                    style={{ scaleY: pathLength, originY: 0 }}
                    className="w-full h-full bg-linear-to-b from-primary via-primary to-transparent"
                />
            </div>

            <div className="space-y-16">
                {leads.map((lead) => {
                    const vehicleData = Array.isArray(lead.vehicles)
                        ? lead.vehicles[0]
                        : lead.vehicles;
                    const vehicleName = vehicleData
                        ? `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`
                        : "General Inquiry";
                    const date = new Date(lead.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });

                    return (
                        <motion.div
                            key={lead.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={itemVariants}
                            className="relative flex flex-col md:flex-row md:items-center gap-6 group"
                        >
                            {/* Timeline Node */}
                            <div className="absolute left-[-47px] md:left-[-95px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background-dark border-2 border-zinc-800 z-10 group-hover:border-primary group-hover:scale-125 transition-all duration-500 shadow-2xl">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    className="absolute inset-0.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </div>

                            {/* Date Column (Desktop) */}
                            <div className="hidden md:block w-32 text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-primary transition-colors">{date}</p>
                                <p className="text-[9px] font-mono text-zinc-700 uppercase">{lead.id.substring(0, 8)}</p>
                            </div>

                            {/* Lead Card */}
                            <Link 
                                href={`/admin/leads/${lead.id}`}
                                className="flex-1 bg-surface-container-high/40 backdrop-blur-md border border-zinc-800 p-6 md:p-8 rounded-3xl hover:border-primary/30 hover:bg-surface-container-high/60 transition-all duration-500 group/card relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover/card:bg-primary/10 transition-colors" />
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded border ${getStatusStyles(lead.status)}`}>
                                                {lead.status.replace('_', ' ')}
                                            </span>
                                            <p className="md:hidden text-[10px] font-black uppercase tracking-widest text-zinc-600">{date}</p>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-headline font-black text-on-surface uppercase tracking-tight group-hover/card:text-primary transition-colors">{lead.name}</h3>
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <span className="material-symbols-outlined text-sm">directions_car</span>
                                            <p className="text-sm font-medium">{vehicleName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-px bg-zinc-800 hidden md:block" />
                                        <div className="flex flex-col items-end">
                                            <span className="material-symbols-outlined text-zinc-700 group-hover/card:text-primary group-hover/card:translate-x-2 transition-all duration-500">arrow_forward_ios</span>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2 opacity-0 group-hover/card:opacity-100 transition-opacity">View Dossier</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
