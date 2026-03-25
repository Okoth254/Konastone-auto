import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/database";
import HeroSearchForm from "@/components/home/HeroSearchForm";
import { siteConfig } from "@/config/site";
import VehicleImage from "@/components/inventory/VehicleImage";
import AnimatedCounter from "@/components/home/AnimatedCounter";

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
        <>
            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row min-h-[600px]">
                <div className="lg:w-[60%] relative overflow-hidden h-[400px] lg:h-auto">
                    <Image
                        alt="Luxury car at dusk in Mombasa"
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGekMr5-7ufq0mbhw8Rz5pUC4s_zGTAU5B6kLOMtwml1JQHbNGylFtnBk7phUFQilKEWEuvopoH26U7_iIfT0w83Z49NybdApRXTQX_CDJyDNq1cQQdlQyPVUt3PmVrCPUy6ckHebYzftqzF0lAW6w65ltuIR1pNT1gEJNEn0KSO1oKy7VWzS2BVz_OxP2pzFNlPL-av0NGyaFXKED5tj1WIvqYi84RUUH1SAk1Sgw8t5xRP4DulOQXWGaESmKlgmuXOJ9tTUMmNVc"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-black/80 to-transparent flex items-end lg:items-center p-8 lg:p-16">
                        <h1 className="font-display text-6xl lg:text-8xl text-white leading-none tracking-tight drop-shadow-lg">
                            DRIVE YOUR<br />
                            <span className="text-primary">DREAM.</span><br />
                            OWN IT TODAY.
                        </h1>
                    </div>
                </div>
                <div className="lg:w-[40%] bg-gray-100 dark:bg-surface-dark p-8 lg:p-12 flex flex-col justify-center border-l border-gray-200 dark:border-gray-800 transition-colors duration-300">
                    <h2 className="font-display text-4xl mb-6 text-gray-900 dark:text-white tracking-wide">Find Your Perfect Car</h2>
                    <HeroSearchForm />
                </div>
            </section>

            {/* Browse By Brand section */}
            <section className="relative bg-[#1A1A1A] py-16 overflow-hidden animate-scroll-reveal" >
                <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-5xl text-primary tracking-widest mb-2">BROWSE BY BRAND</h2>
                        <p className="text-gray-400 font-body text-lg">Select from our curated collection of premium automotive brands</p>
                    </div>
                    <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-6 gap-6 md:justify-items-center snap-x snap-mandatory scrollbar-hide">
                        {makesError ? (
                            <div className="col-span-full text-gray-500 text-center py-8">
                                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                                <p>Unable to load brands at the moment.</p>
                            </div>
                        ) : uniqueMakes.length > 0 ? uniqueMakes.map((make, idx) => {
                            const brandInfo = brandLogoMap[make];
                            return (
                                <Link key={idx} className="shrink-0 snap-center group glass-dark rounded-2xl w-32 h-32 flex flex-col items-center justify-center border border-transparent hover:border-secondary transition-all duration-300 shadow-lg" href={`/inventory?make=${make.toLowerCase()}`}>
                                    {brandInfo ? (
                                        <Image alt={brandInfo.alt} className="w-16 h-16 object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300" src={brandInfo.src} width={64} height={64} />
                                    ) : (
                                        <span className="text-white font-display text-xl uppercase opacity-60 group-hover:opacity-100 transition-opacity">{make}</span>
                                    )}
                                </Link>
                            );
                        }) : (
                            <div className="col-span-full text-gray-500">No brands available at the moment.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-50 dark:bg-[#151515] py-12 border-y border-gray-200 dark:border-gray-800 transition-colors duration-300 animate-scroll-reveal" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Featured Listings Section */}
            <section className="py-20 bg-white dark:bg-background-dark transition-colors duration-300 animate-scroll-reveal" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-display text-5xl text-gray-900 dark:text-white tracking-wide">FEATURED LISTINGS</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Premium hand-picked vehicles ready for immediate delivery.</p>
                        </div>
                        <Link className="hidden md:flex items-center px-6 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary hover:text-background-dark btn-sweep font-medium uppercase tracking-wider transition-colors" href="/inventory">
                            View Inventory <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {!isSupabaseConfigured && (
                            <div className="col-span-full border border-yellow-500/50 bg-yellow-500/10 p-6 rounded-lg text-yellow-500 text-center flex flex-col items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-4xl">warning</span>
                                <h3 className="text-xl font-bold font-display uppercase tracking-wider">Database Not Configured</h3>
                                <p className="text-sm">Please provide Supabase credentials in <code>.env.local</code> to fetch live featured vehicles.</p>
                            </div>
                        )}

                        {isSupabaseConfigured && featuredError && (
                            <div className="col-span-full border border-red-500/50 bg-red-500/10 p-6 rounded-lg text-red-500 text-center flex flex-col items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-4xl">error</span>
                                <h3 className="text-xl font-bold font-display uppercase tracking-wider">Loading Error</h3>
                                <p className="text-sm">{featuredError}</p>
                            </div>
                        )}

                        {isSupabaseConfigured && !featuredError && featuredVehicles.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                                No featured vehicles found at the moment.
                            </div>
                        )}

                        {featuredVehicles.map((car) => {
                            const imagePath = `/images/inventory/${car.folder_name}/1.jpeg`;

                            return (
                                <div key={car.id} className="bg-gray-50 dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group">
                                    <div className="relative h-64 overflow-hidden bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                                        <VehicleImage src={imagePath} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {car.status === 'available' && (
                                            <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                                                Excellent
                                            </div>
                                        )}
                                        {car.status === 'in_transit' && (
                                            <div className="absolute top-4 left-4 bg-accent text-background-dark text-xs font-bold px-3 py-1 rounded uppercase tracking-wider animate-pulse-ring-accent">
                                                In Transit
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col h-full">
                                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">{car.year} {car.make} {car.model}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            <div className="flex items-center"><span className="material-icons text-[18px] mr-1">speed</span> {car.mileage.toLocaleString()} km</div>
                                            <div className="flex items-center"><span className="material-icons text-[18px] mr-1">local_gas_station</span> {car.fuel_type}</div>
                                            <div className="flex items-center"><span className="material-icons text-[18px] mr-1">settings</span> {car.transmission}</div>
                                        </div>
                                        <div className="flex items-end justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</p>
                                                <p className="font-display text-3xl text-primary">KES {car.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Link className="mt-4 flex items-center justify-center w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3 px-4 rounded font-medium transition-colors" href="#">
                                            <span className="material-icons mr-2">whatsapp</span> Inquire on WhatsApp
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex justify-center md:hidden">
                        <Link className="inline-flex items-center px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary hover:text-background-dark btn-sweep font-medium uppercase tracking-wider transition-colors" href="/inventory">
                            View Inventory <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Konastone */}
            <section className="py-20 bg-gray-100 dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 animate-scroll-reveal" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-5xl text-gray-900 dark:text-white tracking-wide">WHY CHOOSE KONASTONE</h2>
                        <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">local_offer</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">COMPETITIVE PRICES</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">We offer the best market rates for premium vehicles, ensuring you get maximum value for your investment.</p>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">bolt</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">FAST PAYMENT</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Selling to us? Experience instant payment processing once the valuation and paperwork are complete.</p>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">verified_user</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">QUALITY ASSURED</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Every vehicle undergoes a rigorous multi-point inspection by our certified mechanics before listing.</p>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-primary text-3xl">support_agent</span>
                            </div>
                            <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-3 tracking-wide">EXPERT SUPPORT</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Our dedicated team guides you through the entire process, from selection to financing and registration.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
