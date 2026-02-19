import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
    return (
        <footer className="bg-[#111111] text-[#9CA3AF]">
            {/* Yellow top border */}
            <div className="h-[3px] bg-gradient-to-r from-transparent via-[#FFC107] to-transparent" />

            <div className="container mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand column */}
                    <div>
                        <div className="mb-4">
                            <Logo variant="light" height={32} width={140} linked={false} />
                        </div>
                        <p className="text-sm font-mono text-[#26C6DA] leading-relaxed">
                            cash · hire purchase · trade-in<br />
                            bank finance · insurance
                        </p>
                        <p className="text-xs font-mono text-[#6B7280] mt-3 leading-loose">
                            Premier Digital Showroom.<br />
                            Mombasa, Kenya.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-heading uppercase tracking-widest text-[#F5F5F5] mb-4 text-lg">
                            Shop
                        </h4>
                        <ul className="space-y-2 font-mono text-sm">
                            <li><Link href="/inventory?mode=hire" className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">Hire Purchase</Link></li>
                            <li><Link href="/inventory?mode=buy" className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">Direct Purchase</Link></li>
                            <li><Link href="/sell" className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">Sell Your Car</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-heading uppercase tracking-widest text-[#F5F5F5] mb-4 text-lg">
                            Support
                        </h4>
                        <ul className="space-y-2 font-mono text-sm">
                            <li><Link href="/help" className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">Contact Us</Link></li>
                            <li><Link href="/terms" className="text-[#9CA3AF] hover:text-[#FFC107] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading uppercase tracking-widest text-[#F5F5F5] mb-4 text-lg">
                            Contact
                        </h4>
                        <p className="font-slab text-[#E53935] text-xl font-bold tracking-widest mb-3">
                            +254 722 511 803
                        </p>
                        <p className="font-mono text-sm text-[#6B7280] leading-loose">
                            Mombasa, Kenya<br />
                            info@konastonemotors.com
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-[#2D2D2D] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-xs text-[#4B5563] tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} Konastone Motors. All rights reserved.
                    </p>
                    <div className="h-[2px] w-24 hazard-stripe opacity-60 rounded" />
                </div>
            </div>
        </footer>
    );
}
