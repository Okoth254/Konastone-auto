'use client';

import Link from "next/link";
import { useState, useRef } from "react";
import { saveVehicle, deleteVehicle } from "@/app/admin/vehicles/actions";
import Image from "next/image";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";
import { Vehicle } from "@/types/database";

interface ExistingImage {
    id: string;
    public_url: string;
    is_main: boolean;
    sort_order: number;
}

const containerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

export default function VehicleForm({ vehicle, vehicleId, existingImages }: { vehicle: Partial<Vehicle> | null, vehicleId: string, existingImages: ExistingImage[] }) {
    const isNew = vehicleId === 'new';
    const [status, setStatus] = useState(vehicle?.status || 'available');
    const [isFeatured, setIsFeatured] = useState(Boolean(vehicle?.is_featured));

    // Image state management
    const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
    const [keepImages, setKeepImages] = useState<ExistingImage[]>(existingImages);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string>(vehicle?.main_image_url || '');
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isDirty, setIsDirty] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const deleteAction = deleteVehicle.bind(null, vehicleId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setPreviews(prev => [...prev, ...newPreviews]);
        setIsDirty(true);
    };

    const removeNewImage = (idx: number) => {
        URL.revokeObjectURL(previews[idx].url);
        setPreviews(prev => prev.filter((_, i) => i !== idx));
        setIsDirty(true);
    };

    const removeExistingImage = (imgId: string) => {
        setKeepImages(prev => prev.filter(img => img.id !== imgId));
        setDeletedIds(prev => [...prev, imgId]);
        setIsDirty(true);
        if (keepImages.find(img => img.id === imgId)?.public_url === mainImageUrl) {
            setMainImageUrl('');
        }
    };

    return (
        <form action={saveVehicle} onChange={() => setIsDirty(true)} className="flex flex-col min-h-screen bg-background-dark">
            <input type="hidden" name="id" value={vehicleId} />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="is_featured" value={isFeatured ? "on" : ""} />
            <input type="hidden" name="main_image_url" value={mainImageUrl} />
            <input type="hidden" name="main_image_index" value={mainImageIndex.toString()} />
            <input type="hidden" name="deleted_image_ids" value={deletedIds.join(',')} />
            <input type="hidden" name="existing_image_order" value={keepImages.map((img) => img.id).join(',')} />

            {/* Cinematic Header */}
            <header className="sticky top-0 z-100 bg-background-dark/80 backdrop-blur-2xl border-b border-white/5 py-4 px-4 sm:px-6 lg:py-6 lg:px-10">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-8 w-full lg:w-auto">
                        <Link href="/admin/vehicles">
                            <motion.div
                                whileHover={{ x: -5 }}
                                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">west</span>
                            </motion.div>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <MotionBadge color="primary" className="text-[9px] tracking-[0.3em] font-black">{isNew ? 'NEW VEHICLE' : 'EDITING'}</MotionBadge>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{isNew ? 'Not yet published' : `Vehicle ID: ${vehicleId.substring(0, 8)}`}</span>
                            </div>
                            <h1 className="text-3xl font-heading font-black text-white uppercase tracking-tighter leading-none italic">
                                {isNew ? 'Add Vehicle' : 'Edit Vehicle'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between lg:justify-end">
                        <AnimatePresence>
                            {isDirty && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] px-4"
                                >
                                    Unsaved Changes Active
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {!isNew && (
                            <MotionButton href={`/vehicle/${vehicleId}`} variant="outline" className="px-5 sm:px-8">
                                Preview Public Page
                            </MotionButton>
                        )}
                        <MotionButton type="submit" variant="primary" className="px-5 sm:px-10">
                            SAVE VEHICLE
                        </MotionButton>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-8 px-4 sm:px-6 lg:py-16 lg:px-10">
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10"
                >
                    {/* Primary Technical Form */}
                    <div className="xl:col-span-8 space-y-8 lg:space-y-14">
                        {/* 01. IDENTITY */}
                        <motion.section variants={itemVars} className="space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">01</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Catalogue Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-6 lg:gap-y-10">
                                {[
                                    { label: 'Manufacturer', name: 'make', defaultValue: vehicle?.make },
                                    { label: 'Model', name: 'model', defaultValue: vehicle?.model },
                                    { label: 'Year', name: 'year', type: 'number', defaultValue: vehicle?.year },
                                    { label: 'VIN', name: 'vin', defaultValue: vehicle?.vin },
                                    { label: 'Body Style', name: 'body_style', type: 'select', options: ['SUV', 'Sedan', 'Coupe', 'Truck', 'Van', 'Wagon'], defaultValue: vehicle?.body_style },
                                    { label: 'Exterior Color', name: 'exterior_color', defaultValue: vehicle?.exterior_color }
                                ].map((field) => (
                                    <div key={field.name} className="group relative">
                                        <label className="absolute -top-2.5 left-4 px-2 bg-background-dark text-[9px] font-black text-slate-500 uppercase tracking-widest z-10 group-focus-within:text-primary transition-colors">
                                            {field.label}
                                        </label>
                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                defaultValue={field.defaultValue}
                                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type || 'text'}
                                                name={field.name}
                                                defaultValue={field.defaultValue}
                                                required
                                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* 02. TECHNICAL MATRICES */}
                        <motion.section variants={itemVars} className="space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">02</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Specifications</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                                {[
                                    { label: 'Engine', name: 'engine_type', placeholder: 'e.g. 4.0L V8', defaultValue: vehicle?.engine_type },
                                    { label: 'Power', name: 'power', placeholder: 'e.g. 500 HP', defaultValue: vehicle?.power },
                                    { label: 'Transmission', name: 'transmission', type: 'select', options: ['Automatic', 'Manual', 'Dual-Clutch'], defaultValue: vehicle?.transmission },
                                    { label: 'Drivetrain', name: 'drivetrain', type: 'select', options: ['AWD', 'RWD', 'FWD', '4WD'], defaultValue: vehicle?.drivetrain }
                                ].map((field) => (
                                    <div key={field.name} className="bg-white/2 border border-white/5 rounded-2xl lg:rounded-3xl p-5 sm:p-6 hover:bg-white/4 transition-all">
                                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select name={field.name} defaultValue={field.defaultValue} className="w-full bg-transparent text-lg sm:text-xl font-heading font-black text-white outline-none cursor-pointer">
                                                {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input name={field.name} defaultValue={field.defaultValue} placeholder={field.placeholder} className="w-full bg-transparent text-lg sm:text-xl font-heading font-black text-white outline-none placeholder:text-white/10" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* 03. PHOTOS */}
                        <motion.section variants={itemVars} className="space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">03</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Photos</h2>
                            </div>

                            <div className="bg-white/2 border border-white/5 rounded-[1.5rem] lg:rounded-[3rem] p-5 sm:p-6 lg:p-10">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-10">
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 italic">Photo Gallery</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">Drag to reorder. Select the cover image shown in the catalogue.</p>
                                    </div>
                                    <MotionButton type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="py-2.5">
                                        UPLOAD PHOTOS
                                    </MotionButton>
                                    <input ref={fileInputRef} name="gallery_images" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                    <Reorder.Group axis="y" values={keepImages} onReorder={setKeepImages} className="contents">
                                        {keepImages.map((img) => (
                                            <Reorder.Item
                                                key={img.id}
                                                value={img}
                                                className={`relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all ${mainImageUrl === img.public_url ? 'border-primary shadow-2xl shadow-primary/20' : 'border-white/5 hover:border-white/20'}`}
                                                onClick={() => setMainImageUrl(img.public_url)}
                                            >
                                                <Image fill src={img.public_url} alt="Vehicle" className="object-cover" />
                                                {mainImageUrl === img.public_url && (
                                                    <div className="absolute top-4 left-4">
                                                        <MotionBadge color="primary" className="text-[8px] font-black">COVER IMAGE</MotionBadge>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeExistingImage(img.id); }}
                                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>

                                    {previews.map((preview, idx) => (
                                        <div
                                            key={preview.url}
                                            onClick={() => { setMainImageIndex(idx); setMainImageUrl(''); }}
                                            className={`relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border-2 border-dashed transition-all group cursor-pointer ${!mainImageUrl && mainImageIndex === idx ? 'border-primary' : 'border-white/10 hover:border-white/20'}`}
                                        >
                                            <Image unoptimized fill src={preview.url} alt="Preview" className="object-cover" />
                                            <div className="absolute top-4 left-4">
                                                <MotionBadge color="neutral" className="text-[8px] font-black bg-white/10 text-white">NEW PHOTO</MotionBadge>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeNewImage(idx); }}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                            {!mainImageUrl && mainImageIndex === idx && (
                                                <div className="absolute inset-0 border-2 border-primary rounded-2xl lg:rounded-3xl pointer-events-none" />
                                            )}
                                            {!mainImageUrl && mainImageIndex === idx && (
                                                <div className="absolute bottom-4 right-4">
                                                    <MotionBadge color="primary" className="text-[8px] font-black">COVER IMAGE</MotionBadge>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-video rounded-2xl lg:rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-primary hover:border-primary/20 transition-all cursor-pointer group"
                                    >
                                        <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">add_a_photo</span>
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Add Photo</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* Operational Sidebar */}
                    <aside className="xl:col-span-4 space-y-6 lg:space-y-10">
                        <motion.div variants={itemVars} className="xl:sticky xl:top-40 space-y-6 lg:space-y-10">
                            {/* Valuation Panel */}
                            <div className="bg-primary p-5 sm:p-8 lg:p-10 rounded-[1.5rem] lg:rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 lg:p-10 opacity-10 group-hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined text-9xl text-black">payments</span>
                                </div>
                                <label className="block text-[10px] font-black text-black uppercase tracking-[0.4em] mb-4">Price</label>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-xl font-heading font-black text-black/40 italic">KSH</span>
                                    <input
                                        name="price"
                                        type="number"
                                        defaultValue={vehicle?.price}
                                        className="bg-transparent border-none p-0 text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-black w-full outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* State Panel */}
                            <div className="bg-white/3 border border-white/5 rounded-[1.5rem] lg:rounded-[3rem] p-5 sm:p-8 lg:p-10 space-y-6 lg:space-y-10">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-5 lg:mb-8">Catalogue Status</label>
                                    <div className="space-y-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xl font-heading font-black text-white uppercase italic tracking-tight">{status.replace('_', ' ')}</span>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Controls how this vehicle appears in the public catalogue.</span>
                                        </div>
                                        <select
                                            value={status}
                                            onChange={(event) => { setStatus(event.target.value); setIsDirty(true); }}
                                            className="w-full bg-white/3 border border-white/10 rounded-2xl px-5 py-4 text-white font-black uppercase tracking-[0.2em] text-[10px] outline-none focus:border-primary/40 transition-all"
                                        >
                                            <option value="available" className="bg-slate-900">Available</option>
                                            <option value="in_transit" className="bg-slate-900">In Transit</option>
                                            <option value="reserved" className="bg-slate-900">Reserved</option>
                                            <option value="sold" className="bg-slate-900">Sold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 lg:pt-10 border-t border-white/5 space-y-6">
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <span className="material-symbols-outlined text-lg">verified</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ready for catalogue sync</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <span className="material-symbols-outlined text-lg">cloud_sync</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Public pages update after save</span>
                                    </div>
                                </div>

                                <div className="pt-6 lg:pt-10 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => { setIsFeatured(prev => !prev); setIsDirty(true); }}
                                        className={`w-full rounded-2xl border px-5 py-5 flex items-center justify-between gap-4 transition-all ${isFeatured ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/2 border-white/5 text-slate-400 hover:border-primary/20'}`}
                                    >
                                        <span className="flex flex-col items-start gap-1 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Feature on homepage</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Available vehicles only appear in the featured section.</span>
                                        </span>
                                        <span className="material-symbols-outlined">{isFeatured ? 'star' : 'star_outline'}</span>
                                    </button>
                                </div>

                                {!isNew && (
                                    <div className="pt-6 lg:pt-10 border-t border-white/5">
                                        <button formAction={deleteAction} className="w-full py-5 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500">
                                            DELETE VEHICLE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </aside>
                </motion.div>
            </main>
        </form>
    );
}
