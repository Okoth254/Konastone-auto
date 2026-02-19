"use client";

import Link from "next/link";
import { Key, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DirectPurchasePanelProps {
    isActive: boolean;
}

export function DirectPurchasePanel({ isActive }: DirectPurchasePanelProps) {
    return (
        <div className="max-w-lg text-white space-y-8 ml-auto text-right md:text-left">
            <div className="flex items-center gap-2 text-trust-300 font-semibold tracking-wider uppercase text-sm justify-end md:justify-start">
                <Key className="w-5 h-5" />
                <span>Direct Purchase</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Own It <span className="text-trust-300">Today.</span>
            </h2>

            <p className="text-lg text-gray-200">
                Browse our premium inventory of certified vehicles ready for immediate ownership.
            </p>

            {/* Search Mini-Widget */}
            <div className="bg-trust-900/80 backdrop-blur-md border border-trust-700 p-6 rounded-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-trust-300 block mb-2 text-left">Search by Make or Model</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="e.g. Mercedes C-Class..."
                                className="w-full pl-10 pr-4 py-3 bg-white text-trust-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust-500"
                            />
                        </div>
                    </div>

                    <Link href="/inventory?mode=buy" className="block w-full">
                        <Button variant="primary" size="lg" className="w-full justify-between group bg-white text-trust-950 hover:bg-gray-100">
                            Browse Inventory
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
