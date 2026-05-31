"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CircleCheckIcon, AlertCircleIcon, ClockIcon, GitBranchIcon } from "lucide-react"
import Link from "next/link"
import type { GitHubRepo, GitHubIssue, GitHubPR, GitHubUser } from "@/lib/github"
import { NoiseBackground } from "@/components/ui/noise-background"


// ── User Profile Card ──────────────────────────────────────────────────────────

interface UserProfileCardProps {
  user: GitHubUser | null
  repos: GitHubRepo[]
}

export function UserProfileCard({ user, repos }: UserProfileCardProps) {
  if (!user) return null

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)

  return (
    <Card className="@container/card overflow-hidden">
      <NoiseBackground 
        containerClassName="h-full w-full"
        className="flex flex-col @md/card:flex-row items-center @md/card:items-start gap-6 p-6"
        backdropBlur
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="size-20 rounded-2xl object-cover ring-4 ring-background border border-border/50"
          />
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-background">
            <span className="sr-only">Online</span>
          </div>
        </div>
        
        {/* Info */}
        <div className="min-w-0 flex-1 text-center @md/card:text-left">
          <div className="flex flex-col @md/card:flex-row @md/card:items-center gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{user.name || user.login}</h3>
            <div className="flex items-center justify-center @md/card:justify-start gap-2">
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold">
                @{user.login}
              </Badge>
              {user.company && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  · {user.company}
                </span>
              )}
            </div>
          </div>
          
          {user.bio && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          )}
          
          <div className="mt-6 grid grid-cols-2 @sm/card:grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Repos</span>
              <span className="text-xl font-bold">{user.public_repos}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Stars</span>
              <span className="text-xl font-bold">{totalStars}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Followers</span>
              <span className="text-xl font-bold">{user.followers}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Following</span>
              <span className="text-xl font-bold">{user.following}</span>
            </div>
          </div>
        </div>
        
        {/* Link */}
        <div className="flex @md/card:flex-col gap-2 shrink-0">
          <Button asChild variant="default" className="border border-primary-foreground/10">
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="gap-2">
              View Profile <ArrowRightIcon className="size-4" />
            </a>
          </Button>
          <Button variant="outline">
            Edit Profile
          </Button>
        </div>
      </NoiseBackground>
    </Card>
  )
}


// ── Recent PRs Card ────────────────────────────────────────────────────────────

interface RecentPRsCardProps {
  prs: GitHubPR[]
  username: string
}

