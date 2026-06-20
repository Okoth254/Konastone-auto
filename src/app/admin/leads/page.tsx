import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import LeadsTimeline from "@/components/admin/LeadsTimeline";
import DropdownMenu, { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/DropdownMenu";
import * as motion from "framer-motion/client";

const statusOptions = [
    { value: 'all', label: 'All Leads' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'sold', label: 'Sold' },
    { value: 'lost', label: 'Lost' },
];

const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'vehicle_detail', label: 'Vehicle Detail' },
    { value: 'homepage', label: 'Homepage' },
    { value: 'finance', label: 'Finance' },
    { value: 'contact', label: 'Contact' },
];

export default async function LeadsListView(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;
    const currentSource = typeof searchParams?.source === 'string' ? searchParams.source : undefined;
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

    if (currentSource) {
        query = query.eq('source', currentSource);
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
        if (currentSource) params.set('source', currentSource);
        if (currentQuery) params.set('q', currentQuery);
        params.set('sort', sortType);
        return `?${params.toString()}`;
    };

    const getStatusLink = (statusType: string) => {
        const params = new URLSearchParams();
        if (statusType !== 'all') params.set('status', statusType);
        if (currentSort) params.set('sort', currentSort);
        if (currentSource) params.set('source', currentSource);
        if (currentQuery) params.set('q', currentQuery);
        return `?${params.toString()}`;
    };

    const getSourceLink = (sourceType: string) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (sourceType !== 'all') params.set('source', sourceType);
        if (currentSort) params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        return `?${params.toString()}`;
    };

    const getPageLink = (page: number) => {
        const params = new URLSearchParams();
        if (currentStatus) params.set('status', currentStatus);
        if (currentSource) params.set('source', currentSource);
        if (currentSort) params.set('sort', currentSort);
        if (currentQuery) params.set('q', currentQuery);
        params.set('page', page.toString());
        return `?${params.toString()}`;
    };

    const getLeadName = (lead: Record<string, unknown>) => String(lead.name || lead.client_name || 'Customer');
    const getLeadEmail = (lead: Record<string, unknown>) => String(lead.email || lead.client_email || '');
    const getLeadPhone = (lead: Record<string, unknown>) => String(lead.phone || lead.client_phone || '');
    const getLeadMessage = (lead: Record<string, unknown>) => String(lead.message || lead.client_message || '');
    const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, '');
    const statusLabel = statusOptions.find((option) => option.value === currentStatus)?.label || 'All';
    const sourceLabel = sourceOptions.find((option) => option.value === currentSource)?.label || 'All Sources';

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
                        {currentSource && <input type="hidden" name="source" value={currentSource} />}
                        {currentSort && <input type="hidden" name="sort" value={currentSort} />}
                        <span className="material-symbols-outlined text-slate-600 text-lg">search</span>
                        <input
                            name="q"
                            defaultValue={currentQuery}
                            placeholder="Search leads"
                            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                        />
                    </form>
                    <DropdownMenu
                        align="end"
                        trigger={
                        <button className="h-12 px-4 sm:px-6 w-full sm:min-w-[190px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all rounded-xl">
                            STATUS: <span className="text-primary">{statusLabel}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        }
                    >
                        <DropdownMenuLabel>Lead status</DropdownMenuLabel>
                        {statusOptions.map((option) => (
                            <DropdownMenuItem key={option.value} href={getStatusLink(option.value)}>{option.label}</DropdownMenuItem>
                        ))}
                    </DropdownMenu>
                    <DropdownMenu
                        align="end"
                        trigger={
                        <button className="h-12 px-4 sm:px-6 w-full sm:min-w-[190px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all rounded-xl">
                            SOURCE: <span className="text-primary">{sourceLabel}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        }
                    >
                        <DropdownMenuLabel>Lead source</DropdownMenuLabel>
                        {sourceOptions.map((option) => (
                            <DropdownMenuItem key={option.value} href={getSourceLink(option.value)}>{option.label}</DropdownMenuItem>
                        ))}
                    </DropdownMenu>
                    <DropdownMenu
                        align="end"
                        trigger={
                        <button className="h-12 px-4 sm:px-6 w-full sm:min-w-[190px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-all rounded-xl">
                            SORT: <span className="text-primary">{currentSort === 'oldest' ? 'Oldest' : 'Newest'}</span>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        }
                    >
                        <DropdownMenuLabel>Sort leads</DropdownMenuLabel>
                        <DropdownMenuItem href={getSortLink('newest')}>Newest First</DropdownMenuItem>
                        <DropdownMenuItem href={getSortLink('oldest')}>Oldest First</DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </motion.header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {(leads || []).slice(0, 6).map((lead) => {
                    const record = lead as Record<string, unknown>;
                    const leadId = String(record.id);
                    const vehicles = record.vehicles as { year?: number; make?: string; model?: string } | { year?: number; make?: string; model?: string }[] | null;
                    const vehicle = Array.isArray(vehicles) ? vehicles[0] : vehicles;
                    const leadName = getLeadName(record);
                    const leadEmail = getLeadEmail(record);
                    const leadPhone = getLeadPhone(record);
                    const leadMessage = getLeadMessage(record);
                    const whatsappPhone = normalizePhone(leadPhone);
                    return (
                        <motion.article
                            key={leadId}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-5 sm:p-6 flex flex-col gap-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">{String(record.source || 'direct web').replace('_', ' ')}</p>
                                    <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tighter italic truncate">{leadName}</h2>
                                </div>
                                <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary">
                                    {String(record.status || 'new').replace('_', ' ')}
                                </span>
                            </div>

                            <div className="space-y-2 text-xs font-bold text-slate-400">
                                <p className="truncate">{leadEmail || 'No email provided'}</p>
                                <p>{leadPhone || 'No phone provided'}</p>
                                <p className="line-clamp-2 text-slate-500 italic">{leadMessage || 'No message yet.'}</p>
                                <p className="pt-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    {vehicle ? `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim() : 'General inquiry'}
                                </p>
                            </div>

                            <div className="mt-auto grid grid-cols-4 gap-2">
                                <Link href={`/admin/leads/${leadId}`} className="col-span-4 h-11 rounded-xl bg-primary text-black flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                                    Open Lead
                                </Link>
                                <a href={leadEmail ? `mailto:${leadEmail}` : undefined} aria-disabled={!leadEmail} className={`h-10 rounded-xl border border-white/10 flex items-center justify-center ${leadEmail ? 'text-slate-300 hover:text-primary' : 'text-slate-700 pointer-events-none'}`}>
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                </a>
                                <a href={leadPhone ? `tel:${leadPhone}` : undefined} aria-disabled={!leadPhone} className={`h-10 rounded-xl border border-white/10 flex items-center justify-center ${leadPhone ? 'text-slate-300 hover:text-primary' : 'text-slate-700 pointer-events-none'}`}>
                                    <span className="material-symbols-outlined text-lg">call</span>
                                </a>
                                <a href={whatsappPhone ? `https://wa.me/${whatsappPhone}` : undefined} target="_blank" rel="noreferrer" aria-disabled={!whatsappPhone} className={`h-10 rounded-xl border border-white/10 flex items-center justify-center ${whatsappPhone ? 'text-slate-300 hover:text-accent-teal' : 'text-slate-700 pointer-events-none'}`}>
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                </a>
                                <Link href={`/admin/leads/${leadId}`} className="h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-300 hover:text-primary">
                                    <span className="material-symbols-outlined text-lg">east</span>
                                </Link>
                            </div>
                        </motion.article>
                    );
                })}
            </section>

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
