import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    // Base: industrial feel — sharp corners, font-heading, tracking
    "inline-flex items-center justify-center whitespace-nowrap font-heading uppercase tracking-widest text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
    {
        variants: {
            variant: {
                // Safety Yellow — primary action
                default:
                    "bg-[#FFC107] text-black hover:bg-[#E6AC00] border border-[#FFC107] shadow-[0_0_16px_rgba(255,193,7,0.2)] hover:shadow-[0_0_24px_rgba(255,193,7,0.4)]",
                // Engine Red — destructive / secondary CTA
                destructive:
                    "bg-[#E53935] text-white hover:bg-[#C62828] border border-[#E53935] shadow-[0_0_16px_rgba(229,57,53,0.2)]",
                // Outlined Safety Yellow
                outline:
                    "border-2 border-[#FFC107] bg-transparent text-[#FFC107] hover:bg-[#FFC107] hover:text-black",
                // Mechanic Teal — secondary action
                secondary:
                    "bg-[#26C6DA] text-black hover:bg-[#00B8CC] border border-[#26C6DA]",
                // Ghost — subtle hover
                ghost:
                    "bg-transparent text-[#D1D5DB] hover:bg-[#FFC107]/10 hover:text-[#FFC107] border border-transparent hover:border-[#FFC107]/30",
                // Text link
                link:
                    "bg-transparent text-[#FFC107] underline-offset-4 hover:underline border-0 p-0 h-auto font-mono normal-case tracking-normal",
                // Alias used in some components
                primary:
                    "bg-[#FFC107] text-black hover:bg-[#E6AC00] border border-[#FFC107] shadow-[0_0_16px_rgba(255,193,7,0.2)]",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
