import Link from "next/link";
import { siteConfig } from "@/config/site";
import { createClient } from "@/utils/supabase/server";
import CollapsibleSection from "@/components/ui/CollapsibleSection";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
    const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    const { count: reviewCount } = await supabase.from('customer_reviews').select('*', { count: 'exact', head: true });

    return (
        <div className="p-8 max-w-5xl space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black font-headline tracking-tighter text-on-background uppercase mb-2">
                    System Settings
                </h1>
                <p className="text-zinc-500 font-label text-sm tracking-wide uppercase">
                    Configuration &amp; Administration
                </p>
            </div>

            {/* Business Information */}
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
                        <div key={item.label} className="glass-dark px-5 py-4 flex items-start gap-3 border border-zinc-800">
                            <span className="material-symbols-outlined text-primary-container text-base mt-0.5">{item.icon}</span>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.label}</p>
                                <p className="text-sm font-bold text-zinc-200 mt-0.5">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-4 border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-600 font-mono">
                        To update business details, edit{" "}
                        <code className="bg-zinc-900 px-1 py-0.5 rounded text-admin-secondary">src/config/site.ts</code>
                        {" "}and redeploy.
                    </p>
                </div>
            </CollapsibleSection>

            {/* Finance Configuration */}
            <CollapsibleSection title="Finance Calculator Config" icon="account_balance" iconColor="text-amber-400">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass-dark px-5 py-4 border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Interest Rate</p>
                        <p className="text-2xl font-black text-amber-400 font-headline">{(siteConfig.finance.interestRate * 100).toFixed(0)}%</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Flat rate, per month</p>
                    </div>
                    <div className="glass-dark px-5 py-4 border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Default Deposit</p>
                        <p className="text-2xl font-black text-amber-400 font-headline">{siteConfig.finance.defaultDepositPercent}%</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Range: {siteConfig.finance.minDepositPercent}% – {siteConfig.finance.maxDepositPercent}%</p>
                    </div>
                    <div className="glass-dark px-5 py-4 border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Tenure Options</p>
                        <p className="text-2xl font-black text-amber-400 font-headline">{siteConfig.finance.tenureOptions.join(' / ')}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Months</p>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Database Telemetry */}
            <CollapsibleSection title="Database Telemetry" icon="database" iconColor="text-cyan-400" borderColor="border-cyan-500/40">
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Vehicles", value: vehicleCount ?? 0, icon: "directions_car", href: "/admin/vehicles" },
                        { label: "Leads", value: leadCount ?? 0, icon: "leaderboard", href: "/admin/leads" },
                        { label: "Reviews", value: reviewCount ?? 0, icon: "rate_review", href: "/admin/reviews" },
                    ].map(item => (
                        <Link key={item.label} href={item.href} className="glass-dark px-5 py-6 border border-zinc-800 hover:border-admin-secondary/40 transition-colors group text-center">
                            <span className="material-symbols-outlined text-admin-secondary text-2xl mb-2 block">{item.icon}</span>
                            <p className="text-3xl font-black text-white font-headline">{item.value}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 group-hover:text-admin-secondary transition-colors">{item.label}</p>
                        </Link>
                    ))}
                </div>
            </CollapsibleSection>

            {/* Quick Links */}
            <CollapsibleSection title="External Administration" icon="open_in_new" iconColor="text-zinc-400" borderColor="border-zinc-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { label: "Supabase Dashboard", desc: "Manage database, auth, and storage", href: "https://supabase.com/dashboard", icon: "storage" },
                        { label: "Supabase SQL Editor", desc: "Run migrations and queries", href: "https://supabase.com/dashboard/project/_/sql", icon: "terminal" },
                        { label: "Storage Buckets", desc: "Manage uploaded vehicle images", href: "https://supabase.com/dashboard/project/_/storage/buckets", icon: "photo_library" },
                        { label: "Auth Users", desc: "Manage admin accounts", href: "https://supabase.com/dashboard/project/_/auth/users", icon: "manage_accounts" },
                    ].map(item => (
                        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                            className="glass-dark px-5 py-4 flex items-start gap-3 border border-zinc-800 hover:border-zinc-600 transition-colors group">
                            <span className="material-symbols-outlined text-zinc-500 group-hover:text-admin-secondary transition-colors text-base mt-0.5">{item.icon}</span>
                            <div>
                                <p className="text-xs font-bold text-zinc-200 group-hover:text-admin-secondary transition-colors">{item.label}</p>
                                <p className="text-[10px] text-zinc-600 mt-0.5">{item.desc}</p>
                            </div>
                            <span className="material-symbols-outlined text-zinc-700 text-sm ml-auto mt-0.5 group-hover:text-zinc-400 transition-colors">open_in_new</span>
                        </a>
                    ))}
                </div>
            </CollapsibleSection>

            {/* Schema Migration Notice */}
            <section className="bg-zinc-950 border border-amber-500/30 p-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-amber-400 text-xl mt-0.5">warning</span>
                <div>
                    <h3 className="text-amber-400 font-headline font-black text-xs tracking-widest uppercase mb-1">Pending Migration</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                        If you have not yet run <code className="bg-zinc-900 px-1 py-0.5 text-admin-secondary">supabase_migration_images.sql</code>,
                        vehicle image uploads and gallery features will not work. Go to the Supabase SQL Editor and run this file once.
                    </p>
                </div>
            </section>
        </div>
    );
}
