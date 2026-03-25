"use client";

import { motion, useScroll, useTransform, Variants, AnimatePresence } from "framer-motion";
import { useRef, useMemo } from "react";
import Link from "next/link";
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";

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

    const groupedLeads = useMemo(() => {
        const groups: Record<string, Lead[]> = {
            'Today': [],
            'Yesterday': [],
            'This Week': [],
            'Older': []
        };

        leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        leads.forEach(lead => {
            const date = parseISO(lead.created_at);
            if (isToday(date)) groups['Today'].push(lead);
            else if (isYesterday(date)) groups['Yesterday'].push(lead);
            else if (isThisWeek(date)) groups['This Week'].push(lead);
            else groups['Older'].push(lead);
        });

        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [leads]);

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -30, filter: "blur(10px)" },
        visible: { 
            opacity: 1, 
            x: 0, 
            filter: "blur(0px)",
            transition: { 
                type: "spring", 
                damping: 25, 
                stiffness: 120 
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
            <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-surface-dark/40 backdrop-blur-xl">
                <span className="material-symbols-outlined text-4xl text-zinc-700 mb-4 block">analytics</span>
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">No active telemetry available</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative pl-12 md:pl-32 py-16">
            {/* Animated Timeline Stroke */}
            <div className="absolute left-[54px] md:left-[96px] top-0 bottom-0 w-[2px] bg-zinc-800/50">
                <motion.div 
                    style={{ scaleY: pathLength, originY: 0 }}
                    className="w-full h-full bg-linear-to-b from-primary via-accent-teal to-transparent"
                />
            </div>

            <div className="space-y-24">
                {groupedLeads.map(([groupName, groupLeads]) => (
                    <div key={groupName} className="relative">
                        {/* Group Header */}
                        <div className="absolute left-[-100px] md:left-[-120px] top-[-30px] z-20">
                            <motion.span 
                                initial={{ opacity: 0, rotate: -90 }}
                                whileInView={{ opacity: 1, rotate: -90 }}
                                className="inline-block text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 origin-bottom-right"
                            >
                                {groupName}
                            </motion.span>
                        </div>

                        <div className="space-y-12">
                            {groupLeads.map((lead, i) => {
                                const vehicleData = Array.isArray(lead.vehicles) ? lead.vehicles[0] : lead.vehicles;
                                const vehicleName = vehicleData
                                    ? `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`
                                    : "General Inquiry";
                                const dateStr = format(parseISO(lead.created_at), "HH:mm");

                                return (
                                    <motion.div
                                        key={lead.id}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={itemVariants}
                                        transition={{ delay: i * 0.05 }}
                                        className="relative flex flex-col md:flex-row md:items-center gap-8 group"
                                    >
                                        {/* Timeline Node */}
                                        <div className="absolute left-[-63px] md:left-[-101px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background-dark border-2 border-zinc-800 z-10 group-hover:border-primary group-hover:scale-125 transition-all duration-500 shadow-2xl flex items-center justify-center">
                                            <motion.div 
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-1.5 h-1.5 rounded-full bg-primary opacity-30 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>

                                        {/* Time Column (Desktop) */}
                                        <div className="hidden md:block w-32 text-right">
                                            <p className="text-sm font-heading font-black text-zinc-500 group-hover:text-primary transition-colors">{dateStr}</p>
                                            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">{lead.id.substring(0, 8)}</p>
                                        </div>

                                        {/* Lead Card */}
                                        <Link 
                                            href={`/admin/leads/${lead.id}`}
                                            className="flex-1 bg-surface-dark/40 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] hover:border-primary/40 hover:bg-surface-dark/60 transition-all duration-500 group/card relative overflow-hidden group-hover:translate-x-2"
                                        >
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none group-hover/card:bg-primary/10 transition-colors" />
                                            
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <motion.span 
                                                            whileHover={{ scale: 1.05 }}
                                                            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border ${getStatusStyles(lead.status)}`}
                                                        >
                                                            {lead.status.replace('_', ' ')}
                                                        </motion.span>
                                                        <p className="md:hidden text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{dateStr}</p>
                                                    </div>
                                                    <h3 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter leading-none group-hover/card:text-primary transition-colors">{lead.name}</h3>
                                                    <div className="flex items-center gap-3 text-slate-400">
                                                        <span className="material-symbols-outlined text-primary text-xl">directions_car</span>
                                                        <p className="text-lg font-heading tracking-tight">{vehicleName}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="h-16 w-px bg-white/5 hidden md:block" />
                                                    <div className="flex flex-col items-end">
                                                        <motion.div 
                                                            whileHover={{ x: 10 }}
                                                            className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary shadow-inner group-hover/card:border-primary/50 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-3xl font-black">arrow_forward_ios</span>
                                                        </motion.div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-4 opacity-0 group-hover/card:opacity-100 transition-opacity">Full Dossier</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
