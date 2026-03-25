"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Konastone Autos - ${title}`,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Failed to share: ', err);
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 rounded-full h-10 border border-border-subtle hover:bg-border-subtle transition-colors text-sm font-medium text-slate-300 w-full mt-2 md:mt-0"
        >
            <span className="material-symbols-outlined text-[18px] text-accent-teal">
                {copied ? "check" : "share"}
            </span>
            {copied ? "Link Copied!" : "Share Vehicle"}
        </button>
    );
}
