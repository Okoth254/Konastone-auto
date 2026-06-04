import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { updateReviewStatus, deleteReview } from "../actions";
import * as motion from "framer-motion/client";
import MotionBadge from "@/components/ui/MotionBadge";

export default async function ReviewModerationDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: review, error } = await supabase
        .from('customer_reviews')
        .select(`
            *,
            vehicles (*)
        `)
        .eq('id', id)
        .single();

    if (error || !review) {
        notFound();
    }

    const deleteReviewAction = async () => {
        "use server";
        await deleteReview(id);
    };

    const vehicleName = review.vehicles
        ? `${review.vehicles.year} ${review.vehicles.make} ${review.vehicles.model}`
        : 'General Review';

    const vehicleImage = review.vehicles?.main_image_url || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070";

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full px-4 py-4 sm:px-6 lg:px-10 lg:py-6 bg-surface-dark/40 backdrop-blur-xl border-b border-white/5"
            >
                <div className="flex items-center gap-4 lg:gap-10 w-full sm:w-auto">
                    <Link href="/admin/reviews" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">west</span>
                    </Link>
                    <div className="space-y-1">
                        <h2 className="text-xl font-heading font-black text-white uppercase tracking-tighter italic">
                            REVIEW: <span className="text-primary">{review.customer_name}</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">LOG_ID: {review.id.substring(0, 12).toUpperCase()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest">STATUS: {review.status.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <MotionBadge color={review.status === 'approved' ? 'primary' : review.status === 'pending' ? 'accent' : 'danger'}>
                        {review.status}
                    </MotionBadge>
                </div>
            </motion.header>

            <div className="admin-page-shell grid grid-cols-12 gap-6 lg:gap-10">
                <div className="col-span-12 xl:col-span-4 space-y-10">
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-surface-dark/40 backdrop-blur-xl rounded-[1.5rem] lg:rounded-[3rem] border border-white/5 overflow-hidden"
                    >
                        <div className="relative aspect-16/10 bg-white/2 overflow-hidden">
                            <Image fill className="object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" src={vehicleImage} alt={vehicleName} />
                            <div className="absolute inset-0 bg-linear-to-t from-background-dark/70 to-transparent" />
                        </div>
                        <div className="p-5 sm:p-6 lg:p-8 space-y-8">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Asset_Link</p>
                                <h1 className="font-heading text-3xl font-black tracking-tighter text-white uppercase italic leading-none">{vehicleName}</h1>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/2 border border-white/5 rounded-2xl p-4">
                                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Status</span>
                                    <span className={`text-xs font-black tracking-widest uppercase ${review.status === 'pending' ? 'text-primary' : review.status === 'approved' ? 'text-accent-teal' : 'text-red-500'}`}>{review.status}</span>
                                </div>
                                <div className="bg-white/2 border border-white/5 rounded-2xl p-4">
                                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Serial</span>
                                    <span className="text-xs font-mono font-black text-white tracking-widest">{review.vehicles?.vin || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <span className="material-symbols-outlined text-accent-teal">verified_user</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Moderation task active</span>
                            </div>
                        </div>
                    </motion.section>
                </div>

                <div className="col-span-12 xl:col-span-8 space-y-10">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface-dark/40 backdrop-blur-xl rounded-[1.5rem] lg:rounded-[3rem] border border-white/5 p-5 sm:p-6 lg:p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-3xl" />
                        <div className="relative z-10 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 lg:gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-4xl text-primary">person_check</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Verified_Client</p>
                                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">{review.customer_name}</h1>
                                        <div className="flex items-center gap-1 mt-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={`material-symbols-outlined text-base ${star <= review.rating ? 'text-primary' : 'text-slate-700'}`}>star</span>
                                            ))}
                                            <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">{review.rating}.0 SCORE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:text-right text-left">
                                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-black">Submission_Date</span>
                                    <span className="font-mono text-sm font-bold text-white tracking-wider">{new Date(review.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="relative rounded-[2rem] bg-white/2 border border-white/5 p-5 sm:p-6 lg:p-8 border-l-2 border-l-primary">
                                <span className="absolute -top-5 left-8 text-6xl font-heading text-primary/20 select-none">&quot;</span>
                                <p className="text-lg md:text-xl leading-relaxed text-slate-300 font-medium italic relative z-10">
                                    {review.review_text}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <MotionBadge color="neutral">ENGINE_PERFORMANCE</MotionBadge>
                                <MotionBadge color="neutral">OFF_ROAD_CAPABILITY</MotionBadge>
                                <MotionBadge color="neutral">LONG_HAUL</MotionBadge>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface-dark/40 backdrop-blur-xl rounded-[1.5rem] lg:rounded-[2.5rem] border border-white/5 p-5 sm:p-6 lg:p-8"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            <form action={updateReviewStatus.bind(null, review.id, 'approved')} className="flex-1 flex">
                                <button type="submit" className="w-full h-14 rounded-2xl bg-primary text-black font-heading font-black tracking-[0.2em] text-[10px] uppercase hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98]">
                                    APPROVE_TRANSMISSION
                                </button>
                            </form>
                            <form action={updateReviewStatus.bind(null, review.id, 'rejected')} className="flex-1 flex">
                                <button type="submit" className="w-full h-14 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 font-heading font-black tracking-[0.2em] text-[10px] uppercase hover:bg-red-500/20 transition-all active:scale-[0.98]">
                                    REJECT_ENTRY
                                </button>
                            </form>
                            <form action={updateReviewStatus.bind(null, review.id, 'flagged')} className="flex-1 flex">
                                <button type="submit" className="w-full h-14 rounded-2xl border border-white/10 bg-white/2 text-slate-400 font-heading font-black tracking-[0.2em] text-[10px] uppercase hover:border-accent-teal/40 hover:text-accent-teal transition-all active:scale-[0.98]">
                                    FLAG_ESCALATION
                                </button>
                            </form>
                            <form action={deleteReviewAction} className="flex-1 flex">
                                <button type="submit" className="w-full h-14 rounded-2xl border border-red-500/30 text-red-400 font-heading font-black tracking-[0.2em] text-[10px] uppercase hover:bg-red-500/20 transition-all active:scale-[0.98]">
                                    DELETE_PERMANENTLY
                                </button>
                            </form>
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
