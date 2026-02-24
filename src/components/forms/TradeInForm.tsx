"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const tradeInSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    vehicleBrand: z.string().min(1, "Brand is required"),
    vehicleModel: z.string().min(1, "Model is required"),
    year: z.coerce.number().min(1900).max(new Date().getFullYear()),
    mileage: z.coerce.number().min(0),
    expectedPrice: z.coerce.number().min(0),
    description: z.string().optional(),
});

type TradeInFormData = z.infer<typeof tradeInSchema>;

export function TradeInForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TradeInFormData>({
        resolver: zodResolver(tradeInSchema),
    });

    const onSubmit = async (data: TradeInFormData) => {
        setIsSubmitting(true);

        const { error } = await (supabase
            .from("trade_in_requests") as any)
            .insert({
                full_name: data.fullName,
                phone: data.phone,
                vehicle_brand: data.vehicleBrand,
                vehicle_model: data.vehicleModel,
                year: data.year,
                mileage: data.mileage,
                expected_price: data.expectedPrice,
                description: data.description,
                status: "new",
            });

        if (error) {
            console.error("Trade-in error:", error);
            toast.error("Failed to submit request. Please try again.");
            setIsSubmitting(false);
            return;
        }

        toast.success("Request Submitted!", {
            description: "Your vehicle details have been sent. Our appraisers will contact you shortly.",
        });

        reset();
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#111111] border border-[#2D2D2D] p-6 lg:p-10 shadow-2xl">
            <div className="space-y-2">
                <h3 className="font-heading text-2xl uppercase text-[#F5F5F5]">Vehicle Submission Form</h3>
                <p className="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest">Provide accurate details for a faster valuation.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Full Name</label>
                        <Input {...register("fullName")} placeholder="e.g. John Doe" />
                        {errors.fullName && <p className="text-xs text-[#E53935]">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Phone Number</label>
                        <Input {...register("phone")} placeholder="e.g. +254 7..." />
                        {errors.phone && <p className="text-xs text-[#E53935]">{errors.phone.message}</p>}
                    </div>
                </div>

                {/* Vehicle Info Top */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Car Brand</label>
                            <Input {...register("vehicleBrand")} placeholder="e.g. Toyota" />
                            {errors.vehicleBrand && <p className="text-xs text-[#E53935]">{errors.vehicleBrand.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Model</label>
                            <Input {...register("vehicleModel")} placeholder="e.g. Prado" />
                            {errors.vehicleModel && <p className="text-xs text-[#E53935]">{errors.vehicleModel.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Year</label>
                            <Input type="number" {...register("year")} placeholder="2018" />
                            {errors.year && <p className="text-xs text-[#E53935]">{errors.year.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Mileage (KM)</label>
                            <Input type="number" {...register("mileage")} placeholder="45000" />
                            {errors.mileage && <p className="text-xs text-[#E53935]">{errors.mileage.message}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Expected Price (KES)</label>
                    <Input type="number" {...register("expectedPrice")} placeholder="3,000,000" />
                    {errors.expectedPrice && <p className="text-xs text-[#E53935]">{errors.expectedPrice.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Additional Notes</label>
                    <Textarea {...register("description")} placeholder="Condition, service history, etc." className="h-[42px]" />
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Vehicle for Valuation"
                )}
            </Button>

            <p className="font-mono text-[9px] text-center text-[#4B5563] uppercase tracking-tighter">
                *By submitting, you agree to being contacted by Konastone Autos for appraisal services.
            </p>
        </form>
    );
}
