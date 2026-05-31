"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PixelatedGradient } from "@/components/ui/pixelated-gradient"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  GitForkIcon,
  StarIcon,
  BookOpenIcon,
  CircleDotIcon,
} from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface GitHubStatsCardsProps {
  repos: GitHubRepo[]
  totalIssues: number
  totalPRs: number
  username: string
}

export function SectionCards({ repos, totalIssues, totalPRs, username }: GitHubStatsCardsProps) {
  const totalRepos = repos.length
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)

  // Language breakdown
  const langMap: Record<string, number> = {}
  for (const r of repos) {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1
  }
  const topLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  const topLangStr = topLangs.map(([l]) => l).join(", ") || "—"

  // Recent activity — repos updated in last 7 days
  const now = new Date().getTime()
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  const recentlyActive = repos.filter((r) => new Date(r.pushed_at).getTime() > weekAgo).length

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">

      {/* Total Repositories */}
      <Card className="@container/card relative overflow-hidden group border border-border/50 bg-background/30 backdrop-blur-md">
        <PixelatedGradient
          colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
          pixelSize={24}
          speed={0.002}
          useMask={false}
          className="opacity-5"
        />
        <div className="relative z-10 flex flex-col flex-1 h-full w-full">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpenIcon className="size-12" />
          </div>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-[10px]">
              Repositories
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalRepos}
            </CardTitle>
            <CardAction>
              <Badge variant="secondary" className="px-2 py-0 border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {recentlyActive} Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs border-none bg-transparent">
            <div className="text-muted-foreground line-clamp-1">
              <span className="font-semibold text-foreground">{topLangStr}</span>
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Total Stars */}
      <Card className="@container/card relative overflow-hidden group border border-border/50 bg-background/30 backdrop-blur-md">
        <PixelatedGradient
          colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
          pixelSize={24}
          speed={0.002}
          useMask={false}
          className="opacity-5"
        />
        <div className="relative z-10 flex flex-col flex-1 h-full w-full">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <StarIcon className="size-12" />
          </div>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
              Total Stars
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalStars.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="secondary" className="px-2 py-0 border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                Community
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs border-none bg-transparent">
            <div className="text-muted-foreground flex items-center gap-1">
              <GitForkIcon className="size-3" />
              <span className="font-semibold text-foreground">{totalForks.toLocaleString()}</span> forks
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Open Issues */}
      <Card className="@container/card relative overflow-hidden group border border-border/50 bg-background/30 backdrop-blur-md">
        <PixelatedGradient
          colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
          pixelSize={24}
          speed={0.002}
          useMask={false}
          className="opacity-5"
        />
        <div className="relative z-10 flex flex-col flex-1 h-full w-full">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CircleDotIcon className="size-12" />
          </div>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-[10px]">
              Open Issues
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalIssues}
            </CardTitle>
            <CardAction>
              <Badge variant="secondary" className={cn(
                "px-2 py-0",
                totalIssues > 10 
                  ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                  : "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              )}>
                {totalIssues > 10 ? "Triage" : "Health"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs border-none bg-transparent">
            <div className="text-muted-foreground line-clamp-1">
              Assigned to <span className="font-semibold text-foreground">@{username}</span>
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Open PRs */}
      <Card className="@container/card relative overflow-hidden group border border-border/50 bg-background/30 backdrop-blur-md">
        <PixelatedGradient
          colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
          pixelSize={24}
          speed={0.002}
          useMask={false}
          className="opacity-5"
        />
        <div className="relative z-10 flex flex-col flex-1 h-full w-full">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="size-12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
            </svg>
          </div>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider text-[10px]">
              Open PRs
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalPRs}
            </CardTitle>
            <CardAction>
              <Badge variant="secondary" className="px-2 py-0 border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs border-none bg-transparent">
            <div className="text-muted-foreground">
              Pending merge and review
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

