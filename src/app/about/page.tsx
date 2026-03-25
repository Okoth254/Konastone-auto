import { Metadata } from "next";
import Link from "next/link";
import * as motion from "framer-motion/client";
import MotionBadge from "@/components/ui/MotionBadge";
import MotionButton from "@/components/ui/MotionButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: 'About Us — Mombasa Car Dealer',
    description: `Learn- [x] **Phase 1: Foundations** (Core Primitives + Global Styles)
- [x] **Phase 2: Public UI Polish** (Inventory + Vehicle Detail + Reviews + About)
- [/] **Phase 3: Admin Dashboard Refinement** (CRM + Moderation + Navigation)
- [ ] **Phase 4: QA & Production Preparation**
me.`,
    alternates: { canonical: 'https://konastoneautos.com/about' },
};

export default function AboutPage() {
    return (
        <main className="page-shell flex-1 flex flex-col w-full py-20 gap-24 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-accent-teal/5 blur-[150px] rounded-full -z-10" />

            <section className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <MotionBadge color="accent" icon="verified">Established Precision</MotionBadge>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-heading tracking-[0.02em] font-black uppercase leading-[0.85] text-white"
                >
                    LEGACY OF <br /> <span className="text-primary">KONASTONE</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium italic max-w-2xl"
                >
                   &quot;Mombasa&apos;s premier destination for high-quality vehicles. We combine a 12-year heritage of trust with a modern digital showroom experience.&quot;
                </motion.p>

                <div className="flex flex-wrap justify-center gap-6 mt-8">
                    {[
                        { icon: "payments", label: "CASH SALES", desc: "Immediate Fulfillment" },
                        { icon: "account_balance", label: "ASSET FINANCE", desc: "90% Financing" },
                        { icon: "swap_horiz", label: "TRADE-INS", desc: "Fair Valuation" }
                    ].map((feature, i) => (
                        <motion.div
                            key={feature.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="bg-surface-dark/40 backdrop-blur-xl px-8 py-5 rounded-4xl border border-white/5 flex flex-col items-center gap-2 hover:border-primary/30 transition-all group"
                        >
                            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                            <div className="text-center">
                                <p className="font-heading text-sm text-slate-100 uppercase tracking-tight">{feature.label}</p>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Core Values / Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {siteConfig.stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 border-l border-white/5 relative group"
                    >
                        <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                        <span className="material-symbols-outlined text-slate-700 text-4xl mb-4 block group-hover:text-primary transition-colors">{stat.icon}</span>
                        <h4 className="text-4xl font-heading text-white tracking-tighter uppercase mb-1">{stat.value}</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{stat.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* Location Section */}
            <section className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <h3 className="text-4xl font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                            <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-2xl">location_on</span>
                            </span>
                            Strategic Annex
                        </h3>
                        <p className="text-slate-500 text-sm font-medium ml-16">Located within the heart of coastal commerce.</p>
                    </div>
                    <div className="font-black text-[10px] text-slate-400 bg-surface-dark/80 px-6 py-3 rounded-full border border-white/5 uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="text-accent-teal">COORD:</span> 4°02&apos;58.2&quot;S 39°40&apos;09.1&quot;E
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="w-full h-[500px] rounded-[3rem] overflow-hidden relative border border-white/5 group bg-surface-dark"
                >
                    <div className="absolute inset-0 bg-background-dark/20 z-10" />
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 10 }}
                        className="absolute inset-0 grayscale opacity-40 mix-blend-luminosity bg-center bg-cover" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6LI6RYWzu6dDCwPq_yPjYC8DLAM6jyZD1Wq0qSoOutm59vjQyedPwfA2PgNBtR0-Nqwfhf_opgCm22trIcgOpajrl6TFD5BHUhkb8eTLKN8iLiZBo11my1jZNASbnKAajyaw5-4Lofn1mlgC0-yazpTBWe2B4ODZXcxTJF8AhE4UlhG2FdbIkzOVhOq0ZTubV7IHzeMV-0fuRXzcMhKYZ61YqcFvVVTYN3K_6OCWOwCotIUtXW7vHiAmoo57W8MwxsI9gnAG09GTf')" }} 
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-primary/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-primary/50 shadow-[0_0_50px_rgba(255,191,41,0.3)]">
                                <span className="material-symbols-outlined text-primary text-4xl font-black">location_on</span>
                            </div>
                            <div className="mt-4 px-6 py-2 bg-background-dark/90 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                                <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">Moi Avenue, Mombasa</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="absolute inset-0 opacity-20 pointer-events-none z-10" style={{ backgroundImage: "radial-gradient(circle at center, #26C6DA 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                </motion.div>
            </section>

            {/* Contact Stacks */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { icon: "call", title: "HQ COMMS", channel: siteConfig.contact.phone, action: "CALL US", href: `tel:${siteConfig.contact.phone.replace(/\s+/g, '')}` },
                    { icon: "mail", title: "DIGITAL INTAKE", channel: siteConfig.contact.email, action: "SEND EMAIL", href: `mailto:${siteConfig.contact.email}` },
                    { icon: "schedule", title: "LOGISTICS OPS", channel: siteConfig.contact.workingHours, action: "VIEW TIMES", href: "#" }
                ].map((stack, i) => (
                    <motion.div
                        key={stack.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface-dark/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group flex flex-col items-center text-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-white/2 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-white/5 shadow-inner">
                            <span className="material-symbols-outlined text-4xl">{stack.icon}</span>
                        </div>
                        <div>
                            <h4 className="text-2xl font-heading text-white uppercase tracking-tighter mb-2">{stack.title}</h4>
                            <p className="text-sm font-medium text-slate-400 break-all px-4">{stack.channel}</p>
                        </div>
                        <MotionButton 
                            href={stack.href}
                            variant="ghost"
                            className="w-full h-14 border-white/5 hover:border-primary/30"
                        >
                            {stack.action}
                        </MotionButton>
                    </motion.div>
                ))}
            </section>

            {/* Social Matrix */}
            <section className="flex flex-wrap justify-center gap-12 py-12 border-t border-white/5 relative">
                {[
                    { name: "FACEBOOK", href: "#" },
                    { name: "INSTAGRAM", href: siteConfig.contact.whatsapp },
                    { name: "TIKTOK", href: "#" }
                ].map((link, i) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link 
                            className="text-4xl md:text-5xl font-heading tracking-tighter text-slate-700 hover:text-primary transition-all flex items-center gap-4 group uppercase" 
                            href={link.href}
                        >
                            {link.name} 
                            <span className="material-symbols-outlined text-[20px] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold">arrow_outward</span>
                        </Link>
                    </motion.div>
                ))}
            </section>
        </main>
    );
}
