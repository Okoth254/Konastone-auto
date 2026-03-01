"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Tag, Layers, RefreshCw } from "lucide-react";

interface Brand {
    id: string;
    name: string;
    slug: string;
}

interface Model {
    id: string;
    brand_id: string;
    name: string;
    body_type: string;
}

export default function TaxonomyManager() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form inputs
    const [newBrandName, setNewBrandName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newModelName, setNewModelName] = useState("");
    const [newModelBrandId, setNewModelBrandId] = useState("");
    const [newModelBody, setNewModelBody] = useState("suv");

    const fetchData = async () => {
        setIsLoading(true);
        const { data: bData } = await supabase.from("brands").select("*").order("name");
        const { data: mData } = await supabase.from("models").select("*").order("name");

        if (bData) setBrands(bData);
        if (mData) setModels(mData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBrandName.trim()) return;
        setIsSubmitting(true);

        const slug = newBrandName.trim().toLowerCase().replace(/\s+/g, '-');

        const { error } = await supabase
            .from("brands")
            .insert([{ name: newBrandName.trim(), slug }] as any);

        if (!error) {
            setNewBrandName("");
            fetchData();
        } else {
            console.error("Failed to add brand:", error);
            alert("Failed to add brand. Ensure it doesn't already exist.");
        }
        setIsSubmitting(false);
    };

    const handleDeleteBrand = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This may cascade and delete associated models and cars.`)) return;

        const { error } = await supabase.from("brands").delete().eq("id", id);
        if (!error) {
            fetchData();
        } else {
            alert("Failed to delete brand.");
        }
    };

    const handleAddModel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newModelName.trim() || !newModelBrandId) return;
        setIsSubmitting(true);

        const { error } = await supabase
            .from("models")
            .insert([{
                name: newModelName.trim(),
                brand_id: newModelBrandId,
                body_type: newModelBody
            }] as any);

        if (!error) {
            setNewModelName("");
            fetchData();
        } else {
            console.error("Failed to add model:", error);
            alert("Failed to add model.");
        }
        setIsSubmitting(false);
    };

    const handleDeleteModel = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This will delete all cars associated with it.`)) return;

        const { error } = await supabase.from("models").delete().eq("id", id);
        if (!error) {
            fetchData();
        } else {
            alert("Failed to delete model.");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading tracking-widest text-[#F5F5F5] uppercase">
                        Taxonomy
                    </h1>
                    <p className="font-mono text-sm text-[#9CA3AF] mt-2">
                        Manage vehicle makes (Brands) and specific Models.
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 text-[#9CA3AF] hover:text-[#FFC107] transition-colors rounded-lg hover:bg-[#222222]"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BRANDS COLUMN */}
                <div className="space-y-6">
                    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
                        <h2 className="text-xl font-heading tracking-widest text-[#F5F5F5] uppercase flex items-center gap-3 mb-6">
                            <Tag className="w-5 h-5 text-[#FFC107]" /> Add Brand
                        </h2>
                        <form onSubmit={handleAddBrand} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="e.g. Toyota"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                className="flex-1 bg-[#111111] border border-[#333333] rounded-md px-4 py-2 text-[#F5F5F5] font-mono focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#FFC107] text-[#111111] px-4 py-2 rounded-md font-mono uppercase tracking-widest text-sm hover:bg-[#FFD54F] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
                        <div className="p-4 border-b border-[#333333] bg-[#222222]">
                            <h3 className="font-mono text-sm tracking-widest text-[#D1D5DB] uppercase">Active Brands</h3>
                        </div>
                        <ul className="divide-y divide-[#333333] max-h-[500px] overflow-y-auto custom-scrollbar">
                            {brands.map(brand => (
                                <li key={brand.id} className="p-4 flex justify-between items-center hover:bg-[#222222] transition-colors">
                                    <span className="font-slab font-bold text-lg text-[#F5F5F5]">{brand.name}</span>
                                    <button
                                        onClick={() => handleDeleteBrand(brand.id, brand.name)}
                                        className="text-[#6B7280] hover:text-[#E53935] transition-colors p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                            {brands.length === 0 && !isLoading && (
                                <li className="p-8 text-center text-[#6B7280] font-mono text-sm">No brands found.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* MODELS COLUMN */}
                <div className="space-y-6">
                    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
                        <h2 className="text-xl font-heading tracking-widest text-[#F5F5F5] uppercase flex items-center gap-3 mb-6">
                            <Layers className="w-5 h-5 text-[#26C6DA]" /> Add Model
                        </h2>
                        <form onSubmit={handleAddModel} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={newModelBrandId}
                                    onChange={(e) => setNewModelBrandId(e.target.value)}
                                    className="bg-[#111111] border border-[#333333] rounded-md px-4 py-2 text-[#F5F5F5] font-mono focus:border-[#FFC107] outline-none"
                                    required
                                >
                                    <option value="">Select Brand...</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={newModelBody}
                                    onChange={(e) => setNewModelBody(e.target.value)}
                                    className="bg-[#111111] border border-[#333333] rounded-md px-4 py-2 text-[#F5F5F5] font-mono focus:border-[#FFC107] outline-none"
                                >
                                    <option value="suv">SUV</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="truck">Truck</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="e.g. Fielder"
                                    value={newModelName}
                                    onChange={(e) => setNewModelName(e.target.value)}
                                    className="flex-1 bg-[#111111] border border-[#333333] rounded-md px-4 py-2 text-[#F5F5F5] font-mono focus:border-[#FFC107] outline-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newModelBrandId}
                                    className="bg-[#FFC107] text-[#111111] px-4 py-2 rounded-md font-mono uppercase tracking-widest text-sm hover:bg-[#FFD54F] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
                        <div className="p-4 border-b border-[#333333] bg-[#222222]">
                            <h3 className="font-mono text-sm tracking-widest text-[#D1D5DB] uppercase">Active Models</h3>
                        </div>
                        <ul className="divide-y divide-[#333333] max-h-[500px] overflow-y-auto custom-scrollbar">
                            {models.map(model => {
                                const parentBrand = brands.find(b => b.id === model.brand_id);
                                return (
                                    <li key={model.id} className="p-4 flex justify-between items-center hover:bg-[#222222] transition-colors">
                                        <div>
                                            <span className="font-slab font-bold text-lg text-[#F5F5F5]">{model.name}</span>
                                            <div className="flex gap-3 mt-1">
                                                <span className="font-mono text-[10px] bg-[#333333] text-[#9CA3AF] px-2 py-0.5 rounded uppercase">{parentBrand?.name || 'Unknown'}</span>
                                                <span className="font-mono text-[10px] border border-[#FFC107]/30 text-[#FFC107] px-2 py-0.5 rounded uppercase">{model.body_type}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteModel(model.id, model.name)}
                                            className="text-[#6B7280] hover:text-[#E53935] transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                );
                            })}
                            {models.length === 0 && !isLoading && (
                                <li className="p-8 text-center text-[#6B7280] font-mono text-sm">No models found.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
