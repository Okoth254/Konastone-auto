import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/database";
import InventorySidebar from "@/components/inventory/InventorySidebar";
import { InventoryMotionGrid } from "@/components/inventory/InventoryMotionGrid";

export const metadata: Metadata = {
  title: 'Car Inventory — Browse All Vehicles',
  description: 'Browse our full inventory of quality used cars in Mombasa, Kenya. Filter by make, model, price & fuel type. Toyota, Mazda, Volvo, Subaru & more.',
  alternates: { canonical: 'https://konastoneautos.com/inventory' },
};

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
        <div className="page-shell flex-1 flex flex-col py-6 md:py-8 gap-6 md:gap-8">
            {/* Page Title Area */}
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-display leading-tight tracking-wider uppercase">VEHICLE INVENTORY</h1>
                <div className="inline-flex items-center">
                    <span className="text-accent text-sm font-bold tracking-widest px-3 py-1 bg-accent/10 border border-accent/30 rounded uppercase">{vehicles.length} VEHICLES AVAILABLE</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Dynamic Client Sidebar Component */}
                <InventorySidebar />

                <InventoryMotionGrid vehicles={vehicles} isSupabaseConfigured={!!isSupabaseConfigured} />
            </div>
        </div>
    );
}
