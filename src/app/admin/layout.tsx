import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Load Google Fonts for Admin (Material Symbols and Space Grotesk)
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={`${spaceGrotesk.variable} bg-background-dark text-on-surface font-body selection:bg-primary selection:text-black min-h-screen dark flex w-full relative`}>
            
            <AdminSidebar />

            {/* Main Canvas Context */}
            <div className="flex-1 flex flex-col min-h-screen xl:ml-72 transition-all duration-700">
                <main className="flex-1 w-full overflow-hidden">
                    {children}
                </main>
                
                <footer className="w-full px-10 py-8 border-t border-white/5 bg-background-dark flex flex-col md:flex-row justify-between items-center">
                    <p className="text-zinc-500 font-heading text-[10px] tracking-widest">© {new Date().getFullYear()} Konastone Autos. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a className="text-zinc-600 font-heading text-[10px] tracking-widest hover:text-zinc-300 transition-colors" href="#">Privacy</a>
                        <a className="text-zinc-600 font-heading text-[10px] tracking-widest hover:text-zinc-300 transition-colors" href="#">Terms</a>
                        <a className="text-zinc-600 font-heading text-[10px] tracking-widest hover:text-zinc-300 transition-colors" href="#">Admin portal</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
