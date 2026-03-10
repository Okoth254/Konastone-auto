'use client';

interface VehicleImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function VehicleImage({ src, alt, className }: VehicleImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
        />
    );
}
