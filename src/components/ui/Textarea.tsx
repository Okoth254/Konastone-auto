import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full border border-[#2D2D2D] bg-[#111111] px-3 py-2 font-mono text-sm text-[#F5F5F5] placeholder:text-[#4B5563] focus-visible:outline-none focus-visible:border-[#FFC107] focus-visible:ring-1 focus-visible:ring-[#FFC107] disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
