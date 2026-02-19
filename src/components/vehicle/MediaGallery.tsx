"use client";

import { Vehicle } from "@/lib/data";

export function MediaGallery({ vehicle }: { vehicle: Vehicle }) {
    return (
        <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[16/10] w-full bg-[#111111] border border-[#2D2D2D] overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <span className="font-heading text-4xl uppercase tracking-widest text-[#2D2D2D] select-none">
                        {vehicle.make} {vehicle.model}
                    </span>
                </div>

                {/* Yellow top bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FFC107] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

                {/* Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="bg-[#1A1A1A]/80 backdrop-blur-md border border-[#FFC107]/30 px-4 py-2 font-mono text-xs text-[#FFC107] uppercase tracking-widest hover:bg-[#FFC107]/10 transition-all">
                        360° View
                    </button>
                    <button className="bg-[#FFC107] border border-[#FFC107] px-4 py-2 font-mono text-xs text-black uppercase tracking-widest hover:bg-[#E6AC00] transition-all">
                        Gallery (12)
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="aspect-video bg-[#111111] border border-[#2D2D2D] overflow-hidden cursor-pointer hover:border-[#FFC107] transition-colors"
                    >
                        <div className="w-full h-full hover:bg-[#1E1E1E] transition-colors flex items-center justify-center">
                            <span className="font-mono text-[9px] text-[#2D2D2D] uppercase tracking-widest">{i}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
