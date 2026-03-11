"use client";

import { useState } from "react";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || "/placeholder.jpg");

    return (
        <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="w-full aspect-video bg-surface-dark rounded-xl overflow-hidden relative border border-border-subtle group">
                <img
                    alt="Vehicle Main View"
                    className="w-full h-full object-cover transition-opacity duration-300"
                    src={mainImage}
                    onError={(e) => { e.currentTarget.src = "/placeholder.jpg" }}
                />
                <button className="absolute bottom-4 right-4 glass-dark p-2 rounded-full text-accent-teal hover:bg-accent-teal/20 transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">fullscreen</span>
                </button>
            </div>

            {images.length > 1 && (
                <div className="flex flex-nowrap gap-2 h-20 md:h-24 overflow-x-auto pb-2 custom-scrollbar scroll-smooth">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`flex-none w-32 h-full rounded overflow-hidden cursor-pointer transition-all border-2 ${
                                mainImage === img ? "border-primary" : "border-border-subtle hover:border-primary/50 opacity-70 hover:opacity-100"
                            }`}
                        >
                            <img alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" src={img} onError={(e) => { e.currentTarget.src = "/placeholder.jpg" }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
