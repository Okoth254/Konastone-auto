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
        "bg-primary/15 text-primary border border-primary/35 hover:bg-primary hover:text-black hover:border-primary",
    secondary:
        "bg-accent-teal/15 text-accent-teal border border-accent-teal/35 hover:bg-accent-teal/25 hover:border-accent-teal/60",
    ghost:
        "bg-white/2 text-slate-300 border border-white/5 hover:border-white/15 hover:bg-white/5 hover:text-white",
    outline:
        "bg-transparent text-slate-300 border border-white/10 hover:border-primary/40 hover:text-primary hover:bg-primary/5",
    danger:
        "bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 hover:text-red-300",
    icon: "bg-white/2 text-slate-400 border border-white/5 p-2 hover:text-white hover:border-white/15",
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
            "relative inline-flex items-center justify-center gap-2 px-5 rounded-2xl font-heading font-black tracking-[0.2em] text-[10px] uppercase",
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
            transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
            className: classes,
            ...rest,
        };

        if (href) {
            return (
                <motion.div
                    whileHover={isDisabled ? {} : { y: -2 }}
                    whileTap={isDisabled ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className={classes}
                >
                    <Link 
                        href={href}
                        ref={ref as React.Ref<HTMLAnchorElement>}
                        target={target}
                        rel={rel}
                        className="flex items-center justify-center gap-2 w-full h-full"
                    >
                        {content}
                    </Link>
                </motion.div>
            );
        }

        return (
            <motion.button
                ref={ref as React.Ref<HTMLButtonElement>}
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
