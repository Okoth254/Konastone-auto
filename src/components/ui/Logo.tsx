"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * ─────────────────────────────────────────────────────────────
 *  LOGO COMPONENT
 *  Drop your logo file into /public/logo.png (or .svg / .webp)
 *  then set  USE_IMAGE = true  to instantly switch from text
 *  to the real Konastone logo across the whole site.
 * ─────────────────────────────────────────────────────────────
 */

// Logo image is live — /public/logo.svg is present
const USE_IMAGE = true;
const LOGO_SRC = "/logo.svg";
const LOGO_ALT = "Konastone Motors";

interface LogoProps {
    /** Controls the rendered size of the image logo (ignored for text variant) */
    width?: number;
    height?: number;
    /** Extra Tailwind classes on the root wrapper */
    className?: string;
    /** If true, wraps logo in a <Link href="/"> */
    linked?: boolean;
    /** Colour variant for the text fallback */
    variant?: "light" | "dark";
}

export function Logo({
    width = 160,
    height = 40,
    className = "",
    linked = true,
    variant = "light",
}: LogoProps) {
    const textClasses =
        variant === "light"
            ? "text-white"
            : "text-trust-900";

    const inner = USE_IMAGE ? (
        <Image
            src={LOGO_SRC}
            alt={LOGO_ALT}
            width={width}
            height={height}
            priority
            style={{ height: "auto" }}
            className={`object-contain ${className}`}
        />
    ) : (
        /* ── TEXT FALLBACK (remove once real logo is in place) ── */
        <span
            className={`text-2xl font-bold tracking-tight ${textClasses} ${className}`}
            aria-label={LOGO_ALT}
        >
            KONASTONE
        </span>
    );

    return linked ? (
        <Link href="/" aria-label="Go to homepage">
            {inner}
        </Link>
    ) : (
        <>{inner}</>
    );
}
