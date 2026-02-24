"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 p-4 bg-action-teal text-white rounded-full shadow-lg hover:bg-teal-600 transition-all z-50",
                    isOpen && "hidden"
                )}
            >
                <MessageCircle className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[500px]">
                    {/* Header */}
                    <div className="bg-trust-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="font-semibold">Konastone Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 h-80">
                        <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 max-w-[80%] border border-gray-100">
                                Hi there! 👋 Welcome to Konastone Autos. Are you looking to hire purchase or buy directly today?
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-action-teal"
                            />
                            <button className="p-2 bg-action-teal text-white rounded-full hover:bg-teal-600">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
