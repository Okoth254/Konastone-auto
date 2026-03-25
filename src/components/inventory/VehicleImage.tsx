'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VehicleImageProps {
    src: string;
    alt: string;
    className?: string;
    hideOnError?: boolean;
}

export default function VehicleImage({ src, alt, className, hideOnError = false }: VehicleImageProps) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        if (hideOnError) return null;
        return (
            <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Image not available</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
        />
    );
}
