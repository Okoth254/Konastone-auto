import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminVehicles() {
    const supabase = await createClient();
    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="p-8">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-background uppercase mb-2">Inventory Fleet</h1>
                    <p className="text-zinc-500 font-label text-sm tracking-wide uppercase">Active Assets: {vehicles?.filter(v => v.status === 'available').length || 0} | Logistics Pipeline: {vehicles?.filter(v => v.status === 'in_transit').length || 0} Units</p>
                </div>
                <div className="flex gap-2">
                    <button className="glass-dark px-4 py-2 border border-admin-secondary/30 text-admin-secondary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">filter_alt</span> Export Data
                    </button>
                    <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700">
                        Sort: Newest First
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full xl:w-72 shrink-0 space-y-8">
                    <div className="bg-surface-container p-6 border-l-2 border-primary-container">
                        <h3 className="font-headline font-bold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-container text-sm">tune</span> Technical Filter
                        </h3>
                        <div className="space-y-6">
                            {/* Status Toggles */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Asset Category</label>
                                <div className="flex flex-col gap-2">
                                    <button className="glass-dark px-4 py-3 text-left text-xs font-bold tracking-wider text-admin-secondary border-l-2 border-admin-secondary flex justify-between items-center group">
                                        New Arrivals <span className="material-symbols-outlined text-sm opacity-50">chevron_right</span>
                                    </button>
                                    <button className="glass-dark px-4 py-3 text-left text-xs font-bold tracking-wider text-zinc-400 border-l-2 border-transparent hover:border-zinc-500 transition-all flex justify-between items-center group">
                                        On Shipment <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-50">chevron_right</span>
                                    </button>
                                    <button className="glass-dark px-4 py-3 text-left text-xs font-bold tracking-wider text-zinc-400 border-l-2 border-transparent hover:border-zinc-500 transition-all flex justify-between items-center group">
                                        Foreign Used <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-50">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Price Sliders */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Price Range (USD)</label>
                                    <span className="text-xs text-primary-container font-mono">$45k - $120k</span>
                                </div>
                                <div className="relative h-1 w-full bg-surface-container-highest">
                                    <div className="absolute h-full bg-primary-container left-1/4 right-1/4"></div>
                                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-3 h-3 bg-primary-container"></div>
                                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-3 h-3 bg-primary-container"></div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Transmission</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="py-2 bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest text-zinc-300 border border-zinc-700">Automatic</button>
                                    <button className="py-2 bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-widest">Manual</button>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-zinc-100 text-black font-headline font-black text-xs uppercase tracking-widest hover:bg-white transition-colors">Reset System</button>
                    </div>

                    {/* Logistics Status Card */}
                    <div className="bg-surface-container-low p-6 border border-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-admin-secondary animate-pulse">local_shipping</span>
                            <h4 className="text-[10px] font-bold tracking-widest uppercase">Pipeline Health</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-zinc-500">TRANSIT ACCURACY</span>
                                <span className="text-admin-secondary">98.4%</span>
                            </div>
                            <div className="h-1 bg-surface-container-lowest">
                                <div className="h-full bg-admin-secondary w-[98%]"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Grid Content */}
                <section className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {vehicles?.map((vehicle) => (
                            <div key={vehicle.id} className="bg-surface-container-high flex flex-col group border-t-2 border-transparent hover:border-admin-secondary transition-all">
                                <div className="relative h-64 overflow-hidden">
                                    <Image fill alt={vehicle.model} className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" src={vehicle.main_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBnXmNPbq6JQzkZR5_Mv2BuOClRsi7z3uaRDTc1PgAU9dJvxJVVg1zBtkWYp9fSu5WCsg1fo7ToKv1_atfqLag6P2Cx3-ngBKwkrG_Ny8o6Jt66P1a0n-8wJ3wQwQvzSevWNx5SG1AyHve5qWxRKXvTtRaTgUjvBZ83EUa3_ccoUjLyTEAeKhmjXjTonS-12IP2IIKhkRGsxWccrCIFQtVVf0gtU-VrogRZCmYC8NG5Sus2xuLcgNOdMIIQWWmuVMixf0RarhwPmFfi"} />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                            vehicle.status === 'in_transit' ? 'bg-error-container text-on-error-container' : 
                                            vehicle.status === 'available' ? 'bg-primary-container text-on-primary-container' : 
                                            'bg-surface-container-highest text-zinc-300'
                                        }`}>
                                            {vehicle.status.replace('_', ' ')}
                                        </span>
                                        {vehicle.status === 'in_transit' && (
                                            <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest">ETA: 48H</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <div>
                                            <h3 className="font-headline font-bold text-lg leading-tight uppercase tracking-tight line-clamp-2">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                                            <span className="text-admin-secondary font-mono text-[10px] tracking-widest">VIN: {vehicle.vin || 'PENDING'}</span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="block text-primary-container font-headline font-black text-xl">${Intl.NumberFormat('en-US').format(vehicle.price)}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Spec</span>
                                            <span className="text-[11px] font-bold text-admin-secondary uppercase truncate">{vehicle.engine_type || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Mileage</span>
                                            <span className="text-[11px] font-bold text-admin-secondary uppercase">{Intl.NumberFormat('en-US').format(vehicle.mileage)} MI</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Grade</span>
                                            <span className="text-[11px] font-bold text-admin-secondary uppercase">{vehicle.condition || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link href={`/admin/vehicles/edit/${vehicle.id}`} className="flex-1 bg-zinc-800 hover:bg-admin-secondary hover:text-on-secondary transition-colors text-center py-2 text-xs font-bold uppercase tracking-widest text-zinc-300">Edit</Link>
                                        <Link href={`/admin/vehicles/${vehicle.id}`} className="flex-1 border border-zinc-700 hover:border-zinc-400 transition-colors text-center py-2 text-xs font-bold uppercase tracking-widest text-zinc-300">View Specs</Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!vehicles || vehicles.length === 0) && (
                            <div className="col-span-full py-20 text-center">
                                <span className="material-symbols-outlined text-4xl text-zinc-600 mb-4 block">inventory_2</span>
                                <p className="text-zinc-500 font-headline uppercase tracking-widest text-sm">No vehicles found in the system</p>
                            </div>
                        )}
                    </div>
                    {/* Load More / Pagination */}
                    <div className="mt-12 flex justify-center">
                        <button className="px-12 py-4 border-2 border-zinc-800 text-zinc-500 font-headline font-bold text-xs uppercase tracking-[0.3em] hover:border-admin-secondary hover:text-admin-secondary transition-all active:scale-95">Load Next Protocol</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
