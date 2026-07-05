"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

interface AuthClientProps {
  missingVars: string[];
  nextAuthError: string | null;
}

export default function AuthClient({ missingVars, nextAuthError }: AuthClientProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`[Username Login] Validating username "${username}" via GitHub REST API...`);
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`);
      
      if (response.status === 404) {
        setError(`GitHub username "${username}" does not exist. Please check the spelling.`);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        setError("GitHub API limit exceeded or server error. Please try again later.");
        setLoading(false);
        return;
      }

      console.log(`[Username Login] Username "${username}" verified successfully. Logging in...`);
      
      // Perform sign in using credentials provider which accepts any verified username
      await signIn("credentials", {
        username: username.trim(),
        callbackUrl: "/dashboard",
      });
    } catch (err: any) {
      console.error("[Username Login] Validation error:", err);
      setError("Network error. Please check your internet connection.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 font-sans">
      {/* ── Background Glow Effects ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      
      {/* ── Floating Particle / Decorative Grid ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-10 md:p-14 text-center shadow-2xl shadow-violet-950/20 backdrop-blur-xl"
        >
          {/* Top subtle badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-medium text-violet-400"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Integrate Stikkle Platform
          </motion.div>

          {/* GitHub Animated Icon */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl relative group"
          >
            {/* Soft inner glow behind logo */}
            <div className="absolute inset-0 rounded-2xl bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <svg className="w-12 h-12 text-zinc-100 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </motion.div>

          {/* Heading & Subtitle */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl font-semibold tracking-tight text-white mb-4 bg-clip-text bg-gradient-to-b from-white to-zinc-400"
          >
            Connect your GitHub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto mb-8"
          >
            Enter your GitHub username to access repository analytics, activity, gists, recommendations and analytics.
          </motion.p>

          {/* Error Display */}
          {(error || nextAuthError) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-400 text-sm text-left flex gap-3"
            >
              <AlertTriangle className="size-5 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Authentication Error:</p>
                <p className="text-xs text-red-200 mt-1 leading-relaxed">
                  {error || (nextAuthError === "CredentialsSignin" ? "Invalid login attempt. Please check your username." : nextAuthError)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter your GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full h-14 px-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300 font-medium"
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full h-14 items-center justify-center gap-3 rounded-2xl bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-5" />
                    Validating...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Bottom subtle text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 text-xs text-zinc-600"
          >
            Stikkle requires access to public repository and profile data to populate analytics.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
