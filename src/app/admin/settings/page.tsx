import Link from "next/link";
import { siteConfig } from "@/config/site";
import { createClient } from "@/utils/supabase/server";
import CollapsibleSection from "../../../components/ui/CollapsibleSection";
import * as motion from "framer-motion/client";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
    const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    const { count: reviewCount } = await supabase.from('customer_reviews').select('*', { count: 'exact', head: true });

    return (
        <div className="p-10 space-y-12 min-h-screen">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
                <div className="space-y-3">
                    <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white uppercase italic leading-none">
                        SYSTEM <span className="text-primary">SETTINGS</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_10px_rgba(38,198,218,0.5)]" />
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">CONFIGURATION_CORE: ONLINE</span>
                    </div>
                </div>
                <div className="bg-surface-dark/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">settings</span>
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Admin_Node</p>
                        <p className="text-sm font-heading font-black text-white uppercase tracking-tight">Configuration Registry</p>
                    </div>
                </div>
            </motion.header>

            <div className="space-y-10 max-w-6xl">
                <CollapsibleSection title="Business Information" icon="store" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Business Name", value: "Konastone Autos", icon: "business" },
                            { label: "Phone", value: siteConfig.contact.phone, icon: "call" },
                            { label: "Email", value: siteConfig.contact.email, icon: "mail" },
                            { label: "Address", value: `${siteConfig.contact.address}, ${siteConfig.contact.city}`, icon: "location_on" },
                            { label: "Working Hours", value: siteConfig.contact.workingHours, icon: "schedule" },
                            { label: "WhatsApp", value: siteConfig.contact.phoneFormatted, icon: "chat" },
                        ].map(item => (
                            <div key={item.label} className="bg-white/2 rounded-2xl px-5 py-4 flex items-start gap-3 border border-white/5 hover:border-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-primary text-base mt-0.5">{item.icon}</span>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
                                    <p className="text-sm font-bold text-slate-200 mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] text-slate-600 font-mono">
                            To update business details, edit <code className="bg-white/5 px-1.5 py-1 rounded text-primary">src/config/site.ts</code> and redeploy.
                        </p>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Finance Calculator Config" icon="account_balance" iconColor="text-primary">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/2 rounded-2xl px-5 py-4 border border-white/5">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Interest Rate</p>
                            <p className="text-2xl font-black text-primary font-heading">{(siteConfig.finance.interestRate * 100).toFixed(0)}%</p>
                            <p className="text-[10px] text-slate-600 mt-1">Flat rate, per month</p>
                        </div>
                        <div className="bg-white/2 rounded-2xl px-5 py-4 border border-white/5">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Default Deposit</p>
                            <p className="text-2xl font-black text-primary font-heading">{siteConfig.finance.defaultDepositPercent}%</p>
                            <p className="text-[10px] text-slate-600 mt-1">Range: {siteConfig.finance.minDepositPercent}% - {siteConfig.finance.maxDepositPercent}%</p>
                        </div>
                        <div className="bg-white/2 rounded-2xl px-5 py-4 border border-white/5">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Tenure Options</p>
                            <p className="text-2xl font-black text-primary font-heading">{siteConfig.finance.tenureOptions.join(' / ')}</p>
                            <p className="text-[10px] text-slate-600 mt-1">Months</p>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Database Telemetry" icon="database" iconColor="text-accent-teal" borderColor="border-accent-teal/30">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Vehicles", value: vehicleCount ?? 0, icon: "directions_car", href: "/admin/vehicles" },
                            { label: "Leads", value: leadCount ?? 0, icon: "leaderboard", href: "/admin/leads" },
                            { label: "Reviews", value: reviewCount ?? 0, icon: "rate_review", href: "/admin/reviews" },
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="bg-white/2 rounded-[2rem] px-5 py-6 border border-white/5 hover:border-accent-teal/40 transition-colors group text-center">
                                <span className="material-symbols-outlined text-accent-teal text-2xl mb-2 block">{item.icon}</span>
                                <p className="text-3xl font-black text-white font-heading">{item.value}</p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 group-hover:text-accent-teal transition-colors">{item.label}</p>
                            </Link>
                        ))}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="External Administration" icon="open_in_new" iconColor="text-slate-400" borderColor="border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { label: "Supabase Dashboard", desc: "Manage database, auth, and storage", href: "https://supabase.com/dashboard", icon: "storage" },
                            { label: "Supabase SQL Editor", desc: "Run migrations and queries", href: "https://supabase.com/dashboard/project/_/sql", icon: "terminal" },
                            { label: "Storage Buckets", desc: "Manage uploaded vehicle images", href: "https://supabase.com/dashboard/project/_/storage/buckets", icon: "photo_library" },
                            { label: "Auth Users", desc: "Manage admin accounts", href: "https://supabase.com/dashboard/project/_/auth/users", icon: "manage_accounts" },
                        ].map(item => (
                            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                                className="bg-white/2 rounded-2xl px-5 py-4 flex items-start gap-3 border border-white/5 hover:border-accent-teal/30 transition-colors group">
                                <span className="material-symbols-outlined text-slate-500 group-hover:text-accent-teal transition-colors text-base mt-0.5">{item.icon}</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-200 group-hover:text-accent-teal transition-colors">{item.label}</p>
                                    <p className="text-[10px] text-slate-600 mt-0.5">{item.desc}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-700 text-sm ml-auto mt-0.5 group-hover:text-slate-400 transition-colors">open_in_new</span>
                            </a>
                        ))}
                    </div>
                </CollapsibleSection>

                <section className="bg-surface-dark/40 backdrop-blur-xl border border-primary/25 rounded-[2.5rem] p-6 flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">warning</span>
                    <div>
                        <h3 className="text-primary font-heading font-black text-xs tracking-widest uppercase mb-1">Pending Migration</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            If you have not yet run <code className="bg-white/5 px-1.5 py-1 rounded text-primary">supabase_migration_images.sql</code>,
                            vehicle image uploads and gallery features will not work. Go to the Supabase SQL Editor and run this file once.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
