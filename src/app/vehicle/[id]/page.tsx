import { getVehicles, getVehicleById } from "@/lib/data";
import { MediaGallery } from "@/components/vehicle/MediaGallery";
import { PaymentOptions } from "@/components/vehicle/PaymentOptions";
import { Check } from "lucide-react";

import { type Metadata } from "next";

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const vehicle = await getVehicleById(id);
    if (!vehicle) return { title: "Vehicle Not Found" };

    return {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} for Sale in Mombasa | Konastone Autos`,
        description: `Buy this ${vehicle.year} ${vehicle.make} ${vehicle.model} in Mombasa. Mileage: ${vehicle.mileage.toLocaleString()}km. Cash price: KES ${vehicle.price.toLocaleString()}. Hire purchase available.`,
        alternates: {
            canonical: `https://konastoneautos.com/vehicle/${vehicle.id}`,
        },
        openGraph: {
            images: [vehicle.images[0]],
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            description: `Mileage: ${vehicle.mileage.toLocaleString()}km | Price: KES ${vehicle.price.toLocaleString()}`,
        },
        twitter: {
            card: "summary_large_image",
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            description: `Cash price: KES ${vehicle.price.toLocaleString()}`,
            images: [vehicle.images[0]],
        },
    };
}

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const vehicle = await getVehicleById(id);

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <p className="font-heading text-4xl uppercase text-[#3D3D3D]">Vehicle not found</p>
            </div>
        );
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        "image": `https://konastoneautos.com${vehicle.images[0]}`,
        "description": `Premium ${vehicle.category} with ${vehicle.transmission} transmission and ${vehicle.fuelType} engine.`,
        "brand": {
            "@type": "Brand",
            "name": vehicle.make
        },
        "offers": {
            "@type": "Offer",
            "url": `https://konastoneautos.com/vehicle/${vehicle.id}`,
            "priceCurrency": "KES",
            "price": vehicle.price,
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "CarDealer",
                "name": "Konastone Autos"
            }
        }
    };

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n).replace(".00", "");

    return (
        <div className="min-h-screen bg-[#1A1A1A] pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <div className="bg-[#111111] border-b border-[#2D2D2D] py-4">
                <div className="container mx-auto px-4 font-mono text-[10px] text-[#4B5563] uppercase tracking-widest">
                    Inventory / {vehicle.make} / <span className="text-[#FFC107]">{vehicle.model}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ── Left: Media + Editorial ── */}
                    <div className="lg:col-span-8 space-y-12">
                        <MediaGallery vehicle={vehicle} />

                        <div className="space-y-8">
                            {/* Title */}
                            <div>
                                <h1 className="font-heading text-grunge text-5xl md:text-6xl uppercase text-[#F5F5F5] leading-tight">
                                    {vehicle.year} {vehicle.make}<br />
                                    <span className="text-[#FFC107]">{vehicle.model}</span>
                                </h1>

                                {/* Meta strip */}
                                <div className="flex flex-wrap gap-4 mt-6 border-y border-[#2D2D2D] py-5">
                                    {[
                                        { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km` },
                                        { label: "Type", value: vehicle.category },
                                        { label: "Gearbox", value: vehicle.transmission },
                                        { label: "Fuel", value: vehicle.fuelType },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center gap-2 bg-[#111111] border border-[#2D2D2D] px-3 py-2">
                                            <span className="font-mono text-[9px] text-[#4B5563] uppercase tracking-widest">{label}</span>
                                            <span className="font-mono text-xs text-[#D1D5DB] capitalize">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Editorial copy */}
                            <div className="space-y-8 font-mono text-sm text-[#9CA3AF] leading-relaxed">
                                <div>
                                    <h2 className="font-heading text-2xl uppercase text-[#F5F5F5] mb-4">Vehicle Overview</h2>
                                    <p>
                                        {vehicle.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-heading text-xl uppercase text-[#F5F5F5] mb-4">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                                        {vehicle.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-3">
                                                <Check className="w-4 h-4 text-[#FFC107] flex-shrink-0" />
                                                <span className="text-[#D1D5DB]">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Sidebar ── */}
                    <div className="lg:col-span-4 space-y-6 relative">
                        <div className="sticky top-24 space-y-6">

                            {/* Payment options — Cash / SACCO / Bank */}
                            <PaymentOptions vehicle={vehicle} />

                            {/* HP Calculator — available when hire purchase is eligible */}
                            {vehicle.hirePurchaseAvailable && (
                                <div className="bg-[#111111] border border-[#FFC107]/20 p-5">
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B7280] mb-3">Also Available</p>
                                    <h4 className="font-heading text-lg uppercase text-[#FFC107] mb-2">Hire Purchase</h4>
                                    <p className="font-mono text-xs text-[#9CA3AF] mb-4 leading-relaxed">
                                        Drive today, pay monthly. Flexible deposits and repayment terms tailored to your budget.
                                    </p>
                                    <ul className="space-y-3 font-mono text-xs text-[#9CA3AF]">
                                        <li className="flex gap-3"><Check className="w-4 h-4 text-[#26C6DA] flex-shrink-0" /> Comprehensive Insurance Included</li>
                                        <li className="flex gap-3"><Check className="w-4 h-4 text-[#26C6DA] flex-shrink-0" /> Real-time GPS Tracking</li>
                                        <li className="flex gap-3"><Check className="w-4 h-4 text-[#26C6DA] flex-shrink-0" /> 12-Month Warranty</li>
                                    </ul>
                                    <a
                                        href={`/vehicle/${vehicle.id}?tab=hp`}
                                        className="mt-4 block w-full py-3 text-center font-heading uppercase text-sm tracking-widest border border-[#FFC107]/40 text-[#FFC107] hover:bg-[#FFC107] hover:text-black transition-all"
                                    >
                                        View HP Calculator
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
