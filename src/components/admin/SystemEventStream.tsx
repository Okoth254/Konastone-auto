"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface TimelineEvent {
    id: string;
    created_at: string;
    event_type: string;
    description: string;
}

export function SystemEventStream({ events }: { events: TimelineEvent[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [events]);

    const getEventColor = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('new') || t.includes('created')) return 'text-primary';
        if (t.includes('contact') || t.includes('update')) return 'text-accent-teal';
        if (t.includes('delete') || t.includes('remove') || t.includes('lost')) return 'text-red-500';
        if (t.includes('sold') || t.includes('success')) return 'text-green-500';
        return 'text-blue-500';
    };

    return (
        <div 
            ref={scrollRef}
            className="bg-surface-dark/60 backdrop-blur-3xl p-8 border border-white/5 rounded-[2.5rem] font-mono text-[10px] leading-relaxed h-[450px] overflow-y-auto relative group scrollbar-hide"
        >
            {/* Scanned Line Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_0%,rgba(255,191,41,0.1)_50%,transparent_100%)] bg-size-[100%_4px]" />
            
            <div className="space-y-4 relative z-10">
                <AnimatePresence initial={false} mode="popLayout">
                    {events && events.length > 0 ? events.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="flex gap-4 group/entry border-b border-white/2 pb-3 last:border-0"
                        >
                            <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                                <span className="text-slate-700 font-black">[{new Date(event.created_at).toLocaleTimeString('en-US', { hour12: false }).substring(0, 8)}]</span>
                                <motion.div 
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                    className={`w-1 h-1 rounded-full ${getEventColor(event.event_type)}`} 
                                />
                            </div>
                            
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-black uppercase tracking-[0.2em] ${getEventColor(event.event_type)}`}>
                                        {event.event_type.replace('_', ' ')}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                                    <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest">TRK_ID: {event.id.substring(0, 6)}</span>
                                </div>
                                <p className="text-slate-400 font-medium leading-normal group-hover/entry:text-slate-200 transition-colors">
                                    {event.description}
                                </p>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="shrink-0 flex items-center justify-center opacity-0 group-hover/entry:opacity-100 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-primary text-sm cursor-pointer hover:scale-125 transition-transform">open_in_new</span>
                            </motion.div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                            <span className="material-symbols-outlined text-4xl animate-pulse">broadcast_on_personal</span>
                            <span className="text-primary font-black tracking-[0.5em] uppercase text-xs">Awaiting data packets...</span>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
