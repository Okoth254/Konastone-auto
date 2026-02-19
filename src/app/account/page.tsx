"use client";

import { FileText, Calendar, CheckCircle, ChevronRight, TrendingUp, CreditCard, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountDashboard() {
    const { user, bookings, orders, financeApplications } = useStore();
    const router = useRouter();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center py-20">
                <div className="w-16 h-16 bg-[#FFC107]/10 border border-[#FFC107]/20 flex items-center justify-center text-[#FFC107]">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-2">
                    <h2 className="font-heading text-4xl uppercase text-[#F5F5F5]">Sign in First</h2>
                    <p className="font-mono text-sm text-[#6B7280]">Track your orders, applications, and test drives in one place.</p>
                </div>
                <Button onClick={() => router.push("/")} size="lg">Go Home</Button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Welcome */}
            <div>
                <p className="font-mono text-xs text-[#26C6DA] uppercase tracking-widest mb-1">Dashboard</p>
                <h1 className="font-heading text-4xl uppercase text-[#F5F5F5]">Welcome, {user.name.split(" ")[0]}</h1>
                <p className="font-mono text-sm text-[#6B7280] mt-1">Here's what's happening with your account today.</p>
            </div>

            {/* ── Applications & Orders ── */}
            <div className="space-y-4">
                <h2 className="font-heading text-2xl uppercase text-[#F5F5F5] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#FFC107]" />
                    Applications & Orders
                </h2>

                {financeApplications.length === 0 && orders.length === 0 ? (
                    <div className="bg-[#111111] border border-dashed border-[#2D2D2D] p-8 text-center">
                        <p className="font-mono text-xs text-[#4B5563] uppercase tracking-widest">No active applications or orders found.</p>
                        <Link href="/inventory?mode=hire" className="font-mono text-xs text-[#FFC107] font-bold hover:underline mt-3 inline-block">
                            Start a new application
                        </Link>
                    </div>
                ) : (
                    <>
                        {financeApplications.map((app) => (
                            <div key={app.id} className="relative bg-[#111111] border border-[#FFC107]/20 p-6 hover:border-[#FFC107]/50 transition-colors">
                                {/* Yellow left accent bar */}
                                <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#FFC107]" />
                                <div className="pl-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#FFC107]/10 border border-[#FFC107]/20 font-mono text-[9px] uppercase tracking-widest text-[#FFC107] mb-2">
                                                <span className="w-1.5 h-1.5 bg-[#FFC107] animate-pulse" />
                                                Finance Application
                                            </span>
                                            <h2 className="font-heading text-2xl uppercase text-[#F5F5F5]">{app.vehicleName}</h2>
                                            <p className="font-mono text-[10px] text-[#4B5563] mt-1">Ref: #{app.id.toUpperCase()}</p>
                                        </div>
                                        <TrendingUp className="w-5 h-5 text-[#FFC107]" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 border-t border-[#2D2D2D] pt-4">
                                        <div>
                                            <p className="font-mono text-[9px] text-[#4B5563] uppercase tracking-widest mb-1">Monthly</p>
                                            <p className="font-slab text-lg font-bold text-[#FFC107] tabular-nums">KES {app.monthlyPayment.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="font-mono text-[9px] text-[#4B5563] uppercase tracking-widest mb-1">Status</p>
                                            <p className="font-heading text-lg uppercase text-[#26C6DA]">{app.status}</p>
                                        </div>
                                        <div>
                                            <p className="font-mono text-[9px] text-[#4B5563] uppercase tracking-widest mb-1">Term</p>
                                            <p className="font-slab text-lg font-bold text-[#F5F5F5]">{app.term} <span className="text-xs text-[#4B5563]">mo</span></p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Button size="sm" variant="outline">View Details</Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {orders.map((order) => (
                            <div key={order.id} className="bg-[#1E1E1E] border border-[#2D2D2D] p-5 hover:border-[#FFC107]/30 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#FFC107]/10 border border-[#FFC107]/20 font-mono text-[9px] uppercase tracking-widest text-[#FFC107] mb-2">
                                            Order Placed
                                        </span>
                                        <h3 className="font-heading text-xl uppercase text-[#F5F5F5]">Order #{order.id.toUpperCase()}</h3>
                                        <p className="font-mono text-xs text-[#4B5563]">Placed on {order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-[9px] text-[#4B5563] uppercase tracking-widest mb-1">Status</p>
                                        <span className="font-heading text-lg uppercase text-[#26C6DA]">{order.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* ── Test Drives ── */}
            <div className="space-y-4">
                <h2 className="font-heading text-2xl uppercase text-[#F5F5F5] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#FFC107]" />
                    Upcoming Test Drives
                </h2>

                {bookings.length === 0 ? (
                    <div className="bg-[#111111] border border-dashed border-[#2D2D2D] p-8 text-center">
                        <p className="font-mono text-xs text-[#4B5563] uppercase tracking-widest">No upcoming test drives.</p>
                        <Link href="/inventory" className="font-mono text-xs text-[#FFC107] font-bold hover:underline mt-3 inline-block">
                            Browse Vehicles
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-[#1E1E1E] border border-[#2D2D2D] p-5 hover:border-[#FFC107]/30 transition-colors flex items-start gap-4">
                                <div className="p-3 bg-[#111111] border border-[#2D2D2D] text-[#26C6DA] flex-shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-heading text-xl uppercase text-[#F5F5F5]">{booking.vehicleName}</h3>
                                    <p className="font-mono text-xs text-[#6B7280] mb-3">{booking.date} · {booking.status}</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Reschedule</Button>
                                        <Button variant="ghost" size="sm" className="text-[#E53935] hover:text-[#E53935] hover:bg-[#E53935]/10">Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Documents ── */}
            <div className="bg-[#111111] border border-[#2D2D2D] p-6">
                <h3 className="font-heading text-2xl uppercase text-[#F5F5F5] mb-5">Documents</h3>
                <div className="space-y-2">
                    {["Identity Verification", "Terms of Service", "Privacy Policy"].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-transparent hover:border-[#FFC107]/20 hover:bg-[#1E1E1E] cursor-pointer group transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#2D2D2D] group-hover:bg-[#FFC107]/10 border border-[#2D2D2D] group-hover:border-[#FFC107]/20 transition-colors">
                                    <FileText className="w-4 h-4 text-[#6B7280] group-hover:text-[#FFC107] transition-colors" />
                                </div>
                                <span className="font-mono text-sm text-[#9CA3AF] group-hover:text-[#F5F5F5] transition-colors">{doc}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#2D2D2D] group-hover:text-[#FFC107] group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
