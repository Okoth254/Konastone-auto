"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface MotionInputProps extends HTMLMotionProps<"input"> {
  label?: string;
  error?: string;
}

const MotionInput = forwardRef<HTMLInputElement, MotionInputProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-400 uppercase"
          >
            {label}
          </label>
        )}
        <motion.input
          ref={ref}
          id={id}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "tween", duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={[
            "motion-input bg-surface-container border border-white/10 px-4 py-3 text-sm text-on-surface font-body",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 focus-visible:border-primary-container/50",
            "transition-colors duration-180",
            "placeholder:text-zinc-600",
            error ? "border-red-600/60" : "",
            className,
          ].join(" ")}
          {...rest}
        />
        {error && (
          <p className="text-xs text-red-400 font-mono" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MotionInput.displayName = "MotionInput";
export default MotionInput;
