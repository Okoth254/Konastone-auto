"use client";

import { useEffect } from "react";

export default function ScrollRevealScript() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.15, // 15% visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    // Stop observing once revealed so it doesn't replay backwards
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Safely observe un-revealed elements
        const observeElements = () => {
            document.querySelectorAll(".animate-scroll-reveal:not(.is-visible)").forEach((el) => {
                observer.observe(el);
            });
        };

        // Run initially
        observeElements();

        // Setup a MutationObserver to catch elements loaded after initial render (e.g. client side routing)
        const mutationObserver = new MutationObserver(() => {
            observeElements();
        });
        
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return null;
}
