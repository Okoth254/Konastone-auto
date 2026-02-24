"use client";

import { Button } from "@/components/ui/Button";
import { TradeInForm } from "@/components/forms/TradeInForm";
import { Banknote, ShieldCheck, Car } from "lucide-react";

export default function SellPage() {
    return (
        <div className="min-h-screen bg-[#1A1A1A]">

            {/* Hero */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                {/* ... (existing hero content) ... */}
                <div
                    className="absolute top-0 left-0 right-0 h-[6px]"
                    style={{ backgroundImage: "repeating-linear-gradient(-45deg,#FFC107,#FFC107 8px,#1A1A1A 8px,#1A1A1A 16px)" }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6 pt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FFC107]/30 bg-[#FFC107]/5 font-mono text-xs text-[#FFC107] uppercase tracking-widest">
                            <span className="w-2 h-2 bg-[#FFC107] animate-pulse" />
                            Fast & Fair Valuation
                        </div>
                        <h1 className="font-heading text-grunge text-5xl lg:text-7xl uppercase text-[#F5F5F5] leading-tight">
                            Sell Your Car<br />
                            <span className="text-[#FFC107]">In 24 Hours.</span>
                        </h1>
                        <p className="font-mono text-sm text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
                            Get a competitive offer for your vehicle instantly. No haggle, no hassle. We handle all the paperwork and settlement.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <a href="#trade-form">
                                <Button size="lg">Get Instant Offer</Button>
                            </a>
                            <Button size="lg" variant="outline">How it Works</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 bg-[#111111] border-y border-[#2D2D2D]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: Banknote,
                                title: "Instant Payment",
                                desc: "Receive payment directly to your bank account immediately after inspection.",
                                color: "#FFC107"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Safe & Secure",
                                desc: "We manage the transfer of ownership and liability, protecting you from future risks.",
                                color: "#26C6DA"
                            },
                            {
                                icon: Car,
                                title: "We Buy Any Car",
                                desc: "From luxury SUVs to city hatchbacks, we offer fair market value for all makes.",
                                color: "#E53935"
                            }
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="p-8 bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#FFC107]/30 transition-colors group relative overflow-hidden"
                            >
                                <div
                                    className="absolute top-0 left-0 bottom-0 w-0 group-hover:w-[3px] transition-all duration-300"
                                    style={{ backgroundColor: feature.color }}
                                />
                                <div
                                    className="w-12 h-12 flex items-center justify-center mb-6 border"
                                    style={{ borderColor: feature.color + "30", backgroundColor: feature.color + "10" }}
                                >
                                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                                </div>
                                <h3 className="font-heading text-2xl uppercase text-[#F5F5F5] mb-3">{feature.title}</h3>
                                <p className="font-mono text-xs text-[#9CA3AF] leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Submission Form Section */}
            <section id="trade-form" className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12 text-center space-y-4">
                            <p className="font-mono text-[10px] text-[#FFC107] uppercase tracking-[0.3em]">Vehicle Intake</p>
                            <h2 className="font-heading text-4xl lg:text-5xl uppercase text-[#F5F5F5]">Ready to start?</h2>
                            <p className="font-mono text-xs text-[#4B5563] uppercase">Complete the form below and our team will get back to you within 24 hours.</p>
                        </div>
                        <TradeInForm />
                    </div>
                </div>

                {/* Background decorative element */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 border border-[#FFC107]/5 rounded-full pointer-events-none" />
            </section>
        </div>
    );
}
