"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "icon" | "outline";

interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: Variant;
    loading?: boolean;
    children?: ReactNode;
    href?: string;
    target?: string;
    rel?: string;
}

const variantClasses: Record<Variant, string> = {
    primary:
        "bg-primary-container/15 text-primary-container border border-primary-container/35 hover:bg-primary-container/25",
    secondary:
        "bg-admin-secondary/15 text-admin-secondary border border-admin-secondary/35 hover:bg-admin-secondary/25",
    ghost:
        "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100",
    outline:
        "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100",
    danger:
        "bg-red-900/20 text-red-400 border border-red-800/40 hover:bg-red-900/35 hover:text-red-300",
    icon: "bg-transparent text-zinc-400 border-0 p-2 hover:text-zinc-100",
};

const MotionWrapper = forwardRef<HTMLButtonElement | HTMLAnchorElement, MotionButtonProps>(
    (
        {
            variant = "primary",
            loading = false,
            disabled,
            children,
            className = "",
            href,
            target,
            rel,
            ...rest
        },
        ref
    ) => {
        const isDisabled = disabled || loading;
        const classes = [
            "btn-premium",
            variantClasses[variant],
            "relative inline-flex items-center justify-center gap-2 px-4 font-headline font-black tracking-widest text-[10px] uppercase",
            isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
            className,
        ].join(" ");

        const content = (
            <>
                {loading && (
                    <span
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden="true"
                    >
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    </span>
                )}
                <span className={loading ? "opacity-0" : ""}>{children}</span>
            </>
        );

        const motionProps = {
            whileHover: isDisabled ? {} : { y: -2 },
            whileTap: isDisabled ? {} : { scale: 0.98 },
            transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as any },
            className: classes,
            ...rest,
        };

        if (href) {
            const { name, value, type, ...anchorRest } = rest as any;
            const anchorMotionProps = {
                ...motionProps,
                ...anchorRest
            };
            return (
                <Link href={href} passHref legacyBehavior>
                    <motion.a 
                        ref={ref as any}
                        target={target}
                        rel={rel}
                        {...anchorMotionProps}
                    >
                        {content}
                    </motion.a>
                </Link>
            );
        }

        return (
            <motion.button
                ref={ref as any}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                {...motionProps}
            >
                {content}
            </motion.button>
        );
    }
);

MotionWrapper.displayName = "MotionButton";
export default MotionWrapper;
