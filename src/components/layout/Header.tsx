"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Search, Heart, User, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { favorites, user, logout } = useStore();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
    };

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    isScrolled
                        ? "bg-[#111111]/95 backdrop-blur-md py-3 border-b border-[#FFC107]/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                        : "bg-[#1A1A1A]/80 backdrop-blur-sm py-5"
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* LOGO */}
                    <Logo variant="light" height={36} width={160} />

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7">
                        {[
                            { href: "/filter?mode=hire", label: "Hire Purchase" },
                            { href: "/filter?mode=buy", label: "Buy" },
                            { href: "/sell", label: "Sell / Trade" },
                            { href: "/reviews", label: "Reviews" },
                            { href: "/help", label: "Help" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "text-sm font-mono font-semibold text-[#F5F5F5] uppercase tracking-widest",
                                    "hover:text-[#FFC107] transition-colors duration-200",
                                    "relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px]",
                                    "after:w-0 after:bg-[#FFC107] after:transition-all after:duration-300",
                                    "hover:after:w-full"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Favourites */}
                        <Link href="/favorites" className="relative text-[#9CA3AF] hover:text-[#FFC107] transition-colors">
                            <Heart className="w-5 h-5" />
                            {favorites.length > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFC107] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/account" className="flex items-center gap-2 text-[#D1D5DB] hover:text-[#FFC107] transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#FFC107]/40 overflow-hidden flex items-center justify-center">
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm font-mono hidden lg:block">{user.name.split(" ")[0]}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-[#6B7280] hover:text-[#E53935] transition-colors" title="Logout">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthOpen(true)}
                                className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#FFC107] transition-colors group"
                            >
                                <User className="w-5 h-5" />
                                <span className="text-xs font-mono uppercase tracking-widest hidden lg:block">Sign In</span>
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden text-[#9CA3AF] hover:text-[#FFC107] transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Yellow accent bar — bottom highlight */}
                <div className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC107]/60 to-transparent transition-all duration-500",
                    isScrolled ? "w-full opacity-100" : "w-0 opacity-0"
                )} />
            </header>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
