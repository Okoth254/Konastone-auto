import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function LeadsListView() {
    const supabase = await createClient();
    const { data: leads } = await supabase
        .from('leads')
        .select(`
            id,
            name,
            status,
            created_at,
            vehicles (
                year,
                make,
                model
            )
        `)
        .order('created_at', { ascending: false });
        
    const activeLeadsCount = leads?.filter(l => l.status !== 'lost' && l.status !== 'sold').length || 0;

    return (
        <div className="p-8 space-y-8 flex-1 w-full max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface uppercase mb-2">Leads Terminal</h1>
                    <p className="text-zinc-500 font-label text-sm tracking-wide uppercase">Active Inquiries: {activeLeadsCount} | Total: {leads?.length || 0}</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700">
                        Filter: Hot Pursuit
                    </button>
                    <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700">
                        Sort: Newest First
                    </button>
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
                                        No leads found in database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination / Controls */}
            {leads && leads.length > 0 && (
            <div className="flex justify-between items-center mt-6">
                <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Showing {leads.length} Records</p>
                <div className="flex gap-2">
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-admin-secondary bg-admin-secondary/10 text-admin-secondary">
                        <span className="text-xs font-bold">1</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="text-xs font-bold">2</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="text-xs font-bold">3</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
            )}
        </div>
    );
}
