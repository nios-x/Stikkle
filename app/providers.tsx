"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactLenis } from "lenis/react";
import { NoiseBackground } from "@/components/ui/noise-background";
import { ThemeProvider } from "@/components/theme-provider";

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
        <ThemeProvider>
          <TooltipProvider>
            <NoiseBackground
              className="min-h-full flex flex-col transition-colors duration-300"
              containerClassName="min-h-full"
              noiseIntensity={0.0}
            >
              {children}
            </NoiseBackground>
          </TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </ReactLenis>
  );
}