"use client";
import { useEffect, useState } from "react";
import AgencyHeroSection from "@/components/shadcn-space/blocks/hero-01/index";

export default function page() {
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
        <AgencyHeroSection key={cacheKey} />
    );
}