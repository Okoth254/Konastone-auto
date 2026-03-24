import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
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

    return <VehicleForm vehicle={vehicle} vehicleId={id} existingImages={existingImages} />;
}
