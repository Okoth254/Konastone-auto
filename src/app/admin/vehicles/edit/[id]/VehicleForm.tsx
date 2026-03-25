'use client';

import Link from "next/link";
import { saveVehicle, deleteVehicle } from "../../actions";
import { useState, useRef } from "react";
import Image from "next/image";
import { Reorder } from "framer-motion";

interface ExistingImage {
    id: string;
    public_url: string;
    is_main: boolean;
    sort_order: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VehicleForm({ vehicle, vehicleId, existingImages }: { vehicle: any, vehicleId: string, existingImages: ExistingImage[] }) {
    const isNew = vehicleId === 'new';
    const [status, setStatus] = useState(vehicle?.status || 'available');
    
    // Image state management
    const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
    const [keepImages, setKeepImages] = useState<ExistingImage[]>(existingImages);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string>(vehicle?.main_image_url || '');
    const [mainImageIndex, setMainImageIndex] = useState(0); // index in new previews for main
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const deleteAction = deleteVehicle.bind(null, vehicleId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (idx: number) => {
        URL.revokeObjectURL(previews[idx].url);
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (imgId: string) => {
        setKeepImages(prev => prev.filter(img => img.id !== imgId));
        setDeletedIds(prev => [...prev, imgId]);
        if (keepImages.find(img => img.id === imgId)?.public_url === mainImageUrl) {
            setMainImageUrl('');
        }
    };

    const setExistingAsMain = (url: string) => {
        setMainImageUrl(url);
    };
    
    return (
        <form action={saveVehicle} className="flex flex-col min-h-full">
            <input type="hidden" name="id" value={vehicleId} />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="main_image_url" value={mainImageUrl} />
            <input type="hidden" name="main_image_index" value={mainImageIndex.toString()} />
            <input type="hidden" name="deleted_image_ids" value={deletedIds.join(',')} />
            <input type="hidden" name="existing_image_order" value={keepImages.map((img) => img.id).join(',')} />
            
            {/* Hidden multi-file input is handled by the ref below */}

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
                                <input name="engine_type" className="bg-transparent border-none p-0 w-full text-xl font-bold font-headline text-amber-400 outline-none" type="text" defaultValue={vehicle?.engine_type || ''} placeholder="e.g. 4.0L V8" />
                            </div>
                            <div className="bg-surface-container-low p-4 space-y-2">
                                <label className="text-[9px] font-headline font-bold tracking-[0.2em] text-zinc-500 uppercase">Power</label>
                                <input name="power" className="bg-transparent border-none p-0 w-full text-xl font-bold font-headline text-amber-400 outline-none" type="text" defaultValue={vehicle?.power || ''} placeholder="e.g. 500 HP" />
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
                    
                    {/* Section: Image Gallery Manager */}
                    <section className="bg-surface-container p-6 border-l-2 border-admin-secondary">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="font-headline text-lg font-bold tracking-widest text-admin-secondary uppercase">03. Assets & Media</h3>
                                <p className="text-[10px] text-zinc-500 mt-1">Click any image to set as the main cover image. Use the &times; to remove.</p>
                            </div>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-admin-secondary/10 border border-admin-secondary text-admin-secondary text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-admin-secondary/20 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                                Add Images
                            </button>
                        </div>

                        {/* Hidden multi-file input */}
                        <input
                            ref={fileInputRef}
                            name="gallery_images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Gallery Grid */}
                        {(keepImages.length > 0 || previews.length > 0) ? (
                            <div className="space-y-4">
                                {keepImages.length > 0 && (
                                    <>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Drag to reorder saved gallery images</p>
                                        <Reorder.Group
                                            axis="y"
                                            values={keepImages}
                                            onReorder={setKeepImages}
                                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                        >
                                            {keepImages.map((img) => (
                                                <Reorder.Item
                                                    key={img.id}
                                                    value={img}
                                                    className={`relative aspect-video overflow-hidden group cursor-grab active:cursor-grabbing border-2 transition-all ${mainImageUrl === img.public_url ? 'border-amber-400 shadow-[0_0_15px_rgba(255,193,7,0.3)]' : 'border-zinc-700 hover:border-zinc-500'}`}
                                                    onClick={() => setExistingAsMain(img.public_url)}
                                                >
                                                    <Image fill src={img.public_url} alt="Vehicle image" className="object-cover" />
                                                    <div className="absolute bottom-1 right-1 bg-zinc-900/80 text-zinc-300 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">drag</div>
                                                    {mainImageUrl === img.public_url && (
                                                        <div className="absolute top-1 left-1 bg-amber-400 text-black text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest">COVER</div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeExistingImage(img.id); }}
                                                        className="absolute top-1 right-1 bg-red-500/80 text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">close</span>
                                                    </button>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    </>
                                )}

                                {/* New preview images */}
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {previews.map((preview, idx) => (
                                            <div
                                                key={preview.url}
                                                onClick={() => { setMainImageIndex(idx); setMainImageUrl(''); }}
                                                className={`relative aspect-video overflow-hidden group cursor-pointer border-2 transition-all ${!mainImageUrl && mainImageIndex === idx ? 'border-amber-400 shadow-[0_0_15px_rgba(255,193,7,0.3)]' : 'border-zinc-600 hover:border-zinc-400 border-dashed'}`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={preview.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute bottom-1 left-1 bg-zinc-900/80 text-[8px] font-bold text-admin-secondary px-1.5 py-0.5 uppercase tracking-widest">NEW</div>
                                                {!mainImageUrl && mainImageIndex === idx && (
                                                    <div className="absolute top-1 left-1 bg-amber-400 text-black text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest">COVER</div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeNewImage(idx); }}
                                                    className="absolute top-1 right-1 bg-red-500/80 text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                >
                                                    <span className="material-symbols-outlined text-xs">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-zinc-700 hover:border-admin-secondary transition-colors p-12 flex flex-col items-center justify-center gap-4 cursor-pointer group"
                            >
                                <span className="material-symbols-outlined text-4xl text-zinc-600 group-hover:text-admin-secondary transition-colors">cloud_upload</span>
                                <p className="text-xs text-zinc-500 font-medium text-center">Click to upload vehicle images<br/><span className="text-[10px] text-zinc-600">Supports JPG, PNG, WEBP. Multiple files allowed.</span></p>
                            </div>
                        )}
                    </section>
                </div>
                
                {/* Right Column: Sidebar Status */}
                <aside className="w-full xl:w-80 shrink-0 space-y-6">
                    {/* Status Panel */}
                    <div className="bg-surface-container p-6 space-y-6">
                        <h4 className="font-headline font-bold text-xs tracking-widest text-zinc-500 uppercase">Publishing Status</h4>
                        <div className="space-y-4">
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
                                <span className="text-sm font-headline font-black text-zinc-400 mr-1">KSH</span>
                                <input name="price" className="bg-transparent border-none p-0 text-3xl font-headline font-black text-white w-full focus:ring-0 outline-none" type="number" defaultValue={vehicle?.price || 0} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Image count indicator */}
                    {(keepImages.length > 0 || previews.length > 0) && (
                        <div className="bg-surface-container p-4 border border-zinc-800">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Gallery Summary</p>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Saved images</span>
                                    <span className="text-admin-secondary font-bold">{keepImages.length}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>New uploads</span>
                                    <span className="text-amber-400 font-bold">{previews.length}</span>
                                </div>
                                {deletedIds.length > 0 && (
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Pending deletion</span>
                                        <span className="text-red-500 font-bold">{deletedIds.length}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {!isNew && (
                        <div className="bg-surface-container p-6 space-y-4 border-l-4 border-red-500/50">
                            <h4 className="font-headline font-bold text-xs tracking-widest text-red-500 uppercase">Danger Zone</h4>
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Permanently delete this vehicle and all its images.</p>
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
