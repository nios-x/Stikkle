"use client";

import React, { useEffect, useRef } from "react";

interface PixelatedGradientProps {
  className?: string;
  colors?: string[];
  pixelSize?: number;
  speed?: number;
}

export function PixelatedGradient({
  className = "",
  colors = ["#4f46e5", "#ec4899", "#8b5cf6"], // Indigo, Pink, Violet
  pixelSize = 24, // Size of the "pixels"
  speed = 0.001,
}: PixelatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // We use an offscreen canvas to draw the smooth gradient, 
    // then draw it downscaled to the main canvas to pixelate it.
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      // Get the display size of the canvas
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // Set the main canvas to the exact screen resolution
      canvas.width = width;
      canvas.height = height;

      // Set the offscreen canvas to a heavily downscaled resolution based on pixelSize
      offscreen.width = Math.ceil(width / pixelSize);
      offscreen.height = Math.ceil(height / pixelSize);
      
      // Disable smoothing on the main canvas to keep the pixels crisp when upscaled
      ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener("resize", resize);
    resize();

    // Orb parameters
    const orbs = colors.map((color, i) => ({
      color,
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 0.4 + 0.3, // relative to width/height
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;

      // 1. Draw smooth gradient on the tiny offscreen canvas
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      
      // We want to blend them nicely
      offCtx.globalCompositeOperation = "screen";

      orbs.forEach((orb, i) => {
        // Update positions with slow drifting and sine wave pulsing
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Bounce off walls (relative 0 to 1)
        if (orb.x < 0 || orb.x > 1) orb.vx *= -1;
        if (orb.y < 0 || orb.y > 1) orb.vy *= -1;

        const x = orb.x * offscreen.width;
        const y = orb.y * offscreen.height;
        // Pulse the radius slightly
        const r = (orb.radius + Math.sin(time + orb.phase) * 0.1) * Math.max(offscreen.width, offscreen.height);

        const gradient = offCtx.createRadialGradient(x, y, 0, x, y, r);
        // Add hex alpha for smooth fading
        gradient.addColorStop(0, orb.color + "ff");
        gradient.addColorStop(0.5, orb.color + "88");
        gradient.addColorStop(1, orb.color + "00");

        offCtx.fillStyle = gradient;
        offCtx.beginPath();
        offCtx.arc(x, y, r, 0, Math.PI * 2);
        offCtx.fill();
      });

      // 2. Draw the tiny offscreen canvas onto the main canvas
      // Since imageSmoothingEnabled is false, it will scale up with hard, pixelated edges
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreen, 0, 0, offscreen.width, offscreen.height, 0, 0, width, height);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [colors, pixelSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      style={{
        // Using a mask image to fade out the top and bottom borders so there are no ugly cutoffs
        maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
      }}
    />
  );
}
