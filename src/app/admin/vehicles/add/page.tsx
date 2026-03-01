"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadImage, deleteImage } from "@/lib/storage";
import { Save, ImagePlus, X, AlertCircle, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Brand { id: string; name: string; }
interface Model { id: string; name: string; brand_id: string; body_type: string; }

export default function AddVehiclePage() {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [allModels, setAllModels] = useState<Model[]>([]);
    const [filteredModels, setFilteredModels] = useState<Model[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [selectedBrand, setSelectedBrand] = useState("");
    const [modelId, setModelId] = useState("");
    const [title, setTitle] = useState("");
    const [condition, setCondition] = useState("Used");
    const [year, setYear] = useState(new Date().getFullYear());
    const [price, setPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [fuelType, setFuelType] = useState("Petrol");
    const [transmission, setTransmission] = useState("Automatic");
    const [location, setLocation] = useState("Mombasa");
    const [description, setDescription] = useState("");

    // HP State
    const [hpAvailable, setHpAvailable] = useState(false);
    const [minDeposit, setMinDeposit] = useState("");
    const [monthlyPayment, setMonthlyPayment] = useState("");

    // Features State (Array of strings)
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");

    // Images State
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Initial Data Fetch
    useEffect(() => {
        async function fetchTaxonomy() {
            const { data: bData } = await supabase.from("brands").select("id, name").order("name");
            const { data: mData } = await supabase.from("models").select("id, name, brand_id, body_type").order("name");
            if (bData) setBrands(bData);
            if (mData) setAllModels(mData);
        }
        fetchTaxonomy();
    }, []);

    // Filter models when brand changes
    useEffect(() => {
        if (selectedBrand) {
            setFilteredModels(allModels.filter(m => m.brand_id === selectedBrand));
        } else {
            setFilteredModels([]);
        }
        setModelId(""); // Reset model when brand changes
    }, [selectedBrand, allModels]);

    const handleFeatureAdd = (e: React.KeyboardEvent | React.MouseEvent) => {
        // Only trigger on Enter key or explicit mouse click, NOT spacebar
        if (('key' in e && e.key !== 'Enter') || !newFeature.trim()) return;
        e.preventDefault();

        if (!features.includes(newFeature.trim())) {
            setFeatures([...features, newFeature.trim()]);
        }
        setNewFeature("");
    };

    const removeFeature = (fToRemove: string) => {
        setFeatures(features.filter(f => f !== fToRemove));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...newFiles]);

        // Generate immediate local previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]); // Cleanup memory
            newUrls.splice(index, 1);
            return newUrls;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modelId) {
            setError("Please select a specific model.");
            return;
        }
        if (selectedFiles.length === 0) {
            setError("Please upload at least one image.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Insert vehicle info first to get the car ID
            const { data: carData, error: carError } = await supabase
                .from("cars")
                .insert([{
                    model_id: modelId,
                    title: title.trim(),
                    condition,
                    year: Number(year),
                    price: Number(price.replace(/,/g, '')),
                    mileage: Number(mileage.replace(/,/g, '')),
                    fuel_type: fuelType,
                    transmission,
                    location,
                    description: description.trim(),
                    hire_purchase_available: hpAvailable,
                    min_deposit: hpAvailable ? Number(minDeposit.replace(/,/g, '')) : 0,
                    monthly_payment: hpAvailable ? Number(monthlyPayment.replace(/,/g, '')) : 0,
                    specifications: { features },
                    status: "available"
                }] as any)
                .select("id")
                .single();

            if (carError) throw carError;
            const carId = carData.id;

            // 2. Upload images sequentially
            // Provide a slugified folder name like "toyota-fielder-1234"
            const brandName = brands.find(b => b.id === selectedBrand)?.name || "brand";
            const modelName = allModels.find(m => m.id === modelId)?.name || "model";
            const folderName = `${brandName}-${modelName}`.toLowerCase().replace(/\s+/g, '-');

            const uploadedUrls: string[] = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                setUploadProgress(Math.round(((i) / selectedFiles.length) * 100)); // Update progress
                const file = selectedFiles[i];
                const publicUrl = await uploadImage(file, folderName);
                uploadedUrls.push(publicUrl);
            }
            setUploadProgress(100);

            // 3. Map uploaded URLs to the car_images table
            const imageRecords = uploadedUrls.map((url, i) => ({
                car_id: carId,
                image_url: url,
                is_primary: i === 0, // First image is primary
                sort_order: i
            }));

            const { error: imgError } = await supabase.from("car_images").insert(imageRecords as any);
            if (imgError) throw imgError;

            // Success! Route back to inventory
            router.push("/admin/vehicles");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred while saving the vehicle.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl animate-fade-in pb-12">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/admin/vehicles" className="p-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] rounded-lg text-[#F5F5F5] transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading tracking-widest text-[#F5F5F5] uppercase">Add Vehicle</h1>
                    <p className="font-mono text-sm text-[#9CA3AF] mt-1">Publish a new car to the active inventory.</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-mono text-red-500 leading-relaxed">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Taxonomy */}
                <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
                    <h2 className="text-lg font-heading tracking-widest text-[#FFC107] uppercase mb-4 border-b border-[#333333] pb-2">1. Vehicle Identity</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Display Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 2019 Toyota Fielder Hybrid WXB" required className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Brand (Make)</label>
                                <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} required className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none">
                                    <option value="">Select Brand...</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Model</label>
                                <select value={modelId} onChange={e => setModelId(e.target.value)} required disabled={!selectedBrand} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none disabled:opacity-50">
                                    <option value="">Select Model...</option>
                                    {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name} ({m.body_type})</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Specifications */}
                <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
                    <h2 className="text-lg font-heading tracking-widest text-[#26C6DA] uppercase mb-4 border-b border-[#333333] pb-2">2. Specifications & Price</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Cash Price (KES)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 2500000" min="0" required className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Mileage (KM)</label>
                            <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="e.g. 60000" min="0" required className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Year</label>
                            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} min="1990" max={new Date().getFullYear() + 1} required className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Condition</label>
                            <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none">
                                <option value="Used">Foreign Used</option>
                                <option value="New">Brand New</option>
                                <option value="Local">Locally Used</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Transmission</label>
                            <select value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none">
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                                <option value="Tiptronic">Tiptronic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Fuel Type</label>
                            <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none">
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Showroom Location</label>
                            <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none">
                                <option value="Mombasa">Mombasa</option>
                                <option value="Nairobi">Nairobi</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 3. Description & Features */}
                <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
                    <h2 className="text-lg font-heading tracking-widest text-[#E53935] uppercase mb-4 border-b border-[#333333] pb-2">3. Features & Description</h2>

                    <div className="mb-6">
                        <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Marketing Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Write a compelling description for this vehicle..." className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none resize-y" />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-[#D1D5DB] uppercase mb-2">Key Features</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {features.map((f, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-[#333333] text-[#F5F5F5] font-mono text-xs px-3 py-1.5 rounded-full">
                                    {f}
                                    <button type="button" onClick={() => removeFeature(f)} className="hover:text-[#E53935]"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={e => setNewFeature(e.target.value)}
                                onKeyDown={handleFeatureAdd}
                                placeholder="e.g. Leather Seats (Press Enter to add)"
                                className="flex-1 bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none"
                            />
                            <button type="button" onClick={handleFeatureAdd} className="bg-[#333333] hover:bg-[#444444] text-[#F5F5F5] px-4 rounded-md font-mono text-xs uppercase tracking-widest transition-colors">Add</button>
                        </div>
                    </div>
                </section>

                {/* 4. Hire Purchase */}
                <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
                    <div className="flex items-center justify-between border-b border-[#333333] pb-2 mb-4">
                        <h2 className="text-lg font-heading tracking-widest text-[#25D366] uppercase">4. Hire Purchase</h2>
                        <label className="flex items-center cursor-pointer relative">
                            <input type="checkbox" className="sr-only" checked={hpAvailable} onChange={e => setHpAvailable(e.target.checked)} />
                            <div className={`w-11 h-6 rounded-full transition-colors ${hpAvailable ? 'bg-[#25D366]' : 'bg-[#333333]'}`}>
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${hpAvailable ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </div>

                    {hpAvailable && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in uppercase">
                            <div>
                                <label className="block text-xs font-mono text-[#D1D5DB] mb-2">Required Deposit (KES)</label>
                                <input type="number" value={minDeposit} onChange={e => setMinDeposit(e.target.value)} placeholder="e.g. 700000" min="0" required={hpAvailable} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[#D1D5DB] mb-2">Monthly Installment (KES)</label>
                                <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} placeholder="e.g. 50000" min="0" required={hpAvailable} className="w-full bg-[#111111] border border-[#333333] rounded-md p-3 font-mono text-sm text-[#F5F5F5] focus:border-[#FFC107] outline-none" />
                            </div>
                        </div>
                    )}
                </section>

                {/* 5. Media Upload */}
                <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
                    <h2 className="text-lg font-heading tracking-widest text-[#F5F5F5] uppercase mb-4 border-b border-[#333333] pb-2">5. Media Upload</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                        {previewUrls.map((url, i) => (
                            <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[#333333] group">
                                <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                                {i === 0 && (
                                    <div className="absolute top-2 left-2 bg-[#FFC107] text-[#111111] text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">Primary</div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute inset-0 bg-red-500/80 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        ))}

                        <label className="aspect-video rounded-lg border-2 border-dashed border-[#444444] hover:border-[#FFC107] hover:bg-[#FFC107]/5 transition-colors flex flex-col justify-center items-center cursor-pointer">
                            <ImagePlus className="w-8 h-8 text-[#6B7280] mb-2" />
                            <span className="font-mono text-xs text-[#9CA3AF] uppercase">Add Photos</span>
                            <input type="file" multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageSelect} className="hidden" />
                        </label>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#FFC107] text-[#111111] px-10 py-4 rounded-xl font-slab font-bold text-lg uppercase tracking-widest hover:bg-[#FFD54F] transition-colors disabled:opacity-50 flex items-center gap-3 relative overflow-hidden group"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Publishing... {uploadProgress > 0 && `${uploadProgress}%`}
                            </>
                        ) : (
                            <>
                                <Save className="w-6 h-6" /> Save Vehicle
                            </>
                        )}
                        {isSubmitting && uploadProgress > 0 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
