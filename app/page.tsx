"use client";
import { useEffect, useState } from "react";
import ScrollHomepage from "@/components/scroll-homepage";

export default function Page() {
    const [cacheKey, setCacheKey] = useState(0);

    useEffect(() => {
        const handlePageshow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                setCacheKey((current) => current + 1);
            }
        };

        window.addEventListener("pageshow", handlePageshow);
        return () => window.removeEventListener("pageshow", handlePageshow);
    }, []);

    return (
        <ScrollHomepage key={cacheKey} />
    );
}