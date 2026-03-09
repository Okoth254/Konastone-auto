import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/vehicle/ImageGallery";
import FinanceCalculator from "@/components/vehicle/FinanceCalculator";
import LeadForm from "@/components/vehicle/LeadForm";
import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    // Fetch vehicle
    const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

    if (error || !vehicle) {
        notFound();
    }

    // Fetch features
    const { data: features } = await supabase
        .from('vehicle_features')
        .select('*')
        .eq('vehicle_id', resolvedParams.id);

    // Fetch similar vehicles
    const { data: similarVehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('body_type', vehicle.body_type)
        .neq('id', vehicle.id)
        .limit(3);

    // Get images from public folder
    let images: string[] = [];
    try {
        const directoryPath = path.join(process.cwd(), 'public', 'images', 'inventory', vehicle.folder_name);
        if (fs.existsSync(directoryPath)) {
            const files = fs.readdirSync(directoryPath);
            // Sort to ensure 1.jpeg is first
            const sortedFiles = files.sort((a, b) => {
                const numA = parseInt(a.split('.')[0]);
                const numB = parseInt(b.split('.')[0]);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return a.localeCompare(b);
            });
            images = sortedFiles.map(file => `/images/inventory/${vehicle.folder_name}/${file}`);
        } else {
            images = ['/placeholder.jpg'];
        }
    } catch (e) {
        console.error("Error reading image directory:", e);
        images = ['/placeholder.jpg'];
    }

    const formatPrice = (price: number) => {
        if (price >= 1000000) return `KES ${(price / 1000000).toFixed(2)}M`;
        return `KES ${price.toLocaleString()}`;
    };

    const whatsappMessage = encodeURIComponent(`Hi Konastone! I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} going for ${formatPrice(vehicle.price)}. Is it still available?`);
    const whatsappLink = `https://wa.me/${siteConfig.contact.phoneFormatted}?text=${whatsappMessage}`;

    return (
        <div className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 gap-8 relative z-10 scanline">
            <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
                <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/inventory">Listings</Link>
                <span>/</span>
                <span className="text-slate-300">{vehicle.make} {vehicle.model}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <ImageGallery images={images} />

                <div className="lg:col-span-4 bg-surface-dark rounded-xl p-6 flex flex-col gap-6 border border-border-subtle">
                    <div>
                        {vehicle.is_featured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-primary/20 text-primary mb-3">
                                <span className="material-symbols-outlined text-[14px] text-primary">new_releases</span>
                                NEW ARRIVAL
                            </span>
                        )}
                        <h2 className="text-4xl font-heading tracking-wide mb-2 text-slate-100 uppercase">{vehicle.make} {vehicle.model}</h2>
                        <p className="text-3xl font-heading text-primary tracking-wide">{formatPrice(vehicle.price)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6">
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">calendar_month</span>
                            <div>
                                <p className="text-xs text-slate-400">Year</p>
                                <p className="font-medium text-slate-200">{vehicle.year}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">speed</span>
                            <div>
                                <p className="text-xs text-slate-400">Mileage</p>
                                <p className="font-medium text-slate-200">{vehicle.mileage.toLocaleString()} km</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">settings</span>
                            <div>
                                <p className="text-xs text-slate-400">Transmission</p>
                                <p className="font-medium text-slate-200 capitalize">{vehicle.transmission}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">local_gas_station</span>
                            <div>
                                <p className="text-xs text-slate-400">Fuel Type</p>
                                <p className="font-medium text-slate-200 uppercase">{vehicle.fuel_type}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto pt-4">
                        <a href={`tel:${siteConfig.contact.phoneFormatted}`} className="w-full flex items-center justify-center gap-2 rounded-full h-12 bg-accent-red text-white font-bold shadow-lg hover:bg-opacity-80 transition-colors">
                            <span className="material-symbols-outlined text-white">call</span>
                            Call Now
                        </a>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 rounded-full h-12 bg-primary text-background-dark font-bold shadow-lg hover:bg-yellow-500 transition-colors">
                            <span className="material-symbols-outlined text-background-dark">chat</span>
                            WhatsApp
                        </a>
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-full h-10 border border-border-subtle hover:bg-border-subtle transition-colors text-sm font-medium text-slate-300">
                                <span className="material-symbols-outlined text-[18px] text-accent-teal">favorite_border</span>
                                Save
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-full h-10 border border-border-subtle hover:bg-border-subtle transition-colors text-sm font-medium text-slate-300">
                                <span className="material-symbols-outlined text-[18px] text-accent-teal">compare_arrows</span>
                                Compare
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-[#1E1E1E] rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border border-border-subtle">
                        {siteConfig.promises.map((promise, index) => (
                            <div key={promise.id} className={`flex flex-col items-center text-center gap-2 ${index > 0 ? "border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0" : ""}`}>
                                <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center text-primary mb-2 border border-border-subtle">
                                    <span className="material-symbols-outlined text-primary">{promise.icon}</span>
                                </div>
                                <h4 className="font-bold text-sm text-slate-200">{promise.title}</h4>
                                <p className="text-xs text-slate-400">{promise.description}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading tracking-wide mb-4 flex items-center gap-2 text-slate-100">
                            <span className="material-symbols-outlined text-accent-teal">tune</span> Technical Specifications
                        </h3>
                        <div className="border border-border-subtle rounded-xl overflow-hidden text-sm">
                            <div className="grid grid-cols-2 bg-surface-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Make</div>
                                <div className="font-medium text-right text-slate-200">{vehicle.make}</div>
                            </div>
                            <div className="grid grid-cols-2 bg-background-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Model</div>
                                <div className="font-medium text-right text-slate-200">{vehicle.model}</div>
                            </div>
                            <div className="grid grid-cols-2 bg-surface-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Body Type</div>
                                <div className="font-medium text-right text-slate-200">{vehicle.body_type || 'N/A'}</div>
                            </div>
                            <div className="grid grid-cols-2 bg-background-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Color</div>
                                <div className="font-medium text-right text-slate-200">{vehicle.color || 'N/A'}</div>
                            </div>
                            <div className="grid grid-cols-2 bg-surface-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Drive Type</div>
                                <div className="font-medium text-right text-slate-200 uppercase">{vehicle.drive_type || '2WD'}</div>
                            </div>
                            <div className="grid grid-cols-2 bg-background-dark p-3">
                                <div className="text-slate-400">Condition Status</div>
                                <div className="font-medium text-right text-slate-200 capitalize">{vehicle.status.replace("_", " ")}</div>
                            </div>
                        </div>
                    </div>

                    {features && features.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-heading tracking-wide mb-4 flex items-center gap-2 text-slate-100">
                                <span className="material-symbols-outlined text-accent-teal">star</span> Premium Features
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {features.map(feature => (
                                    <span key={feature.id} className="px-3 py-1 rounded-full bg-surface-dark border border-border-subtle text-slate-300 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-accent-teal">check</span>
                                        {feature.feature_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <FinanceCalculator price={vehicle.price} />

                    <LeadForm vehicleId={vehicle.id} />
                </div>
            </div>

            {similarVehicles && similarVehicles.length > 0 && (
                <div className="mt-8 border-t border-border-subtle pt-8">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-2xl font-heading tracking-wide text-slate-100">Similar Premium Vehicles</h3>
                        <Link className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center" href="/inventory">View all <span className="material-symbols-outlined text-[16px]">chevron_right</span></Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {similarVehicles.map(sim => (
                            <Link href={`/vehicle/${sim.id}`} key={sim.id} className="bg-surface-dark rounded-xl overflow-hidden group cursor-pointer border border-border-subtle hover:border-primary/50 transition-all">
                                <div className="aspect-[3/2] overflow-hidden relative">
                                    <img
                                        alt={`${sim.make} ${sim.model}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        src={`/images/inventory/${sim.folder_name}/1.jpeg`}
                                        onError={(e) => { e.currentTarget.src = "/placeholder.jpg" }}
                                    />
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dark/90 backdrop-blur rounded text-xs font-bold text-primary border border-border-subtle">
                                        {formatPrice(sim.price)}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-slate-400 mb-1">{sim.year} • {(sim.mileage / 1000).toFixed(0)}k km • {sim.transmission}</p>
                                    <h4 className="font-bold text-lg text-slate-200 group-hover:text-primary transition-colors">{sim.make} {sim.model}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
