'use client';

import Link from "next/link";
import { saveVehicle, deleteVehicle } from "../../actions";
import { useState, useRef } from "react";
import Image from "next/image";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
};

export default function VehicleForm({ vehicle, vehicleId, existingImages }: { vehicle: any, vehicleId: string, existingImages: ExistingImage[] }) {
    const isNew = vehicleId === 'new';
    const [status, setStatus] = useState(vehicle?.status || 'available');
    
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
            <input type="hidden" name="main_image_url" value={mainImageUrl} />
            <input type="hidden" name="main_image_index" value={mainImageIndex.toString()} />
            <input type="hidden" name="deleted_image_ids" value={deletedIds.join(',')} />
            <input type="hidden" name="existing_image_order" value={keepImages.map((img) => img.id).join(',')} />
            
            {/* Cinematic Header */}
            <header className="sticky top-0 z-[100] bg-background-dark/80 backdrop-blur-2xl border-b border-white/5 py-6 px-10">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
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
                                <MotionBadge color="primary" className="text-[9px] tracking-[0.3em] font-black">{isNew ? 'NEW_ENTRY' : 'EDITOR_ACTIVE'}</MotionBadge>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{isNew ? 'AWAITING_INITIALIZATION' : `ASSET_ID: ${vehicleId.substring(0, 8)}`}</span>
                            </div>
                            <h1 className="text-3xl font-heading font-black text-white uppercase tracking-tighter leading-none italic">
                                {isNew ? 'Initialize Vehicle' : 'Modify Asset Specification'}
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
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
                        <MotionButton type="submit" variant="primary" className="px-10">
                            Push_Changes
                        </MotionButton>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-16 px-10">
                <motion.div 
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-16"
                >
                    {/* Primary Technical Form */}
                    <div className="xl:col-span-8 space-y-20">
                        {/* 01. IDENTITY */}
                        <motion.section variants={itemVars} className="space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">01</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Asset_Identity</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {[
                                    { label: 'Manufacturer', name: 'make', defaultValue: vehicle?.make },
                                    { label: 'Model_Designation', name: 'model', defaultValue: vehicle?.model },
                                    { label: 'Production_Year', name: 'year', type: 'number', defaultValue: vehicle?.year },
                                    { label: 'VIN_Identification', name: 'vin', defaultValue: vehicle?.vin },
                                    { label: 'Body_Configuration', name: 'body_style', type: 'select', options: ['SUV', 'Sedan', 'Coupe', 'Truck', 'Van', 'Wagon'], defaultValue: vehicle?.body_style },
                                    { label: 'Exterior_Finish', name: 'exterior_color', defaultValue: vehicle?.exterior_color }
                                ].map((field) => (
                                    <div key={field.name} className="group relative">
                                        <label className="absolute -top-2.5 left-4 px-2 bg-background-dark text-[9px] font-black text-slate-500 uppercase tracking-widest z-10 group-focus-within:text-primary transition-colors">
                                            {field.label}
                                        </label>
                                        {field.type === 'select' ? (
                                            <select 
                                                name={field.name} 
                                                defaultValue={field.defaultValue}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                type={field.type || 'text'} 
                                                name={field.name}
                                                defaultValue={field.defaultValue}
                                                required
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* 02. TECHNICAL MATRICES */}
                        <motion.section variants={itemVars} className="space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">02</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Propulsion_Metrics</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Engine_Type', name: 'engine_type', placeholder: 'e.g. 4.0L V8', defaultValue: vehicle?.engine_type },
                                    { label: 'Power_Output', name: 'power', placeholder: 'e.g. 500 HP', defaultValue: vehicle?.power },
                                    { label: 'Transmission', name: 'transmission', type: 'select', options: ['Automatic', 'Manual', 'Dual-Clutch'], defaultValue: vehicle?.transmission },
                                    { label: 'Drive_Protocol', name: 'drivetrain', type: 'select', options: ['AWD', 'RWD', 'FWD', '4WD'], defaultValue: vehicle?.drivetrain }
                                ].map((field) => (
                                    <div key={field.name} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all">
                                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select name={field.name} defaultValue={field.defaultValue} className="w-full bg-transparent text-xl font-heading font-black text-white outline-none cursor-pointer">
                                                {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input name={field.name} defaultValue={field.defaultValue} placeholder={field.placeholder} className="w-full bg-transparent text-xl font-heading font-black text-white outline-none placeholder:text-white/10" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* 03. MEDIA PROTOCOL */}
                        <motion.section variants={itemVars} className="space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">03</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Visual_Assets</h2>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 italic">Gallery_Management</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">DRAG TO REORDER. TAP TO SET COVER IMAGE.</p>
                                    </div>
                                    <MotionButton type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="py-2.5">
                                        Initialize_Upload
                                    </MotionButton>
                                    <input ref={fileInputRef} name="gallery_images" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <Reorder.Group axis="y" values={keepImages} onReorder={setKeepImages} className="contents">
                                        {keepImages.map((img) => (
                                            <Reorder.Item
                                                key={img.id}
                                                value={img}
                                                className={`relative aspect-video rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all ${mainImageUrl === img.public_url ? 'border-primary shadow-2xl shadow-primary/20' : 'border-white/5 hover:border-white/20'}`}
                                                onClick={() => setMainImageUrl(img.public_url)}
                                            >
                                                <Image fill src={img.public_url} alt="Vehicle" className="object-cover" />
                                                {mainImageUrl === img.public_url && (
                                                    <div className="absolute top-4 left-4">
                                                        <MotionBadge color="primary" className="text-[8px] font-black">COVER_ASSET</MotionBadge>
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
                                            className={`relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed transition-all group cursor-pointer ${!mainImageUrl && mainImageIndex === idx ? 'border-primary' : 'border-white/10 hover:border-white/20'}`}
                                        >
                                            <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4">
                                                <MotionBadge color="neutral" className="text-[8px] font-black bg-white/10 text-white">NEW_UPLOAD</MotionBadge>
                                            </div>
                                            {!mainImageUrl && mainImageIndex === idx && (
                                                <div className="absolute bottom-4 right-4">
                                                    <MotionBadge color="primary" className="text-[8px] font-black">COVER_STRATEGY</MotionBadge>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-video rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-primary hover:border-primary/20 transition-all cursor-pointer group"
                                    >
                                        <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">add_a_photo</span>
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Link_Asset</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* Operational Sidebar */}
                    <aside className="xl:col-span-4 space-y-10">
                        <motion.div variants={itemVars} className="sticky top-40 space-y-10">
                            {/* Valuation Panel */}
                            <div className="bg-primary p-12 rounded-[3.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined text-9xl text-black">payments</span>
                                </div>
                                <label className="block text-[10px] font-black text-black uppercase tracking-[0.4em] mb-4">Asset_Valuation</label>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-xl font-heading font-black text-black/40 italic">KSH</span>
                                    <input 
                                        name="price" 
                                        type="number" 
                                        defaultValue={vehicle?.price} 
                                        className="bg-transparent border-none p-0 text-6xl font-heading font-black text-black w-full outline-none focus:ring-0" 
                                    />
                                </div>
                            </div>

                            {/* State Panel */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-[3.5rem] p-12 space-y-10">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Operational_State</label>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xl font-heading font-black text-white uppercase italic tracking-tight">{status === 'available' ? 'DEPLOYED' : 'ARCHIVED'}</span>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Global_Visibility_State</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setStatus(status === 'available' ? 'sold' : 'available')}
                                            className={`w-20 h-10 rounded-full relative transition-all duration-500 ${status === 'available' ? 'bg-primary' : 'bg-slate-800'}`}
                                        >
                                            <motion.div 
                                                animate={{ x: status === 'available' ? 44 : 4 }}
                                                className="absolute top-1 w-8 h-8 rounded-full bg-black shadow-lg"
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/5 space-y-6">
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <span className="material-symbols-outlined text-lg">verified</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Integrity Check Passed</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <span className="material-symbols-outlined text-lg">cloud_sync</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Real-time Sync Active</span>
                                    </div>
                                </div>

                                {!isNew && (
                                    <div className="pt-10 border-t border-white/5">
                                        <button formAction={deleteAction} className="w-full py-5 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500">
                                            PURGE_ASSET_FROM_REGISTRY
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
