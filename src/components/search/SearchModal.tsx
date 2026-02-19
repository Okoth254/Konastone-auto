"use client";

import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search, Car, HelpCircle, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { vehicles } from "@/lib/data";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    // Toggle scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredVehicles = vehicles.filter(v =>
        `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase()) ||
        v.make.toLowerCase().includes(search.toLowerCase())
    );

    const helpTopics = [
        { label: "How Hire Purchase Works", href: "/help" },
        { label: "Trade-in process", href: "/sell" },
        { label: "Contact Support", href: "/help" },
    ].filter(t => t.label.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = (href: string) => {
        router.push(href);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-gray-200">
                <div className="flex items-center px-4 border-b border-gray-100">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        autoFocus
                        placeholder="Search vehicles, help topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 h-14 outline-none text-lg placeholder:text-gray-400"
                    />
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredVehicles.length === 0 && helpTopics.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                            No results found.
                        </div>
                    )}

                    {filteredVehicles.length > 0 && (
                        <div className="mb-4">
                            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicles</h3>
                            <div className="space-y-1">
                                {filteredVehicles.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleSelect(`/vehicle/${v.id}`)}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 group transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                <img src={v.image} alt={`${v.year} ${v.make} ${v.model}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-trust-900 group-hover:text-action-teal transition-colors">{v.year} {v.make} {v.model}</p>
                                                <p className="text-sm text-gray-500">{v.category} • {v.fuelType}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {helpTopics.length > 0 && (
                        <div>
                            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Help & Guide</h3>
                            <div className="space-y-1">
                                {helpTopics.map((topic, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(topic.href)}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 group text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-trust-50 text-trust-600 group-hover:bg-action-teal group-hover:text-white transition-colors">
                                            <HelpCircle className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-700 group-hover:text-trust-900">{topic.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                    <span>Pro tip: Press <kbd className="font-sans px-1.5 py-0.5 rounded bg-white border border-gray-200">⌘K</kbd> to open</span>
                    <span>Konastone Motors</span>
                </div>
            </div>
        </div>
    );
}
