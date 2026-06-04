import { createClient } from "@/utils/supabase/server";
import ReviewsClient from "@/components/admin/ReviewsClient";
import * as motion from "framer-motion/client";

export default async function ReviewsPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;

    const supabase = await createClient();

    // 1. Fetch counts & stats
    const { data: allReviews } = await supabase.from('customer_reviews').select('status');
    const pendingReviewsCount = allReviews?.filter(r => r.status === 'pending').length || 0;
    const totalReviewsCount = allReviews?.length || 0;

    // 2. Fetch data for the list view
    let listQuery = supabase.from('customer_reviews').select(`
        *,
        vehicles (
            year,
            make,
            model
        )
    `);

    if (currentStatus) {
        listQuery = listQuery.eq('status', currentStatus);
    }

    if (currentSort === 'newest') {
        listQuery = listQuery.order('created_at', { ascending: false });
    } else {
        listQuery = listQuery.order('created_at', { ascending: true });
    }

    const { data: reviews } = await listQuery;

    // 3. Fetch pending reviews for the focus deck
    const { data: pendingReviews } = await supabase
        .from('customer_reviews')
        .select(`
            *,
            vehicles (
                year,
                make,
                model
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    return (
        <div className="admin-page-shell admin-section-stack min-h-screen">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8"
            >
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black tracking-tighter text-white uppercase italic leading-none">
                            REVIEW <span className="text-primary">MODERATION</span>
                        </h1>
                        <span className="hidden sm:inline-flex px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em]">Queue</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_10px_rgba(38,198,218,0.5)]" />
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">TOTAL_LOGS: {totalReviewsCount.toString().padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,193,7,0.5)]" />
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">PENDING_REVIEW: {pendingReviewsCount.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-dark/40 backdrop-blur-xl p-5 sm:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/5 flex items-start gap-4 w-full lg:max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">rate_review</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Sentiment_Gate</p>
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
                            Authorize or redact customer sentiment telemetry to keep the public review stream clean.
                        </p>
                    </div>
                </div>
            </motion.header>

            <ReviewsClient
                initialReviews={reviews || []}
                pendingReviews={pendingReviews || []}
            />
        </div>
    );
}
