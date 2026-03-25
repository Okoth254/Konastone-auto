"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX.current - touchEndX;

        // Swipe left -> Next image
        if (deltaX > 50) {
            setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        }
        // Swipe right -> Previous image
        else if (deltaX < -50) {
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        }
        touchStartX.current = null;
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === "Escape") setIsLightboxOpen(false);
            if (e.key === "ArrowRight") setCurrentIndex((p) => (p < images.length - 1 ? p + 1 : 0));
            if (e.key === "ArrowLeft") setCurrentIndex((p) => (p > 0 ? p - 1 : images.length - 1));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Main Image View */}
            <div 
                className="w-full aspect-video bg-surface-dark rounded-xl overflow-hidden relative border border-border-subtle group cursor-pointer"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image
                    fill
                    alt={`Vehicle View ${currentIndex + 1}`}
                    className="object-cover transition-opacity duration-300"
                    src={images[currentIndex]}
                    priority
                />
                
                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold font-mono border border-border-subtle z-10">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
                
                <button className="absolute bottom-4 right-4 glass-dark p-2 rounded-full text-accent-teal hover:bg-accent-teal/20 transition-colors opacity-0 group-hover:opacity-100 z-10 md:block hidden">
                    <span className="material-symbols-outlined">fullscreen</span>
                </button>
            </div>

            {/* Thumbnail Scroll */}
            {images.length > 1 && (
                <div className="flex flex-nowrap gap-3 h-20 md:h-24 overflow-x-auto pb-2 custom-scrollbar scroll-smooth snap-x">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-none w-32 h-full rounded overflow-hidden relative cursor-pointer transition-all duration-200 snap-start border-2 ${
                                currentIndex === idx ? "border-primary scale-[1.03]" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                            <Image fill alt={`Thumb ${idx + 1}`} className="object-cover" src={img} />
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md" onClick={() => setIsLightboxOpen(false)}>
                    <button 
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors z-50"
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                    
                    <div className="relative w-full max-w-6xl aspect-video flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Image
                            fill
                            alt={`Fullscreen View ${currentIndex + 1}`}
                            className="object-contain"
                            src={images[currentIndex]}
                            priority
                        />
                        
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm border border-white/10"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm border border-white/10"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                                
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/50 font-mono tracking-widest text-sm">
                                    {currentIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
