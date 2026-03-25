"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ 
        loop: true,
        duration: 30,
        dragFree: false
    });
    const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
        slidesToScroll: 1
    });

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
        if (!emblaMainApi) return;
        
        emblaMainApi.on("select", onSelect);
        emblaMainApi.on("reInit", onSelect);
        
        const timer = setTimeout(() => {
            if (emblaMainApi.internalEngine()) {
                onSelect();
            }
        }, 0);

        return () => {
            clearTimeout(timer);
            emblaMainApi.off("select", onSelect);
            emblaMainApi.off("reInit", onSelect);
        };
    }, [emblaMainApi, onSelect]);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Main Carousel */}
            <div className="relative group/gallery overflow-hidden rounded-3xl bg-background-dark border border-border-subtle shadow-2xl">
                <div className="overflow-hidden" ref={mainViewportRef}>
                    <div className="flex touch-pan-y cursor-grab active:cursor-grabbing">
                        {images.map((src, index) => (
                            <div key={`${src}-${index}`} className="flex-[0_0_100%] min-w-0 relative aspect-video" onClick={() => setLightboxIndex(index)}>
                                <Image
                                    src={src}
                                    alt={`Vehicle View ${index + 1}`}
                                    fill
                                    priority={index === 0}
                                    className="object-cover transition-transform duration-700 group-hover/gallery:scale-105"
                                    sizes="(max-width: 768px) 100vw, 80vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background-dark/40 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Counter */}
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-background-dark/80 backdrop-blur-xl rounded-full border border-white/10 text-white text-[10px] font-black tracking-widest uppercase z-10 shadow-2xl">
                    {selectedIndex + 1} <span className="text-slate-500 mx-1">/</span> {images.length}
                </div>

                {/* Navigation Arrows */}
                <button 
                    onClick={() => emblaMainApi?.scrollPrev()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-primary hover:text-background-dark -translate-x-4 group-hover/gallery:translate-x-0"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                    onClick={() => emblaMainApi?.scrollNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-primary hover:text-background-dark translate-x-4 group-hover/gallery:translate-x-0"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Thumbnails */}
            <div className="overflow-hidden" ref={thumbViewportRef}>
                <div className="flex gap-3 px-1">
                    {images.map((src, index) => (
                        <div
                            key={`thumb-${src}-${index}`}
                            onClick={() => onThumbClick(index)}
                            className={`flex-[0_0_20%] min-w-[100px] aspect-video relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                index === selectedIndex 
                                ? "border-primary opacity-100 scale-95 shadow-lg shadow-primary/20" 
                                : "border-transparent opacity-40 hover:opacity-70"
                            }`}
                        >
                            <Image
                                src={src}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="100px"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-70 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,191,41,0.15)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[lightboxIndex]}
                                alt="Full View"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = (lightboxIndex - 1 + images.length) % images.length;
                                    setLightboxIndex(next);
                                }}
                                className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-background-dark transition-all border border-white/10"
                            >
                                <span className="material-symbols-outlined text-3xl">arrow_back</span>
                            </button>
                            <div className="px-6 py-2 bg-white/10 rounded-full border border-white/10 text-white font-black tracking-widest uppercase">
                                {lightboxIndex + 1} / {images.length}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = (lightboxIndex + 1) % images.length;
                                    setLightboxIndex(next);
                                }}
                                className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-background-dark transition-all border border-white/10"
                            >
                                <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
