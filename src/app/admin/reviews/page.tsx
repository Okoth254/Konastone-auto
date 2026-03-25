import { createClient } from "@/utils/supabase/server";
import ReviewsClient from "@/components/admin/ReviewsClient";

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
        <div className="p-8 space-y-12 flex-1 w-full max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface uppercase mb-4 leading-[0.9]">
                        Review <br />
                        <span className="text-primary">Moderation</span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Network Logs</span>
                            <span className="text-xl font-mono font-bold text-zinc-300">{totalReviewsCount.toString().padStart(3, '0')}</span>
                        </div>
                        <div className="w-px h-8 bg-zinc-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Critical Pending</span>
                            <span className="text-xl font-mono font-bold text-amber-500">{pendingReviewsCount.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-container-high/40 p-4 rounded-3xl border border-zinc-800">
                    <span className="material-symbols-outlined text-zinc-600">info</span>
                    <p className="text-[10px] font-medium text-zinc-500 leading-relaxed max-w-[200px] uppercase">
                        Authorize or redact customer sentiment telemetry to ensure brand integrity.
                    </p>
                </div>
            </div>

            <ReviewsClient 
                initialReviews={reviews || []} 
                pendingReviews={pendingReviews || []} 
            />
        </div>
    );
}
