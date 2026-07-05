"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { 
  Sun, 
  Moon, 
  Menu, 
  Sparkles, 
  ArrowRight, 
  Star, 
  GitFork, 
  AlertCircle, 
  GitPullRequest,
  CheckCircle,
  Home,
  Info,
  BookOpen,
  User,
  LayoutGrid
} from "lucide-react";
import type { GitHubUser, GitHubRepo, GitHubIssue, GitHubPR } from "@/lib/github";
import { useTheme } from "@/components/theme-provider";

function getRelativeTime(iso: string) {
  const diff = new Date().getTime() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface DashboardViewProps {
  githubUser: GitHubUser | null;
  repos: GitHubRepo[];
  issues: GitHubIssue[];
  prs: GitHubPR[];
  username: string;
}

export default function DashboardView({ githubUser, repos, issues, prs, username }: DashboardViewProps) {
  const { theme, toggleTheme } = useTheme();

  const openIssuesCount = issues.length;
  const openPRsCount = prs.length;
  
  // Health score calculation
  const healthScore = Math.max(
    10, 
    Math.min(100, 100 - (openIssuesCount * 5) - (openPRsCount * 3))
  );

  // Active repositories (recently updated)
  const now = new Date().getTime();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const activeReposCount = repos.filter((r) => new Date(r.pushed_at).getTime() > weekAgo).length;

  // Language counts
  const langMap: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  });
  const topLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1)
    .map(([l]) => l);
  const primaryLanguage = topLangs[0] || "TypeScript";

  return (
    <div className="w-full min-h-screen flex flex-col font-sans select-none bg-[#fbfbfa] text-zinc-900 dark:bg-[#0a0a0b] dark:text-zinc-100 transition-colors duration-300">
        
        {/* ── 1. Top Navbar ── */}
        <header className="border-b border-zinc-200/80 dark:border-zinc-900 bg-[#fbfbfa]/70 dark:bg-[#0a0a0b]/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="font-serif italic font-bold text-2xl tracking-tight text-zinc-900 dark:text-white hover:opacity-80 transition-opacity">
                Stikkle
              </span>
            </div>

            {/* Center Nav Links with Icons */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200">
                <Home className="size-3.5" />
                Home
              </Link>
              <Link href="/about" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200">
                <Info className="size-3.5" />
                About the product
              </Link>
              <Link href="/docs" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200">
                <BookOpen className="size-3.5" />
                Documentation
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Sliding Pill-Shaped Theme Toggle Switch */}
              <button
                onClick={toggleTheme}
                className="w-14 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 relative transition-colors duration-300 cursor-pointer flex items-center border border-zinc-300/40 dark:border-zinc-700/40"
                aria-label="Toggle Theme"
              >
                <div 
                  className={`w-5.5 h-5.5 rounded-full bg-white dark:bg-[#0a0a0b] border border-zinc-200 dark:border-zinc-800 absolute top-[2px] transition-all duration-300 flex items-center justify-center shadow-sm ${
                    theme === "dark" ? "left-[30px]" : "left-[3px]"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="size-3 text-zinc-400" />
                  ) : (
                    <Sun className="size-3 text-amber-500" />
                  )}
                </div>
              </button>

              {/* Username Pill */}
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-700 dark:text-zinc-300">
                {githubUser ? (
                  <img
                    src={githubUser.avatar_url}
                    alt={githubUser.login}
                    className="size-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="size-3.5 text-zinc-400" />
                )}
                <span>@{githubUser?.login || username}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="h-9 px-4 rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-medium transition-colors duration-200 cursor-pointer border border-zinc-800 dark:border-zinc-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ── 2. Breadcrumb Row ── */}
        <div className="border-b border-zinc-200/50 dark:border-zinc-900/60 bg-zinc-50/20 dark:bg-zinc-950/10 py-3.5 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 text-xs font-mono">
            <LayoutGrid className="size-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" />
            <span className="text-zinc-400 dark:text-zinc-500">Dashboard</span>
            <span className="text-zinc-300 dark:text-zinc-800">&gt;</span>
            <span className="text-zinc-800 dark:text-zinc-100 font-medium">Overview</span>
          </div>
        </div>

        {/* ── Main content area ── */}
        <main className="max-w-7xl w-full mx-auto px-6 py-12 md:py-16 space-y-12">
          
          {/* ── 3. Hero Section (Wrapped in soft-bordered rounded card) ── */}
          <div className="border border-zinc-200 dark:border-zinc-900 bg-zinc-50/10 dark:bg-zinc-950/10 rounded-2xl p-6 md:p-8 space-y-8 transition-colors duration-300">
            
            {/* Hero Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {githubUser ? (
                  <img
                    src={githubUser.avatar_url}
                    alt={githubUser.login}
                    className="size-8 rounded-full border border-zinc-200 dark:border-zinc-800"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center text-xs">
                    <User className="size-4" />
                  </div>
                )}
                <span className="text-[10px] font-mono font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  DEVELOPER DASHBOARD
                </span>
              </div>
              <div className="space-y-2.5">
                <h1 className="text-[40px] md:text-[48px] font-medium tracking-tight text-zinc-900 dark:text-white leading-[1.1] font-serif italic">
                  Welcome back, {githubUser?.name || username}.
                </h1>
                <p className="text-[14px] font-sans font-normal leading-[1.6] text-zinc-500 dark:text-zinc-400">
                  Your codebase health is sitting at <span className="font-bold text-emerald-600 dark:text-emerald-500">{healthScore}%</span>, with <span className="font-bold text-zinc-800 dark:text-zinc-200">{activeReposCount} active {activeReposCount === 1 ? "project" : "projects"}</span> under development.
                </p>
              </div>
            </div>

            {/* Two-Column Card Row inside Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Left Card: Productivity */}
              <div className="border border-zinc-200 dark:border-zinc-900/80 bg-[#fbfbfa]/40 dark:bg-[#0a0a0b]/40 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-300 shadow-2xs">
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">Productivity</span>
                    <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/30">
                      Healthy
                    </span>
                  </div>
                  
                  {/* Score */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 block">Performance Index</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">{healthScore}</span>
                      <span className="text-sm text-zinc-400 dark:text-zinc-600 font-mono">/ 100</span>
                    </div>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Stat list with Icons */}
                <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900/60 space-y-3 text-[12px] font-mono tracking-tight text-zinc-500 dark:text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="size-3.5 text-zinc-400" />
                      Open Issues
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-200 font-bold text-sm">{openIssuesCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <GitPullRequest className="size-3.5 text-zinc-400" />
                      Pending PRs
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-200 font-bold text-sm">{openPRsCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <BookOpen className="size-3.5 text-zinc-400" />
                      Primary Language
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-200 font-bold text-sm">{primaryLanguage}</span>
                  </div>
                </div>
              </div>

              {/* Right Card: AI Insights */}
              <div className="border border-zinc-200 dark:border-zinc-900/80 bg-[#fbfbfa]/40 dark:bg-[#0a0a0b]/40 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-300 shadow-2xs">
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-violet-500" />
                      AI Insights
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">Updated just now</span>
                  </div>

                  {/* List of Insights */}
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="size-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shrink-0">
                        <AlertCircle className="size-3.5 text-emerald-500" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200 font-sans">Refine Repository Queues</h4>
                        <p className="text-[14px] font-sans font-normal leading-[1.6] text-zinc-500 dark:text-zinc-400">
                          Label the {openIssuesCount} unresolved issues to optimize workspace visibility.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="size-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shrink-0">
                        <GitPullRequest className="size-3.5 text-violet-500" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200 font-sans">Merge Branch Pipelines</h4>
                        <p className="text-[14px] font-sans font-normal leading-[1.6] text-zinc-500 dark:text-zinc-400">
                          Accelerate deployment times by integrating the {openPRsCount} open pull requests.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="size-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shrink-0">
                        <CheckCircle className="size-3.5 text-blue-500" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200 font-sans">API Rate Optimization</h4>
                        <p className="text-[14px] font-sans font-normal leading-[1.6] text-zinc-500 dark:text-zinc-400">
                          Personal Access Token is active, elevating your request limit to 5,000 req/hr.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer and link */}
                <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 dark:text-zinc-500 font-light flex items-center gap-1.5">
                    <CheckCircle className="size-3.5 text-zinc-400" />
                    AI recommendations match your sprint.
                  </span>
                  <Link href="/recommendation" className="text-zinc-800 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-medium flex items-center gap-1 transition-colors">
                    View all <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* ── 4. Repositories Section ── */}
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4 transition-colors duration-300">
              <div>
                <h3 className="text-[22px] md:text-[24px] font-medium text-zinc-900 dark:text-white font-serif italic">Repositories</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 font-light">Bespoke catalog of public source code projects</p>
              </div>
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{repos.length} total repos</span>
            </div>

            {/* Responsive 2-Column Grid of Repo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.slice(0, 6).map((repo) => (
                <div
                  key={repo.id}
                  className="border border-zinc-200 dark:border-zinc-900 bg-zinc-50/10 dark:bg-zinc-950/10 hover:border-zinc-300 dark:hover:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-950/20 rounded-xl p-6 flex flex-col justify-between gap-4 transition-all duration-200 group shadow-2xs hover:shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[16px] font-serif italic font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:underline truncate inline-flex items-center gap-1"
                      >
                        {repo.name}
                        <ArrowRight className="size-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
                      </a>
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 px-1.5 py-0.5 rounded leading-none">
                        Public
                      </span>
                    </div>

                    {repo.description && (
                      <p className="text-[14px] font-sans font-normal leading-[1.7] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/60 text-[10px] text-zinc-500 dark:text-zinc-400">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-400">
                        <span className="inline-block size-2 rounded-full bg-emerald-500" />
                        {repo.language}
                      </span>
                    )}

                    <span className="flex items-center gap-1 font-mono">
                      <Star className="size-3 text-zinc-400" />
                      {repo.stargazers_count}
                    </span>

                    <span className="flex items-center gap-1 font-mono">
                      <GitFork className="size-3 text-zinc-400" />
                      {repo.forks_count}
                    </span>
                    
                    <span className="text-zinc-400 dark:text-zinc-500 font-mono ml-auto">
                      {getRelativeTime(repo.pushed_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
  );
}
