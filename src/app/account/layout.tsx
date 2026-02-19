"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, Heart, Shield, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { href: "/account", label: "My Garage", icon: User },
        { href: "/account/contracts", label: "Active Contracts", icon: FileText },
        { href: "/account/saved", label: "Saved Vehicles", icon: Heart },
        { href: "/account/documents", label: "Document Vault", icon: Shield },
        { href: "/account/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Nav */}
                    <aside className="w-full md:w-72 flex-shrink-0 animate-fade-in">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-trust-900 mb-2">My Garage</h1>
                                <p className="text-sm text-trust-500 font-medium">Manage your automotive journey.</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden p-3">
                                <nav className="flex flex-col space-y-1">
                                    {links.map((link) => {
                                        const Icon = link.icon;
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group",
                                                    isActive
                                                        ? "bg-trust-900 text-white shadow-lg shadow-trust-900/20 translate-x-1"
                                                        : "text-trust-500 hover:bg-trust-50 hover:text-trust-900"
                                                )}
                                            >
                                                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-action-teal" : "text-trust-400 group-hover:text-trust-600")} />
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                    <div className="my-2 border-t border-gray-100 mx-2" />
                                    <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-trust-400 hover:text-red-600 hover:bg-red-50 transition-all text-left w-full group">
                                        <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                                        Sign Out
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 animate-slide-up">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
