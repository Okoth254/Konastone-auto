import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { addTimelineNote, updateLeadStatus, deleteLead } from "../actions";

export default async function LeadDetailView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: lead, error } = await supabase
        .from('leads')
        .select(`
            *,
            vehicles (*),
            lead_timeline_events (*)
        `)
        .eq('id', id)
        .single();

    if (error || !lead) {
        notFound();
    }

    const timeline = lead.lead_timeline_events?.sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
    
    // Bind actions
    const deleteLeadAction = async () => {
        "use server";
        await deleteLead(id);
        redirect('/admin/leads');
    };

    return (
        <div className="flex flex-col flex-1 pb-32">
            <header className="mb-10 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 bg-admin-surface sticky top-0 z-40">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-headline tracking-[0.2em] text-zinc-500 uppercase mb-2">
                        <Link className="hover:text-admin-secondary transition-colors" href="/admin/leads">CRM</Link>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <Link className="hover:text-admin-secondary transition-colors" href="/admin/leads">Active Leads</Link>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span className="text-admin-secondary">{lead.id.substring(0, 8).toUpperCase()}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface uppercase leading-none">{lead.name}</h1>
                    <p className="text-zinc-500 font-mono text-xs mt-2 tracking-widest">UID: 0x{lead.id.substring(0, 12).toUpperCase()}</p>
                </div>
                <div className="flex gap-4">
                    <a href={`mailto:${lead.email}`} className="border border-admin-secondary text-admin-secondary px-6 py-3 font-headline font-bold text-xs tracking-widest hover:bg-admin-secondary/10 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">mail</span> EMAIL CUSTOMER
                    </a>
                    {lead.phone && (
                    <a href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`} className="border border-admin-secondary text-admin-secondary px-6 py-3 font-headline font-bold text-xs tracking-widest hover:bg-admin-secondary/10 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">call</span> INITIATE CALL
                    </a>
                    )}
                </div>
            </header>

            {/* Technical Layout Grid */}
            <div className="px-8 grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-[1600px] mx-auto">
                {/* Left Column: Customer Profile & Vehicle */}
                <div className="xl:col-span-8 space-y-6">
                    {/* Customer Info Card */}
                    <section className="bg-surface-container-high border-l-2 border-admin-secondary p-6">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="font-headline font-bold text-xs tracking-[0.2em] text-admin-secondary uppercase">Lead Parameters</h2>
                            <span className="bg-admin-secondary/10 text-admin-secondary text-[10px] font-mono px-2 py-1 tracking-widest">VERIFIED IDENTITY</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <p className="text-[10px] text-zinc-500 font-headline uppercase tracking-widest mb-1">Contact Point</p>
                                <p className="text-lg font-headline font-medium text-white">{lead.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-headline uppercase tracking-widest mb-1">Direct Line</p>
                                <p className="text-lg font-headline font-medium text-white">{lead.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-headline uppercase tracking-widest mb-1">Location</p>
                                <p className="text-lg font-headline font-medium text-white">Detroit, MI Hub</p>
                            </div>
                        </div>
                    </section>
                    
                    {/* Vehicle of Interest */}
                    {lead.vehicles ? (
                        <section className="bg-surface-container-high relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary-container z-10"></div>
                            <div className="grid grid-cols-1 md:grid-cols-5 h-full relative">
                                <div className="md:col-span-2 relative min-h-[240px]">
                                    <Image fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" src={lead.vehicles.main_image_url || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070"} alt="Vehicle of Interest" />
                                    <div className="absolute inset-0 bg-linear-to-r from-surface-container-high via-transparent to-transparent md:bg-linear-to-l opacity-60"></div>
                                </div>
                                <div className="md:col-span-3 p-8 flex flex-col justify-center bg-surface-container-high z-10">
                                    <h2 className="font-headline font-bold text-xs tracking-[0.2em] text-amber-400 uppercase mb-4">Target Inventory</h2>
                                    <h3 className="text-2xl md:text-3xl font-black font-headline tracking-tighter mb-2 text-white">{lead.vehicles.year} {lead.vehicles.make} {lead.vehicles.model}</h3>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="bg-surface-container-highest px-3 py-1 border border-zinc-700 text-white">
                                            <span className="text-[9px] text-zinc-500 block">VIN SERIAL</span>
                                            <span className="font-mono text-xs font-bold">{lead.vehicles.vin || 'N/A'}</span>
                                        </div>
                                        <div className="bg-surface-container-highest px-3 py-1 border border-zinc-700 text-white">
                                            <span className="text-[9px] text-zinc-500 block">PRICE SPEC</span>
                                            <span className="font-mono text-xs font-bold">${lead.vehicles.price ? Intl.NumberFormat('en-US').format(lead.vehicles.price) : 'N/A'}</span>
                                        </div>
                                        <div className="bg-surface-container-highest px-3 py-1 border border-zinc-700 text-white">
                                            <span className="text-[9px] text-zinc-500 block">STATUS</span>
                                            <span className="font-mono text-xs font-bold text-admin-secondary">{lead.vehicles.status.replace('_', ' ').toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <Link href={`/admin/vehicles/${lead.vehicles.id}`} className="text-admin-secondary text-[10px] font-headline font-bold tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all w-fit uppercase">
                                        VIEW FULL SPEC SHEET <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="bg-surface-container-high relative overflow-hidden group p-8 border-l-4 border-zinc-600">
                            <h2 className="font-headline font-bold text-xs tracking-[0.2em] text-zinc-400 uppercase mb-4">Target Inventory</h2>
                            <h3 className="text-2xl md:text-3xl font-black font-headline tracking-tighter mb-2 text-white">{lead.target_vehicle || 'General Inquiry'}</h3>
                        </section>
                    )}
                    
                    {/* Notes / Additional Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-surface-container-low border border-zinc-800 p-6">
                            <h4 className="font-headline font-bold text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-4">Trade-In Profile</h4>
                            <div className="flex items-center gap-4 bg-surface-container p-4">
                                <span className="material-symbols-outlined text-admin-secondary">no_crash</span>
                                <div>
                                    <p className="text-xs font-bold uppercase text-white">{lead.trade_in_year ? `${lead.trade_in_year} ` : ''}{lead.trade_in_make ? `${lead.trade_in_make} ` : ''}{lead.trade_in_model || 'No Trade-In Specified'}</p>
                                    <p className="text-[10px] text-zinc-500">{lead.trade_in_value ? `Estimated Value: $${Intl.NumberFormat('en-US').format(lead.trade_in_value)}` : ''}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-low border border-zinc-800 p-6">
                            <h4 className="font-headline font-bold text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-4">Finance / Purchase Plan</h4>
                            <div className="flex items-center gap-4 bg-surface-container p-4">
                                <span className="material-symbols-outlined text-amber-400">account_balance</span>
                                <div>
                                    <p className="text-xs font-bold uppercase text-white">{lead.finance_status ? lead.finance_status.replace('_', ' ') : 'Cash / Unspecified'}</p>
                                    <p className="text-[10px] text-zinc-500">{lead.finance_score_tier || ''} - {lead.expected_purchase_date || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Column: Interaction Timeline */}
                <div className="xl:col-span-4">
                    <section className="bg-surface-container border border-zinc-800 h-full flex flex-col min-h-[600px]">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h2 className="font-headline font-bold text-xs tracking-[0.2em] text-zinc-400 uppercase">System Interaction Log</h2>
                            <span className="material-symbols-outlined text-zinc-600">history</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
                            {/* Vertical line */}
                            <div className="absolute left-9 top-10 bottom-10 w-px bg-zinc-800"></div>
                            {/* Timeline Items */}
                            {timeline.length > 0 ? timeline.map((event: { id: string; created_at: string; event_type: string; description: string }, index: number) => (
                                <div key={event.id} className={`relative pl-10 ${index > 0 ? 'opacity-70' : ''}`}>
                                    <div className={`absolute left-[-5px] top-1 w-[11px] h-[11px] border-4 border-admin-surface ${index === 0 ? 'bg-admin-secondary ring-1 ring-admin-secondary' : 'bg-zinc-700'}`}></div>
                                    <div className="mb-1">
                                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{new Date(event.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-200">{event.event_type.replace(/_/g, ' ').toUpperCase()}</p>
                                    <p className="text-xs text-zinc-500 mt-1 italic">&quot;{event.description}&quot;</p>
                                </div>
                            )) : (
                                <div className="relative pl-10">
                                    <div className="absolute left-[-5px] top-1 w-[11px] h-[11px] bg-admin-secondary border-4 border-admin-surface ring-1 ring-admin-secondary"></div>
                                    <div className="mb-1">
                                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{new Date(lead.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-200">System Genesis</p>
                                    <p className="text-xs text-zinc-500 mt-1 italic">&quot;Lead captured via primary ingestion channel.&quot;</p>
                                    {lead.notes && <p className="text-xs text-zinc-400 mt-2 p-2 border-l border-zinc-700">{lead.notes}</p>}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-surface-container-high border-t border-zinc-800">
                            <form action={addTimelineNote.bind(null, lead.id)} className="relative">
                                <textarea name="note" required className="w-full bg-surface border border-zinc-800 text-xs font-mono p-4 min-h-[100px] focus:ring-1 focus:ring-admin-secondary focus:border-admin-secondary placeholder:text-zinc-700 outline-none text-white" placeholder="ADD TECHNICAL NOTE..."></textarea>
                                <button type="submit" className="absolute bottom-3 right-3 text-admin-secondary hover:text-cyan-300">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>

            {/* Bottom Control Bar */}
            <form action={updateLeadStatus.bind(null, lead.id)}>
                <footer className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#141413]/90 backdrop-blur-md border-t border-zinc-800 px-6 py-4 z-50 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Lead Health</span>
                            <div className="flex gap-1">
                                <div className="h-1 w-6 bg-admin-secondary"></div>
                                <div className="h-1 w-6 bg-admin-secondary"></div>
                                <div className="h-1 w-6 bg-admin-secondary"></div>
                                <div className="h-1 w-6 bg-zinc-800"></div>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-zinc-800 mx-2 hidden sm:block"></div>
                        <div className="hidden sm:block">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Process Status</label>
                            <select name="status" className="bg-transparent border-none text-xs font-headline font-bold uppercase text-admin-secondary py-1 pl-0 pr-8 focus:ring-0 cursor-pointer outline-none appearance-none" defaultValue={lead.status}>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="negotiating">Negotiating</option>
                                <option value="sold">Sold</option>
                                <option value="lost">Lost / Dormant</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button formAction={deleteLeadAction} className="text-red-500 hover:text-red-400 text-[10px] font-headline font-bold tracking-widest uppercase px-4 hidden sm:block transition-colors">
                            Delete Lead
                        </button>
                        <Link href="/admin/leads" className="text-zinc-500 hover:text-zinc-300 text-[10px] font-headline font-bold tracking-widest uppercase px-4 hidden sm:block">Discard Changes</Link>
                        <button type="submit" className="bg-primary-container text-black px-10 py-3 font-headline font-black text-xs tracking-[0.2em] uppercase hover:bg-amber-500 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,193,7,0.1)]">
                            Commit &amp; Save Changes
                        </button>
                    </div>
                </footer>
            </form>
        </div>
    );
}
