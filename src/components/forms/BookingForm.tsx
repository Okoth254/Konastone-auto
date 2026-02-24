"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase";
import {
    useFormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
// import { Calendar } from "@/components/ui/Calendar" // Pending Calendar component
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover" // Pending Popover
import { format } from "date-fns"
import { bookingSchema, BookingFormData } from "@/lib/schemas"
import { toast } from "sonner" // Assuming Sonner is installed, otherwise replace with alert
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export function BookingForm({ vehicleName, vehicleId }: { vehicleName: string, vehicleId: string }) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Check if user has already booked? (Mock logic)

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            vehicleId,
            vehicleName,
            location: "showroom",
            // date: new Date(), // Optional: pre-fill
        },
    })

    const { addBooking, user } = useStore();
    const router = useRouter();

    async function onSubmit(data: BookingFormData) {
        setIsSubmitting(true)

        const { error } = await (supabase
            .from('purchase_inquiries') as any)
            .insert({
                car_id: vehicleId,
                full_name: user?.name || "Anonymous Client",
                phone: "0700000000",
                email: user?.email || null,
                message: `Booking Test Drive for ${vehicleName}. Preferred Date: ${data.date.toDateString()}, Time: ${data.time}, Location: ${data.location}. Notes: ${data.notes || 'None'}`,
                inquiry_status: 'new'
            });

        if (error) {
            console.error('Submission error:', error);
            toast.error("Failed to book test drive. Please try again or contact us via WhatsApp.");
            setIsSubmitting(false);
            return;
        }

        addBooking({
            id: Math.random().toString(36).substr(2, 9),
            vehicleId,
            vehicleName,
            date: data.date.toDateString(),
            status: 'Pending'
        });

        toast.success("Interest Captured!", {
            description: `We've received your inquiry for the ${vehicleName}. Our sales team will contact you shortly to confirm the appointment.`,
        });

        setIsSubmitting(false)
        form.reset()

        if (user) {
            router.push("/account");
        }
    }

    return (
        <div className="bg-[#111111] border border-[#2D2D2D] p-5">
            <div className="mb-5">
                <h3 className="font-heading text-2xl uppercase text-[#F5F5F5]">Book a Test Drive</h3>
                <p className="font-mono text-xs text-[#6B7280] mt-1">Experience the {vehicleName} firsthand.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Date Selection (Simplified to native date picker for now to avoid installing shadcn calendar complex deps in one go) */}
                <div className="space-y-2">
                    <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Date</label>
                    <input
                        type="date"
                        {...form.register("date", { valueAsDate: true })}
                        className="flex h-12 w-full border border-[#2D2D2D] bg-[#111111] px-3 py-2 font-mono text-sm text-[#F5F5F5] focus-visible:outline-none focus-visible:border-[#FFC107] focus-visible:ring-1 focus-visible:ring-[#FFC107] transition-colors"
                    />
                    {form.formState.errors.date && <p className="text-xs text-status-error">{form.formState.errors.date.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Time</label>
                        <Input type="time" {...form.register("time")} />
                        {form.formState.errors.time && <p className="text-xs text-status-error">{form.formState.errors.time.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Location</label>
                        <select
                            {...form.register("location")}
                            className="flex h-12 w-full border border-[#2D2D2D] bg-[#111111] px-3 py-2 font-mono text-sm text-[#F5F5F5] focus-visible:outline-none focus-visible:border-[#FFC107] transition-colors"
                        >
                            <option value="showroom">Showroom</option>
                            <option value="home">Home Delivery (Premium)</option>
                            <option value="office">Office</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Notes (Optional)</label>
                    <Textarea placeholder="Any specific requests?" {...form.register("notes")} />
                </div>

                <Button type="submit" className="w-full text-lg font-bold shadow-glow" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Booking...
                        </>
                    ) : (
                        "Confirm Booking"
                    )}
                </Button>
            </form>
        </div>
    )
}
