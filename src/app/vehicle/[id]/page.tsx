import { vehicles } from "@/lib/data";
import { MediaGallery } from "@/components/vehicle/MediaGallery";
import { HPCalculator } from "@/components/vehicle/HPCalculator";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, Shield, TrendingUp } from "lucide-react";
import { BookingForm } from "@/components/forms/BookingForm";

export default function VehicleDetailPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: { mode?: string };
}) {
    const vehicle = vehicles.find((v) => v.id === params.id);
    const mode = searchParams.mode === "buy" ? "buy" : "hire";

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <p className="font-heading text-4xl uppercase text-[#3D3D3D]">Vehicle not found</p>
            </div>
        );
    }

    const isHire = mode === "hire";

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n).replace(".00", "");

    return (
        <div className="min-h-screen bg-[#1A1A1A] pb-20">

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
                            <div className="space-y-4 font-mono text-sm text-[#9CA3AF] leading-relaxed">
                                <h2 className="font-heading text-2xl uppercase text-[#F5F5F5]">Vehicle Overview</h2>
                                <p>
                                    Experience the pinnacle of automotive engineering with this {vehicle.year} {vehicle.make} {vehicle.model}.
                                    Meticulously maintained and offering a perfect balance of performance and comfort, this vehicle represents
                                    a smart investment for the discerning driver.
                                </p>
                                <p>
                                    Highlighted features include premium interior finishes, advanced safety systems, and a responsive {vehicle.fuelType} engine
                                    that delivers efficiency without compromise.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Sidebar ── */}
                    <div className="lg:col-span-4 space-y-6 relative">
                        <div className="sticky top-24 space-y-6">

                            {/* Mode Switcher */}
                            <div className="flex bg-[#0D0D0D] border border-[#2D2D2D] p-0.5">
                                <button className={cn(
                                    "flex-1 py-2.5 font-heading uppercase text-sm tracking-widest transition-all",
                                    isHire ? "bg-[#FFC107] text-black" : "text-[#4B5563] hover:text-[#9CA3AF]"
                                )}>
                                    Hire Purchase
                                </button>
                                <button className={cn(
                                    "flex-1 py-2.5 font-heading uppercase text-sm tracking-widest transition-all",
                                    !isHire ? "bg-[#E53935] text-white" : "text-[#4B5563] hover:text-[#9CA3AF]"
                                )}>
                                    Direct Buy
                                </button>
                            </div>

                            {isHire ? (
                                vehicle.hirePurchaseAvailable ? (
                                    <>
                                        <HPCalculator vehicle={vehicle} />
                                        {/* Promise card */}
                                        <div className="bg-[#111111] border border-[#FFC107]/20 p-5">
                                            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#6B7280] mb-4">Konastone Promise</h4>
                                            <ul className="space-y-3 font-mono text-xs text-[#9CA3AF]">
                                                <li className="flex gap-3"><Check className="w-4 h-4 text-[#26C6DA] flex-shrink-0" /> Comprehensive Insurance</li>
                                                <li className="flex gap-3"><Check className="w-4 h-4 text-[#26C6DA] flex-shrink-0" /> Real-time Tracking</li>
                                                <li className="flex gap-3"><Check className="w-4 h-4 text-[#26C6DA] flex-shrink-0" /> 12-Month Warranty</li>
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-[#111111] border border-dashed border-[#2D2D2D] p-8 text-center">
                                        <p className="font-mono text-sm text-[#4B5563] uppercase tracking-widest mb-4">Finance Unavailable</p>
                                        <Button variant="outline" className="w-full">View Direct Purchase</Button>
                                    </div>
                                )
                            ) : (
                                /* Direct Buy */
                                <div className="bg-[#1E1E1E] border border-[#2D2D2D] p-6 space-y-6">
                                    <div>
                                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Cash Price</p>
                                        <p className="font-slab text-4xl font-bold text-[#E53935] tabular-nums tracking-tight">
                                            {formatCurrency(vehicle.price)}
                                        </p>
                                    </div>

                                    <BookingForm
                                        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                        vehicleId={vehicle.id}
                                    />

                                    <div className="pt-4 border-t border-[#2D2D2D] space-y-3 font-mono text-xs text-[#6B7280]">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-[#26C6DA]" /> Verified Clean Title
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <TrendingUp className="w-4 h-4 text-[#FFC107]" /> Competitive Market Value
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
