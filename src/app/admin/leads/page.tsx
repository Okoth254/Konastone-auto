import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

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
        <div className="p-8 space-y-8 flex-1 w-full max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface uppercase mb-2">Leads Terminal</h1>
                    <p className="text-zinc-500 font-label text-sm tracking-wide uppercase">Active Inquiries: {activeLeadsCount} | Total: {totalLeadsCount}</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative group cursor-pointer z-50">
                        <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700 min-w-[140px] flex justify-between items-center gap-2">
                            Filter: {currentStatus ? currentStatus.replace('_', ' ') : 'All Leads'}
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-1 w-full bg-surface-container-highest border border-zinc-700 hidden group-hover:flex flex-col z-50">
                            <Link href={getStatusLink('all')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 transition-colors">All Leads</Link>
                            <Link href={getStatusLink('new')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 border-t border-zinc-700 transition-colors">New</Link>
                            <Link href={getStatusLink('contacted')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 border-t border-zinc-700 transition-colors">Contacted</Link>
                            <Link href={getStatusLink('negotiating')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 border-t border-zinc-700 transition-colors">Negotiating</Link>
                        </div>
                    </div>
                    <div className="relative group cursor-pointer z-50">
                        <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700 min-w-[140px] flex justify-between items-center gap-2">
                            Sort: {currentSort === 'oldest' ? 'Oldest First' : 'Newest First'}
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full right-0 mt-1 w-full bg-surface-container-highest border border-zinc-700 hidden group-hover:flex flex-col z-50">
                            <Link href={getSortLink('newest')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 transition-colors">Newest First</Link>
                            <Link href={getSortLink('oldest')} className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:bg-admin-secondary hover:text-black py-3 px-4 border-t border-zinc-700 transition-colors">Oldest First</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-surface-container-high border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-4 pl-6">Lead ID</th>
                                <th className="p-4">Customer Name</th>
                                <th className="p-4">Target Vehicle</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Captured On</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {leads && leads.length > 0 ? (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                leads.map((lead: any) => {
                                    // Parse status colors
                                    let statusColorClass = "bg-zinc-800 border border-zinc-600 text-zinc-400";
                                    if (lead.status === 'new') statusColorClass = "bg-admin-secondary/10 border border-admin-secondary text-admin-secondary";
                                    else if (lead.status === 'contacted') statusColorClass = "bg-blue-500/10 border border-blue-500 text-blue-500";
                                    else if (lead.status === 'negotiating') statusColorClass = "bg-amber-500/10 border border-amber-500 text-amber-500";
                                    else if (lead.status === 'sold') statusColorClass = "bg-green-500/10 border border-green-500 text-green-500";

                                    const targetVehicle = lead.vehicles ? `${lead.vehicles.year || ''} ${lead.vehicles.make || ''} ${lead.vehicles.model || ''}`.trim() : 'General Inquiry';

                                    return (
                                        <tr key={lead.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-4 pl-6 text-zinc-500 font-mono text-xs">{lead.id.substring(0, 8).toUpperCase()}</td>
                                            <td className="p-4 text-white font-bold">{lead.name}</td>
                                            <td className="p-4 text-zinc-300">{targetVehicle}</td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColorClass}`}>{lead.status.replace('_', ' ')}</span>
                                            </td>
                                            <td className="p-4 text-zinc-500 font-mono text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 pr-6 text-right">
                                                <Link href={`/admin/leads/${lead.id}`} className="text-admin-secondary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                                                    Open Log <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-500 font-bold uppercase tracking-widest">
                                        No leads found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination / Controls */}
            {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
                <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Showing Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                    <Link scroll={false} href={currentPage > 1 ? getPageLink(currentPage - 1) : '#'} className={`h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container transition-colors ${currentPage > 1 ? 'text-zinc-400 hover:text-white hover:border-zinc-500' : 'text-zinc-600 pointer-events-none'}`}>
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </Link>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link scroll={false} key={page} href={getPageLink(page)} className={`h-8 w-8 flex items-center justify-center border transition-colors ${page === currentPage ? 'border-admin-secondary bg-admin-secondary/10 text-admin-secondary' : 'border-zinc-700 bg-surface-container text-zinc-400 hover:text-white hover:border-zinc-500'}`}>
                            <span className="text-xs font-bold">{page}</span>
                        </Link>
                    ))}

                    <Link scroll={false} href={currentPage < totalPages ? getPageLink(currentPage + 1) : '#'} className={`h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container transition-colors ${currentPage < totalPages ? 'text-zinc-400 hover:text-white hover:border-zinc-500' : 'text-zinc-600 pointer-events-none'}`}>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </Link>
                </div>
            </div>
            )}
        </div>
    );
}
