import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import * as motion from "framer-motion/client";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";

export default async function AdminVehicles(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;
    const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

    const supabase = await createClient();

    // 1. Fetch counts
    const { data: allVehicles } = await supabase.from('vehicles').select('status');
    const availableCount = allVehicles?.filter(v => v.status === 'available').length || 0;
    const inTransitCount = allVehicles?.filter(v => v.status === 'in_transit').length || 0;

    // 2. Fetch filtered vehicles
    let query = supabase.from('vehicles').select('*, vehicle_images(public_url, is_main, sort_order)', { count: 'exact' });
    
    if (currentStatus) {
        query = query.eq('status', currentStatus);
    }
    
    if (currentSort === 'price_asc') query = query.order('price', { ascending: true });
    else if (currentSort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const pageSize = 12;
    const to = (currentPage * pageSize) - 1;
    query = query.range(0, to);

    const { data: vehicles, count } = await query;
    const hasMore = count !== null && count > to + 1;

    const getSortLink = (sortType: string) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        params.set('sort', sortType);
        return `?${params.toString()}`;
    };

    const getStatusLink = (statusType: string) => {
        const params = new URLSearchParams();
        params.set('status', statusType);
        if (currentSort) params.set('sort', currentSort);
        return `?${params.toString()}`;
    };

    const getNextPageLink = () => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentSort) params.set('sort', currentSort);
        params.set('page', (currentPage + 1).toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="p-10 space-y-12">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white uppercase italic">INVENTORY <span className="text-primary">FLEET</span></h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_10px_rgba(38,198,218,0.5)]" />
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">READY: {availableCount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">PIPELINE: {inTransitCount}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-dark/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5">
                    <div className="relative group">
                        <button className="h-12 px-6 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all min-w-[200px]">
                            {currentSort === 'price_asc' ? 'VALUATION: LOW-HIGH' : currentSort === 'price_desc' ? 'VALUATION: HIGH-LOW' : 'SORT: NEWEST'}
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-full bg-surface-dark border border-white/10 rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl">
                            <Link href={getSortLink('newest')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/2 hover:text-primary border-b border-white/5 transition-all">Newest First</Link>
                            <Link href={getSortLink('price_desc')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/2 hover:text-primary border-b border-white/5 transition-all">Highest Valuation</Link>
                            <Link href={getSortLink('price_asc')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/2 hover:text-primary transition-all">Lowest Valuation</Link>
                        </div>
                    </div>
                    <div className="w-10 h-10 border-l border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-700 text-xl">database</span>
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col xl:flex-row gap-12">
                {/* Protocol Sidebar */}
                <aside className="w-full xl:w-80 shrink-0 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 space-y-8"
                    >
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">FILTER_PROTOCOL</p>
                            <div className="flex flex-col gap-2">
                                {[
                                    { label: 'ALL ASSETS', value: undefined, icon: 'grid_view' },
                                    { label: 'NEW ARRIVALS', value: 'available', icon: 'verified' },
                                    { label: 'ON SHIPMENT', value: 'in_transit', icon: 'local_shipping' },
                                    { label: 'SOLD HISTORY', value: 'sold', icon: 'history' }
                                ].map((filter) => (
                                    <Link 
                                        key={filter.label}
                                        href={getStatusLink(filter.value as string)} 
                                        className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center group transition-all duration-500 border ${
                                            currentStatus === filter.value 
                                                ? 'bg-primary/10 border-primary/20 text-primary' 
                                                : 'border-transparent text-slate-500 hover:border-white/10 hover:text-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-lg">{filter.icon}</span>
                                            {filter.label}
                                        </div>
                                        <span className={`material-symbols-outlined text-sm transition-transform duration-500 ${currentStatus === filter.value ? 'opacity-100' : 'opacity-0 translate-x-4 group-hover:opacity-50 group-hover:translate-x-0'}`}>east</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <Link href="/admin/vehicles" className="w-full h-12 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-primary transition-colors">
                                RESET_FILTERS
                            </Link>
                        </div>
                    </motion.div>

                    {/* Pipeline Health (Decorative) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface-dark/40 backdrop-blur-xl p-8 rounded-4xl border border-white/5 overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/5 blur-3xl" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <span className="material-symbols-outlined text-accent-teal animate-pulse">analytics</span>
                            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Logistics_Metrics</h4>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-300">
                                    <span>Sync Accuracy</span>
                                    <span className="text-accent-teal">99.8%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "99.8%" }} className="h-full bg-accent-teal" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </aside>

                {/* Heavy-Duty Grid Content */}
                <section className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {vehicles?.map((vehicle, i) => {
                             const imgs = (vehicle as { vehicle_images?: { public_url: string; is_main: boolean; sort_order: number }[] }).vehicle_images;
                             const imgSrc = imgs?.find(img => img.is_main)?.public_url 
                                || imgs?.sort((a,b) => a.sort_order - b.sort_order)[0]?.public_url
                                || 'https://placehold.co/800x600/1a1a1a/444444?text=No+Image';

                             return (
                                <motion.div 
                                    key={vehicle.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 + 0.3 }}
                                    className="bg-surface-dark/40 backdrop-blur-xl flex flex-col group border border-white/5 rounded-4xl overflow-hidden hover:border-primary/40 transition-all duration-700"
                                >
                                    <div className="relative aspect-16/10 overflow-hidden">
                                        <Image 
                                            fill 
                                            alt={vehicle.model} 
                                            className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                                            src={imgSrc} 
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <MotionBadge 
                                                    className={`uppercase ${
                                                        vehicle.status === 'in_transit' ? 'bg-blue-500/20 text-blue-500 border-blue-500/20' : 
                                                        vehicle.status === 'available' ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/20' : 
                                                        'bg-slate-800 text-slate-500 border-white/5'
                                                    }`}
                                                >
                                                    {vehicle.status?.replace('_', ' ')}
                                                </MotionBadge>
                                                {vehicle.is_featured && <MotionBadge color="primary" icon="star">FEATURED</MotionBadge>}
                                            </div>
                                            {vehicle.status === 'in_transit' && (
                                                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest self-start">ETA: T-MINUS 48H</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col gap-8">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
                                                    {vehicle.year} {vehicle.make} <br />
                                                    <span className="text-3xl">{vehicle.model.split(' ')[0]}</span>
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-primary transition-colors" />
                                                    <span className="text-slate-600 font-mono text-[9px] font-black uppercase tracking-[0.3em]">VIN: {vehicle.vin?.substring(0, 10) || 'PENDING'}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Valuation</p>
                                                <span className="text-3xl font-heading font-black text-white tracking-tighter italic">KSH {Intl.NumberFormat('en-KE').format(vehicle.price || 0)}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">DRIVETRAIN</span>
                                                <span className="text-[11px] font-black text-slate-200 uppercase truncate">{vehicle.engine_type || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">MILEAGE</span>
                                                <span className="text-[11px] font-black text-slate-200 uppercase">{Intl.NumberFormat('en-US').format(vehicle.mileage || 0)} KM</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">GRADE</span>
                                                <span className="text-[11px] font-black text-white uppercase">{vehicle.condition || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <MotionButton 
                                                href={`/admin/vehicles/edit/${vehicle.id}`}
                                                variant="outline"
                                                className="flex-1 h-12 border-white/10 hover:border-primary/40 group/btn"
                                            >
                                                <span className="material-symbols-outlined text-lg mr-2 group-hover/btn:rotate-90 transition-transform">edit_note</span>
                                                MODIFY
                                            </MotionButton>
                                            <MotionButton 
                                                href={`/admin/vehicles/${vehicle.id}`}
                                                variant="ghost"
                                                className="flex-1 h-12 border-white/5"
                                            >
                                                DETAILS
                                            </MotionButton>
                                        </div>
                                    </div>
                                </motion.div>
                             );
                        })}
                    </div>

                    {hasMore && (
                        <div className="mt-16 flex justify-center">
                            <MotionButton 
                                href={getNextPageLink()}
                                variant="outline"
                                className="px-16 h-16 border-white/5 text-[10px] tracking-[0.4em]"
                            >
                                LOAD_NEXT_PROTOCOL
                            </MotionButton>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