export function RecentPRsCard({ prs, username }: RecentPRsCardProps) {
  const shown = prs.slice(0, 6)

  return (
    <Card className="flex flex-col border border-border/50 border-t-4 border-t-purple-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Recent Pull Requests</CardTitle>
            <CardDescription className="text-sm">
              Work items for <span className="font-semibold text-foreground">@{username}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            {prs.length} Open
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground bg-muted/5">
            <div className="p-4 rounded-full bg-muted/10">
              <CircleCheckIcon className="size-10 opacity-50" />
            </div>
            <p className="text-sm font-medium">No open pull requests</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {shown.map((pr) => (
              <li key={pr.id}>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 px-6 py-4 transition-all hover:bg-muted/50"
                >
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-100/80 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <GitBranchIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-semibold leading-none group-hover:text-primary transition-colors">{pr.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono text-purple-500/80">#{pr.number}</span>
                      <span>·</span>
                      <span>{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <span className="truncate max-w-[120px]">{pr.head.ref}</span>
                      {pr.draft && (
                        <Badge variant="outline" className="ml-1 px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider">Draft</Badge>
                      )}
                    </div>
                  </div>
                  <ArrowRightIcon className="mt-2 size-4 shrink-0 text-muted-foreground/50 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {prs.length > 6 && (
          <div className="p-4 border-t bg-muted/5">
            <Button asChild variant="ghost" className="w-full justify-between h-9 text-xs font-semibold hover:bg-muted/10">
              <Link href="/activity">
                <span>View all {prs.length} pull requests</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



// ── Open Issues Card ───────────────────────────────────────────────────────────

interface OpenIssuesCardProps {
  issues: GitHubIssue[]
  username: string
}

const LABEL_STYLES: Record<string, string> = {
  bug: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  enhancement: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  documentation: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  "good first issue": "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  question: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  feature: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
  help: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
}

export function OpenIssuesCard({ issues, username }: OpenIssuesCardProps) {
  const shown = issues.slice(0, 6)

  return (
    <Card className="flex flex-col border border-border/50 border-t-4 border-t-green-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Open Issues</CardTitle>
            <CardDescription className="text-sm">
              Assigned or reported by <span className="font-semibold text-foreground">@{username}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {issues.length > 0 ? `${issues.length} Open` : "Clear"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground bg-muted/5">
            <div className="p-4 rounded-full bg-muted/10">
              <CircleCheckIcon className="size-10 opacity-50 text-green-500" />
            </div>
            <p className="text-sm font-medium">All clear! No open issues.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {shown.map((issue) => (
              <li key={issue.id}>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 px-6 py-4 transition-all hover:bg-muted/50"
                >
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-green-100/80 text-green-600 dark:bg-green-900/30 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <AlertCircleIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-semibold leading-none group-hover:text-primary transition-colors">{issue.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono text-green-600/80 font-bold">#{issue.number}</span>
                      <span>·</span>
                      <span>{new Date(issue.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      {issue.comments > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            {issue.comments} 💬
                          </span>
                        </>
                      )}
                      <div className="flex gap-1 ml-1">
                        {issue.labels?.slice(0, 2).map((label) => (
                          <span
                            key={label.id}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LABEL_STYLES[label.name.toLowerCase()] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRightIcon className="mt-2 size-4 shrink-0 text-muted-foreground/50 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {issues.length > 6 && (
          <div className="p-4 border-t bg-muted/5">
            <Button asChild variant="ghost" className="w-full justify-between h-9 text-xs font-semibold hover:bg-muted/10">
              <Link href="/activity">
                <span>View all {issues.length} issues</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



// ── Activity Feed Card (recent GitHub events) ──────────────────────────────────

interface ActivityFeedCardProps {
  repos: GitHubRepo[]
  issues: GitHubIssue[]
  prs: GitHubPR[]
}

interface ActivityItem {
  id: string
  icon: "issue" | "pr" | "push" | "star"
  title: string
  description: string
  time: string
  url: string
  avatarUrl?: string
}

export function ActivityFeedCard({ repos, issues, prs }: ActivityFeedCardProps) {
  // Build a unified activity feed
  const items: ActivityItem[] = []

  // Recent issues
  for (const issue of issues.slice(0, 4)) {
    items.push({
      id: `issue-${issue.id}`,
      icon: "issue",
      title: issue.title,
      description: `#${issue.number} opened by ${issue.user.login}`,
      time: issue.created_at,
      url: issue.html_url,
      avatarUrl: issue.user.avatar_url,
    })
  }

  // Recent PRs
  for (const pr of prs.slice(0, 4)) {
    items.push({
      id: `pr-${pr.id}`,
      icon: "pr",
      title: pr.title,
      description: `#${pr.number} by ${pr.user.login} → ${pr.base.ref}`,
      time: pr.created_at,
      url: pr.html_url,
      avatarUrl: pr.user.avatar_url,
    })
  }

  // Recent repo pushes
  for (const repo of repos.slice(0, 4)) {
    items.push({
      id: `push-${repo.id}`,
      icon: "push",
      title: `Push to ${repo.name}`,
      description: `${repo.default_branch} · ${repo.language ?? "—"}`,
      time: repo.pushed_at,
      url: repo.html_url,
      avatarUrl: repo.owner.avatar_url,
    })
  }

  // Sort by recency
  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  const shown = items.slice(0, 8)

  const iconBg: Record<string, string> = {
    issue: "bg-green-100 dark:bg-green-900/30",
    pr: "bg-purple-100 dark:bg-purple-900/30",
    push: "bg-blue-100 dark:bg-blue-900/30",
    star: "bg-amber-100 dark:bg-amber-900/30",
  }

  const iconColor: Record<string, string> = {
    issue: "text-green-600 dark:text-green-400",
    pr: "text-purple-600 dark:text-purple-400",
    push: "text-blue-600 dark:text-blue-400",
    star: "text-amber-600 dark:text-amber-400",
  }

  // Use a ref or state for "now" to avoid purity issues if needed, 
  // but for relative time, calculating it in the render is common.
  // To satisfy the linter, we can calculate it once.
  const now = new Date().getTime()

  function getRelativeTime(iso: string) {
    const diff = now - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="flex flex-col border border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Activity Feed
            </CardTitle>
            <CardDescription className="text-sm">Latest updates from your repositories</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] tracking-tighter">
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground bg-muted/5">
            <ClockIcon className="size-10 opacity-30" />
            <p className="text-sm font-medium">No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {shown.map((item) => (
              <li key={item.id} className="relative group">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 px-6 py-4 transition-all hover:bg-muted/50"
                >
                  {/* Avatar or icon */}
                  <div className="relative shrink-0 transition-transform group-hover:scale-110">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt="" className="size-8 rounded-xl object-cover ring-2 ring-background border border-border/20" />
                    ) : (
                      <div className={cn("flex size-8 items-center justify-center rounded-xl border border-border/20", iconBg[item.icon])}>
                        <AlertCircleIcon className={cn("size-4", iconColor[item.icon])} />
                      </div>
                    )}
                    <div className={cn("absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-background border border-border/20", iconBg[item.icon])}>
                      {/* Sub-icon or indicator could go here */}
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-semibold leading-none group-hover:text-primary transition-colors">{item.title}</p>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60">{getRelativeTime(item.time)}</span>
                    </div>
                    <p className="mt-1.5 truncate text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="p-4 border-t bg-muted/5">
          <Button asChild variant="ghost" className="w-full justify-center h-9 text-xs font-semibold hover:bg-muted/10 gap-2">
            <Link href="/activity">
              <span>View Full Timeline</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

