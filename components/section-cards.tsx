"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { GitForkIcon, StarIcon, GitPullRequestIcon, AlertCircleIcon, Code2Icon, FlameIcon } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface GitHubStatsCardsProps {
  repos: GitHubRepo[]
  totalIssues: number
  totalPRs: number
  username: string
}

export function SectionCards({ repos, totalIssues, totalPRs, username }: GitHubStatsCardsProps) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)

  // Sprint activity - repos pushed to in last 7 days
  const now = new Date().getTime()
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  const activeReposCount = repos.filter((r) => new Date(r.pushed_at).getTime() > weekAgo).length

  // Languages distribution
  const langMap: Record<string, number> = {}
  repos.forEach((r) => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1
  })
  const topLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
  const topLangsText = topLangs.map(([l]) => l).join(" & ") || "No languages"

  return (
    <div className="grid grid-cols-1 gap-5 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Sprint Activity & Language Velocity */}
      <Card className="relative overflow-hidden border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 hover:border-zinc-700/60 transition-colors duration-200">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Sprint Velocity</p>
            <h4 className="text-2xl font-semibold tracking-tight text-zinc-100">
              {activeReposCount} Active {activeReposCount === 1 ? "Repo" : "Repos"}
            </h4>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <FlameIcon className="size-4" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Pushed to last 7 days</span>
          <span className="font-medium text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{topLangsText}</span>
        </div>
      </Card>

      {/* Attention Queue */}
      <Card className="relative overflow-hidden border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 hover:border-zinc-700/60 transition-colors duration-200">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Attention Queue</p>
            <h4 className="text-2xl font-semibold tracking-tight text-zinc-100">
              {totalIssues + totalPRs} Open Items
            </h4>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <GitPullRequestIcon className="size-4" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-900 flex gap-4 text-xs">
          <span className="text-zinc-500 flex items-center gap-1">
            <AlertCircleIcon className="size-3.5 text-zinc-600" />
            {totalIssues} Open Issues
          </span>
          <span className="text-zinc-500 flex items-center gap-1">
            <GitPullRequestIcon className="size-3.5 text-zinc-600" />
            {totalPRs} Draft/Open PRs
          </span>
        </div>
      </Card>

      {/* Community Impact */}
      <Card className="relative overflow-hidden border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 hover:border-zinc-700/60 transition-colors duration-200 md:col-span-2 lg:col-span-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Community Impact</p>
            <h4 className="text-2xl font-semibold tracking-tight text-zinc-100 flex items-baseline gap-1.5">
              {totalStars} <span className="text-sm font-normal text-zinc-500">Stars</span>
            </h4>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <StarIcon className="size-4" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Forks & Contributions</span>
          <span className="font-mono text-zinc-400 flex items-center gap-1">
            <GitForkIcon className="size-3 text-zinc-600" />
            {totalForks} forks
          </span>
        </div>
      </Card>
    </div>
  )
}
