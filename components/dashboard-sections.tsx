"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CircleCheckIcon, AlertCircleIcon, ClockIcon, GitBranchIcon } from "lucide-react"
import Link from "next/link"
import type { GitHubRepo, GitHubIssue, GitHubPR, GitHubUser } from "@/lib/github"


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
      <CardContent className="flex items-center gap-5 p-5">
        {/* Avatar */}
        <img
          src={user.avatar_url}
          alt={user.login}
          className="size-16 rounded-full ring-2 ring-primary/20"
        />
        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold">{user.name || user.login}</h3>
            <Badge variant="outline" className="text-xs">@{user.login}</Badge>
          </div>
          {user.bio && (
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{user.bio}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{user.public_repos}</span> repos
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{totalStars}</span> stars
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{user.followers}</span> followers
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{user.following}</span> following
            </span>
          </div>
        </div>
        {/* Link */}
        <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5">
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowRightIcon className="size-3" />
          </a>
        </Button>
      </CardContent>
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
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent Pull Requests
            </CardDescription>
            <CardTitle className="mt-0.5 text-base">@{username}</CardTitle>
          </div>
          <Badge variant="secondary" className="border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
            {prs.length} open
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <CircleCheckIcon className="size-8 opacity-30" />
            <p className="text-sm">No open pull requests</p>
          </div>
        ) : (
          <ul className="divide-y">
            {shown.map((pr) => (
              <li key={pr.id}>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/30">
                    <svg className="size-3 text-purple-600 dark:text-purple-400" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-snug">{pr.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>#{pr.number}</span>
                      <span>·</span>
                      <span>{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <GitBranchIcon className="size-3" />
                      <span className="truncate">{pr.head.ref}</span>
                      {pr.draft && (
                        <Badge variant="outline" className="ml-1 px-1 py-0 text-[10px]">Draft</Badge>
                      )}
                    </p>
                  </div>
                  <ArrowRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {prs.length > 6 && (
          <div className="border-t px-4 py-2.5">
            <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Link href="/activity">View all {prs.length} PRs <ArrowRightIcon className="size-3" /></Link>
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
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Open Issues
            </CardDescription>
            <CardTitle className="mt-0.5 text-base">@{username}</CardTitle>
          </div>
          <Badge variant="secondary" className={
            issues.length > 0
              ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
              : "border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
          }>
            {issues.length > 0 ? `${issues.length} open` : "all clear ✓"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <CircleCheckIcon className="size-8 opacity-30" />
            <p className="text-sm">No open issues — nice! 🎉</p>
          </div>
        ) : (
          <ul className="divide-y">
            {shown.map((issue) => (
              <li key={issue.id}>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                    <svg className="size-3 text-green-600 dark:text-green-400" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-snug">{issue.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        #{issue.number} · {new Date(issue.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {issue.comments > 0 && ` · ${issue.comments} 💬`}
                      </span>
                      {issue.labels?.slice(0, 2).map((label) => (
                        <span
                          key={label.id}
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${LABEL_STYLES[label.name.toLowerCase()] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {issues.length > 6 && (
          <div className="border-t px-4 py-2.5">
            <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Link href="/activity">View all {issues.length} issues <ArrowRightIcon className="size-3" /></Link>
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
  // Build a unified activity feed from recent issues, PRs, and repo pushes
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
    issue: "bg-green-100 dark:bg-green-950/30",
    pr: "bg-purple-100 dark:bg-purple-950/30",
    push: "bg-blue-100 dark:bg-blue-950/30",
    star: "bg-amber-100 dark:bg-amber-950/30",
  }

  const iconColor: Record<string, string> = {
    issue: "text-green-600 dark:text-green-400",
    pr: "text-purple-600 dark:text-purple-400",
    push: "text-blue-600 dark:text-blue-400",
    star: "text-amber-600 dark:text-amber-400",
  }

  function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
              Activity Feed
            </CardDescription>
            <CardTitle className="mt-0.5 text-base">Recent Updates</CardTitle>
          </div>
          <Badge variant="secondary">{shown.length} events</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <ClockIcon className="size-8 opacity-30" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y">
            {shown.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  {/* Avatar or icon */}
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt="" className="mt-0.5 size-6 rounded-full" />
                  ) : (
                    <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${iconBg[item.icon]}`}>
                      <AlertCircleIcon className={`size-3 ${iconColor[item.icon]}`} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium leading-snug">{item.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(item.time)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t px-4 py-2.5">
          <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <Link href="/activity">View full activity feed <ArrowRightIcon className="size-3" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
