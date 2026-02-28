"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Key, FileText, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { AuthModal } from "@/components/auth/AuthModal";

export function MobileNav() {
    const pathname = usePathname();
    const { favorites, user } = useStore();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/inventory?mode=hire", label: "Hire", icon: FileText },
        { href: "/inventory?mode=buy", label: "Buy", icon: Key },
        { href: "/favorites", label: "Saved", icon: Heart },
    ];

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#2D2D2D] z-50 pb-safe">
                {/* Yellow top accent */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FFC107]/50 to-transparent" />

                <div className="flex justify-around items-center h-16">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "?");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                    isActive ? "text-[#FFC107]" : "text-[#9CA3AF] hover:text-[#D1D5DB]"
                                )}
                            >
                                <div className="relative">
                                    <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                    {link.href === "/favorites" && favorites.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#FFC107] text-black text-[9px] font-bold flex items-center justify-center rounded-full border border-[#111111]">
                                            {favorites.length}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-mono uppercase tracking-widest leading-none">{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* Auth / Account */}
                    {user ? (
                        <Link
                            href="/account"
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                pathname === "/account" ? "text-[#FFC107]" : "text-[#9CA3AF] hover:text-[#D1D5DB]"
                            )}
                        >
                            <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full border border-[#FFC107]/40" />
                            <span className="text-[10px] font-mono uppercase tracking-widest leading-none">Me</span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#9CA3AF] hover:text-[#FFC107] transition-colors duration-200"
                        >
                            <User className="w-6 h-6" />
                            <span className="text-[10px] font-mono uppercase tracking-widest leading-none">Login</span>
                        </button>
                    )}
                </div>
            </nav>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
