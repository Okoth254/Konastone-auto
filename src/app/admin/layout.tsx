import Link from "next/link";
import { ReactNode } from "react";

// Load Google Fonts for Admin (Material Symbols and Space Grotesk)
import { Space_Grotesk } from "next/font/google";
import { logout } from "./login/actions";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={`${spaceGrotesk.variable} bg-admin-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen dark flex w-full`}>
            
            {/* SideNavBar */}
            <nav className="flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#131313] border-r border-zinc-800 w-64">
                <div className="p-6">
                    <h1 className="text-amber-400 font-bold tracking-widest font-headline text-xl">COMMAND CENTER</h1>
                    <p className="text-[10px] text-cyan-400 font-medium tracking-[0.2em] mt-1">SYSTEM ACTIVE</p>
                </div>
                <div className="mt-8 flex flex-col gap-1">
                    <Link href="/admin" className="bg-zinc-800 text-cyan-400 border-l-4 border-cyan-400 px-4 py-3 flex items-center gap-3 font-headline text-xs font-medium tracking-widest transition-all duration-150">
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        Dashboard
                    </Link>
                    <Link href="/admin/vehicles" className="text-zinc-500 px-4 py-3 flex items-center gap-3 font-headline text-xs font-medium tracking-widest hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-150">
                        <span className="material-symbols-outlined text-lg">directions_car</span>
                        Inventory
                    </Link>
                    <Link href="/admin/leads" className="text-zinc-500 px-4 py-3 flex items-center gap-3 font-headline text-xs font-medium tracking-widest hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-150">
                        <span className="material-symbols-outlined text-lg">leaderboard</span>
                        Leads
                    </Link>
                    <Link href="/admin/reviews" className="text-zinc-500 px-4 py-3 flex items-center gap-3 font-headline text-xs font-medium tracking-widest hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-150">
                        <span className="material-symbols-outlined text-lg">rate_review</span>
                        Moderation
                    </Link>
                </div>
                <div className="px-6 mt-10">
                    <Link href="/admin/vehicles/new" className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-3 text-xs tracking-widest hover:bg-amber-500 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span>
                        NEW LISTING
                    </Link>
                </div>
                <div className="mt-auto border-t border-zinc-800 pt-4 pb-8">
                    <Link href="/admin/settings" className="text-zinc-500 px-4 py-3 flex items-center gap-3 font-headline text-xs font-medium tracking-widest hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-150">
                        <span className="material-symbols-outlined text-lg">settings</span>
                        Settings
                    </Link>
                    <form action={logout}>
                        <button type="submit" className="w-full text-left text-zinc-500 px-4 py-3 flex items-center gap-3 font-headline text-xs font-medium tracking-widest hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-150">
                            <span className="material-symbols-outlined text-lg">logout</span>
                            Exit Admin
                        </button>
                    </form>
                </div>
            </nav>

            {/* Main Canvas Context */}
            <div className="ml-64 flex-1 flex flex-col min-h-screen">
                <main className="flex-1">
                    {children}
                </main>
                
                <footer className="w-full px-10 py-8 border-t border-zinc-900 bg-[#131313] flex flex-col md:flex-row justify-between items-center">
                    <p className="text-zinc-500 font-headline text-[10px] uppercase tracking-widest">©{new Date().getFullYear()} KONASTONE AUTOS. ALL SYSTEMS OPERATIONAL.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a className="text-zinc-600 font-headline text-[10px] uppercase tracking-widest hover:text-zinc-300 transition-colors" href="#">Privacy Policy</a>
                        <a className="text-zinc-600 font-headline text-[10px] uppercase tracking-widest hover:text-zinc-300 transition-colors" href="#">Terms of Service</a>
                        <a className="text-zinc-600 font-headline text-[10px] uppercase tracking-widest hover:text-zinc-300 transition-colors" href="#">Dealer Portal</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
