"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";

export default function AdminSidebar() {
    const pathname = usePathname();

    // Map routes to indices to calculate the translate-y position
    // Each link is 40px (py-3 approx + text) -> 44px total height.
    const navItems = [
        { name: "Dashboard", href: "/admin", icon: "dashboard", exact: true },
        { name: "Inventory", href: "/admin/vehicles", icon: "directions_car", exact: false },
        { name: "Leads", href: "/admin/leads", icon: "leaderboard", exact: false },
        { name: "Moderation", href: "/admin/reviews", icon: "rate_review", exact: false },
    ];

    const activeIndex = navItems.findIndex((item) =>
        item.exact ? pathname === item.href : pathname?.startsWith(item.href)
    );

    return (
        <nav className="flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#131313] border-r border-zinc-800 w-64 pt-6">
            <div className="px-6 mb-8">
                <h1 className="text-amber-400 font-bold tracking-widest font-headline text-xl">COMMAND CENTER</h1>
                <p className="text-[10px] text-cyan-400 font-medium tracking-[0.2em] mt-1">SYSTEM ACTIVE</p>
            </div>

            <div className="relative flex flex-col gap-1 w-full px-4">
                {/* Sliding Indicator Pill Background */}
                <div
                    className="absolute left-4 right-4 h-12 bg-zinc-800 border-l-4 border-cyan-400 transition-transform duration-300 ease-in-out pointer-events-none z-0 shadow-lg"
                    style={{
                        transform: `translateY(${activeIndex >= 0 ? activeIndex * 52 : -100}px)`,
                        opacity: activeIndex >= 0 ? 1 : 0,
                    }}
                />

                {navItems.map((item) => {
                    const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative h-12 z-10 px-4 flex items-center gap-3 font-headline text-xs font-medium tracking-widest transition-colors duration-150 ${
                                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-200"
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="px-6 mt-10">
                <Link
                    href="/admin/vehicles/new"
                    className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-3 text-xs tracking-widest hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 rounded-sm btn-sweep"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    NEW LISTING
                </Link>
            </div>

            <div className="mt-auto border-t border-zinc-800 pt-4 pb-8 px-4 flex flex-col gap-1">
                <Link
                    href="/admin/settings"
                    className={`h-12 px-4 flex items-center gap-3 font-headline text-xs font-medium tracking-widest transition-all duration-150 ${
                        pathname?.startsWith("/admin/settings") ? "text-cyan-400 bg-zinc-800 border-l-4 border-cyan-400" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">settings</span>
                    Settings
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="w-full h-12 text-left text-zinc-500 px-4 flex items-center gap-3 font-headline text-xs font-medium tracking-widest hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-150"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Exit Admin
                    </button>
                </form>
            </div>
        </nav>
    );
}
