'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { saveVehicle, deleteVehicle, updateVehicleCatalogueState } from "@/app/admin/vehicles/actions";
import Image from "next/image";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";
import Dialog, { DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
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

const steps = [
    { id: 'details', label: 'Details', icon: 'badge' },
    { id: 'description', label: 'Description', icon: 'notes' },
    { id: 'specs', label: 'Specs', icon: 'tune' },
    { id: 'photos', label: 'Photos', icon: 'add_a_photo' },
    { id: 'pricing', label: 'Pricing & Status', icon: 'payments' },
    { id: 'review', label: 'Review', icon: 'task_alt' },
] as const;

function SaveVehicleButton({ intent = 'publish', children }: { intent?: 'draft' | 'publish'; children?: ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <MotionButton
            type="submit"
            name="save_intent"
            value={intent}
            variant={intent === 'draft' ? 'outline' : 'primary'}
            loading={pending}
            className="px-5 sm:px-10"
        >
            {pending ? 'SAVING' : children || (intent === 'draft' ? 'SAVE DRAFT' : 'PUBLISH / SAVE')}
        </MotionButton>
    );
}

function DeleteConfirmButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={disabled || pending}
            className="w-full h-12 rounded-2xl bg-red-500 text-white px-6 text-[10px] font-black uppercase tracking-[0.25em] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-400 transition-all"
        >
            {pending ? 'REMOVING' : 'DELETE VEHICLE'}
        </button>
    );
}

