"use client";

import { Star, User } from "lucide-react";

export default function ReviewsPage() {
    const reviews = [
        {
            name: "Sarah M.",
            role: "Business Owner",
            rating: 5,
            text: "The split payment option for the Mercedes C200 was a game changer for my cash flow. Approvals were instant.",
            date: "2 days ago"
        },
        {
            name: "John K.",
            role: "Architect",
            rating: 5,
            text: "Bought a Land Rover Discovery. The direct purchase process was transparent, no hidden dealership fees.",
            date: "1 week ago"
        },
        {
            name: "David O.",
            role: "First-time Buyer",
            rating: 4,
            text: "Great experience with the digital signing. Saved me so much time avoiding paperwork.",
            date: "3 weeks ago"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-trust-900 mb-4">Customer Stories</h1>
                    <p className="text-lg text-gray-600">Join 5,000+ happy owners who chose Konastone.</p>
                </div>

                <div className="grid gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-trust-100 p-2 rounded-full text-trust-700">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-trust-900">{review.name}</h3>
                                        <p className="text-xs text-gray-500">{review.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, r) => (
                                        <Star key={r} className={`w-4 h-4 ${r < review.rating ? "text-action-yellow fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">"{review.text}"</p>
                            <p className="text-xs text-gray-400 mt-4 text-right">{review.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
