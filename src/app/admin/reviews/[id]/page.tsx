import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { updateReviewStatus, deleteReview } from "../actions";

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

    // Bind actions
    const deleteReviewAction = async () => {
        "use server";
        await deleteReview(id);
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden min-h-[calc(100vh-(--spacing(16)))]">
            {/* Background Technical Detail */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4f4632 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            {/* Detail Container / Modal Sheet */}
            <div className="w-full max-w-5xl bg-admin-surface/80 backdrop-blur-xl border border-admin-secondary/20 relative z-10 flex flex-col md:flex-row shadow-2xl">
                {/* Close Action */}
                <Link href="/admin/reviews" className="absolute top-4 right-4 text-zinc-500 hover:text-admin-primary transition-colors z-20">
                    <span className="material-symbols-outlined text-3xl">close</span>
                </Link>

                {/* Left Panel: Product Metadata */}
                <div className="w-full md:w-1/3 bg-surface-container-high p-8 flex flex-col justify-between border-r border-zinc-800">
                    <div>
                        <span className="font-headline text-[10px] tracking-[0.2em] text-admin-secondary uppercase block mb-2">SYSTEM_LOG // UNIT_REF</span>
                        <h2 className="font-headline text-3xl tracking-wider text-white mb-6 uppercase">MODERATION_TASK</h2>
                        <div className="space-y-6">
                            <div className="relative aspect-video bg-admin-surface overflow-hidden border border-zinc-800">
                                <Image fill className="object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-500" src={review.vehicles?.main_image_url || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070"} alt="Vehicle" />
                            </div>
                            <div>
                                <label className="font-headline text-[10px] tracking-widest text-zinc-500 uppercase">Product Identifier</label>
                                <p className="font-headline text-xl text-amber-400 mt-1 uppercase">{review.vehicles ? `${review.vehicles.year} ${review.vehicles.make} ${review.vehicles.model}` : 'General Review'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-surface-container-highest/50">
                                    <span className="block font-headline text-[9px] text-zinc-500 uppercase tracking-widest">STATUS</span>
                                    <span className={`font-headline text-xs font-bold tracking-widest mt-1 block uppercase ${review.status === 'pending' ? 'text-amber-500' : review.status === 'approved' ? 'text-admin-secondary' : 'text-red-500'}`}>{review.status}</span>
                                </div>
                                <div className="p-3 bg-surface-container-highest/50">
                                    <span className="block font-headline text-[9px] text-zinc-500 uppercase tracking-widest">SERIAL</span>
                                    <span className="font-headline text-xs font-bold text-white tracking-widest mt-1 block">{review.vehicles?.vin || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Review Content */}
                <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between bg-surface-container">
                    <div className="space-y-8">
                        {/* Reviewer Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 relative bg-surface-container-highest border border-zinc-700 flex items-center justify-center overflow-hidden">
                                        <Image fill className="object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_uCvsOSf-mE5ekxtGvjC9yXbxsT9-uMEm6vi331CBxRrumjNQRSCWi-2P-CnurSMz3fB2_vMpsL6kHZJjv81B2ATOlVbmRevrd4k1Y5jEFBDPH4enul_PB3JQkAakegCwvjHa61G3TAito0jLuPXFTivE_kkANefTVyTTg6-CbFtOZ7StJs0UC3p9NPcX727Dt8a__cATCz-WfzCoJYwO8JYtY0KhhunDfgUD-DxQrYP4b0R-aoOmZ-O1u05HXSNMWhS40miEv7fB" alt="Reviewer" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-admin-secondary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px] text-black">check_circle</span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="font-headline text-4xl tracking-tighter text-white uppercase">{review.customer_name}</h1>
                                    <div className="flex items-center gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className={`material-symbols-outlined text-sm ${star <= review.rating ? 'text-amber-400' : 'text-zinc-600'}`}>star</span>
                                        ))}
                                        <span className="ml-2 font-headline text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{review.rating}.0 SCORE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:text-right text-left">
                                <span className="block font-headline text-[10px] text-zinc-500 uppercase tracking-widest">Submission Date</span>
                                <span className="font-headline text-sm font-bold text-white tracking-wider">{new Date(review.created_at).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Review Text Body */}
                        <div className="relative">
                            <span className="absolute -top-6 -left-4 text-6xl font-headline text-zinc-800 select-none">&quot;</span>
                            <div className="border-l-2 border-admin-secondary pl-6">
                                <p className="text-lg leading-relaxed text-zinc-300 font-light italic">
                                    {review.review_text}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Tags */}
                        <div className="flex flex-wrap gap-2 pt-4">
                            <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-headline font-bold tracking-widest text-zinc-400 border border-zinc-800 uppercase">ENGINE_PERFORMANCE</span>
                            <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-headline font-bold tracking-widest text-zinc-400 border border-zinc-800 uppercase">OFF_ROAD_CAPABILITY</span>
                            <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-headline font-bold tracking-widest text-zinc-400 border border-zinc-800 uppercase">LONG_HAUL</span>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-800">
                        <form action={updateReviewStatus.bind(null, review.id, 'approved')} className="flex-1 flex">
                            <button type="submit" className="w-full bg-primary-container text-black font-headline font-black tracking-widest text-xs py-4 px-2 hover:bg-amber-500 transition-all active:scale-[0.98]">
                                APPROVE_TRANSMISSION
                            </button>
                        </form>
                        <form action={updateReviewStatus.bind(null, review.id, 'rejected')} className="flex-1 flex">
                            <button type="submit" className="w-full border border-red-500 text-red-500 font-headline font-bold tracking-widest text-xs py-4 px-2 hover:bg-red-500/10 transition-all active:scale-[0.98]">
                                REJECT_ENTRY
                            </button>
                        </form>
                        <form action={updateReviewStatus.bind(null, review.id, 'flagged')} className="flex-1 flex">
                            <button type="submit" className="w-full border border-zinc-700 text-zinc-400 font-headline font-bold tracking-widest text-xs py-4 px-2 hover:border-admin-secondary hover:text-admin-secondary transition-all active:scale-[0.98]">
                                FLAG_ESCALATION
                            </button>
                        </form>
                        <form action={deleteReviewAction} className="flex-1 flex">
                            <button type="submit" className="w-full border border-red-500/50 text-red-500 font-headline font-bold tracking-widest text-xs py-4 px-2 hover:bg-red-500/20 transition-all active:scale-[0.98]">
                                DELETE_PERMANENTLY
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* System Background Decor */}
            <div className="fixed bottom-10 left-[280px] opacity-20 hidden lg:block z-0 pointer-events-none">
                <div className="font-headline text-[8px] tracking-[0.4em] space-y-1 text-zinc-500">
                    <p>LAT: 35.6895° N</p>
                    <p>LONG: 139.6917° E</p>
                    <p>ENCRYPT: RSA_4096_GCM</p>
                    <p>BUFFER: 100%_SECURE</p>
                </div>
            </div>
        </div>
    );
}
