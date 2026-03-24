'use client';

import Link from "next/link";
import { saveVehicle, deleteVehicle } from "../../actions";
import { useState } from "react";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VehicleForm({ vehicle, vehicleId }: { vehicle: any, vehicleId: string }) {
    const isNew = vehicleId === 'new';
    const [status, setStatus] = useState(vehicle?.status || 'available');
    
    const deleteAction = deleteVehicle.bind(null, vehicleId);
    
    return (
        <form action={saveVehicle} className="flex flex-col min-h-full">
            <input type="hidden" name="id" value={vehicleId} />
            <input type="hidden" name="status" value={status} />
            
            {/* TopAppBar */}
            <header className="bg-admin-surface/80 backdrop-blur-xl border-b border-primary-container/20 flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/admin/vehicles" className="material-symbols-outlined text-zinc-500 cursor-pointer hover:text-amber-400 transition-colors">arrow_back</Link>
                    <h2 className="text-2xl font-black tracking-tighter text-amber-400 font-headline uppercase">{isNew ? 'New Vehicle' : 'Vehicle Editor'}</h2>
                </div>
                <div className="flex items-center gap-6">
                    <button type="submit" className="bg-primary-container text-on-primary-container px-6 py-2 font-headline font-bold text-xs tracking-widest hover:bg-primary-fixed-dim transition-colors cursor-pointer">
                        SAVE VEHICLE
                    </button>
                </div>
            </header>

            {/* Editor Content */}
            <div className="flex flex-1 p-8 gap-8 max-w-[1600px] mx-auto w-full flex-col xl:flex-row">
                {/* Left Column: Form Sections */}
                <div className="flex-1 space-y-8">
                    {/* Section: Basic Info */}
                    <section className="bg-surface-container p-6 border-l-2 border-admin-secondary">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-headline text-lg font-bold tracking-widest text-admin-secondary uppercase">01. BASIC INFO</h3>
                            {!isNew && <span className="text-[10px] font-mono text-zinc-500 tracking-tighter">REF_ID: {vehicleId.substring(0, 8)}</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Make</label>
                                <input name="make" required className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-medium focus:border-admin-primary transition-all text-white outline-none" type="text" defaultValue={vehicle?.make || ''} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Model</label>
                                <input name="model" required className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-medium focus:border-admin-primary transition-all text-white outline-none" type="text" defaultValue={vehicle?.model || ''} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Year</label>
                                <input name="year" required className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-medium focus:border-admin-primary transition-all text-white outline-none" type="number" defaultValue={vehicle?.year || new Date().getFullYear()} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">VIN Number</label>
                                <input name="vin" required className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-mono tracking-widest focus:border-admin-primary transition-all text-white outline-none" type="text" defaultValue={vehicle?.vin || ''} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Body Style</label>
                                <select name="body_style" className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-medium focus:border-admin-primary transition-all appearance-none cursor-pointer text-white outline-none" defaultValue={vehicle?.body_style || 'SUV'}>
                                    <option value="Coupe">Coupe</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Van">Van</option>
                                    <option value="Wagon">Wagon</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Exterior Color</label>
                                <input name="exterior_color" className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-medium focus:border-admin-primary transition-all text-white outline-none" type="text" defaultValue={vehicle?.exterior_color || ''} />
                            </div>
                        </div>
                    </section>
                    
                    {/* Section: Technical Specs */}
                    <section className="bg-surface-container p-6 border-l-2 border-admin-secondary">
                        <h3 className="font-headline text-lg font-bold tracking-widest text-admin-secondary mb-8 uppercase">02. Technical Specs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-surface-container-low p-4 space-y-2">
                                <label className="text-[9px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Engine Details</label>
                                <div className="flex items-baseline gap-2">
                                    <input name="engine_type" className="bg-transparent border-none p-0 w-full text-xl font-bold font-headline text-amber-400 outline-none" type="text" defaultValue={vehicle?.engine_type || ''} placeholder="e.g. 4.0L V8" />
                                </div>
                            </div>
                            <div className="bg-surface-container-low p-4 space-y-2">
                                <label className="text-[9px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Power</label>
                                <div className="flex items-baseline gap-2">
                                    <input name="power" className="bg-transparent border-none p-0 w-full text-xl font-bold font-headline text-amber-400 outline-none" type="text" defaultValue={vehicle?.power || ''} placeholder="e.g. 500 HP" />
                                </div>
                            </div>
                            <div className="bg-surface-container-low p-4 space-y-2">
                                <label className="text-[9px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Transmission</label>
                                <select name="transmission" className="bg-transparent border-none p-0 w-full text-lg font-bold font-headline text-amber-400 appearance-none cursor-pointer outline-none" defaultValue={vehicle?.transmission || 'Automatic'}>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Dual-Clutch">Dual-Clutch</option>
                                </select>
                            </div>
                            <div className="bg-surface-container-low p-4 space-y-2">
                                <label className="text-[9px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Drivetrain</label>
                                <select name="drivetrain" className="bg-transparent border-none p-0 w-full text-lg font-bold font-headline text-amber-400 appearance-none cursor-pointer outline-none" defaultValue={vehicle?.drivetrain || 'AWD'}>
                                    <option value="AWD">AWD</option>
                                    <option value="RWD">RWD</option>
                                    <option value="FWD">FWD</option>
                                    <option value="4WD">4WD</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    
                    {/* Section: Assets */}
                    <section className="bg-surface-container p-6 border-l-2 border-admin-secondary">
                        <h3 className="font-headline text-lg font-bold tracking-widest text-admin-secondary mb-8 uppercase">03. Assets & Media</h3>
                        <div className="flex flex-col gap-1 mb-4">
                            <label className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Main Image Upload</label>
                            <input name="image_file" type="file" accept="image/*" className="bg-surface-container-highest border-b border-zinc-700 py-3 px-4 text-sm font-medium focus:border-admin-primary transition-all text-white outline-none w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-amber-400 cursor-pointer" />
                            <input type="hidden" name="main_image_url" value={vehicle?.main_image_url || ''} />
                        </div>
                        {vehicle?.main_image_url && (
                            <div className="aspect-video w-64 bg-surface-container-low group relative overflow-hidden mb-4 border border-zinc-800">
                                <Image fill className="object-cover" src={vehicle.main_image_url} alt="Vehicle image preview" />
                            </div>
                        )}
                        <div className="bg-surface-container-low border border-zinc-800 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-amber-400">cloud_upload</span>
                                <p className="text-[11px] text-zinc-400 font-medium">Upload a high-quality image of the vehicle. It will be stored securely and optimized.</p>
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Right Column: Sidebar Status */}
                <aside className="w-full xl:w-80 shrink-0 space-y-6">
                    {/* Status Panel */}
                    <div className="bg-surface-container p-6 space-y-6">
                        <h4 className="font-headline font-bold text-xs tracking-widest text-zinc-500 uppercase">Publishing Status</h4>
                        <div className="space-y-4">
                            {/* Sold Toggle */}
                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setStatus(status === 'sold' ? 'available' : 'sold')}>
                                <span className="text-xs font-headline font-bold tracking-widest uppercase text-white group-hover:text-amber-400 transition-colors">Mark as Sold</span>
                                <div className={`w-12 h-6 relative transition-colors ${status === 'sold' ? 'bg-primary-container' : 'bg-zinc-800 border border-zinc-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 transition-all ${status === 'sold' ? 'right-1 bg-on-primary-container' : 'left-1 bg-zinc-600'}`}></div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-zinc-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Visibility</span>
                                <span className="text-[10px] text-admin-secondary font-bold uppercase tracking-widest">{status === 'available' ? 'Public' : 'Hidden'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Price Management */}
                    <div className="bg-surface-container-high p-6 border-t-4 border-amber-400">
                        <h4 className="font-headline font-bold text-xs tracking-widest text-amber-400 uppercase mb-4">Price Point</h4>
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-headline font-black text-white">$</span>
                                <input name="price" className="bg-transparent border-none p-0 text-3xl font-headline font-black text-white w-full focus:ring-0 outline-none" type="number" defaultValue={vehicle?.price || 0} />
                            </div>
                        </div>
                    </div>
                    
                    {!isNew && (
                        <div className="bg-surface-container p-6 space-y-4 border-l-4 border-red-500/50">
                            <h4 className="font-headline font-bold text-xs tracking-widest text-red-500 uppercase">Danger Zone</h4>
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Permanently delete this vehicle and remove it from all inventory views.</p>
                            <button formAction={deleteAction} className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-3 text-xs font-bold font-headline tracking-widest hover:bg-red-500/20 transition-colors uppercase cursor-pointer">
                                Delete Vehicle
                            </button>
                        </div>
                    )}
                </aside>
            </div>
        </form>
    );
}
