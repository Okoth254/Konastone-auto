import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminToaster from "@/components/admin/AdminToaster";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-background-dark text-on-surface font-body selection:bg-primary selection:text-black min-h-screen dark flex w-full relative">
            
            <AdminSidebar />

            {/* Main Canvas Context */}
            <div className="flex-1 flex flex-col min-h-screen xl:ml-72 transition-all duration-700">
                <main className="flex-1 w-full overflow-x-hidden overflow-y-visible">
                    {children}
                </main>
                
                <footer className="w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8 border-t border-white/5 bg-background-dark flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-zinc-500 font-heading text-[10px] tracking-widest">© {new Date().getFullYear()} Konastone Autos. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:mt-0">
                        <a className="text-zinc-600 font-heading text-[10px] tracking-widest hover:text-zinc-300 transition-colors" href="/">Public site</a>
                        <a className="text-zinc-600 font-heading text-[10px] tracking-widest hover:text-zinc-300 transition-colors" href="/inventory">Inventory</a>
                        <a className="text-zinc-600 font-heading text-[10px] tracking-widest hover:text-zinc-300 transition-colors" href="/reviews">Reviews</a>
                    </div>
                </footer>
            </div>
            <AdminToaster />
        </div>
    );
}
