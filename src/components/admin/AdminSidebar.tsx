"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change for mobile
    // We use a safe check to avoid cascading renders warning
    useEffect(() => {
        let mounted = true;
        if (mounted && isOpen) {
            setIsOpen(false);
        }
        return () => { mounted = false; };
    }, [pathname]);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: "dashboard", exact: true },
        { name: "Inventory", href: "/admin/vehicles", icon: "directions_car", exact: false },
        { name: "Leads", href: "/admin/leads", icon: "leaderboard", exact: false },
        { name: "Moderation", href: "/admin/reviews", icon: "rate_review", exact: false },
    ];

    return (
        <>
            {/* Mobile Toggle Trigger */}
            <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden fixed top-6 right-6 z-[100] w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-2xl shadow-primary/20 border border-white/20 active:scale-95 transition-transform"
            >
                <span className="material-symbols-outlined font-black">
                    {isOpen ? 'close' : 'menu'}
                </span>
            </motion.button>

            {/* Mobile Backdrop Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="xl:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
                    />
                )}
            </AnimatePresence>

            <nav className={`
                fixed top-0 left-0 z-50 h-screen w-72 pt-12 pb-12 flex flex-col 
                bg-background-dark/95 backdrop-blur-3xl border-r border-white/5 
                transition-all duration-700 ease-[0.16, 1, 0.3, 1]
                ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
            `}>
                {/* Tactical Status Indicators */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-white/10 via-transparent to-transparent" />

                <div className="px-10 mb-16 relative">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="material-symbols-outlined text-primary text-xl font-black relative">shield</span>
                        </div>
                        <div>
                            <h1 className="text-white font-heading font-black tracking-tighter text-2xl uppercase italic leading-none">
                                KONA<span className="text-primary">CORE</span>
                            </h1>
                            <p className="text-[7px] text-slate-500 font-black tracking-[0.5em] uppercase mt-1">Registry_Alpha_v3</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-6 space-y-3">
                    <p className="px-4 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Main_Operations</p>
                    {navItems.map((item) => {
                        const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`relative h-14 px-6 flex items-center gap-4 group transition-all duration-500 rounded-2xl overflow-hidden ${
                                    isActive ? "text-primary bg-primary/10 shadow-inner" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                }`}
                            >
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="admin-nav-indicator"
                                            className="absolute left-0 w-1 h-8 rounded-full bg-primary"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                        />
                                    )}
                                </AnimatePresence>
                                
                                <span className={`material-symbols-outlined text-2xl transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,191,41,0.5)]' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-heading text-[11px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="admin-nav-telemetry"
                                        className="ml-auto flex items-center gap-1.5"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[7px] font-black text-primary/40 uppercase tracking-widest">Live</span>
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-10 px-4">
                        <Link href="/admin/vehicles/new" onClick={() => setIsOpen(false)}>
                            <motion.div 
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-black flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 cursor-pointer"
                            >
                                <span className="material-symbols-outlined font-black">add</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">New_Asset</span>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                <div className="mt-auto px-6 space-y-3">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-6" />
                    
                    <Link
                        href="/admin/settings"
                        onClick={() => setIsOpen(false)}
                        className={`h-14 px-6 flex items-center gap-4 transition-all duration-500 rounded-2xl group ${
                            pathname?.startsWith("/admin/settings") 
                                ? "text-primary bg-primary/10 border border-primary/20" 
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl transition-transform group-hover:rotate-90 duration-500">settings</span>
                        <span className="font-heading text-[11px] font-black uppercase tracking-[0.2em]">Core_Settings</span>
                    </Link>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full h-14 px-6 flex items-center gap-4 text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-500 rounded-2xl group cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">logout</span>
                            <span className="font-heading text-[11px] font-black uppercase tracking-[0.2em]">Exit_Registry</span>
                        </button>
                    </form>
                </div>
            </nav>
        </>
    );
}
