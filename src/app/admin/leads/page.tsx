import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import LeadsTimeline from "@/components/admin/LeadsTimeline";
import * as motion from "framer-motion/client";

export default async function LeadsListView(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;
    const currentQuery = typeof searchParams?.q === 'string' ? searchParams.q.trim() : '';
    const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

    const supabase = await createClient();

    // 1. Fetch counts independent of filters
    const { data: allLeads } = await supabase.from('leads').select('status');
    const activeLeadsCount = allLeads?.filter(l => !['lost', 'sold'].includes(l.status)).length || 0;
    const totalLeadsCount = allLeads?.length || 0;

    // 2. Fetch filtered paginated data
    let query = supabase.from('leads').select(`
        id,
        name,
        email,
        phone,
        message,
        source,
        client_name,
        client_email,
        client_phone,
        client_message,
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

    if (currentQuery) {
        query = query.or(`name.ilike.%${currentQuery}%,client_name.ilike.%${currentQuery}%,email.ilike.%${currentQuery}%,client_email.ilike.%${currentQuery}%,phone.ilike.%${currentQuery}%,client_phone.ilike.%${currentQuery}%`);
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
        if (currentQuery) params.set('q', currentQuery);
        params.set('sort', sortType);
        return `?${params.toString()}`;
    };

    const getStatusLink = (statusType: string) => {
        const params = new URLSearchParams();
        if (statusType !== 'all') params.set('status', statusType);
        if (currentSort) params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        return `?${params.toString()}`;
    };

    const getPageLink = (page: number) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentSort) params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        params.set('page', page.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="admin-page-shell admin-section-stack min-h-screen">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8"
            >
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black tracking-tighter text-white uppercase italic leading-none">
                            CUSTOMER <span className="text-primary">LEADS</span>
                        </h1>
                        <span className="hidden sm:inline-flex px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,193,7,0.5)]" />
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">ACTIVE LEADS: {activeLeadsCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-700 text-sm">database</span>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">TOTAL LEADS: {totalLeadsCount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 bg-surface-dark/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5">
                    <form className="flex h-12 min-w-0 sm:min-w-[260px] items-center gap-2 rounded-xl bg-white/3 px-4 border border-white/5">
                        {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
                        {currentSort && <input type="hidden" name="sort" value={currentSort} />}
                        <span className="material-symbols-outlined text-slate-600 text-lg">search</span>
                        <input
                            name="q"
                            defaultValue={currentQuery}
                            placeholder="Search leads"
                            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                        />
                    </form>
                    <div className="relative group cursor-pointer z-50">
                        <button className="h-12 px-4 sm:px-6 w-full sm:min-w-[190px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all rounded-xl">
                            STATUS: <span className="text-primary">{currentStatus ? currentStatus.replace('_', ' ') : 'All'}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-full bg-surface-dark border border-white/10 rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl backdrop-blur-xl">
                            <Link href={getStatusLink('all')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary transition-all">All Leads</Link>
                            <Link href={getStatusLink('new')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary border-t border-white/5 transition-all">New</Link>
                            <Link href={getStatusLink('contacted')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary border-t border-white/5 transition-all">Contacted</Link>
                            <Link href={getStatusLink('negotiating')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary border-t border-white/5 transition-all">Negotiating</Link>
                            <Link href={getStatusLink('sold')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary border-t border-white/5 transition-all">Sold</Link>
                            <Link href={getStatusLink('lost')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary border-t border-white/5 transition-all">Lost</Link>
                        </div>
                    </div>
                    <div className="relative group cursor-pointer z-50">
                        <button className="h-12 px-4 sm:px-6 w-full sm:min-w-[190px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all rounded-xl">
                            SORT: <span className="text-primary">{currentSort === 'oldest' ? 'Oldest' : 'Newest'}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-full bg-surface-dark border border-white/10 rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl backdrop-blur-xl">
                            <Link href={getSortLink('newest')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary transition-all">Newest First</Link>
                            <Link href={getSortLink('oldest')} className="block px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5 hover:text-primary border-t border-white/5 transition-all">Oldest First</Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            <LeadsTimeline leads={leads || []} />

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 border-t border-white/5 pt-8">
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-3">
                        <Link scroll={false} href={currentPage > 1 ? getPageLink(currentPage - 1) : '#'} className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all ${currentPage > 1 ? 'border-white/10 bg-white/2 text-slate-400 hover:text-primary hover:border-primary/40' : 'border-white/5 text-slate-800 pointer-events-none'}`}>
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </Link>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Link scroll={false} key={page} href={getPageLink(page)} className={`h-11 w-11 rounded-xl flex items-center justify-center border text-xs transition-all ${page === currentPage ? 'border-primary/40 bg-primary/10 text-primary font-black' : 'border-white/10 bg-white/2 text-slate-500 hover:text-white hover:border-white/20 font-bold'}`}>
                                {page}
                            </Link>
                        ))}
                        <Link scroll={false} href={currentPage < totalPages ? getPageLink(currentPage + 1) : '#'} className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all ${currentPage < totalPages ? 'border-white/10 bg-white/2 text-slate-400 hover:text-primary hover:border-primary/40' : 'border-white/5 text-slate-800 pointer-events-none'}`}>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
