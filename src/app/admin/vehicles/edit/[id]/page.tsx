import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import VehicleForm from "./VehicleForm";

export default async function VehicleEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    let vehicle = null;
    
    if (id !== 'new') {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error || !data) {
            notFound();
        }
        vehicle = data;
    }

    return <VehicleForm vehicle={vehicle} vehicleId={id} />;
}
