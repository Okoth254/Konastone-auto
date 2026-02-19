"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="system"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-trust-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-trust-900 dark:group-[.toaster]:text-white dark:group-[.toaster]:border-trust-800",
                    description: "group-[.toast]:text-trust-500 dark:group-[.toast]:text-trust-400",
                    actionButton:
                        "group-[.toast]:bg-action-teal group-[.toast]:text-white",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 group-[.toast]:text-trust-500 dark:group-[.toast]:bg-trust-800 dark:group-[.toast]:text-trust-400",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
