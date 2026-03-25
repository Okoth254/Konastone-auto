"use client";

import { AnimatePresence, motion } from "framer-motion";

interface TimelineEvent {
    id: string;
    created_at: string;
    event_type: string;
    description: string;
}

export function SystemEventStream({ events }: { events: TimelineEvent[] }) {
    return (
        <div className="bg-surface-container-lowest p-6 border border-white/5 font-mono text-[11px] leading-relaxed h-[360px] overflow-y-auto">
            <div className="space-y-3">
                <AnimatePresence initial={false}>
                    {events && events.length > 0 ? events.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ height: 0, opacity: 0, y: -8 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 280, damping: 26 }}
                            className="flex gap-3 relative group overflow-hidden"
                        >
                            <span className="text-zinc-600 shrink-0">[{new Date(event.created_at).toLocaleTimeString('en-US', { hour12: false }).substring(0, 8)}]</span>
                            <p><span className="text-admin-secondary font-bold">{event.event_type.toUpperCase()}</span>: <span className="text-zinc-300">{event.description}</span></p>
                        </motion.div>
                    )) : (
                        <div className="flex gap-3">
                            <span className="text-zinc-600">[--:--:--]</span>
                            <p><span className="text-admin-secondary">WAITING_FOR_DATA_PACKETS...</span></p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
