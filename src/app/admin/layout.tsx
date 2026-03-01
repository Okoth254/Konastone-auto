"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { LogOut, LayoutDashboard, CarFront, Tags } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session && pathname !== "/admin/login") {
                router.push("/admin/login");
            } else if (session && pathname === "/admin/login") {
                router.push("/admin");
            } else {
                setIsAuthenticated(!!session);
                setIsLoading(false);
            }
        };

        checkAuth();

        // Listen for internal auth changes (like signing out)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_OUT") {
                    router.push("/admin/login");
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [pathname, router]);

    // Show a blank dark screen while determining auth state
    if (isLoading && pathname !== "/admin/login") {
        return <div className="min-h-screen bg-[#111111]" />;
    }

    // If on the login page, just render the children without the admin sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Authenticated layout with Sidebar
    return (
        <div className="min-h-screen bg-[#111111] flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1A1A1A] border-r border-[#333333] flex flex-col hidden md:flex h-screen sticky top-0">
                <div className="p-6 border-b border-[#333333]">
                    <Logo variant="light" height={28} width={120} linked={true} />
                    <p className="font-mono text-[10px] tracking-widest text-[#FFC107] uppercase mt-2">
                        System Control
                    </p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${pathname === "/admin"
                                ? "bg-[#333333] text-[#F5F5F5] border-l-2 border-[#FFC107]"
                                : "text-[#9CA3AF] hover:bg-[#222222] hover:text-[#D1D5DB]"
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/vehicles"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${pathname.startsWith("/admin/vehicles")
                                ? "bg-[#333333] text-[#F5F5F5] border-l-2 border-[#FFC107]"
                                : "text-[#9CA3AF] hover:bg-[#222222] hover:text-[#D1D5DB]"
                            }`}
                    >
                        <CarFront className="w-5 h-5" />
                        Inventory
                    </Link>

                    <Link
                        href="/admin/taxonomy"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${pathname.startsWith("/admin/taxonomy")
                                ? "bg-[#333333] text-[#F5F5F5] border-l-2 border-[#FFC107]"
                                : "text-[#9CA3AF] hover:bg-[#222222] hover:text-[#D1D5DB]"
                            }`}
                    >
                        <Tags className="w-5 h-5" />
                        Brands & Models
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#333333]">
                    <button
                        onClick={async () => await supabase.auth.signOut()}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-mono text-sm text-[#E53935] hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto w-full">
                {/* Mobile header (shows only on small screens) */}
                <div className="md:hidden bg-[#1A1A1A] p-4 border-b border-[#333333] flex justify-between items-center sticky top-0 z-50">
                    <Logo variant="light" height={24} width={100} linked={true} />
                    <button
                        onClick={async () => await supabase.auth.signOut()}
                        className="p-2 text-[#E53935]"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
