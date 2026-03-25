"use client";
import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Image from 'next/image';
import Link from 'next/link';

export function BrandCarousel({ makes, brandLogoMap }: { makes: string[], brandLogoMap: Record<string, { src: string, alt: string }> }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true }, [
        AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 1.2 })
    ]);

    useEffect(() => {
        if (emblaApi) emblaApi.reInit();
    }, [emblaApi, makes]);

    const pauseScroll = () => {
        const plugin = emblaApi?.plugins()?.autoScroll as { stop?: () => void } | undefined;
        plugin?.stop?.();
    };
    const resumeScroll = () => {
        const plugin = emblaApi?.plugins()?.autoScroll as { play?: () => void } | undefined;
        plugin?.play?.();
    };

    return (
        <div
            className="overflow-hidden cursor-grab active:cursor-grabbing w-full pb-8 relative"
            ref={emblaRef}
            onMouseEnter={pauseScroll}
            onMouseLeave={resumeScroll}
            style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
        >
            <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                {makes.map((make, idx) => {
                    const brandInfo = brandLogoMap[make];
                    return (
                        <div key={idx} className="flex-[0_0_auto] min-w-0 px-3 md:px-5">
                            <Link
                                className="group glass-dark rounded-2xl w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center border border-transparent hover:border-secondary hover:scale-[1.02] transition-all duration-300 shadow-lg"
                                href={`/inventory?make=${make.toLowerCase()}`}
                            >
                                {brandInfo ? (
                                    <Image alt={brandInfo.alt} className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 pointer-events-none" src={brandInfo.src} width={80} height={80} />
                                ) : (
                                    <span className="text-white font-display text-xl uppercase opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">{make}</span>
                                )}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
