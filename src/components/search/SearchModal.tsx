"use client";

import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search, Car, HelpCircle, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getVehicles, type Vehicle } from "@/lib/data";

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (isOpen) {
            getVehicles().then(setVehicles);
        }
    }, [isOpen]);

    // Toggle scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredVehicles = searchQuery === ""
        ? []
        : vehicles.filter((v) =>
            `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Filter help topics (simplified mock)
    const filteredHelp = searchQuery === ""
        ? []
        : [
            "How to apply for finance?",
            "What is hire purchase?",
            "Exporting cars to Kenya",
            "Mombasa showroom location"
        ].filter(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleSelect = (href: string) => {
        router.push(href);
        onClose();
    };

    return (
        <Command.Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            label="Search cars and guides"
            className="fixed inset-0 z-[100] p-4 pt-[15vh] overflow-y-auto bg-[#0D0D0D]/90 backdrop-blur-sm animate-in fade-in duration-300"
        >
            <div className="mx-auto max-w-2xl w-full bg-[#1A1A1A] border border-[#2D2D2D] shadow-2xl overflow-hidden rounded-lg">
                <div className="flex items-center px-4 border-b border-[#2D2D2D]">
                    <Search className="w-5 h-5 text-[#4B5563]" />
                    <Command.Input
                        autoFocus
                        placeholder="Search cars, financing, guides..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className="w-full h-14 bg-transparent border-none text-trust-100 placeholder:text-[#4B5563] focus:ring-0 font-mono text-sm"
                    />
                    <button onClick={onClose} className="p-2 hover:bg-[#262626] rounded-lg text-[#4B5563] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#2D2D2D]">
                    <Command.List>
                        <Command.Empty className="py-12 text-center text-[#4B5563] font-mono text-xs uppercase tracking-widest">
                            No matching items found.
                        </Command.Empty>

                        {filteredVehicles.length > 0 && (
                            <Command.Group heading={<span className="px-3 py-2 text-[10px] font-mono font-semibold text-[#4B5563] uppercase tracking-wider block">Vehicles</span>}>
                                {filteredVehicles.map(v => (
                                    <Command.Item
                                        key={v.id}
                                        onSelect={() => handleSelect(`/vehicle/${v.id}`)}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-[#262626] aria-selected:bg-[#262626] group transition-colors text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded bg-[#0D0D0D] border border-[#2D2D2D] overflow-hidden shrink-0">
                                                <img src={v.images[0]} alt={`${v.year} ${v.make} ${v.model}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-heading uppercase text-sm text-[#F5F5F5] group-hover:text-[#FFC107] transition-colors">{v.year} {v.make} {v.model}</p>
                                                <p className="font-mono text-[10px] text-[#4B5563] uppercase">{v.category} • {v.fuelType}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-[#4B5563] group-hover:text-[#FFC107] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {filteredHelp.length > 0 && (
                            <Command.Group heading={<span className="px-3 py-2 text-[10px] font-mono font-semibold text-[#4B5563] uppercase tracking-wider block">Help & Guide</span>}>
                                {filteredHelp.map((topic, i) => (
                                    <Command.Item
                                        key={i}
                                        onSelect={() => handleSelect('/help')}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#262626] aria-selected:bg-[#262626] group text-left cursor-pointer"
                                    >
                                        <div className="p-2 rounded bg-[#0D0D0D] border border-[#2D2D2D] text-[#4B5563] group-hover:border-[#FFC107]/20 group-hover:text-[#FFC107] transition-colors">
                                            <HelpCircle className="w-4 h-4" />
                                        </div>
                                        <span className="font-mono text-xs text-[#9CA3AF] group-hover:text-[#F5F5F5] transition-colors">{topic}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </Command.List>
                </div>

                <div className="bg-[#111111] px-4 py-3 border-t border-[#2D2D2D] text-[10px] font-mono text-[#4B5563] uppercase tracking-widest flex justify-between">
                    <div className="flex gap-4">
                        <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-[#0D0D0D] border border-[#2D2D2D] text-[#9CA3AF]">↑↓</kbd> Navigate</span>
                        <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-[#0D0D0D] border border-[#2D2D2D] text-[#9CA3AF]">Enter</kbd> Select</span>
                    </div>
                    <span>Konastone Autos</span>
                </div>
            </div>
        </Command.Dialog>
    );
}
