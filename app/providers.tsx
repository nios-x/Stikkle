"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactLenis } from "lenis/react";
import { NoiseBackground } from "@/components/ui/noise-background";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <ReactLenis root>
      <SessionProvider session={session}>
        <TooltipProvider>
          <NoiseBackground
            className="min-h-full flex flex-col"
            containerClassName="min-h-full"
            noiseIntensity={0.0}
          >
            {children}
          </NoiseBackground>
        </TooltipProvider>
      </SessionProvider>
    </ReactLenis>
  );
}