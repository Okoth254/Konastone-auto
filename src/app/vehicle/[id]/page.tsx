import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { siteConfig } from "@/config/site";
import VehicleDetailClient from "@/components/vehicle/VehicleDetailClient";

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const supabase = await createClient();
    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!vehicle) return { title: 'Vehicle Not Found' };

    return {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Konastone Autos`,
        description: vehicle.description || `View details for the ${vehicle.year} ${vehicle.make} ${vehicle.model} at Konastone Autos.`,
        openGraph: {
            images: [`/images/inventory/${vehicle.folder_name}/1.jpeg`],
        },
    };
}

export default async function VehicleDetail({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    
    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!vehicle) notFound();

    // Fetch additional images
    const { data: imagesData } = await supabase
        .from('vehicle_images')
        .select('public_url')
        .eq('vehicle_id', params.id)
        .order('id', { ascending: true });

    let images = imagesData?.map((img: { public_url: string }) => img.public_url) || [];
    
    if (images.length === 0) {
        images = [`/images/inventory/${vehicle.folder_name}/1.jpeg`];
    }

    // Fetch features
    const { data: features } = await supabase
        .from('vehicle_features')
        .select('*')
        .eq('vehicle_id', params.id);

    // Fetch similar vehicles
    const { data: similarVehicles } = await supabase
        .from('vehicles')
        .select('*')
        .neq('id', params.id)
        .eq('make', vehicle.make)
        .limit(3);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0
        }).format(price).replace('KES', 'Ksh');
    };

    const whatsappMessage = encodeURIComponent(`Hi Konastone Autos, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.id})`);
    const whatsappLink = `https://wa.me/${siteConfig.contact.phoneFormatted}?text=${whatsappMessage}`;

    return (
        <div className="bg-gray-50 dark:bg-[#151515] transition-colors duration-300 min-h-screen selection:bg-primary selection:text-background-dark">
            <div className="scanline" />
            
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
                features={features || []}
                similarVehicles={similarVehicles || []}
                images={images}
                whatsappLink={whatsappLink}
                formatPrice={formatPrice}
            />
        </div>
    );
}
