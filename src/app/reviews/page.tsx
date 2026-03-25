import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ReviewForm from "@/components/reviews/ReviewForm";
import { CustomerReview } from "@/types/database";

export const metadata: Metadata = {
  title: 'Customer Reviews — Trusted Dealership',
  description: 'Read genuine customer reviews for Konastone Autos. Hundreds of satisfied clients across Mombasa, Nairobi & Kenya. Share your own experience.',
  alternates: { canonical: 'https://konastoneautos.com/reviews' },
};

export default async function Reviews() {
    let reviews: CustomerReview[] = [];
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (isSupabaseConfigured) {
        try {
            const { data } = await supabase
                .from('customer_reviews')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (data) {
                reviews = data;
            }
        } catch (e) {
            console.error("Error fetching reviews", e);
        }
    }

    return (
        <div className="page-shell layout-content-container flex flex-col max-w-[1200px] flex-1 w-full py-8 relative z-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-10">
                <div className="inline-block bg-secondary/20 text-secondary border border-secondary/50 px-3 py-1 text-xs font-bold tracking-widest uppercase self-start rounded-sm mb-2">
                    CUSTOMER FEEDBACK
                </div>
                <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-display tracking-wider leading-none font-bold uppercase">VOICES OF PRECISION</h1>
            </div>

            {/* Featured Review (Hero) */}
            <div className="mb-12 rounded-lg overflow-hidden bg-card-dark border border-secondary/20 shadow-lg relative group">
                <div className="flex flex-col md:flex-row min-h-[400px]">
                    {/* Image side */}
                    <div className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQlCHYU5jA_loaHsmWcxG2qgP5oBi32sCPY2qxnq6DVUbsmzT3juaiaN0w1oFrPZhOsY_51Qub_lKshMsgJ9j7LP8vz_YDwMusKQfu0KvTjI7xmIlJ-0oAPPPGsz4uzOp3BlGJuhnnpH8DzTc4bop5CXpXPLY2CYYMSCaLL7M2cPV-QImH9We5MoGh-46CxoYp1-rkaINqk3-gJmHvr3_5fokws0KnQe98Gu3HIsdPA0xBRzfSAPeST0TdbrwhdvNq2mKFGLPZ_RLx')" }}>
                        <div className="absolute inset-0 bg-linear-to-r from-card-dark via-transparent to-transparent md:hidden"></div>
                        <div className="absolute inset-0 bg-linear-to-l from-card-dark via-transparent to-transparent hidden md:block"></div>
                    </div>
                    {/* Content side */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card-dark relative z-10">
                        <span className="material-symbols-outlined text-primary text-6xl opacity-20 absolute top-8 left-8">format_quote</span>
                        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-quote font-bold text-white leading-tight mb-8 relative z-10 italic">
                            &quot;The most transparent car buying experience in Kenya.&quot;
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="bg-cover bg-center rounded-full size-12 border-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC0YTrrD8XsTMcEV8ysYZtdZfOkoMp8Tjatxp3NhNEYGjZLt0bkNGMIJnhYZdsu6rcABwFpuuZvoL_Wl2DV_GCV6XEuB0-hZFlkIF5-0WGw6w1XccxbWMlIf_5I6jDM2IpaJ0SAnvWrthoZO7pFUrekiWegvlCn9myzbTFOJKzLtTGNkZwti8KJf0HnvE71LiIsPmLS1uQ_bEO6yVOHBBBfBJvHQdJvZcE4DEHx5y8HL9_p_gR_wRMLD79Mn3oWNZ6mL4AI-JkmDrJ')" }}></div>
                            <div>
                                <p className="text-primary font-mono font-bold text-lg">KAMAU M.</p>
                                <p className="text-slate-400 text-sm">Purchased Toyota Prado, Mombasa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories / Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-card-dark rounded-lg p-6 border border-secondary/20">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Reliability</p>
                        <p className="text-secondary font-mono text-xl font-bold">4.9<span className="text-slate-500 text-sm">/5</span></p>
                    </div>
                    <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[98%] shadow-[0_0_10px_rgba(38,198,218,0.5)]"></div>
                    </div>
                </div>
                <div className="bg-card-dark rounded-lg p-6 border border-secondary/20">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Performance</p>
                        <p className="text-secondary font-mono text-xl font-bold">4.8<span className="text-slate-500 text-sm">/5</span></p>
                    </div>
                    <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[96%] shadow-[0_0_10px_rgba(38,198,218,0.5)]"></div>
                    </div>
                </div>
                <div className="bg-card-dark rounded-lg p-6 border border-secondary/20">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Service</p>
                        <p className="text-secondary font-mono text-xl font-bold">4.9<span className="text-slate-500 text-sm">/5</span></p>
                    </div>
                    <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[98%] shadow-[0_0_10px_rgba(38,198,218,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Review Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-16">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="ui-card break-inside-avoid bg-surface-dark bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-secondary/10 hover:border-primary/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-1 text-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined text-lg ${i < review.rating ? '' : 'opacity-30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <span className="text-xs text-slate-500 font-mono">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-slate-200 font-body mb-6 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                            <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 flex px-2 py-1 items-center justify-center rounded-full size-8 font-bold text-primary">
                                        {review.reviewer_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-mono text-sm font-bold uppercase">{review.reviewer_name}</p>
                                        {(review.vehicle_make || review.vehicle_model) && (
                                            <p className="text-xs text-slate-400">
                                                {review.vehicle_make} {review.vehicle_model}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-surface-dark rounded-xl border border-border-subtle">
                        <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">forum</span>
                        <h3 className="text-xl font-heading text-slate-300">No Reviews Yet</h3>
                        <p className="text-slate-500 mt-1 pb-4">Be the first to share your experience with Konastone Autos!</p>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="my-12 relative z-20">
                <ReviewForm />
            </div>
        </div>
    );
}
