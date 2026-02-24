"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Maximize2, Rotate3d } from "lucide-react";

export function MediaGallery({ vehicle }: { vehicle: Vehicle }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            {/* Main image */}
            <div className="relative aspect-[16/10] w-full bg-[#111111] border border-[#2D2D2D] overflow-hidden group">
                <img
                    key={activeIndex}
                    src={vehicle.images[activeIndex]}
                    alt={`${vehicle.make} ${vehicle.model} - Image ${activeIndex + 1}`}
                    className="w-full h-full object-cover animate-in fade-in scale-in-95 duration-500"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Yellow top bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FFC107] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-10" />

                {/* Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                    <button className="bg-[#1A1A1A]/80 backdrop-blur-md border border-[#FFC107]/30 px-4 py-2 font-mono text-[10px] text-[#FFC107] uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-all flex items-center gap-2">
                        <Rotate3d className="w-3 h-3" />
                        360° View
                    </button>
                    <button className="bg-[#FFC107] border border-[#FFC107] px-4 py-2 font-mono text-[10px] text-black uppercase tracking-widest hover:bg-[#E6AC00] transition-all flex items-center gap-2">
                        <Maximize2 className="w-3 h-3" />
                        Gallery ({vehicle.images.length})
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {vehicle.images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "aspect-video bg-[#111111] border overflow-hidden transition-all duration-300 relative",
                            activeIndex === i
                                ? "border-[#FFC107] ring-1 ring-[#FFC107]"
                                : "border-[#2D2D2D] hover:border-[#4B5563]"
                        )}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            className={cn(
                                "w-full h-full object-cover transition-opacity",
                                activeIndex !== i && "opacity-40 hover:opacity-100"
                            )}
                        />
                        {activeIndex === i && (
                            <div className="absolute inset-0 border-2 border-[#FFC107] pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
