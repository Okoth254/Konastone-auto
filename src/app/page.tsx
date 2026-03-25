import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/database";
import { siteConfig } from "@/config/site";
import AnimatedCounter from "@/components/home/AnimatedCounter";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import HeroSection from "@/components/home/HeroSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";

export const metadata: Metadata = {
  title: 'Premium Car Dealership in Mombasa, Kenya',
  description: 'Konastone Autos — Mombasa\'s premier car showroom. Shop quality SUVs, sedans & hybrids. Hire purchase & bank finance available.',
  alternates: { canonical: 'https://konastoneautos.com' },
};

export const revalidate = 3600; // Revalidate every hour for ISR

export default async function Home() {
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let featuredVehicles: Vehicle[] = [];
    let uniqueMakes: string[] = [];
    let featuredError: string | null = null;
    let makesError: string | null = null;

    if (isSupabaseConfigured) {
        try {
            const { data: featuredData, error: featuredErr } = await supabase
                .from('vehicles')
                .select('*')
                .eq('is_featured', true)
                .limit(3);

            if (featuredErr) {
                featuredError = 'Failed to load featured vehicles';
                console.error('Featured vehicles error:', featuredErr);
            } else if (featuredData) {
                featuredVehicles = featuredData;
            }
        } catch (err) {
            featuredError = 'Network error loading featured vehicles';
            console.error('Featured vehicles fetch error:', err);
        }

        try {
            const { data: makesData, error: makesErr } = await supabase
                .from('vehicles')
                .select('make');

            if (makesErr) {
                makesError = 'Failed to load vehicle brands';
                console.error('Makes error:', makesErr);
            } else if (makesData) {
                uniqueMakes = Array.from(new Set(makesData.map(v => v.make)));
            }
        } catch (err) {
            makesError = 'Network error loading vehicle brands';
            console.error('Makes fetch error:', err);
        }
    }

    const brandLogoMap: Record<string, { src: string, alt: string }> = {
        'Toyota': { src: "/images/brands/toyota.svg", alt: "Toyota Logo" },
        'Mercedes-Benz': { src: "/images/brands/mercedes-benz.svg", alt: "Mercedes Logo" },
        'BMW': { src: "/images/brands/bmw.svg", alt: "BMW Logo" },
        'Porsche': { src: "/images/brands/porsche.svg", alt: "Porsche Logo" },
        'Nissan': { src: "/images/brands/nissan.svg", alt: "Nissan Logo" },
        'Audi': { src: "/images/brands/audi.svg", alt: "Audi Logo" },
        'Mazda': { src: "/images/brands/mazda.svg", alt: "Mazda Logo" },
        'Subaru': { src: "/images/brands/subaru.svg", alt: "Subaru Logo" },
        'Honda': { src: "/images/brands/honda.svg", alt: "Honda Logo" },
        'Land Rover': { src: "/images/brands/land rover.svg", alt: "Land Rover Logo" },
        'Volvo': { src: "/images/brands/volvo.svg", alt: "Volvo Logo" },
    };

    return (
        <div className="overflow-hidden">
            {/* New Cinematic Hero Section */}
            <HeroSection />

            {/* Browse By Brand section */}
            <section className="section-pad relative bg-[#1A1A1A] overflow-hidden animate-scroll-reveal">
                <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
                <div className="page-shell relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-5xl text-primary tracking-widest mb-2">BROWSE BY BRAND</h2>
                        <p className="text-gray-400 font-body text-lg">Select from our curated collection of premium automotive brands</p>
                    </div>
                    {makesError ? (
                        <div className="text-gray-500 text-center py-8">
                            <span className="material-symbols-outlined text-4xl mb-2">error</span>
                            <p>Unable to load brands at the moment.</p>
                        </div>
                    ) : uniqueMakes.length > 0 ? (
                        <BrandCarousel makes={uniqueMakes} brandLogoMap={brandLogoMap} />
                    ) : (
                        <div className="text-gray-500 text-center">No brands available at the moment.</div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-50 dark:bg-[#151515] py-12 md:py-14 border-y border-gray-200 dark:border-gray-800 transition-colors duration-300 animate-scroll-reveal">
                <div className="page-shell">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                        {siteConfig.stats.map((stat, idx) => (
                            <div key={idx} className={`flex flex-col items-center ${idx === 4 ? "col-span-2 md:col-span-1" : ""}`}>
                                <span className="material-icons text-secondary text-5xl mb-3">{stat.icon}</span>
                                <h3 className="font-display text-2xl text-gray-900 dark:text-white">
                                    <AnimatedCounter text={stat.value} />
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Listings Section - New Premium Cards */}
            <FeaturedVehicles 
                vehicles={featuredVehicles}
                isSupabaseConfigured={!!isSupabaseConfigured}
                featuredError={featuredError}
            />

            {/* Why Choose Konastone */}
            <section className="section-pad bg-gray-100 dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 animate-scroll-reveal">
                <div className="page-shell">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-5xl text-gray-900 dark:text-white tracking-wide">WHY CHOOSE KONASTONE</h2>
                        <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="ui-card bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">local_offer</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">COMPETITIVE PRICES</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">We offer the best market rates for premium vehicles, ensuring you get maximum value for your investment.</p>
                        </div>
                        <div className="ui-card bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">bolt</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">FAST PAYMENT</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Selling to us? Experience instant payment processing once the valuation and paperwork are complete.</p>
                        </div>
                        <div className="ui-card bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">verified_user</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">QUALITY ASSURED</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Every vehicle undergoes a rigorous multi-point inspection by our certified mechanics before listing.</p>
                        </div>
                        <div className="ui-card bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">support_agent</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">EXPERT SUPPORT</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Our dedicated team guides you through the entire process, from selection to financing and registration.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}