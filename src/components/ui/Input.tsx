import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full border border-[#2D2D2D] bg-[#111111] px-3 py-2 font-mono text-sm text-[#F5F5F5] placeholder:text-[#4B5563] focus-visible:outline-none focus-visible:border-[#FFC107] focus-visible:ring-1 focus-visible:ring-[#FFC107] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
