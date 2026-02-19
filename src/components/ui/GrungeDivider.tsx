/**
 * GrungeDivider
 * A decorative section separator using the brand's hazard-tape yellow/black stripe.
 * Usage: <GrungeDivider /> between major page sections.
 */
interface GrungeDividerProps {
    /** Height of the stripe in pixels (default 8) */
    height?: number;
    /** Opacity 0–100 (default 70) */
    opacity?: number;
    /** Show a text label in the centre */
    label?: string;
}

export function GrungeDivider({ height = 8, opacity = 70, label }: GrungeDividerProps) {
    if (label) {
        return (
            <div className="relative flex items-center my-2">
                {/* Left stripe */}
                <div
                    className="flex-1"
                    style={{
                        height,
                        opacity: opacity / 100,
                        backgroundImage: "repeating-linear-gradient(-45deg,#FFC107,#FFC107 8px,#1A1A1A 8px,#1A1A1A 16px)",
                    }}
                />
                {/* Centre label */}
                <span className="px-6 font-heading uppercase tracking-[0.3em] text-sm text-[#FFC107] bg-[#1A1A1A] whitespace-nowrap">
                    {label}
                </span>
                {/* Right stripe */}
                <div
                    className="flex-1"
                    style={{
                        height,
                        opacity: opacity / 100,
                        backgroundImage: "repeating-linear-gradient(-45deg,#FFC107,#FFC107 8px,#1A1A1A 8px,#1A1A1A 16px)",
                    }}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                height,
                opacity: opacity / 100,
                backgroundImage: "repeating-linear-gradient(-45deg,#FFC107,#FFC107 8px,#1A1A1A 8px,#1A1A1A 16px)",
            }}
        />
    );
}
