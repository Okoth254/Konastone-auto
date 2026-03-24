import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function VehicleSpecsView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const [vehicleResult, imagesResult] = await Promise.all([
        supabase.from('vehicles').select('*').eq('id', id).single(),
        supabase.from('vehicle_images').select('public_url, is_main, sort_order').eq('vehicle_id', id).order('sort_order', { ascending: true }),
    ]);
    const vehicle = vehicleResult.data;
    const vehicleImages = imagesResult.data || [];

    if (!vehicle) {
        notFound();
    }

    // Resolve the best hero image from the fallback chain
    const heroImage = vehicleImages.find(i => i.is_main)?.public_url
        || vehicleImages[0]?.public_url
        || vehicle.main_image_url
        || (vehicle.folder_name ? `/images/inventory/${vehicle.folder_name}/1.jpeg` : null)
        || 'https://placehold.co/1600x900/1a1a1a/444444?text=No+Image';

    return (
        <div className="space-y-8 flex-1">
            {/* TopAppBar */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-admin-surface/80 backdrop-blur-md border-b border-primary-container/20">
                <div className="flex items-center gap-8">
                    <Link href="/admin/vehicles" className="material-symbols-outlined text-zinc-400 hover:text-amber-400">arrow_back</Link>
                    <span className="text-primary font-bold uppercase tracking-widest text-xs md:text-base">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                    <nav className="hidden md:flex gap-6">
                        <span className="text-primary border-b-2 border-primary pb-1 uppercase tracking-widest text-xs font-bold cursor-pointer">Vehicle Details</span>
                        <span className="text-neutral-400 hover:text-primary transition-all duration-150 ease-linear uppercase tracking-widest text-xs font-bold cursor-pointer">History</span>
                        <span className="text-neutral-400 hover:text-primary transition-all duration-150 ease-linear uppercase tracking-widest text-xs font-bold cursor-pointer">Telemetry</span>
                    </nav>
                </div>
                <div className="items-center gap-4 hidden sm:flex">
                    <span className="material-symbols-outlined text-neutral-400 cursor-pointer hover:text-primary transition-colors">print</span>
                    <span className="material-symbols-outlined text-neutral-400 cursor-pointer hover:text-primary transition-colors">share</span>
                    <span className="material-symbols-outlined text-neutral-400 cursor-pointer hover:text-primary transition-colors">more_vert</span>
                </div>
            </header>

            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="relative h-[450px] w-full overflow-hidden bg-surface-dark border border-zinc-800">
                    <Image fill className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" src={heroImage} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                    <div className="absolute inset-0 bg-linear-to-r from-admin-background via-admin-background/40 to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-12 space-y-4 w-full pr-12">
                        <div className="inline-block bg-primary text-black px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
                            {vehicle.status.replace('_', ' ')} / SPEC-ID: {vehicle.id.substring(0, 8)}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                            {vehicle.year} {vehicle.make} <br /> {vehicle.model}
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href={`/admin/vehicles/edit/${vehicle.id}`} className="bg-primary text-black px-8 py-3 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,193,7,0.4)] text-center text-xs">
                                Edit in Manager
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Technical Specs Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Engine */}
                    <div className="bg-[#252525] p-6 border border-zinc-800 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-primary uppercase tracking-widest text-xs">ENGINE & PERFORMANCE</h3>
                            <span className="material-symbols-outlined text-primary">bolt</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Displacement / Type</p>
                                <p className="text-xl font-black text-white uppercase">{vehicle.engine_type || 'N/A'}</p>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Power</p>
                                    <p className="text-lg font-black text-white uppercase">{vehicle.power || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Torque</p>
                                    <p className="text-lg font-black text-white uppercase">{vehicle.torque || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Transmission */}
                    <div className="bg-[#252525] p-6 border border-zinc-800 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-primary uppercase tracking-widest text-xs">TRANSMISSION & DRIVETRAIN</h3>
                            <span className="material-symbols-outlined text-primary">settings_input_component</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Gearbox</p>
                                <p className="text-xl font-black text-white uppercase">{vehicle.transmission || 'N/A'}</p>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Drive</p>
                                    <p className="text-lg font-black text-white uppercase">{vehicle.drivetrain || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Mileage</p>
                                    <p className="text-lg font-black text-white uppercase">{vehicle.mileage ? `${Intl.NumberFormat('en-US').format(vehicle.mileage)} MI` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Dimensions & Details */}
                    <div className="bg-[#252525] p-6 border border-zinc-800 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-primary uppercase tracking-widest text-xs">DIMENSIONS & DETAILS</h3>
                            <span className="material-symbols-outlined text-primary">square_foot</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Exterior Color</p>
                                    <p className="text-lg font-black text-white uppercase">{vehicle.exterior_color || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Interior Color</p>
                                    <p className="text-lg font-black text-white uppercase">{vehicle.interior_color || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Price</p>
                                <p className="text-xl font-black text-white uppercase">KSH {vehicle.price ? Intl.NumberFormat('en-KE').format(vehicle.price) : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Features */}
                    <div className="bg-[#252525] p-6 border border-zinc-800 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-primary uppercase tracking-widest text-xs">FEATURES & TECH</h3>
                            <span className="material-symbols-outlined text-primary">memory</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {vehicle.tags && vehicle.tags.length > 0 ? (
                                vehicle.tags.slice(0, 4).map((tag: string, index: number) => (
                                    <div key={index} className="bg-admin-background p-2 text-center border border-zinc-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                        <p className="text-[8px] text-white uppercase leading-tight font-bold">{tag}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center text-xs text-zinc-500 py-4">No tags specified</div>
                            )}
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-800">
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified</span> SYSTEM ONLINE
                            </p>
                        </div>
                    </div>
                </section>

                {/* Detailed Specification Table */}
                <section className="bg-[#252525] overflow-hidden border border-zinc-800">
                    <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-surface-container-high">
                        <h2 className="font-black text-xl tracking-tighter uppercase text-white">Technical Identification Matrix</h2>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <span className="material-symbols-outlined text-sm">database</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">DB_REF: 2022_LC78_V8</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-admin-background text-primary text-[10px] tracking-[0.2em] uppercase font-bold">
                                    <th className="px-8 py-5 border-b border-zinc-800">Parameter</th>
                                    <th className="px-8 py-5 border-b border-zinc-800">Value</th>
                                    <th className="px-8 py-5 border-b border-zinc-800 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="hover:bg-primary/5 transition-colors border-b border-zinc-800">
                                    <td className="px-8 py-5 text-neutral-400 uppercase font-bold text-xs">VIN Number</td>
                                    <td className="px-8 py-5 text-white font-mono tracking-wider">{vehicle.vin || 'N/A'}</td>
                                    <td className="px-8 py-5 text-right"><span className="inline-block w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#FFC107]"></span></td>
                                </tr>
                                <tr className="bg-admin-background/30 hover:bg-primary/5 transition-colors border-b border-zinc-800">
                                    <td className="px-8 py-5 text-neutral-400 uppercase font-bold text-xs">Grade / Condition</td>
                                    <td className="px-8 py-5 text-white font-mono tracking-wider">{vehicle.condition || 'N/A'}</td>
                                    <td className="px-8 py-5 text-right"><span className="inline-block w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#FFC107]"></span></td>
                                </tr>
                                <tr className="hover:bg-primary/5 transition-colors border-b border-zinc-800">
                                    <td className="px-8 py-5 text-neutral-400 uppercase font-bold text-xs">Body Style</td>
                                    <td className="px-8 py-5 text-white font-mono tracking-wider">{vehicle.body_style || 'N/A'}</td>
                                    <td className="px-8 py-5 text-right"><span className="inline-block w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#FFC107]"></span></td>
                                </tr>
                                <tr className="bg-admin-background/30 hover:bg-primary/5 transition-colors border-b border-zinc-800">
                                    <td className="px-8 py-5 text-neutral-400 uppercase font-bold text-xs">Fuel System</td>
                                    <td className="px-8 py-5 text-white uppercase font-bold text-xs">Common Rail Direct Injection</td>
                                    <td className="px-8 py-5 text-right"><span className="inline-block w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#FFC107]"></span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
