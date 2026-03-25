import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { addTimelineNote, updateLeadStatus, deleteLead } from "../actions";
import * as motion from "framer-motion/client";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";
import { formatCurrency } from "@/utils/format";

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
    
    const deleteLeadAction = async () => {
        "use server";
        await deleteLead(id);
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 flex justify-between items-center w-full px-10 py-6 bg-surface-dark/40 backdrop-blur-xl border-b border-white/5"
            >
                <div className="flex items-center gap-10">
                    <Link href="/admin/leads" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">west</span>
                    </Link>
                    <div className="space-y-1">
                        <h2 className="text-xl font-heading font-black text-white uppercase tracking-tighter italic">
                            LEAD: <span className="text-primary">{lead.name.split(' ')[0]}</span> {lead.name.split(' ').slice(1).join(' ')}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">UID: {lead.id.substring(0, 12).toUpperCase()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">CHNL: {lead.source?.toUpperCase() || 'DIRECT_WEB'}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <MotionButton variant="ghost" className="w-12 h-12 p-0 rounded-xl border-white/5" href={`mailto:${lead.email}`}>
                        <span className="material-symbols-outlined">mail</span>
                    </MotionButton>
                    {lead.phone && (
                        <MotionButton variant="ghost" className="w-12 h-12 p-0 rounded-xl border-white/5" href={`tel:${lead.phone}`}>
                            <span className="material-symbols-outlined">call</span>
                        </MotionButton>
                    )}
                    <MotionButton variant="outline" className="px-8 h-12 rounded-xl border-primary/20 text-primary">
                        PROTO_COMM
                    </MotionButton>
                </div>
            </motion.header>

            <div className="p-10 grid grid-cols-12 gap-10">
                {/* Information Core */}
                <div className="col-span-12 xl:col-span-8 space-y-10">
                    {/* Identity Matrix */}
                    <motion.section 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface-dark/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Subject_Profile</p>
                                <div className="h-[2px] w-12 bg-primary" />
                            </div>
                            <MotionBadge color="primary" icon="verified">IDENTITY_CONFIRMED</MotionBadge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">Primary Email</p>
                                <p className="text-xl font-heading font-black text-white truncate">{lead.email}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">Mobile Link</p>
                                <p className="text-xl font-heading font-black text-white">{lead.phone || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">Deployment Zone</p>
                                <p className="text-xl font-heading font-black text-white uppercase italic">NAIROBI_METRO</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Target Asset Profile */}
                    <motion.section 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface-dark/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden group"
                    >
                        {lead.vehicles ? (
                            <div className="grid grid-cols-1 md:grid-cols-5 min-h-[300px]">
                                <div className="md:col-span-2 relative">
                                    <Image 
                                        fill 
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                                        src={lead.vehicles.main_image_url || "/images/placeholders/car-hero.jpg"} 
                                        alt="Target Asset" 
                                    />
                                    <div className="absolute inset-0 bg-linear-to-r from-surface-dark via-transparent to-transparent opacity-60" />
                                </div>
                                <div className="md:col-span-3 p-10 flex flex-col justify-center gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Target_Inventory</p>
                                        <h3 className="text-4xl font-heading font-black text-white uppercase tracking-tighter italic">
                                            {lead.vehicles.year} {lead.vehicles.make} <br /> {lead.vehicles.model}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Valuation</p>
                                            <p className="text-sm font-heading font-black text-white tracking-widest whitespace-nowrap">KSH {formatCurrency(lead.vehicles.price || 0).split('KSh')[1]}</p>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">State</p>
                                            <p className="text-sm font-heading font-black text-accent-teal uppercase tracking-widest">{lead.vehicles.status.toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <Link href={`/admin/vehicles/${lead.vehicles.id}`} className="text-[9px] font-black text-slate-500 hover:text-primary transition-all uppercase tracking-[0.4em] flex items-center gap-2 group/link">
                                        EXAMINE SPEC_SHEET
                                        <span className="material-symbols-outlined text-sm group-hover/link:translate-x-2 transition-transform">east</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center space-y-4">
                                <span className="material-symbols-outlined text-6xl text-slate-800">search_off</span>
                                <h3 className="text-2xl font-heading font-black text-slate-600 uppercase italic">NO_TARGET_ASSET_LOCKED</h3>
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">User initiated general inquiry protocol</p>
                            </div>
                        )}
                    </motion.section>

                    {/* Secondary Intel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-surface-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-accent-teal">no_crash</span>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Trade_In_Profile</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-sm font-black font-heading text-white uppercase italic">
                                    {lead.trade_in_year ? `${lead.trade_in_year} ` : ''}{lead.trade_in_make ? `${lead.trade_in_make} ` : ''}{lead.trade_in_model || 'NONE_SPECIFIED'}
                                </p>
                                {lead.trade_in_value && (
                                    <p className="text-[10px] font-black font-mono text-accent-teal mt-2 uppercase">EST_VALUE: KSH {formatCurrency(lead.trade_in_value).split('KSh')[1]}</p>
                                )}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-surface-dark/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">account_balance</span>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Procurement_Plan</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-sm font-black font-heading text-white uppercase italic">
                                    {lead.finance_status ? lead.finance_status.toUpperCase() : 'CASH_PROTOCOL'}
                                </p>
                                <p className="text-[10px] font-black font-mono text-slate-500 mt-2 uppercase tracking-widest">
                                    {lead.expected_purchase_date || 'IMMEDIATE_EXECUTION'}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Interaction Timeline */}
                <div className="col-span-12 xl:col-span-4 h-full">
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[3rem] h-[800px] flex flex-col overflow-hidden sticky top-32"
                    >
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="font-heading font-black text-xl tracking-tighter uppercase text-white">interaction_Log</h2>
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10 relative scrollbar-hide">
                            <div className="absolute left-[51px] top-10 bottom-10 w-[1px] bg-slate-800/50" />
                            
                            {timeline.length > 0 ? timeline.map((event: any, i: number) => (
                                <motion.div 
                                    key={event.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className="relative pl-12 group/evt"
                                >
                                    <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-surface-dark transition-all duration-500 ${i === 0 ? 'bg-primary ring-4 ring-primary/20 scale-125' : 'bg-slate-700'}`} />
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black font-mono text-slate-600 uppercase tracking-widest">{new Date(event.created_at).toLocaleString()}</p>
                                        <p className="text-[11px] font-black text-slate-200 uppercase tracking-widest group-hover/evt:text-primary transition-colors">{event.event_type.replace(/_/g, ' ')}</p>
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 border-l-2 border-l-slate-800 group-hover/evt:border-l-primary transition-all">
                                            <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed">&quot;{event.description}&quot;</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-20 opacity-20">
                                    <span className="material-symbols-outlined text-6xl">cloud_off</span>
                                    <p className="text-[10px] font-black uppercase mt-4">NO_LOGS_RECORDED</p>
                                </div>
                            )}
                        </div>

                        {/* Note Entry */}
                        <div className="p-8 bg-surface-dark/60 border-t border-white/5">
                            <form action={addTimelineNote.bind(null, lead.id)} className="relative group/form">
                                <textarea 
                                    name="note" 
                                    required 
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-[1.5rem] p-6 text-[11px] font-mono text-white placeholder:text-slate-600 outline-none focus:border-primary/40 transition-all min-h-[120px] resize-none"
                                    placeholder="APPEND_INTEL_NOTE..."
                                />
                                <button type="submit" className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                    <span className="material-symbols-outlined font-black">send</span>
                                </button>
                            </form>
                        </div>
                    </motion.section>
                </div>
            </div>

            {/* Global Control Bar */}
            <form action={updateLeadStatus.bind(null, lead.id)}>
                <motion.footer 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 lg:left-80 right-0 bg-surface-dark/80 backdrop-blur-3xl border-t border-white/5 px-10 py-6 z-[60] flex items-center justify-between"
                >
                    <div className="flex items-center gap-12">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pipeline_Status</p>
                            <div className="flex gap-1.5 h-1.5">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className={`w-8 rounded-full ${i < 3 ? 'bg-primary' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/5" />
                        <div className="relative">
                            <select 
                                name="status" 
                                className="bg-transparent text-sm font-black text-primary uppercase tracking-[0.2em] outline-none cursor-pointer appearance-none pr-8"
                                defaultValue={lead.status}
                            >
                                <option value="new">PROTOCOL: NEW</option>
                                <option value="contacted">PROTOCOL: CONTACTED</option>
                                <option value="negotiating">PROTOCOL: NEGOTIATING</option>
                                <option value="sold">PROTOCOL: CONVERTED</option>
                                <option value="lost">PROTOCOL: DORMANT</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xl">expand_more</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button formAction={deleteLeadAction} className="text-[9px] font-black text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-[0.3em]">PURGE_LEAD</button>
                        <MotionButton type="submit" className="px-12 h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 group/save overflow-hidden">
                            COMMIT_PROTOCOL
                        </MotionButton>
                    </div>
                </motion.footer>
            </form>
        </div>
    );
}
