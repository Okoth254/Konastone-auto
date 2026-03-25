import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminVehicles(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;
    const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

    const supabase = await createClient();

    // 1. Fetch counts independent of filters
    const { data: allVehicles } = await supabase.from('vehicles').select('status');
    const availableCount = allVehicles?.filter(v => v.status === 'available').length || 0;
    const inTransitCount = allVehicles?.filter(v => v.status === 'in_transit').length || 0;

    // 2. Fetch filtered paginated vehicles with their first gallery image
    let query = supabase.from('vehicles').select('*, vehicle_images(public_url, is_main, sort_order)', { count: 'exact' });
    
    if (currentStatus) {
        query = query.eq('status', currentStatus);
    }
    
    if (currentSort === 'price_asc') {
        query = query.order('price', { ascending: true });
    } else if (currentSort === 'price_desc') {
        query = query.order('price', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false }); // newest
    }

    const pageSize = 12;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(0, to); // Always fetch from 0 to current page's end (incremental loading)

    const { data: vehicles, count } = await query;
    const hasMore = count !== null && count > to + 1;

    // Helper functions for links
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
        <div className="p-8">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-background uppercase mb-2">Inventory Fleet</h1>
                    <p className="text-zinc-500 font-label text-sm tracking-wide uppercase">Active Assets: {availableCount} | Logistics Pipeline: {inTransitCount} Units</p>
                </div>
                <div className="flex gap-2 relative">
                    <button className="glass-dark px-4 py-2 border border-admin-secondary/30 text-admin-secondary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">filter_alt</span> Export Data
                    </button>
                    <div className="relative group cursor-pointer">
                        <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700 min-w-[170px] flex justify-between items-center gap-2">
                            Sort: {currentSort === 'price_asc' ? 'Low to High' : currentSort === 'price_desc' ? 'High to Low' : 'Newest'}
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-1 w-full bg-surface-container-highest border border-zinc-700 hidden group-hover:flex flex-col z-50">
                            <Link href={getSortLink('newest')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 transition-colors">Newest First</Link>
                            <Link href={getSortLink('price_desc')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 border-t border-zinc-700 transition-colors">Highest Price</Link>
                            <Link href={getSortLink('price_asc')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 border-t border-zinc-700 transition-colors">Lowest Price</Link>
                        </div>
                    </div>
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
                                    <Link href={getStatusLink('available')} className={`glass-dark px-4 py-3 text-left text-xs font-bold tracking-wider flex justify-between items-center group border-l-2 transition-all ${currentStatus === 'available' ? 'text-admin-secondary border-admin-secondary' : 'text-zinc-400 border-transparent hover:border-zinc-500'}`}>
                                        New Arrivals <span className={`material-symbols-outlined text-sm ${currentStatus === 'available' ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}>chevron_right</span>
                                    </Link>
                                    <Link href={getStatusLink('in_transit')} className={`glass-dark px-4 py-3 text-left text-xs font-bold tracking-wider flex justify-between items-center group border-l-2 transition-all ${currentStatus === 'in_transit' ? 'text-admin-secondary border-admin-secondary' : 'text-zinc-400 border-transparent hover:border-zinc-500'}`}>
                                        On Shipment <span className={`material-symbols-outlined text-sm ${currentStatus === 'in_transit' ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}>chevron_right</span>
                                    </Link>
                                    <Link href={getStatusLink('sold')} className={`glass-dark px-4 py-3 text-left text-xs font-bold tracking-wider flex justify-between items-center group border-l-2 transition-all ${currentStatus === 'sold' ? 'text-admin-secondary border-admin-secondary' : 'text-zinc-400 border-transparent hover:border-zinc-500'}`}>
                                        Sold History <span className={`material-symbols-outlined text-sm ${currentStatus === 'sold' ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}>chevron_right</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/vehicles" className="w-full mt-8 py-3 bg-zinc-100 text-black font-headline font-black text-xs uppercase tracking-widest hover:bg-white transition-colors block text-center">Reset System</Link>
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
                                    {(() => {
                                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                         const imgs = (vehicle as any).vehicle_images as { public_url: string; is_main: boolean; sort_order: number }[] | undefined;
                                         const galleryUrl = imgs && imgs.length > 0
                                             ? (imgs.find((i: { is_main: boolean; public_url: string }) => i.is_main)?.public_url
                                                 || [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0]?.public_url)
                                             : null;
                                         const imgSrc = galleryUrl
                                             || vehicle.main_image_url
                                             || (vehicle.folder_name ? `/images/inventory/${vehicle.folder_name}/1.jpeg` : null)
                                             || 'https://placehold.co/800x600/1a1a1a/444444?text=No+Image';
                                         return <Image fill alt={vehicle.model} className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" src={imgSrc} />;
                                     })()}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                            vehicle.status === 'in_transit' ? 'bg-error-container text-on-error-container' : 
                                            vehicle.status === 'available' ? 'bg-primary-container text-on-primary-container' : 
                                            vehicle.status === 'sold' ? 'bg-zinc-800 text-zinc-400' :
                                            'bg-surface-container-highest text-zinc-300'
                                        }`}>
                                            {vehicle.status?.replace('_', ' ')}
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
                                            <span className="block text-primary-container font-headline font-black text-xl">KSH {Intl.NumberFormat('en-KE').format(vehicle.price || 0)}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Spec</span>
                                            <span className="text-[11px] font-bold text-admin-secondary uppercase truncate">{vehicle.engine_type || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Mileage</span>
                                            <span className="text-[11px] font-bold text-admin-secondary uppercase">{Intl.NumberFormat('en-US').format(vehicle.mileage || 0)} MI</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Grade</span>
                                            <span className="text-[11px] font-bold text-admin-secondary uppercase">{vehicle.condition || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link href={`/admin/vehicles/edit/${vehicle.id}`} className="btn-sweep relative overflow-hidden flex-1 bg-zinc-800 hover:bg-admin-secondary hover:text-on-secondary transition-colors text-center py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 z-10"><span className="relative z-10 pointer-events-none">Edit</span></Link>
                                        <Link href={`/admin/vehicles/${vehicle.id}`} className="btn-sweep relative overflow-hidden flex-1 border border-zinc-700 hover:border-zinc-400 text-zinc-300 transition-colors text-center py-2 text-xs font-bold uppercase tracking-widest z-10"><span className="relative z-10 pointer-events-none">View Specs</span></Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!vehicles || vehicles.length === 0) && (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800">
                                <span className="material-symbols-outlined text-4xl text-zinc-600 mb-4 block">inventory_2</span>
                                <p className="text-zinc-500 font-headline uppercase tracking-widest text-sm">No vehicles found matching filters</p>
                            </div>
                        )}
                    </div>
                    {/* Load More / Pagination */}
                    {hasMore && (
                        <div className="mt-12 flex justify-center">
                            <Link href={getNextPageLink()} scroll={false} className="px-12 py-4 border-2 border-zinc-800 text-zinc-500 font-headline font-bold text-xs uppercase tracking-[0.3em] hover:border-admin-secondary hover:text-admin-secondary transition-all active:scale-95 text-center">
                                Load Next Protocol (Page {currentPage + 1})
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
