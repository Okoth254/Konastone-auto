"use client";

import { CheckCircle, HelpCircle, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HelpPage() {
    const faqs = [
        {
            q: "How does Hire Purchase work?",
            a: "Hire purchase allows you to drive the car away after paying an initial deposit (usually 30-50%). You then pay the remaining balance in monthly installments over a period of 12 to 48 months. Ownership transfers to you upon completion of payments."
        },
        {
            q: "What documents do I need?",
            a: "For individual applications, you typically need your ID/Passport, KRA PIN, 6 months bank statements, and M-Pesa statements. For businesses, we require Certificate of Incorporation and company bank statements."
        },
        {
            q: "How long is the approval process?",
            a: "Our digital approval process is designed to be fast. Most applications receive a preliminary decision within 2 hours, and full approval within 24 hours of document submission."
        },
        {
            q: "Can I trade in my current car?",
            a: "Yes! We accept trade-ins. You can use the value of your current vehicle as your deposit for a Hire Purchase agreement on a newer model."
        }
    ];

    return (
        <div className="min-h-screen bg-bg-secondary font-sans text-text-primary">
            <section className="relative py-20 bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">How can we help?</h1>
                    <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
                        Find answers to common questions about buying, selling, and hire purchase agreements.
                    </p>

                    <div className="max-w-md mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex bg-white rounded-xl p-2 items-center">
                            <input
                                type="text"
                                placeholder="Search specifically..."
                                className="flex-1 p-3 text-primary outline-none placeholder:text-gray-400 font-medium"
                            />
                            <Button size="sm" className="shadow-none">Search</Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4 max-w-4xl">
                <div className="grid gap-6">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-bg-primary rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-primary mb-3 flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-accent shrink-0 mt-1" />
                                {item.q}
                            </h3>
                            <p className="text-text-muted leading-relaxed ml-8">{item.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-white p-10 rounded-3xl border border-border shadow-soft">
                    <h3 className="text-2xl font-bold text-primary mb-4">Still have questions?</h3>
                    <p className="text-text-muted mb-8">Our team is available Mon-Sat, 8am - 6pm.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="outline" className="gap-2">
                            <MessageCircle className="w-4 h-4" /> Live Chat
                        </Button>
                        <Button className="gap-2">
                            <FileText className="w-4 h-4" /> Contact Support
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
