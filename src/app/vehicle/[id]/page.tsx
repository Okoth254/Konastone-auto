import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { siteConfig } from "@/config/site";
import VehicleDetailClient from "@/components/vehicle/VehicleDetailClient";

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

    if (!vehicle) return { title: 'Vehicle Not Found | Konastone Autos' };

    return {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Konastone Autos`,
        description: vehicle.description || `View details for the ${vehicle.year} ${vehicle.make} ${vehicle.model} at Konastone Autos. Premium vehicles with flexible financing options.`,
        openGraph: {
            images: [`/images/inventory/${vehicle.folder_name}/1.jpeg`],
        },
    };
}

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch vehicle with all details
    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

    if (!vehicle) notFound();


    // Build image list from local filesystem (numbered JPEGs in the vehicle's folder)
    const { readdirSync } = await import('fs');
    const { join } = await import('path');
    let images: string[] = [];
    try {
        const folderPath = join(process.cwd(), 'public', 'images', 'inventory', vehicle.folder_name);
        const files = readdirSync(folderPath)
            .filter((f: string) => /\.(jpe?g|png|webp)$/i.test(f))
            .sort((a: string, b: string) => {
                // Numeric sort: 1.jpeg, 2.jpeg, ... 10.jpeg (not 1, 10, 2)
                const numA = parseInt(a.replace(/\D/g, ''), 10);
                const numB = parseInt(b.replace(/\D/g, ''), 10);
                return numA - numB;
            });
        images = files.map((f: string) => `/images/inventory/${vehicle.folder_name}/${f}`);
    } catch {
        // folder doesn't exist yet — fallback to first image
    }

    if (images.length === 0) {
        images = [`/images/inventory/${vehicle.folder_name}/1.jpeg`];
    }


    // Fetch features
    const { data: features } = await supabase
        .from('vehicle_features')
        .select('feature_name')
        .eq('vehicle_id', id);

    // Fetch similar vehicles
    const { data: similarVehicles } = await supabase
        .from('vehicles')
        .select('id, make, model, year, price, mileage, fuel_type, transmission, folder_name, status, is_featured')
        .neq('id', id)
        .eq('make', vehicle.make)
        .limit(3);

    const whatsappMessage = encodeURIComponent(`Hi Konastone Autos, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.id})`);
    const whatsappLink = `https://wa.me/${siteConfig.contact.phoneFormatted}?text=${whatsappMessage}`;

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
            />
        </>
    );
}
