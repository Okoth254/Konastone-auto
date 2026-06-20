import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import VehicleForm from "./VehicleForm";

export default async function VehicleEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    let vehicle = null;
    let existingImages: { id: string; public_url: string; is_main: boolean; sort_order: number }[] = [];
    
    if (id !== 'new') {
        const supabase = await createClient();
        const [vehicleResult, imagesResult] = await Promise.all([
            supabase.from('vehicles').select('*').eq('id', id).single(),
            supabase.from('vehicle_images').select('*').eq('vehicle_id', id).order('sort_order', { ascending: true }),
        ]);
            
        if (vehicleResult.error || !vehicleResult.data) {
            notFound();
        }
        vehicle = vehicleResult.data;
        existingImages = imagesResult.data || [];
    }

    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-background-dark p-6 sm:p-10">
                    <div className="h-14 max-w-3xl rounded-2xl bg-white/5 animate-pulse" />
                    <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-8 h-96 rounded-[1.5rem] bg-white/5 animate-pulse" />
                        <div className="xl:col-span-4 h-96 rounded-[1.5rem] bg-white/5 animate-pulse" />
                    </div>
                </div>
            }
        >
            <VehicleForm vehicle={vehicle} vehicleId={id} existingImages={existingImages} />
        </Suspense>
    );
}
