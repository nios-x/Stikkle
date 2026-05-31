"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AgencyHeroSection from "@/components/shadcn-space/blocks/hero-01/index";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightIcon, 
  LayersIcon, 
  ZapIcon, 
  ShieldCheckIcon, 
  SparklesIcon, 
  CodeIcon, 
  GlobeIcon 
} from "lucide-react";
import Link from "next/link";

export default function ScrollHomepage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Phase 1: Hero Section (0.0 to 0.25)
  // Fades out and scales down as user scrolls away from the top.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // ── Phase 2: Features Section (0.2 to 0.5)
  // Fades in, then fades out before phase 3
  const featuresOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.55], [0, 1, 1, 0]);
  const featuresY = useTransform(scrollYProgress, [0.15, 0.25], [100, 0]);
  const featuresScale = useTransform(scrollYProgress, [0.45, 0.55], [1, 1.05]);

  // ── Phase 3: Showcase Section (0.45 to 0.75)
  const showcaseOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.7, 0.8], [0, 1, 1, 0]);
  const showcaseY = useTransform(scrollYProgress, [0.45, 0.55], [100, 0]);

  // ── Phase 4: CTA Section (0.75 to 1.0)
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.75, 0.85], [0.9, 1]);

  // Prevent hidden layers from blocking clicks
  const heroPointerEvents = useTransform(heroOpacity, (v) => (v > 0.05 ? "auto" : "none"));
  const featuresPointerEvents = useTransform(featuresOpacity, (v) => (v > 0.05 ? "auto" : "none"));
  const showcasePointerEvents = useTransform(showcaseOpacity, (v) => (v > 0.05 ? "auto" : "none"));
  const ctaPointerEvents = useTransform(ctaOpacity, (v) => (v > 0.05 ? "auto" : "none"));

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-background">
      <div className="sticky top-0 left-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        
        {/* Decorative background blur (always visible, gently pulsing) */}
        <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        {/* ── Phase 1: Hero ── */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, pointerEvents: heroPointerEvents }}
          className="absolute inset-0 flex flex-col items-center justify-start pt-10 md:pt-20"
        >
          <div className="w-full">
            <AgencyHeroSection />
          </div>
        </motion.div>

        {/* ── Phase 2: Features ── */}
        <motion.div
          style={{ opacity: featuresOpacity, y: featuresY, scale: featuresScale, pointerEvents: featuresPointerEvents }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                <SparklesIcon className="mr-1.5 size-3" /> Next-Gen Architecture
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                Built for velocity.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Stikkle provides a comprehensive suite of tools designed to help teams collaborate, ship faster, and maintain perfect stability.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ZapIcon, title: "Lightning Fast", desc: "Optimized workflows that cut compilation and deployment times by up to 50%." },
                { icon: LayersIcon, title: "Seamless Integration", desc: "Connect your GitHub repositories in one click and start managing instantly." },
                { icon: ShieldCheckIcon, title: "Enterprise Grade", desc: "Built with security-first architecture. Role-based access control out of the box." },
              ].map((feature, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                  <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4 text-primary">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Phase 3: Showcase ── */}
        <motion.div
          style={{ opacity: showcaseOpacity, y: showcaseY, pointerEvents: showcasePointerEvents }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <div className="mb-10 text-center">
             <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                Command your infrastructure
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                A unified dashboard that gives you x-ray vision into your projects.
              </p>
          </div>
          
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-sm">
            {/* Window controls mockup */}
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
            </div>
            {/* Dashboard Mockup Content */}
            <div className="grid grid-cols-4 gap-4 p-6">
              <div className="col-span-1 flex flex-col gap-4">
                <div className="h-10 w-full rounded-md bg-muted/50" />
                <div className="h-32 w-full rounded-md bg-muted/50" />
                <div className="h-32 w-full rounded-md bg-muted/50" />
              </div>
              <div className="col-span-3 flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-md bg-primary/5 border border-primary/10" />
                  <div className="h-24 rounded-md bg-blue-500/5 border border-blue-500/10" />
                  <div className="h-24 rounded-md bg-purple-500/5 border border-purple-500/10" />
                </div>
                <div className="h-64 w-full rounded-md bg-muted/30 border border-border/50" />
              </div>
            </div>
            {/* Glow effect overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </motion.div>

        {/* ── Phase 4: CTA ── */}
        <motion.div
          style={{ opacity: ctaOpacity, scale: ctaScale, pointerEvents: ctaPointerEvents }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="relative overflow-hidden rounded-3xl border bg-card p-10 md:p-20 text-center shadow-2xl w-full max-w-4xl">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 size-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 size-48 rounded-full bg-blue-500/20 blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Ready to transform your workflow?
              </div>
              <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
                Start building with Stikkle.
              </h2>
              <p className="mb-10 max-w-xl text-xl text-muted-foreground">
                Join thousands of developers who are shipping faster, collaborating better, and building the future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 rounded-full px-8 text-base shadow-lg shadow-primary/20" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
                  <Link href="/docs">
                    Read the Docs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// Inline Badge component for quick use
function Badge({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "secondary" | "outline" }) {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground",
  };
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className || ""}`}>
      {children}
    </div>
  );
}
