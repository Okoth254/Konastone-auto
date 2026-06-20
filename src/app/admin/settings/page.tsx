import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import CollapsibleSection from "../../../components/ui/CollapsibleSection";
import * as motion from "framer-motion/client";
import { getSiteSettings } from "@/lib/site-settings";
import { saveSiteSettings } from "./actions";

function EditableField({ label, name, value, icon, type = "text" }: { label: string; name: string; value: string | number; icon?: string; type?: string }) {
    return (
        <label className="bg-white/2 rounded-2xl px-5 py-4 flex items-start gap-3 border border-white/5 hover:border-primary/20 transition-colors">
            {icon && <span className="material-symbols-outlined text-primary text-base mt-0.5">{icon}</span>}
            <span className="block w-full">
                <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
                <input
                    name={name}
                    type={type}
                    defaultValue={value}
                    className="mt-1 w-full bg-transparent text-sm font-bold text-slate-200 outline-none"
                />
            </span>
        </label>
    );
}

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const settings = await getSiteSettings();
    const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
    const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    const { count: reviewCount } = await supabase.from('customer_reviews').select('*', { count: 'exact', head: true });

    return (
        <div className="admin-page-shell admin-section-stack min-h-screen">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8"
            >
                <div className="space-y-3">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase leading-none">
                        Admin <span className="text-primary">Settings</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_10px_rgba(38,198,218,0.5)]" />
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Website settings are database-backed</span>
                    </div>
                </div>
                <div className="bg-surface-dark/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">settings</span>
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Public Site</p>
                        <p className="text-sm font-heading font-black text-white uppercase tracking-tight">Business Configuration</p>
                    </div>
                </div>
            </motion.header>

            <div className="space-y-6 lg:space-y-10 max-w-6xl">
                <form action={saveSiteSettings} className="space-y-6">
                    <CollapsibleSection title="Business Information" icon="store" defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField label="Phone" name="phone" value={settings.contact.phone} icon="call" />
                            <EditableField label="Phone Digits" name="phoneFormatted" value={settings.contact.phoneFormatted} icon="tag" />
                            <EditableField label="Email" name="email" value={settings.contact.email} icon="mail" />
                            <EditableField label="WhatsApp URL" name="whatsapp" value={settings.contact.whatsapp} icon="chat" />
                            <EditableField label="Address" name="address" value={settings.contact.address} icon="location_on" />
                            <EditableField label="City" name="city" value={settings.contact.city} icon="location_city" />
                            <EditableField label="Working Hours" name="workingHours" value={settings.contact.workingHours} icon="schedule" />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Finance Calculator Config" icon="account_balance" iconColor="text-primary">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <EditableField label="Interest Rate %" name="interestRatePercent" value={(settings.finance.interestRate * 100).toFixed(1)} type="number" />
                            <EditableField label="Default Deposit %" name="defaultDepositPercent" value={settings.finance.defaultDepositPercent} type="number" />
                            <EditableField label="Tenure Options" name="tenureOptions" value={settings.finance.tenureOptions.join(", ")} />
                            <EditableField label="Minimum Deposit %" name="minDepositPercent" value={settings.finance.minDepositPercent} type="number" />
                            <EditableField label="Maximum Deposit %" name="maxDepositPercent" value={settings.finance.maxDepositPercent} type="number" />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Social Links" icon="share" iconColor="text-accent-teal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField label="Facebook" name="facebook" value={settings.social.facebook} />
                            <EditableField label="Instagram" name="instagram" value={settings.social.instagram} />
                            <EditableField label="Twitter" name="twitter" value={settings.social.twitter} />
                            <EditableField label="LinkedIn" name="linkedin" value={settings.social.linkedin} />
                        </div>
                    </CollapsibleSection>

                    <button type="submit" className="btn-premium btn-premium-primary h-14 px-8">
                        Save website settings
                    </button>
                </form>

                <CollapsibleSection title="Catalogue Counts" icon="database" iconColor="text-accent-teal" borderColor="border-accent-teal/30">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Vehicles", value: vehicleCount ?? 0, icon: "directions_car", href: "/admin/vehicles" },
                            { label: "Leads", value: leadCount ?? 0, icon: "leaderboard", href: "/admin/leads" },
                            { label: "Reviews", value: reviewCount ?? 0, icon: "rate_review", href: "/admin/reviews" },
                        ].map(item => (
                            <Link key={item.label} href={item.href} className="bg-white/2 rounded-2xl px-5 py-6 border border-white/5 hover:border-accent-teal/40 transition-colors group text-center">
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
            </div>
        </div>
    );
}
