import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import LeadsTimeline from "@/components/admin/LeadsTimeline";

export default async function LeadsListView(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;
    const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

    const supabase = await createClient();
    
    // 1. Fetch counts independent of filters
    const { data: allLeads } = await supabase.from('leads').select('status');
    const activeLeadsCount = allLeads?.filter(l => l.status !== 'lost' && l.status !== 'sold').length || 0;
    const totalLeadsCount = allLeads?.length || 0;

    // 2. Fetch filtered paginated data
    let query = supabase.from('leads').select(`
        id,
        name,
        status,
        created_at,
        vehicles (
            year,
            make,
            model
        )
    `, { count: 'exact' });

    if (currentStatus) {
        query = query.eq('status', currentStatus);
    }

    if (currentSort === 'oldest') {
        query = query.order('created_at', { ascending: true });
    } else {
        query = query.order('created_at', { ascending: false }); // newest
    }

    const pageSize = 12;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: leads, count } = await query;
    const totalPages = count ? Math.ceil(count / pageSize) : 1;

    // Helper functions for links
    const getSortLink = (sortType: string) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        params.set('sort', sortType);
        return `?${params.toString()}`;
    };

    const getStatusLink = (statusType: string) => {
        const params = new URLSearchParams();
        if (statusType !== 'all') params.set('status', statusType);
        if (currentSort) params.set('sort', currentSort);
        return `?${params.toString()}`;
    };

    const getPageLink = (page: number) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentSort) params.set('sort', currentSort);
        params.set('page', page.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="p-8 space-y-8 flex-1 w-full max-w-[1400px] mx-auto min-h-screen selection:bg-primary selection:text-background-dark">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-12">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface uppercase mb-4 leading-none glitch-hover" data-text="LEADS">Leads <span className="text-primary italic">Terminal</span></h1>
                    <div className="flex flex-wrap gap-4 text-zinc-500 font-label text-[10px] font-black tracking-[0.3em] uppercase">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Active Inquiries: {activeLeadsCount}
                        </span>
                        <span className="text-zinc-700">|</span>
                        <span>Telemetry Total: {totalLeadsCount}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="relative group cursor-pointer z-50">
                        <button className="bg-surface-container-high/50 hover:bg-surface-container-high px-6 py-3 text-zinc-300 text-[10px] font-black tracking-widest uppercase border border-zinc-700 min-w-[180px] flex justify-between items-center gap-3 transition-all rounded-sm">
                            Status: <span className="text-primary">{currentStatus ? currentStatus.replace('_', ' ') : 'All Dossiers'}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-full bg-surface-container-highest border border-zinc-700 hidden group-hover:flex flex-col z-50 shadow-2xl rounded-sm backdrop-blur-xl overflow-hidden">
                            <Link href={getStatusLink('all')} className="text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:bg-primary hover:text-black py-4 px-6 transition-all">All Dossiers</Link>
                            <Link href={getStatusLink('new')} className="text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:bg-primary hover:text-black py-4 px-6 border-t border-zinc-800 transition-all">New</Link>
                            <Link href={getStatusLink('contacted')} className="text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:bg-primary hover:text-black py-4 px-6 border-t border-zinc-800 transition-all">Contacted</Link>
                            <Link href={getStatusLink('negotiating')} className="text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:bg-primary hover:text-black py-4 px-6 border-t border-zinc-800 transition-all">Negotiating</Link>
                        </div>
                    </div>
                    <div className="relative group cursor-pointer z-50">
                        <button className="bg-surface-container-high/50 hover:bg-surface-container-high px-6 py-3 text-zinc-300 text-[10px] font-black tracking-widest uppercase border border-zinc-700 min-w-[180px] flex justify-between items-center gap-3 transition-all rounded-sm">
                            Sequence: <span className="text-primary">{currentSort === 'oldest' ? 'Oldest' : 'Newest'}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-full bg-surface-container-highest border border-zinc-700 hidden group-hover:flex flex-col z-50 shadow-2xl rounded-sm backdrop-blur-xl overflow-hidden">
                            <Link href={getSortLink('newest')} className="text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:bg-primary hover:text-black py-4 px-6 transition-all">Newest First</Link>
                            <Link href={getSortLink('oldest')} className="text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:bg-primary hover:text-black py-4 px-6 border-t border-zinc-800 transition-all">Oldest First</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <LeadsTimeline leads={leads || []} />
            
            {/* Pagination / Controls */}
            {totalPages > 1 && (
            <div className="flex justify-between items-center mt-12 border-t border-zinc-800 pt-8">
                <p className="text-[10px] text-zinc-500 font-black tracking-[0.2em] uppercase">Telemetry Page {currentPage} of {totalPages}</p>
                <div className="flex gap-3">
                    <Link scroll={false} href={currentPage > 1 ? getPageLink(currentPage - 1) : '#'} className={`h-10 w-10 flex items-center justify-center border border-zinc-700 bg-surface-container transition-all rounded-sm ${currentPage > 1 ? 'text-zinc-400 hover:text-primary hover:border-primary' : 'text-zinc-800 pointer-events-none'}`}>
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </Link>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link scroll={false} key={page} href={getPageLink(page)} className={`h-10 w-10 flex items-center justify-center border transition-all rounded-sm ${page === currentPage ? 'border-primary bg-primary/10 text-primary font-black' : 'border-zinc-700 bg-surface-container text-zinc-500 hover:text-white hover:border-zinc-500 font-bold'}`}>
                            <span className="text-xs">{page}</span>
                        </Link>
                    ))}

                    <Link scroll={false} href={currentPage < totalPages ? getPageLink(currentPage + 1) : '#'} className={`h-10 w-10 flex items-center justify-center border border-zinc-700 bg-surface-container transition-all rounded-sm ${currentPage < totalPages ? 'text-zinc-400 hover:text-primary hover:border-primary' : 'text-zinc-800 pointer-events-none'}`}>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </Link>
                </div>
            </div>
            )}
        </div>
    );
}
