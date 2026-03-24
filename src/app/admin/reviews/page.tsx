import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function ReviewsListView() {
    const supabase = await createClient();
    const { data: reviews } = await supabase
        .from('customer_reviews')
        .select(`
            *,
            vehicles (
                year,
                make,
                model
            )
        `)
        .order('created_at', { ascending: false });

    const pendingReviewsCount = reviews?.filter(r => r.status === 'pending').length || 0;

    return (
        <div className="p-8 space-y-8 flex-1 w-full max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface uppercase mb-2">Review Moderation</h1>
                    <p className="text-zinc-500 font-label text-sm tracking-wide uppercase">Total Network Logs: {reviews?.length || 0} | Pending Review: {pendingReviewsCount}</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700">
                        Filter: Pending Review
                    </button>
                    <button className="bg-surface-container-high px-4 py-2 text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-700">
                        Sort: Oldest First
                    </button>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-surface-container-high border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-4 pl-6">Ref ID</th>
                                <th className="p-4">Customer Name</th>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Submitted On</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {reviews && reviews.length > 0 ? (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                reviews.map((review: any) => {
                                    // Parse status colors
                                    let statusColorClass = "bg-zinc-800 border border-zinc-600 text-zinc-400";
                                    if (review.status === 'pending') statusColorClass = "bg-amber-500/10 border border-amber-500 text-amber-500";
                                    else if (review.status === 'approved') statusColorClass = "bg-admin-secondary/10 border border-admin-secondary text-admin-secondary";
                                    else if (review.status === 'rejected') statusColorClass = "bg-red-500/10 border border-red-500 text-red-500";

                                    const targetVehicle = review.vehicles ? `${review.vehicles.year || ''} ${review.vehicles.make || ''} ${review.vehicles.model || ''}`.trim() : 'General Review';

                                    return (
                                        <tr key={review.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-4 pl-6 text-zinc-500 font-mono text-xs">{review.id.substring(0, 8).toUpperCase()}</td>
                                            <td className="p-4 text-white font-bold">{review.customer_name}</td>
                                            <td className="p-4 text-zinc-300">{targetVehicle}</td>
                                            <td className="p-4">
                                                <div className="flex gap-1 text-amber-400">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span key={star} className={`material-symbols-outlined text-[14px] ${star <= review.rating ? '' : 'text-zinc-600'}`}>star</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColorClass}`}>{review.status}</span>
                                            </td>
                                            <td className="p-4 text-zinc-500 font-mono text-xs">{new Date(review.created_at).toLocaleString()}</td>
                                            <td className="p-4 pr-6 text-right">
                                                <Link href={`/admin/reviews/${review.id}`} className={`${review.status === 'pending' ? 'text-admin-secondary' : 'text-zinc-400'} hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100`}>
                                                    {review.status === 'pending' ? 'MODERATE' : 'VIEW'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-zinc-500 font-bold uppercase tracking-widest">
                                        No reviews found in database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination / Controls */}
            {reviews && reviews.length > 0 && (
            <div className="flex justify-between items-center mt-6">
                <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Showing {reviews.length} Records</p>
                <div className="flex gap-2">
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-admin-secondary bg-admin-secondary/10 text-admin-secondary">
                        <span className="text-xs font-bold">1</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="text-xs font-bold">2</span>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center border border-zinc-700 bg-surface-container text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
            )}
        </div>
    );
}
