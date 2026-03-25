"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ 
        loop: true,
        duration: 40,
        dragFree: false,
        startIndex: 0,
        watchDrag: true,
        watchFocus: true
    });
    const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "trimSnaps",
        dragFree: true,
        slidesToScroll: 1,
        startIndex: 0
    });

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const lightboxX = useMotionValue(0);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, images.length]);

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        const newIndex = emblaMainApi.selectedScrollSnap();
        setSelectedIndex(newIndex);
        emblaThumbsApi.scrollTo(newIndex, true);
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
        if (!emblaMainApi) return;
        
        const handleSelect = () => {
            onSelect();
        };

        emblaMainApi.on("select", handleSelect);
        emblaMainApi.on("reInit", handleSelect);
        
        // Initial sync after a short delay to ensure carousels are ready
        const timer = setTimeout(() => {
            handleSelect();
        }, 100);

        return () => {
            clearTimeout(timer);
            emblaMainApi.off("select", handleSelect);
            emblaMainApi.off("reInit", handleSelect);
        };
    }, [emblaMainApi, onSelect]);

    // Also sync when emblaThumbsApi becomes available
    useEffect(() => {
        if (!emblaThumbsApi || !emblaMainApi) return;
        const newIndex = emblaMainApi.selectedScrollSnap();
        emblaThumbsApi.scrollTo(newIndex, true);
    }, [emblaThumbsApi, emblaMainApi]);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            {/* Main Carousel */}
            <div className="relative group/gallery overflow-hidden rounded-3xl bg-background-dark border border-border-subtle shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="overflow-hidden" ref={mainViewportRef}>
                    <div className="flex touch-pan-y cursor-grab active:cursor-grabbing">
                        {images.map((src, index) => (
                            <div 
                                key={`${src}-${index}`} 
                                className="flex-[0_0_100%] min-w-0 relative aspect-video overflow-hidden" 
                                onClick={() => setLightboxIndex(index)}
                            >
                                <motion.div
                                    animate={{ 
                                        scale: index === selectedIndex ? 1 : 0.95,
                                        opacity: index === selectedIndex ? 1 : 0.7 
                                    }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={src}
                                        alt={`Vehicle View ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/gallery:scale-105"
                                        sizes="(max-width: 768px) 100vw, 80vw"
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-linear-to-t from-background-dark/40 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl"
                                    >
                                        <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Indicators (Snap Dots) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 px-3 py-1.5 bg-background-dark/40 backdrop-blur-md rounded-full border border-white/5">
                    {images.map((_, i) => (
                        <div 
                            key={`dot-${i}`} 
                            className={`h-1 rounded-full transition-all duration-500 ${
                                i === selectedIndex ? "w-8 bg-primary" : "w-1.5 bg-white/20"
                            }`}
                        />
                    ))}
                </div>

                {/* Counter */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-background-dark/80 backdrop-blur-xl rounded-full border border-white/10 text-white text-[10px] font-black tracking-widest uppercase z-10 shadow-2xl">
                    {selectedIndex + 1} <span className="text-slate-500 mx-1">/</span> {images.length}
                </div>

                {/* Navigation Arrows */}
                <div className="hidden md:block">
                    <button 
                        onClick={() => emblaMainApi?.scrollPrev()}
                        className="tap-highlight-none absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-primary hover:text-background-dark -translate-x-4 group-hover/gallery:translate-x-0 group/btn"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover/btn:-translate-x-0.5">chevron_left</span>
                    </button>
                    <button 
                        onClick={() => emblaMainApi?.scrollNext()}
                        className="tap-highlight-none absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-primary hover:text-background-dark translate-x-4 group-hover/gallery:translate-x-0 group/btn"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-0.5">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="overflow-hidden" ref={thumbViewportRef}>
                <div className="flex gap-4 px-1">
                    {images.map((src, index) => (
                        <div key={`thumb-${src}-${index}`} className="flex flex-col gap-2">
                            <motion.div
                                onClick={() => onThumbClick(index)}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-[0_0_22%] min-w-[120px] aspect-video relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ease-[0.16,1,0.3,1] ${
                                    index === selectedIndex 
                                    ? "border-primary opacity-100 shadow-[0_12px_24px_-8px_rgba(255,191,41,0.4)]" 
                                    : "border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
                                }`}
                            >
                                <Image
                                    src={src}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="150px"
                                />
                            </motion.div>
                            {/* Snap indicator */}
                            <motion.div 
                                animate={{ 
                                    width: index === selectedIndex ? "100%" : "0%",
                                    opacity: index === selectedIndex ? 1 : 0
                                }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="h-0.5 bg-primary rounded-full mx-auto"
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
                        className="fixed inset-0 z-70 bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="tap-highlight-none absolute top-8 right-8 w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10 z-80"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_120px_rgba(255,191,41,0.1)] cursor-grab active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.3}
                            style={{ x: lightboxX }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x > 100 || info.velocity.x > 500) {
                                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
                                } else if (info.offset.x < -100 || info.velocity.x < -500) {
                                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
                                }
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={lightboxIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={images[lightboxIndex]}
                                        alt="Full View"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Lightbox Navigation */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-10">
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = (lightboxIndex - 1 + images.length) % images.length;
                                    setLightboxIndex(next);
                                }}
                                className="tap-highlight-none w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-background-dark transition-all border border-white/10 group"
                            >
                                <span className="material-symbols-outlined text-3xl transition-transform group-hover:-translate-x-1">arrow_back</span>
                            </button>
                            <div className="flex flex-col items-center gap-1">
                                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-white font-black tracking-widest uppercase transition-all">
                                    {lightboxIndex + 1} / {images.length}
                                </div>
                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">View Gallery</div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = (lightboxIndex + 1) % images.length;
                                    setLightboxIndex(next);
                                }}
                                className="tap-highlight-none w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-background-dark transition-all border border-white/10 group"
                            >
                                <span className="material-symbols-outlined text-3xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