function StatusActionButton({ children, className = "" }: { children: ReactNode; className?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full h-12 rounded-2xl border px-5 text-[10px] font-black uppercase tracking-[0.22em] transition-all disabled:opacity-50 ${className}`}
        >
            {pending ? 'UPDATING' : children}
        </button>
    );
}

export default function VehicleForm({ vehicle, vehicleId, existingImages }: { vehicle: Partial<Vehicle> | null, vehicleId: string, existingImages: ExistingImage[] }) {
    const isNew = vehicleId === 'new';
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<Vehicle['status']>(vehicle?.status || 'draft');
    const [isFeatured, setIsFeatured] = useState(Boolean(vehicle?.is_featured));

    const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [keepImages, setKeepImages] = useState<ExistingImage[]>(existingImages);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string>(vehicle?.main_image_url || '');
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isDirty, setIsDirty] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [fieldValues, setFieldValues] = useState({
        make: vehicle?.make?.toString() || '',
        model: vehicle?.model?.toString() || '',
        year: vehicle?.year?.toString() || '',
        price: vehicle?.price?.toString() || '',
        mileage: vehicle?.mileage?.toString() || '',
        fuel_type: vehicle?.fuel_type?.toString() || '',
        engine_type: vehicle?.engine_type?.toString() || '',
        transmission: vehicle?.transmission?.toString() || '',
        drivetrain: vehicle?.drivetrain?.toString() || vehicle?.drive_type?.toString() || '',
        description: vehicle?.description?.toString() || '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const deleteAction = deleteVehicle.bind(null, vehicleId);
    const markSoldAction = updateVehicleCatalogueState.bind(null, vehicleId, { status: 'sold' }, `/admin/vehicles/edit/${vehicleId}?vehicleAction=sold`);
    const markReservedAction = updateVehicleCatalogueState.bind(null, vehicleId, { status: 'reserved' }, `/admin/vehicles/edit/${vehicleId}?vehicleAction=reserved`);
    const markDraftAction = updateVehicleCatalogueState.bind(null, vehicleId, { status: 'draft' }, `/admin/vehicles/edit/${vehicleId}?vehicleAction=drafted`);
    const deleteVehicleLabel = [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || vehicleId.substring(0, 8);
    const deleteTarget = `DELETE ${deleteVehicleLabel}`.trim();
    const canDelete = !isNew && deleteConfirmation.trim().toLowerCase() === deleteTarget.toLowerCase();

    const imageCount = keepImages.length + previews.length;
    const completion = useMemo(() => {
        const details = Boolean(fieldValues.make.trim() && fieldValues.model.trim() && fieldValues.year.trim());
        const description = true;
        const pricing = Boolean(fieldValues.price.trim() && status);
        const specs = Boolean(fieldValues.engine_type.trim() && fieldValues.transmission.trim() && fieldValues.drivetrain.trim());
        const photos = imageCount > 0 || Boolean(mainImageUrl);
        const review = details && pricing && photos && Boolean(fieldValues.mileage.trim() && fieldValues.fuel_type.trim() && fieldValues.transmission.trim());

        return { details, description, pricing, specs, photos, review };
    }, [fieldValues, imageCount, mainImageUrl, status]);

    const requiresPublicReadiness = status === 'available' || status === 'in_transit' || isFeatured;

    const validationIssues = [
        !completion.details && 'Add manufacturer, model, and year.',
        !completion.pricing && 'Set price and catalogue status.',
        !fieldValues.mileage.trim() && 'Add mileage for public inventory cards.',
        !fieldValues.fuel_type.trim() && 'Select fuel type for public inventory cards.',
        !completion.photos && 'Add at least one public-quality image.',
        !completion.specs && 'Complete engine, transmission, and drivetrain for a stronger listing.',
    ].filter(Boolean) as string[];

    useEffect(() => {
        if (searchParams.get('saved') === '1') {
            toast.success('Vehicle saved', {
                description: 'Catalogue, homepage, inventory, and vehicle pages have been revalidated.',
            });
            setIsDirty(false);
            router.replace(`/admin/vehicles/edit/${vehicleId}`, { scroll: false });
        }
    }, [router, searchParams, vehicleId]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!isDirty) return;
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const updateField = (name: keyof typeof fieldValues, value: string) => {
        setFieldValues(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const syncFileInput = (files: File[]) => {
        if (!fileInputRef.current || typeof DataTransfer === 'undefined') return;
        const dataTransfer = new DataTransfer();
        files.forEach((file) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
    };

    const setNewImageFiles = (files: File[]) => {
        previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        setSelectedFiles(files);
        setPreviews(files.map(file => ({ file, url: URL.createObjectURL(file) })));
        syncFileInput(files);
    };

    const addFiles = (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== files.length) {
            toast.error('Only image files can be uploaded');
        }
        if (imageFiles.length === 0) return;

        setNewImageFiles([...selectedFiles, ...imageFiles]);
        setIsDirty(true);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        addFiles(Array.from(e.target.files || []));
    };

    const removeNewImage = (idx: number) => {
        setNewImageFiles(selectedFiles.filter((_, i) => i !== idx));
        if (mainImageIndex >= selectedFiles.length - 1) {
            setMainImageIndex(Math.max(0, selectedFiles.length - 2));
        }
        setIsDirty(true);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const intent = submitter?.value === 'draft' ? 'draft' : 'publish';
        const hasDatabaseMinimum = Boolean(fieldValues.make.trim() && fieldValues.model.trim() && fieldValues.year.trim() && fieldValues.price.trim());

        if (!hasDatabaseMinimum) {
            event.preventDefault();
            toast.error('Draft needs core details', {
                description: 'Add make, model, year, and price before saving. Public fields can stay incomplete until publish.',
            });
            return;
        }

        if (intent === 'publish' && (requiresPublicReadiness || status === 'draft') && !completion.review) {
            event.preventDefault();
            toast.error('Listing is not ready', {
                description: 'Add make, model, year, price, mileage, fuel type, transmission, and at least one image before publishing or featuring.',
            });
        }
    };

    const removeExistingImage = (imgId: string) => {
        const removedImage = keepImages.find(img => img.id === imgId);
        const nextImages = keepImages.filter(img => img.id !== imgId);
        setKeepImages(nextImages);
        setDeletedIds(prev => [...prev, imgId]);
        setIsDirty(true);
        if (removedImage?.public_url === mainImageUrl) {
            setMainImageUrl(nextImages[0]?.public_url || '');
        }
    };

    return (
        <>
        <form action={saveVehicle} onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="flex flex-col min-h-screen bg-background-dark">
            <input type="hidden" name="id" value={vehicleId} />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="is_featured" value={isFeatured ? "on" : ""} />
            <input type="hidden" name="main_image_url" value={mainImageUrl} />
            <input type="hidden" name="main_image_index" value={mainImageIndex.toString()} />
            <input type="hidden" name="deleted_image_ids" value={deletedIds.join(',')} />
            <input type="hidden" name="existing_image_order" value={keepImages.map((img) => img.id).join(',')} />

            <header className="sticky top-16 xl:top-0 z-[80] bg-background-dark/80 backdrop-blur-2xl border-b border-white/5 py-3 px-4 sm:px-6 lg:py-6 lg:px-10">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-8 w-full lg:w-auto">
                        <Link href="/admin/vehicles">
                            <motion.div
                                whileHover={{ x: -5 }}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">west</span>
                            </motion.div>
                        </Link>
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <MotionBadge color="primary" className="text-[9px] tracking-[0.3em] font-black">{isNew ? 'NEW VEHICLE' : 'EDITING'}</MotionBadge>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{isNew ? 'Not yet published' : `Vehicle ID: ${vehicleId.substring(0, 8)}`}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tighter leading-none italic">
                                {isNew ? 'Add Vehicle' : 'Edit Vehicle'}
                            </h1>
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between lg:justify-end">
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
                        <SaveVehicleButton intent="draft" />
                        <SaveVehicleButton />
                    </div>
                </div>
            </header>

            <div className="sticky top-[129px] sm:top-[137px] xl:top-[97px] z-40 bg-background-dark/70 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-10 py-3">
                <div className="max-w-[1600px] mx-auto overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max gap-2">
                        {steps.map((step) => {
                            const complete = completion[step.id];
                            return (
                                <a
                                    key={step.id}
                                    href={`#${step.id}`}
                                    className={`h-10 rounded-xl border px-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${complete ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/3 border-white/5 text-slate-500 hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-base">{complete ? 'check_circle' : step.icon}</span>
                                    {step.label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="flex-1 py-8 px-4 pb-28 sm:px-6 sm:pb-10 lg:py-16 lg:px-10">
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10"
                >
                    <div className="xl:col-span-8 space-y-8 lg:space-y-14">
                        <motion.section id="details" variants={itemVars} className="scroll-mt-44 space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">01</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Catalogue Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-6 lg:gap-y-10">
                                {[
                                    { label: 'Manufacturer', name: 'make', required: true, defaultValue: vehicle?.make },
                                    { label: 'Model', name: 'model', required: true, defaultValue: vehicle?.model },
                                    { label: 'Year', name: 'year', type: 'number', required: true, defaultValue: vehicle?.year },
                                    { label: 'Mileage', name: 'mileage', type: 'number', required: true, defaultValue: vehicle?.mileage },
                                    { label: 'VIN', name: 'vin', defaultValue: vehicle?.vin },
                                    { label: 'Body Style', name: 'body_style', type: 'select', options: ['SUV', 'Sedan', 'Coupe', 'Truck', 'Van', 'Wagon'], defaultValue: vehicle?.body_style },
                                    { label: 'Exterior Color', name: 'exterior_color', defaultValue: vehicle?.exterior_color || vehicle?.color },
                                    { label: 'Fuel Type', name: 'fuel_type', type: 'select', required: true, options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], defaultValue: vehicle?.fuel_type }
                                ].map((field) => (
                                    <div key={field.name} className="group relative">
                                        <label className="absolute -top-2.5 left-4 px-2 bg-background-dark text-[9px] font-black text-slate-500 uppercase tracking-widest z-10 group-focus-within:text-primary transition-colors">
                                            {field.label}{field.required ? ' *' : ''}
                                        </label>
                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                defaultValue={field.defaultValue || ''}
                                                aria-required={field.required}
                                                onChange={(event) => {
                                                    if (field.name === 'fuel_type') updateField('fuel_type', event.target.value);
                                                }}
                                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-900">Select {field.label}</option>
                                                {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type || 'text'}
                                                name={field.name}
                                                defaultValue={field.defaultValue}
                                                aria-required={field.required}
                                                onChange={(event) => {
                                                    if (field.name === 'make' || field.name === 'model' || field.name === 'year' || field.name === 'mileage') {
                                                        updateField(field.name, event.target.value);
                                                    }
                                                }}
                                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        <motion.section id="description" variants={itemVars} className="scroll-mt-44 space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">02</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Public Description</h2>
                            </div>
                            <textarea
                                name="description"
                                defaultValue={vehicle?.description || ''}
                                rows={5}
                                onChange={(event) => updateField('description', event.target.value)}
                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-medium leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Summarize condition, ownership story, standout specs, and what buyers should know before viewing."
                            />
                            <label className="block space-y-3">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">Features / tags</span>
                                <input
                                    name="tags"
                                    defaultValue={(vehicle?.tags || []).join(', ')}
                                    className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold outline-none focus:border-primary/40"
                                    placeholder="Sunroof, leather seats, reverse camera"
                                />
                            </label>
                        </motion.section>

                        <motion.section id="specs" variants={itemVars} className="scroll-mt-44 space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">03</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Specifications</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                                {[
                                    { label: 'Engine', name: 'engine_type', placeholder: 'e.g. 4.0L V8', defaultValue: vehicle?.engine_type },
                                    { label: 'Power', name: 'power', placeholder: 'e.g. 500 HP', defaultValue: vehicle?.power },
                                    { label: 'Transmission', name: 'transmission', type: 'select', required: true, options: ['Automatic', 'Manual', 'Dual-Clutch'], defaultValue: vehicle?.transmission },
                                    { label: 'Drivetrain', name: 'drivetrain', type: 'select', options: ['AWD', 'RWD', 'FWD', '4WD', '2WD'], defaultValue: vehicle?.drivetrain || vehicle?.drive_type }
                                ].map((field) => (
                                    <div key={field.name} className="bg-white/2 border border-white/5 rounded-2xl lg:rounded-3xl p-5 sm:p-6 hover:bg-white/4 transition-all">
                                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">{field.label}{field.required ? ' *' : ''}</label>
                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                defaultValue={field.defaultValue || ''}
                                                aria-required={field.required}
                                                onChange={(event) => {
                                                    if (field.name === 'transmission' || field.name === 'drivetrain') updateField(field.name, event.target.value);
                                                }}
                                                className="w-full bg-transparent text-lg sm:text-xl font-heading font-black text-white outline-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-900">Select</option>
                                                {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                name={field.name}
                                                defaultValue={field.defaultValue}
                                                placeholder={field.placeholder}
                                                onChange={(event) => {
                                                    if (field.name === 'engine_type') updateField(field.name, event.target.value);
                                                }}
                                                className="w-full bg-transparent text-lg sm:text-xl font-heading font-black text-white outline-none placeholder:text-white/10"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        <motion.section id="photos" variants={itemVars} className="scroll-mt-44 space-y-6 lg:space-y-10">
                            <div className="flex items-center gap-6">
                                <span className="text-4xl font-heading font-black text-white/10 italic">04</span>
                                <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Photos</h2>
                            </div>

                            <div
                                onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    setIsDragging(false);
                                    addFiles(Array.from(event.dataTransfer.files || []));
                                }}
                                className={`bg-white/2 border rounded-[1.5rem] lg:rounded-[3rem] p-5 sm:p-6 lg:p-10 transition-all ${isDragging ? 'border-primary/50 bg-primary/5' : 'border-white/5'}`}
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-10">
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 italic">Photo Gallery</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">Drag files here, reorder saved photos, and select the cover image used in the catalogue.</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <MotionBadge color={completion.photos ? 'primary' : 'neutral'} className="justify-center text-[8px] font-black">{imageCount} PHOTOS</MotionBadge>
                                        <MotionButton type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="py-2.5">
                                            UPLOAD PHOTOS
                                        </MotionButton>
                                    </div>
                                    <input ref={fileInputRef} name="gallery_images" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                </div>

                                {imageCount === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mb-6 w-full min-h-44 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-primary hover:border-primary/30 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Drop or choose vehicle photos</span>
                                    </button>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                    <Reorder.Group axis="y" values={keepImages} onReorder={(items) => { setKeepImages(items); setIsDirty(true); }} className="contents">
                                        {keepImages.map((img) => (
                                            <Reorder.Item
                                                key={img.id}
                                                value={img}
                                                className={`group relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all ${mainImageUrl === img.public_url ? 'border-primary shadow-2xl shadow-primary/20' : 'border-white/5 hover:border-white/20'}`}
                                                onClick={() => { setMainImageUrl(img.public_url); setIsDirty(true); }}
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
                                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                                    aria-label="Remove saved photo"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>

                                    {previews.map((preview, idx) => (
                                        <div
                                            key={preview.url}
                                            onClick={() => { setMainImageIndex(idx); setMainImageUrl(''); setIsDirty(true); }}
                                            className={`relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border-2 border-dashed transition-all group cursor-pointer ${!mainImageUrl && mainImageIndex === idx ? 'border-primary' : 'border-white/10 hover:border-white/20'}`}
                                        >
                                            <Image unoptimized fill src={preview.url} alt="Preview" className="object-cover" />
                                            <div className="absolute top-4 left-4">
                                                <MotionBadge color="neutral" className="text-[8px] font-black bg-white/10 text-white">NEW PHOTO</MotionBadge>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeNewImage(idx); }}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                                aria-label="Remove new photo"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                            {!mainImageUrl && mainImageIndex === idx && (
                                                <div className="absolute bottom-4 right-4">
                                                    <MotionBadge color="primary" className="text-[8px] font-black">COVER IMAGE</MotionBadge>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {imageCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-video rounded-2xl lg:rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-primary hover:border-primary/20 transition-all cursor-pointer group"
                                        >
                                            <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">add_a_photo</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Add Photo</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    <aside id="pricing" className="scroll-mt-44 xl:col-span-4 space-y-6 lg:space-y-10">
                        <motion.div variants={itemVars} className="xl:sticky xl:top-52 space-y-6 lg:space-y-10">
                            <div id="review" className="bg-surface-dark/40 border border-white/5 rounded-[1.5rem] lg:rounded-[3rem] p-5 sm:p-8 lg:p-10 space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2">Listing Readiness</p>
                                        <h3 className="text-2xl font-heading font-black text-white uppercase italic tracking-tighter">Review</h3>
                                    </div>
                                    <MotionBadge color={completion.review ? 'primary' : 'neutral'} className="text-[8px] font-black">{completion.review ? 'READY' : 'NEEDS INPUT'}</MotionBadge>
                                </div>
                                <div className="space-y-3">
                                    {validationIssues.map((issue) => (
                                        <div key={issue} className="flex items-start gap-3 rounded-2xl bg-white/3 border border-white/5 p-4 text-slate-400">
                                            <span className="material-symbols-outlined text-primary text-lg">info</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] leading-relaxed">{issue}</span>
                                        </div>
                                    ))}
                                    {validationIssues.length === 0 && (
                                        <div className="flex items-start gap-3 rounded-2xl bg-accent-teal/10 border border-accent-teal/20 p-4 text-accent-teal">
                                            <span className="material-symbols-outlined text-lg">verified</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] leading-relaxed">Ready for public catalogue sync.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

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
                                        onChange={(event) => updateField('price', event.target.value)}
                                        aria-required
                                        className="bg-transparent border-none p-0 text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-black w-full outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/3 border border-white/5 rounded-[1.5rem] lg:rounded-[3rem] p-5 sm:p-8 lg:p-10 space-y-6 lg:space-y-10">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-5 lg:mb-8">Catalogue Status</label>
                                    <div className="space-y-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xl font-heading font-black text-white uppercase italic tracking-tight">{status.replace('_', ' ')}</span>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Available vehicles appear in inventory. Featured available vehicles also appear on the homepage.</span>
                                        </div>
                                <select
                                    value={status}
                                    onChange={(event) => { setStatus(event.target.value as Vehicle['status']); setIsDirty(true); }}
                                    className="w-full bg-white/3 border border-white/10 rounded-2xl px-5 py-4 text-white font-black uppercase tracking-[0.2em] text-[10px] outline-none focus:border-primary/40 transition-all"
                                >
                                            <option value="draft" className="bg-slate-900">Draft</option>
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
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ready for catalogue sync after save</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <span className="material-symbols-outlined text-lg">cloud_sync</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Public pages revalidate after save</span>
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
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Only available vehicles appear in the featured section.</span>
                                        </span>
                                        <motion.span animate={{ scale: isFeatured ? [1, 1.25, 1] : 1 }} className="material-symbols-outlined">{isFeatured ? 'star' : 'star_outline'}</motion.span>
                                    </button>
                                </div>

                                {!isNew && (
                                    <div className="pt-6 lg:pt-10 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setDeleteOpen(true)}
                                            className="w-full py-5 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500"
                                        >
                                            REMOVE VEHICLE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </aside>
                </motion.div>
            </main>

            <div className="sm:hidden fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-background-dark/95 backdrop-blur-2xl p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <div className="grid grid-cols-2 gap-2">
                    <SaveVehicleButton intent="draft">Draft</SaveVehicleButton>
                    <SaveVehicleButton>Publish</SaveVehicleButton>
                    {!isNew && (
                        <>
                            <MotionButton href={`/vehicle/${vehicleId}`} variant="outline" className="h-11">
                                Preview
                            </MotionButton>
                            <button
                                type="button"
                                onClick={() => setDeleteOpen(true)}
                                className="h-11 rounded-2xl border border-red-500/25 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

        </form>

        {!isNew && (
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogHeader onClose={() => setDeleteOpen(false)}>
                    <DialogTitle>Remove Vehicle</DialogTitle>
                    <DialogDescription>Typed confirmation required</DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-5 text-red-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed">
                                This permanently removes the admin record, gallery images, public vehicle page, and catalogue listing for {vehicle?.year} {vehicle?.make} {vehicle?.model}.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <form action={markDraftAction}>
                                <StatusActionButton className="bg-white/3 border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
                                    Save as draft
                                </StatusActionButton>
                            </form>
                            <form action={markReservedAction}>
                                <StatusActionButton className="bg-orange-500/5 border-orange-500/20 text-orange-400 hover:bg-orange-500/10">
                                    Mark reserved instead
                                </StatusActionButton>
                            </form>
                            <form action={markSoldAction}>
                                <StatusActionButton className="bg-red-500/5 border-red-500/20 text-red-300 hover:bg-red-500/10">
                                    Mark sold instead
                                </StatusActionButton>
                            </form>
                        </div>
                        <label className="block space-y-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Type {deleteTarget} to confirm delete</span>
                            <input
                                value={deleteConfirmation}
                                onChange={(event) => setDeleteConfirmation(event.target.value)}
                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-red-500/50"
                            />
                        </label>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="grid grid-cols-1 sm:flex sm:flex-row sm:justify-end gap-3">
                        <button type="button" onClick={() => setDeleteOpen(false)} className="h-12 rounded-2xl bg-white/3 border border-white/10 px-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 hover:text-white transition-all">
                            Cancel
                        </button>
                        <form action={deleteAction}>
                            <DeleteConfirmButton disabled={!canDelete} />
                        </form>
                    </div>
                </DialogFooter>
            </Dialog>
        )}
        </>
    );
}
