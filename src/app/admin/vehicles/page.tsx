import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import * as motion from "framer-motion/client";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";
import DropdownMenu, { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/DropdownMenu";
import { updateVehicleCatalogueState } from "./actions";

const statusFilters = [
    { label: 'ALL VEHICLES', value: undefined, icon: 'grid_view', description: 'Every catalogue record' },
    { label: 'AVAILABLE', value: 'available', icon: 'verified', description: 'Visible in the public inventory' },
    { label: 'IN TRANSIT', value: 'in_transit', icon: 'local_shipping', description: 'Shown as shipment stock' },
    { label: 'RESERVED', value: 'reserved', icon: 'bookmark', description: 'Held for an active buyer' },
    { label: 'SOLD', value: 'sold', icon: 'history', description: 'Closed catalogue records' },
    { label: 'DRAFT', value: 'draft', icon: 'draft', description: 'Hidden records that still need listing details' },
] as const;

const sortLabels: Record<string, string> = {
    newest: 'SORT: NEWEST',
    price_desc: 'PRICE: HIGH-LOW',
    price_asc: 'PRICE: LOW-HIGH',
};

export default async function AdminVehicles(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = typeof searchParams?.status === 'string' ? searchParams.status : undefined;
    const currentSort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'newest';
    const currentQuery = typeof searchParams?.q === 'string' ? searchParams.q.trim() : '';
    const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

    const supabase = await createClient();

    const { data: allVehicles } = await supabase.from('vehicles').select('status');
    const counts = (allVehicles || []).reduce((acc, vehicle) => {
        const status = vehicle.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        acc.total += 1;
        return acc;
    }, { total: 0 } as Record<string, number>);

    let query = supabase.from('vehicles').select('*, vehicle_images(public_url, is_main, sort_order)', { count: 'exact' });

    if (currentStatus && currentStatus !== 'all') {
        query = query.eq('status', currentStatus);
    }

    if (currentQuery) {
        const yearQuery = Number(currentQuery);
        const parts = [
            `make.ilike.%${currentQuery}%`,
            `model.ilike.%${currentQuery}%`,
            `vin.ilike.%${currentQuery}%`,
        ];
        if (Number.isFinite(yearQuery)) parts.push(`year.eq.${yearQuery}`);
        query = query.or(parts.join(','));
    }

    if (currentSort === 'price_asc') query = query.order('price', { ascending: true });
    else if (currentSort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const pageSize = 12;
    const from = (currentPage - 1) * pageSize;
    const to = (currentPage * pageSize) - 1;
    query = query.range(from, to);

    const { data: vehicles, count } = await query;
    const hasMore = count !== null && count > to + 1;
    const hasVehicles = Boolean(vehicles && vehicles.length > 0);
    const activeFilter = statusFilters.find((filter) => filter.value === currentStatus);

    const getSortLink = (sortType: string) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentQuery) params.set('q', currentQuery);
        params.set('sort', sortType);
        return `?${params.toString()}`;
    };

    const getStatusLink = (statusType?: string) => {
        const params = new URLSearchParams();
        if (statusType) params.set('status', statusType);
        if (currentSort && currentSort !== 'newest') params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        return params.toString() ? `?${params.toString()}` : '/admin/vehicles';
    };

    const getNextPageLink = () => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentSort && currentSort !== 'newest') params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        params.set('page', (currentPage + 1).toString());
        return `?${params.toString()}`;
    };

    const getActionReturnPath = (vehicleAction: string) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentSort && currentSort !== 'newest') params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        if (currentPage > 1) params.set('page', currentPage.toString());
        params.set('vehicleAction', vehicleAction);
        return `/admin/vehicles?${params.toString()}`;
    };

    return (
        <div className="admin-page-shell admin-section-stack">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row xl:items-end justify-between gap-8"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black tracking-tighter text-white uppercase italic">CATALOGUE <span className="text-primary">INVENTORY</span></h1>
                        <p className="max-w-3xl text-xs sm:text-sm text-slate-500 font-black uppercase tracking-[0.18em] leading-relaxed">
                            Manage the front-page catalogue pipeline. Featured available vehicles appear on the homepage, available stock appears in inventory, and shipment stock appears as in transit.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {[
                            { label: 'TOTAL', value: counts.total || 0, color: 'bg-primary' },
                            { label: 'AVAILABLE', value: counts.available || 0, color: 'bg-accent-teal' },
                            { label: 'IN TRANSIT', value: counts.in_transit || 0, color: 'bg-blue-500' },
                            { label: 'RESERVED', value: counts.reserved || 0, color: 'bg-orange-500' },
                            { label: 'SOLD', value: counts.sold || 0, color: 'bg-slate-600' },
                            { label: 'DRAFT', value: counts.draft || 0, color: 'bg-zinc-700' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">{stat.label}: {stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                    <form className="h-14 min-w-0 sm:min-w-[300px] flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-dark/40 px-4">
                        {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
                        {currentSort !== 'newest' && <input type="hidden" name="sort" value={currentSort} />}
                        <span className="material-symbols-outlined text-slate-600">search</span>
                        <input
                            name="q"
                            defaultValue={currentQuery}
                            placeholder="Search make, model, VIN, year"
                            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                        />
                    </form>
                    <MotionButton href="/admin/vehicles/new" variant="primary" className="h-14 px-6 sm:px-8">
                        <span className="material-symbols-outlined text-lg">add</span>
                        ADD VEHICLE
                    </MotionButton>

                    <div className="flex items-center gap-2 bg-surface-dark/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 w-full sm:w-auto">
                        <DropdownMenu
                            align="end"
                            trigger={
                                <button className="h-12 px-4 sm:px-6 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all w-full sm:min-w-[210px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                                    {sortLabels[currentSort] || 'SORT: NEWEST'}
                                    <span className="material-symbols-outlined text-sm">filter_list</span>
                                </button>
                            }
                        >
                            <DropdownMenuLabel>Sort vehicles</DropdownMenuLabel>
                            <DropdownMenuItem href={getSortLink('newest')}>Newest first</DropdownMenuItem>
                            <DropdownMenuItem href={getSortLink('price_desc')}>Highest price</DropdownMenuItem>
                            <DropdownMenuItem href={getSortLink('price_asc')}>Lowest price</DropdownMenuItem>
                        </DropdownMenu>
                        <div className="hidden sm:flex w-10 h-10 border-l border-white/5 items-center justify-center">
                            <span className="material-symbols-outlined text-slate-700 text-xl">database</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col xl:flex-row gap-6 lg:gap-10">
                <aside className="w-full xl:w-80 shrink-0 space-y-6 lg:space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface-dark/40 backdrop-blur-xl p-5 sm:p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border border-white/5 space-y-6 lg:space-y-8"
                    >
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">CATALOGUE FILTERS</p>
                            <div className="flex flex-col gap-2">
                                {statusFilters.map((filter) => {
                                    const isActive = currentStatus === filter.value || (!currentStatus && !filter.value);
                                    return (
                                        <Link
                                            key={filter.label}
                                            href={getStatusLink(filter.value)}
                                            className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center group transition-all duration-500 border ${
                                                isActive
                                                    ? 'bg-primary/10 border-primary/20 text-primary'
                                                    : 'border-transparent text-slate-500 hover:border-white/10 hover:text-slate-200'
                                            }`}
                                        >
                                            <span className="flex items-center gap-3 min-w-0">
                                                <span className="material-symbols-outlined text-lg shrink-0">{filter.icon}</span>
                                                <span className="min-w-0 truncate">{filter.label}</span>
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-600">{filter.value ? counts[filter.value] || 0 : counts.total || 0}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div className="rounded-2xl bg-white/3 border border-white/5 p-4">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">Active view</p>
                                <p className="text-sm text-slate-300 font-bold leading-relaxed">{activeFilter?.description || 'Every catalogue record'}</p>
                            </div>
                            <Link href="/admin/vehicles" className="w-full h-12 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-primary transition-colors">
                                RESET FILTERS
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface-dark/40 backdrop-blur-xl p-5 sm:p-6 lg:p-8 rounded-[1.5rem] lg:rounded-4xl border border-white/5 overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/5 blur-3xl" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <span className="material-symbols-outlined text-accent-teal animate-pulse">analytics</span>
                            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Catalogue Health</h4>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-300">
                                    <span>Public Sync</span>
                                    <span className="text-accent-teal">LIVE</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full bg-accent-teal" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </aside>

                <section className="flex-1 min-w-0">
                    {hasVehicles ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 lg:gap-8">
                            {vehicles?.map((vehicle, i) => {
                                const imgs = (vehicle as { vehicle_images?: { public_url: string; is_main: boolean; sort_order: number }[] }).vehicle_images;
                                const imgSrc = imgs?.find(img => img.is_main)?.public_url
                                    || imgs?.sort((a,b) => a.sort_order - b.sort_order)[0]?.public_url
                                    || 'https://placehold.co/800x600/1a1a1a/444444?text=No+Image';
                                const markReserved = updateVehicleCatalogueState.bind(null, vehicle.id, { status: 'reserved' }, getActionReturnPath('reserved'));
                                const markSold = updateVehicleCatalogueState.bind(null, vehicle.id, { status: 'sold' }, getActionReturnPath('sold'));
                                const toggleFeatured = updateVehicleCatalogueState.bind(null, vehicle.id, { is_featured: !vehicle.is_featured }, getActionReturnPath(vehicle.is_featured ? 'unfeatured' : 'featured'));

                                return (
                                    <motion.div
                                        key={vehicle.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 + 0.3 }}
                                        className="bg-surface-dark/40 backdrop-blur-xl flex flex-col group border border-white/5 rounded-[1.5rem] lg:rounded-4xl overflow-hidden hover:border-primary/40 transition-all duration-700"
                                    >
                                        <div className="relative aspect-16/10 overflow-hidden">
                                            <Image
                                                fill
                                                alt={vehicle.model}
                                                className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                                src={imgSrc}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-col gap-2 max-w-[calc(100%-2rem)]">
                                                <div className="flex flex-wrap gap-2">
                                                    <MotionBadge
                                                        className={`uppercase ${
                                                            vehicle.status === 'in_transit' ? 'bg-blue-500/20 text-blue-500 border-blue-500/20' :
                                                            vehicle.status === 'available' ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/20' :
                                                            vehicle.status === 'reserved' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' :
                                                            'bg-slate-800 text-slate-500 border-white/5'
                                                        }`}
                                                    >
                                                        {vehicle.status?.replace('_', ' ')}
                                                    </MotionBadge>
                                                    {vehicle.is_featured && <MotionBadge color="primary" icon="star">FEATURED</MotionBadge>}
                                                </div>
                                                {vehicle.status === 'in_transit' && (
                                                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest self-start">Shipment stock</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6 lg:gap-8">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                                <div className="space-y-1 min-w-0">
                                                    <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
                                                        {vehicle.year} {vehicle.make} <br />
                                                        <span className="text-3xl break-words">{vehicle.model.split(' ')[0]}</span>
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-primary transition-colors" />
                                                        <span className="text-slate-600 font-mono text-[9px] font-black uppercase tracking-[0.3em] truncate">VIN: {vehicle.vin?.substring(0, 10) || 'PENDING'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-left sm:text-right shrink-0">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Price</p>
                                                    <span className="text-2xl lg:text-3xl font-heading font-black text-white tracking-tighter italic">KSH {Intl.NumberFormat('en-KE').format(vehicle.price || 0)}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-6 border-t border-white/5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">ENGINE</span>
                                                    <span className="text-[11px] font-black text-slate-200 uppercase truncate">{vehicle.engine_type || 'N/A'}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">MILEAGE</span>
                                                    <span className="text-[11px] font-black text-slate-200 uppercase">{Intl.NumberFormat('en-US').format(vehicle.mileage || 0)} KM</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">VISIBILITY</span>
                                                    <span className="text-[11px] font-black text-white uppercase">{vehicle.is_featured && vehicle.status === 'available' ? 'HOME + INVENTORY' : vehicle.status === 'available' ? 'INVENTORY' : vehicle.status?.replace('_', ' ')}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <MotionButton href={`/admin/vehicles/edit/${vehicle.id}`} variant="outline" className="h-12 border-white/10 hover:border-primary/40 group/btn">
                                                    <span className="material-symbols-outlined text-lg mr-2 group-hover/btn:rotate-90 transition-transform">edit_note</span>
                                                    EDIT
                                                </MotionButton>
                                                <MotionButton href={`/admin/vehicles/${vehicle.id}`} variant="ghost" className="h-12 border-white/5">ADMIN</MotionButton>
                                                <MotionButton href={`/vehicle/${vehicle.id}`} variant="ghost" className="h-12 border-white/5">PUBLIC</MotionButton>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-white/5">
                                                <form action={toggleFeatured}>
                                                    <button className="w-full h-10 rounded-xl bg-white/3 border border-white/5 hover:border-primary/30 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 hover:text-primary transition-all">
                                                        {vehicle.is_featured ? 'Unfeature' : 'Feature'}
                                                    </button>
                                                </form>
                                                <form action={markReserved}>
                                                    <button disabled={vehicle.status === 'reserved'} className="w-full h-10 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 text-[9px] font-black uppercase tracking-[0.18em] text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                        Reserve
                                                    </button>
                                                </form>
                                                <form action={markSold}>
                                                    <button disabled={vehicle.status === 'sold'} className="w-full h-10 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 text-[9px] font-black uppercase tracking-[0.18em] text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                        Mark sold
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="min-h-[420px] bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] lg:rounded-[3rem] flex flex-col items-center justify-center text-center p-8 sm:p-12"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tighter italic mb-3">
                                {counts.total ? 'No matching vehicles' : 'No vehicles yet'}
                            </h2>
                            <p className="max-w-lg text-sm text-slate-500 font-bold leading-relaxed mb-8">
                                {counts.total
                                    ? 'This filter has no catalogue records. Reset filters or add a new vehicle to the pipeline.'
                                    : 'Start the Konastone Autos catalogue by adding the first vehicle record, pricing, public status, and gallery.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <MotionButton href="/admin/vehicles/new" variant="primary" className="h-12 px-8">ADD VEHICLE</MotionButton>
                                {counts.total > 0 && <MotionButton href="/admin/vehicles" variant="outline" className="h-12 px-8">RESET FILTERS</MotionButton>}
                            </div>
                        </motion.div>
                    )}

                    {(currentPage > 1 || hasMore) && (
                        <div className="mt-16 flex flex-wrap justify-center gap-3">
                            {currentPage > 1 && (
                                <MotionButton
                                    href={`?${new URLSearchParams({
                                        ...(currentStatus ? { status: currentStatus } : {}),
                                        ...(currentQuery ? { q: currentQuery } : {}),
                                        ...(currentSort !== 'newest' ? { sort: currentSort } : {}),
                                        page: String(currentPage - 1),
                                    }).toString()}`}
                                    variant="outline"
                                    className="px-8 sm:px-12 h-14 border-white/5 text-[10px] tracking-[0.3em]"
                                >
                                    PREVIOUS
                                </MotionButton>
                            )}
                            {hasMore && (
                            <MotionButton href={getNextPageLink()} variant="outline" className="px-8 sm:px-16 h-14 sm:h-16 border-white/5 text-[10px] tracking-[0.3em] sm:tracking-[0.4em]">
                                NEXT PAGE
                            </MotionButton>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
