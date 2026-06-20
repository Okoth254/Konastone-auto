import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { siteConfig } from "@/config/site";
import VehicleDetailClient from "@/components/vehicle/VehicleDetailClient";
import { getSiteSettings } from "@/lib/site-settings";
import { getVehicleImageUrls } from "@/lib/vehicle-images";

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*, vehicle_images(public_url, is_main, sort_order)')
        .eq('id', id)
        .single();

    if (!vehicle) return { title: 'Vehicle Not Found | Konastone Autos' };
    const images = getVehicleImageUrls(vehicle);

    return {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Konastone Autos`,
        description: vehicle.description || `View details for the ${vehicle.year} ${vehicle.make} ${vehicle.model} at Konastone Autos. Premium vehicles with flexible financing options.`,
        openGraph: {
            images: [images[0]],
        },
    };
}

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch vehicle with all details
    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*, vehicle_images(public_url, is_main, sort_order)')
        .eq('id', id)
        .single();

    if (!vehicle) notFound();
    const images = getVehicleImageUrls(vehicle);
    const settings = await getSiteSettings();


    // Fetch features
    const { data: features } = await supabase
        .from('vehicle_features')
        .select('feature_name')
        .eq('vehicle_id', id);

    // Fetch similar vehicles
    const { data: similarVehicles } = await supabase
        .from('vehicles')
        .select('id, make, model, year, price, mileage, fuel_type, transmission, folder_name, main_image_url, status, is_featured, vehicle_images(public_url, is_main, sort_order)')
        .neq('id', id)
        .eq('make', vehicle.make)
        .limit(3);

    const whatsappMessage = encodeURIComponent(`Hi Konastone Autos, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.id})`);
    const whatsappLink = `https://wa.me/${settings.contact.phoneFormatted || siteConfig.contact.phoneFormatted}?text=${whatsappMessage}`;

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                description: vehicle.description,
                image: images[0],
                offers: {
                    '@type': 'Offer',
                    price: vehicle.price,
                    priceCurrency: 'KES',
                    availability: vehicle.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
                    seller: { '@type': 'Organization', name: 'Konastone Autos' },
                },
            }) }} />

            <VehicleDetailClient 
                vehicle={vehicle}
                features={features?.map(f => f.feature_name) || []}
                similarVehicles={similarVehicles || []}
                images={images}
                whatsappLink={whatsappLink}
                financeSettings={settings.finance}
                contactSettings={settings.contact}
            />
        </>
    );
}
