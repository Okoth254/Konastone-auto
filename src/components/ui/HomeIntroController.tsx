"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import so the intro isn't included in the SSR bundle
const KonastoneIntro = dynamic(() => import("@/components/ui/KonastoneIntro"), {
    ssr: false,
});

export function HomeIntroController() {
    const [showIntro, setShowIntro] = useState(true);

    if (!showIntro) return null;

    return <KonastoneIntro onFinish={() => setShowIntro(false)} />;
}
