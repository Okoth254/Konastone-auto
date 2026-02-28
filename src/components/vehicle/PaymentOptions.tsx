"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BookingForm } from "@/components/forms/BookingForm";
import { Button } from "@/components/ui/Button";
import { Shield, TrendingUp, MessageCircle, Landmark, Building2, Banknote } from "lucide-react";
import Link from "next/link";

interface PaymentOptionsProps {
    vehicle: Vehicle;
}

type PaymentMode = "cash" | "sacco" | "bank";

const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 })
        .format(n)
        .replace(".00", "");

export function PaymentOptions({ vehicle }: PaymentOptionsProps) {
    const [mode, setMode] = useState<PaymentMode>("cash");

    const TABS: { key: PaymentMode; label: string }[] = [
        { key: "cash", label: "Cash" },
        { key: "sacco", label: "SACCO" },
        { key: "bank", label: "Bank" },
    ];

    const whatsappBase = "https://wa.me/254722511803?text=";

    const saccoMessage = encodeURIComponent(
        `Hi Konastone Autos! I'm interested in SACCO financing for the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Price: ${formatCurrency(vehicle.price)}). Please guide me through the process.`
    );

    const bankMessage = encodeURIComponent(
        `Hi Konastone Autos! I'd like to inquire about bank financing options for the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Price: ${formatCurrency(vehicle.price)}). Please advise.`
    );

    return (
        <div className="space-y-4">
            {/* 3-tab switcher */}
            <div className="flex bg-[#0D0D0D] border border-[#2D2D2D] p-0.5">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setMode(key)}
                        className={cn(
                            "flex-1 py-2.5 font-heading uppercase text-sm tracking-widest transition-all",
                            mode === key
                                ? key === "cash"
                                    ? "bg-[#E53935] text-white"
                                    : key === "sacco"
                                        ? "bg-[#26C6DA] text-black"
                                        : "bg-[#FFC107] text-black"
                                : "text-[#4B5563] hover:text-[#9CA3AF]"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── CASH ── */}
            {mode === "cash" && (
                <div className="bg-[#1E1E1E] border border-[#2D2D2D] p-6 space-y-6">
                    <div>
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">
                            Cash Price
                        </p>
                        <p className="font-slab text-4xl font-bold text-[#E53935] tabular-nums tracking-tight">
                            {formatCurrency(vehicle.price)}
                        </p>
                        <p className="font-mono text-xs text-[#4B5563] mt-2">
                            Full payment. No interest. Immediate ownership transfer.
                        </p>
                    </div>

                    <BookingForm
                        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        vehicleId={vehicle.id}
                    />

                    <div className="pt-4 border-t border-[#2D2D2D] space-y-3 font-mono text-xs text-[#6B7280]">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-[#26C6DA] flex-shrink-0" />
                            Verified Clean Title
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-[#FFC107] flex-shrink-0" />
                            Competitive Market Value
                        </div>
                        <div className="flex items-center gap-3">
                            <Banknote className="w-4 h-4 text-[#E53935] flex-shrink-0" />
                            Instant Ownership on Full Payment
                        </div>
                    </div>
                </div>
            )}

            {/* ── SACCO FINANCING ── */}
            {mode === "sacco" && (
                <div className="bg-[#111111] border border-[#26C6DA]/20 p-6 space-y-6">
                    <div>
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">
                            SACCO Financing
                        </p>
                        <h3 className="font-heading text-2xl uppercase text-[#F5F5F5]">
                            Finance via Your SACCO
                        </h3>
                        <p className="font-mono text-xs text-[#9CA3AF] mt-3 leading-relaxed">
                            Use your SACCO loan to own this vehicle. We work with all major SACCOs
                            in Kenya and can help prepare the required documentation for a smooth
                            approval process.
                        </p>
                    </div>

                    {/* How it works */}
                    <div className="space-y-3">
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">
                            How It Works
                        </p>
                        {[
                            "Apply for a development / asset loan at your SACCO",
                            "Konastone prepares a pro-forma invoice for your SACCO",
                            "SACCO disburses directly to Konastone Autos",
                            "Drive away — title transferred in your name",
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-3 font-mono text-xs text-[#9CA3AF]">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#26C6DA]/10 border border-[#26C6DA]/30 text-[#26C6DA] flex items-center justify-center text-[10px] font-bold">
                                    {i + 1}
                                </span>
                                {step}
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#1A1A1A] border border-[#26C6DA]/20 p-4">
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">
                            Vehicle Price
                        </p>
                        <p className="font-slab text-3xl font-bold text-[#26C6DA] tabular-nums">
                            {formatCurrency(vehicle.price)}
                        </p>
                    </div>

                    <Link href={`${whatsappBase}${saccoMessage}`} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="w-full bg-[#26C6DA] hover:bg-[#26C6DA]/90 text-black border-none">
                            <MessageCircle className="w-5 h-5 mr-2 text-[#25D366] fill-[#25D366]/20" />
                            Discuss SACCO Financing on WhatsApp
                        </Button>
                    </Link>

                    <p className="font-mono text-[9px] text-center text-[#4B5563] leading-relaxed">
                        *SACCO approval subject to your SACCO's lending policy. We assist with documentation only.
                    </p>
                </div>
            )}

            {/* ── BANK FINANCING ── */}
            {mode === "bank" && (
                <div className="bg-[#111111] border border-[#FFC107]/20 p-6 space-y-6">
                    <div>
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">
                            Bank Financing
                        </p>
                        <h3 className="font-heading text-2xl uppercase text-[#F5F5F5]">
                            Bank / Logbook Loan
                        </h3>
                        <p className="font-mono text-xs text-[#9CA3AF] mt-3 leading-relaxed">
                            Finance this vehicle through a commercial bank or logbook loan facility.
                            We partner with leading Kenyan banks and can connect you with a lending
                            officer to walk you through your options.
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">
                            Common Options
                        </p>
                        {[
                            { icon: Building2, label: "Bank Asset Finance", desc: "KBA-regulated auto loans, typically 20–30% deposit required" },
                            { icon: Landmark, label: "Logbook Loan", desc: "Secure finance against the vehicle's logbook after purchase" },
                        ].map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="flex items-start gap-3 bg-[#1A1A1A] border border-[#2D2D2D] p-4">
                                <Icon className="w-5 h-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-mono text-xs text-[#D1D5DB] font-semibold">{label}</p>
                                    <p className="font-mono text-[10px] text-[#4B5563] mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#1A1A1A] border border-[#FFC107]/20 p-4">
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">
                            Vehicle Price
                        </p>
                        <p className="font-slab text-3xl font-bold text-[#FFC107] tabular-nums">
                            {formatCurrency(vehicle.price)}
                        </p>
                    </div>

                    <Link href={`${whatsappBase}${bankMessage}`} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="w-full">
                            <MessageCircle className="w-5 h-5 mr-2 text-[#25D366] fill-[#25D366]/20" />
                            Enquire About Bank Financing
                        </Button>
                    </Link>

                    <p className="font-mono text-[9px] text-center text-[#4B5563] leading-relaxed">
                        *Bank approvals are subject to individual credit assessments. Terms vary by lender.
                    </p>
                </div>
            )}
        </div>
    );
}
