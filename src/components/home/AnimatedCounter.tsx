"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
    text: string;
    duration?: number;
}

export default function AnimatedCounter({ text, duration = 2000 }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Parse the string to find the numeric part and any surrounding text
    // Handles cases like "500+", "12+ Years", "$1,000"
    const match = text.replace(/,/g, '').match(/^([^\d]*)(\d+)(.*)$/);
    
    useEffect(() => {
        if (!countRef.current || hasAnimated || !match) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true);
                    const targetValue = parseInt(match[2], 10);
                    let start = 0;
                    const increment = targetValue / (duration / 16);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= targetValue) {
                            setCount(targetValue);
                            clearInterval(timer);
                        } else {
                            setCount(Math.ceil(start));
                        }
                    }, 16);

                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(countRef.current);

        return () => observer.disconnect();
    }, [text, duration, hasAnimated, match]);

    if (!match) {
        return <span>{text}</span>;
    }

    const [, prefix, , suffix] = match;

    return (
        <span ref={countRef}>
            {prefix}
            {count > 0 ? count.toLocaleString() : "0"}
            {suffix}
        </span>
    );
}
