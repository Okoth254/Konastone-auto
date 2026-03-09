import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/database";
import InventorySidebar from "@/components/inventory/InventorySidebar";

export default async function Inventory({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Check if Supabase keys are configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const resolvedParams = await searchParams;

    // Extract filters from search parameters
    const statusFilter = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';
    const makeFilter = typeof resolvedParams.make === 'string' ? resolvedParams.make : 'all';
    const modelFilter = typeof resolvedParams.model === 'string' ? resolvedParams.model : 'all';
    const minYearFilter = typeof resolvedParams.minYear === 'string' ? parseInt(resolvedParams.minYear) : 2010;
    const maxYearFilter = typeof resolvedParams.maxYear === 'string' ? parseInt(resolvedParams.maxYear) : 2025;
    const maxPriceFilter = typeof resolvedParams.maxPrice === 'string' ? parseInt(resolvedParams.maxPrice) : 15000000;

    let vehicles: Vehicle[] = [];

    if (isSupabaseConfigured) {
        let query = supabase
            .from('vehicles')
            .select('*')
            .gte('year', minYearFilter)
            .lte('year', maxYearFilter)
            .lte('price', maxPriceFilter)
            .order('created_at', { ascending: false });

        // Apply Status Filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'new') {
                query = query.eq('status', 'available').eq('is_featured', true);
            } else if (statusFilter === 'foreign') {
                query = query.eq('status', 'available').eq('is_featured', false); // Assuming not featured means foreign for this demo
            } else if (statusFilter === 'shipment') {
                query = query.eq('status', 'in_transit');
            }
        }

        // Apply Make Filter
        if (makeFilter !== 'all') {
            query = query.ilike('make', `%${makeFilter}%`);
        }

        // Apply Model Filter
        if (modelFilter !== 'all') {
            query = query.ilike('model', `%${modelFilter}%`);
        }

        const { data, error } = await query;

        if (!error && data) {
            vehicles = data;
        } else {
            console.error("Supabase Error:", error);
        }
    }

    return (
        <div className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-10 py-8 gap-8">
            {/* Page Title Area */}
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-6xl font-display leading-tight tracking-wider uppercase">VEHICLE INVENTORY</h1>
                <div className="inline-flex items-center">
                    <span className="text-accent text-sm font-bold tracking-widest px-3 py-1 bg-accent/10 border border-accent/30 rounded uppercase">{vehicles.length} VEHICLES AVAILABLE</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Dynamic Client Sidebar Component */}
                <InventorySidebar />

                {/* Grid Area */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">

                    {!isSupabaseConfigured && (
                        <div className="col-span-full border border-yellow-500/50 bg-yellow-500/10 p-6 rounded-lg text-yellow-500 text-center flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-4xl">warning</span>
                            <h3 className="text-xl font-bold font-display uppercase tracking-wider">Database Not Configured</h3>
                            <p className="text-sm">Please follow the implementation plan to set up Supabase and add the credentials to <code>.env.local</code>.</p>
                        </div>
                    )}

                    {vehicles.length === 0 && isSupabaseConfigured && (
                        <div className="col-span-full p-12 text-center text-slate-500 font-display text-xl uppercase tracking-wider border border-border-color border-dashed rounded-lg bg-card-bg/30">
                            No vehicles found matching those criteria.
                        </div>
                    )}

                    {vehicles.map((vehicle) => {
                        const isNewArrival = vehicle.status === 'available' && vehicle.is_featured;
                        const inTransit = vehicle.status === 'in_transit';
                        // Construct the image path based on the folder name
                        const imagePath = `/images/inventory/${vehicle.folder_name}/1.jpeg`;

                        return (
                            <div key={vehicle.id} className={`group bg-card-bg rounded-lg overflow-hidden ${isNewArrival ? 'border-t-4 border-primary border-x border-b border-border-color hover:border-primary/50' : inTransit ? 'border border-border-color hover:border-accent/50 relative' : 'border border-border-color hover:border-slate-400'} transition-all flex flex-col h-full shadow-lg`}>
                                {inTransit && <div className="absolute top-0 left-0 w-full h-1 bg-accent z-20"></div>}
                                <div className="relative aspect-[4/3] overflow-hidden bg-background-dark">
                                    <img alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${inTransit ? 'opacity-90' : ''}`} src={imagePath} onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }} />

                                    {inTransit && <div className="absolute inset-0 bg-background-dark/20 group-hover:bg-transparent transition-colors"></div>}

                                    {isNewArrival && (
                                        <div className="absolute top-3 left-3 bg-primary text-background-dark px-3 py-1 rounded text-grunge text-lg font-bold shadow-md">
                                            NEW ARRIVAL
                                        </div>
                                    )}
                                    {inTransit && (
                                        <>
                                            <div className="absolute top-3 left-3 bg-accent text-background-dark px-3 py-1 rounded font-display tracking-widest text-lg font-bold shadow-md uppercase">
                                                IN TRANSIT
                                            </div>
                                            <div className="absolute top-3 right-3 bg-background-dark/90 text-accent px-2 py-1 rounded font-mono text-xs font-bold border border-accent/30 shadow-md">
                                                ETA: 14 DAYS
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-1 gap-4">
                                    <div>
                                        <h3 className={`text-white font-display text-2xl tracking-wide uppercase line-clamp-1 group-hover:${inTransit ? 'text-accent' : isNewArrival ? 'text-primary' : 'text-white'} transition-colors`}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                                        <p className="text-slate-400 text-sm">{vehicle.body_type || 'Vehicle'} {vehicle.fuel_type}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 border-y border-border-color py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>speed</span>
                                            <span>{vehicle.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>local_gas_station</span>
                                            <span>{vehicle.fuel_type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>settings</span>
                                            <span>{vehicle.transmission}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[18px] ${inTransit ? 'text-accent/70' : isNewArrival ? 'text-primary/70' : 'text-slate-500'}`}>palette</span>
                                            <span>{vehicle.color || 'Standard'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-2 flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">{inTransit ? 'Landed Price' : 'Price'}</span>
                                            <span className={`${inTransit ? 'text-white' : 'text-primary'} font-display text-3xl tracking-wide`}>KES {vehicle.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Link href={`/vehicle/${vehicle.id}`} className="flex items-center justify-center flex-1 h-10 rounded border border-border-color hover:border-white text-white transition-colors text-sm font-medium uppercase tracking-wider">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
