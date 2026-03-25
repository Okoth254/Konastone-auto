"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import { motion } from "framer-motion";

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: "dashboard", exact: true },
        { name: "Inventory", href: "/admin/vehicles", icon: "directions_car", exact: false },
        { name: "Leads", href: "/admin/leads", icon: "leaderboard", exact: false },
        { name: "Moderation", href: "/admin/reviews", icon: "rate_review", exact: false },
    ];

    return (
        <nav className="flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#131313] border-r border-zinc-800 w-64 pt-6">
            <div className="px-6 mb-8">
                <h1 className="text-amber-400 font-bold tracking-widest font-headline text-xl uppercase">Command Center</h1>
                <p className="text-[10px] text-cyan-400 font-black tracking-[0.2em] mt-1 uppercase">System Active</p>
            </div>

            <div className="relative flex flex-col gap-1.5 w-full px-4">
                {navItems.map((item) => {
                    const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative h-12 z-10 px-5 flex items-center gap-4 font-headline text-[11px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${
                                isActive ? "text-cyan-400" : "text-zinc-600 hover:text-zinc-300"
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="admin-active-pill"
                                    className="absolute inset-0 bg-zinc-800/80 border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-sm"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="px-6 mt-10">
                <Link
                    href="/admin/vehicles/new"
                    className="w-full bg-primary text-background-dark font-black py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-amber-400 transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-primary/10"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Listing
                </Link>
            </div>

            <div className="mt-auto border-t border-zinc-800 pt-4 pb-8 px-4 flex flex-col gap-1">
                <Link
                    href="/admin/settings"
                    className={`relative h-12 px-5 flex items-center gap-4 font-headline text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                        pathname?.startsWith("/admin/settings") ? "text-cyan-400" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-xl"
                    }`}
                >
                    {pathname?.startsWith("/admin/settings") && (
                        <motion.div
                            layoutId="admin-active-pill"
                            className="absolute inset-0 bg-zinc-800/80 border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-sm"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                    )}
                    <span className="material-symbols-outlined text-xl">settings</span>
                    Settings
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="w-full h-12 text-left text-zinc-600 px-5 flex items-center gap-4 font-headline text-[11px] font-black uppercase tracking-[0.15em] hover:bg-zinc-800/50 hover:text-zinc-300 transition-all duration-300 rounded-xl"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Exit Admin
                    </button>
                </form>
            </div>
        </nav>
    );
}
