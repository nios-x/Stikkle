"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function GithubSignInClient() {
  useEffect(() => {
    console.log("[GithubSignInClient] Executing signIn('github') mount hook...");
    signIn("github", { callbackUrl: "/dashboard" });
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 font-sans text-white">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <svg className="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-zinc-400 text-sm font-medium animate-pulse">Redirecting to GitHub OAuth...</p>
      </div>
    </div>
  );
}
