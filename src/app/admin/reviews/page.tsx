import { createClient } from "@/utils/supabase/server";
import ReviewsClient from "@/components/admin/ReviewsClient";
import * as motion from "framer-motion/client";

export default async function ReviewsPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const currentStatus = searchParams?.status as string | undefined;
    const currentSort = searchParams?.sort as string | undefined;
    const currentQuery = typeof searchParams?.q === 'string' ? searchParams.q.trim() : '';
    const currentRating = typeof searchParams?.rating === 'string' ? Number(searchParams.rating) : undefined;

    const supabase = await createClient();

    // 1. Fetch counts & stats
    const { data: allReviews } = await supabase.from('customer_reviews').select('status, is_approved');
    const pendingReviewsCount = allReviews?.filter(r => r.status === 'pending' || r.is_approved === false).length || 0;
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

    if (currentRating && Number.isFinite(currentRating)) {
        listQuery = listQuery.eq('rating', currentRating);
    }

    if (currentQuery) {
        listQuery = listQuery.or(`customer_name.ilike.%${currentQuery}%,reviewer_name.ilike.%${currentQuery}%,vehicle_make.ilike.%${currentQuery}%,vehicle_model.ilike.%${currentQuery}%,review_text.ilike.%${currentQuery}%,comment.ilike.%${currentQuery}%`);
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
        .or('status.eq.pending,is_approved.eq.false')
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
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">TOTAL REVIEWS: {totalReviewsCount.toString().padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,193,7,0.5)]" />
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">PENDING: {pendingReviewsCount.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-dark/40 backdrop-blur-xl p-5 sm:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/5 flex items-start gap-4 w-full lg:max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">rate_review</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Public Review Gate</p>
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
                            Approve or reject customer reviews before they appear on the public reviews page.
                        </p>
                    </div>
                </div>
            </motion.header>

            <form className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 rounded-2xl border border-white/5 bg-surface-dark/40 p-2">
                {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
                {currentSort && <input type="hidden" name="sort" value={currentSort} />}
                <label className="flex h-12 items-center gap-3 rounded-xl bg-white/3 px-4">
                    <span className="material-symbols-outlined text-slate-600 text-lg">search</span>
                    <input name="q" defaultValue={currentQuery} placeholder="Search reviews" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
                </label>
                <select name="rating" defaultValue={currentRating || ''} className="h-12 rounded-xl bg-white/3 px-4 text-sm text-slate-300 outline-none">
                    <option value="">All ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                </select>
                <button className="btn-premium btn-premium-ghost h-12 px-6">Filter</button>
            </form>

            <ReviewsClient
                initialReviews={reviews || []}
                pendingReviews={pendingReviews || []}
            />
        </div>
    );
}
