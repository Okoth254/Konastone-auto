import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Load Google Fonts for Admin (Material Symbols and Space Grotesk)
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={`${spaceGrotesk.variable} bg-admin-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen dark flex w-full`}>
            
            <AdminSidebar />

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
