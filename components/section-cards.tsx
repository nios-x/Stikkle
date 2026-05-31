"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  TrendingUpIcon,
  TrendingDownIcon,
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
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentlyActive = repos.filter((r) => new Date(r.pushed_at).getTime() > weekAgo).length

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">

      {/* Total Repositories */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <BookOpenIcon className="size-3.5 text-blue-500" />
            Repositories
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRepos}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
              <TrendingUpIcon />
              {recentlyActive} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {recentlyActive} repos pushed this week
          </div>
          <div className="text-muted-foreground">
            Top languages: {topLangStr}
          </div>
        </CardFooter>
      </Card>

      {/* Total Stars */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <StarIcon className="size-3.5 text-amber-500" />
            Total Stars
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalStars.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              <StarIcon className="size-3" />
              across {totalRepos} repos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <GitForkIcon className="size-4" /> {totalForks.toLocaleString()} total forks
          </div>
          <div className="text-muted-foreground">
            Community engagement across all repos
          </div>
        </CardFooter>
      </Card>

      {/* Open Issues */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <CircleDotIcon className="size-3.5 text-green-500" />
            Open Issues
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalIssues}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={totalIssues > 10 
              ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" 
              : "border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
            }>
              {totalIssues > 10 ? <TrendingDownIcon /> : <TrendingUpIcon />}
              {totalIssues > 10 ? "needs attention" : "looking good"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            From your top repositories
          </div>
          <div className="text-muted-foreground">
            Across @{username}&apos;s active projects
          </div>
        </CardFooter>
      </Card>

      {/* Open PRs */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <svg className="size-3.5 text-purple-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
            </svg>
            Open PRs
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPRs}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
              <TrendingUpIcon />
              pull requests
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active contributions
          </div>
          <div className="text-muted-foreground">
            Pending review and merge
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
