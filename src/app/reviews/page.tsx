import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ReviewForm from "@/components/reviews/ReviewForm";
import { CustomerReview } from "@/types/database";
import { Suspense } from "react";
import MotionBadge from "@/components/ui/MotionBadge";
import * as motion from "framer-motion/client";

export const metadata: Metadata = {
    title: 'Customer Reviews — Trusted Dealership',
    description: 'Read genuine customer reviews for Konastone Autos. Hundreds of satisfied clients across Mombasa, Nairobi & Kenya. Share your own experience.',
    alternates: { canonical: 'https://konastoneautos.com/reviews' },
};

async function ReviewContent() {
    let reviews: CustomerReview[] = [];
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (isSupabaseConfigured) {
        try {
            const { data } = await supabase
                .from('customer_reviews')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (data) reviews = data;
        } catch (e) {
            console.error("Error fetching reviews", e);
        }
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mb-24">
            {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                    <motion.div 
                        key={review.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="break-inside-avoid bg-surface-dark border border-white/5 rounded-4xl p-12 relative overflow-hidden group hover:border-primary/20 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full" />
                        
                        <div className="flex justify-between items-start mb-6 relative">
                            <div className="flex gap-1 text-primary">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-[18px] ${i < review.rating ? '' : 'text-slate-800'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                            </div>
                            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase opacity-60">
                                {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        
                        <p className="text-slate-300 font-medium mb-8 text-sm leading-relaxed italic relative">
                            &quot;{review.comment}&quot;
                        </p>
                        
                        <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                            <div className="bg-primary/10 flex items-center justify-center rounded-full size-10 font-black text-primary border border-primary/20">
                                {review.reviewer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-slate-100 font-heading text-sm tracking-tight uppercase">{review.reviewer_name}</p>
                                {(review.vehicle_make || review.vehicle_model) && (
                                    <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-0.5">
                                        Owner: {review.vehicle_make} {review.vehicle_model}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="col-span-full text-center py-24 bg-surface-dark/20 rounded-[3rem] border border-dashed border-white/10">
                    <span className="material-symbols-outlined text-6xl text-slate-700 mb-4 block">forum</span>
                    <h3 className="text-2xl font-heading text-slate-300 uppercase">Awaiting Logs</h3>
                    <p className="text-slate-500 mt-2 text-sm italic">Be the first to document your journey.</p>
                </div>
            )}
        </div>
    );
}

export default function ReviewsPage() {
    return (
        <main className="page-shell layout-content-container flex flex-col flex-1 w-full pt-20 pb-20 relative z-10 overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-teal/5 blur-[150px] rounded-full -z-10" />

            {/* Header Section */}
            <header className="flex flex-col mb-20 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex mb-6"
                >
                    <MotionBadge color="accent" icon="verified">Verified Experience</MotionBadge>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-5xl sm:text-6xl md:text-8xl font-heading tracking-tighter leading-[0.85] font-black uppercase mb-8"
                >
                    VOICES OF <br /> <span className="text-primary">PRECISION</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic"
                >
                    Every Konastone vehicle represents a commitment to excellence. These are the stories of the drivers who trusted us with their journey.
                </motion.p>
            </header>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { label: "Reliability", value: 98, rating: "4.9/5", icon: "security_update_good" },
                    { label: "Performance", value: 96, rating: "4.8/5", icon: "speed" },
                    { label: "Concierge Quality", value: 100, rating: "5.0/5", icon: "support_agent" }
                ].map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="bg-surface-dark/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 relative group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                            <p className="text-slate-100 font-heading text-xl">{stat.rating}</p>
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${stat.value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                                className="h-full bg-primary shadow-[0_0_15px_rgba(255,191,41,0.4)]"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Featured Review (Hero) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-24 rounded-[3rem] overflow-hidden bg-surface-dark border border-white/5 shadow-2xl relative group"
            >
                <div className="flex flex-col lg:flex-row min-h-[500px]">
                    <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full overflow-hidden">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 10 }}
                            className="absolute inset-0 bg-cover bg-center" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQlCHYU5jA_loaHsmWcxG2qgP5oBi32sCPY2qxnq6DVUbsmzT3juaiaN0w1oFrPZhOsY_51Qub_lKshMsgJ9j7LP8vz_YDwMusKQfu0KvTjI7xmIlJ-0oAPPPGsz4uzOp3BlGJuhnnpH8DzTc4bop5CXpXPLY2CYYMSCaLL7M2cPV-QImH9We5MoGh-46CxoYp1-rkaINqk3-gJmHvr3_5fokws0KnQe98Gu3HIsdPA0xBRzfSAPeST0TdbrwhdvNq2mKFGLPZ_RLx')" }} 
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-surface-dark via-transparent to-transparent hidden lg:block" />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-surface-dark lg:hidden" />
                    </div>
                    <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-surface-dark relative">
                        <span className="material-symbols-outlined text-primary text-8xl opacity-10 absolute top-12 left-12 select-none">format_quote</span>
                        <blockquote className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-12 relative z-10 italic tracking-tighter uppercase">
                            &quot;The most transparent car buying experience in Kenya.&quot;
                        </blockquote>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="size-16 rounded-full border-2 border-primary p-1">
                                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC0YTrrD8XsTMcEV8ysYZtdZfOkoMp8Tjatxp3NhNEYGjZLt0bkNGMIJnhYZdsu6rcABwFpuuZvoL_Wl2DV_GCV6XEuB0-hZFlkIF5-0WGw6w1XccxbWMlIf_5I6jDM2IpaJ0SAnvWrthoZO7pFUrekiWegvlCn9myzbTFOJKzLtTGNkZwti8KJf0HnvE71LiIsPmLS1uQ_bEO6yVOHBBBfBJvHQdJvZcE4DEHx5y8HL9_p_gR_wRMLD79Mn3oWNZ6mL4AI-JkmDrJ')" }} />
                            </div>
                            <div>
                                <p className="text-primary font-heading text-xl uppercase tracking-tighter">KAMAU M.</p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Purchased Toyota Prado, Mombasa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Review Grid */}
            <Suspense fallback={<div className="h-[600px] flex items-center justify-center"><span className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <ReviewContent />
            </Suspense>

            {/* Call to Action */}
            <ReviewForm />
        </main>
    );
}
