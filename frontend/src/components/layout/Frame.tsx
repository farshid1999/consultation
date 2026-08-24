"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FrameProps {
  children: ReactNode;
  className?: string;
}

export default function Frame({ children, className }: FrameProps) {
  return (
    <div className="relative min-h-screen w-full bg-white">
      
      {/* 1. Top Bar - Floating & Rounded */}
      <div className="fixed left-4 right-4 top-4 z-20 h-[3px] rounded-full bg-[#0b2622] shadow-sm md:left-8 md:right-8 md:top-6" />

      <div className="flex flex-1 pt-12 md:pt-16">
        
        {/* 2. Left Bar - Floating & Rounded */}
        {/*<div className="fixed bottom-4 left-10 top-20 z-10 hidden w-[3px] rounded-full bg-[#0b2622] shadow-sm lg:block" />*/}

        {/* Main Content Area */}
        <main className={cn("mx-auto w-full max-w-6xl px-4 pb-10 pt-4 lg:px-12", className)}>
          {children}
        </main>

        {/* 3. Right Bar - Floating & Rounded */}
        {/*<div className="fixed bottom-4 right-10 top-20 z-10 hidden w-[3px] rounded-full bg-[#0b2622] shadow-sm lg:block" />*/}
      
      </div>
    </div>
  );
}