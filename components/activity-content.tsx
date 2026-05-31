"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowRightIcon,
  GitPullRequestIcon,
  GitBranchIcon,
  AlertCircleIcon,
  ClockIcon,
  StarIcon,
  ExternalLinkIcon,
  ActivityIcon,
  FilterIcon,
  CalendarIcon,
  GitCommitHorizontalIcon,
  MessageSquareIcon,
  EyeIcon,
  TagIcon,
  CircleDotIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react"
import type { GitHubRepo, GitHubIssue, GitHubPR, GitHubUser } from "@/lib/github"

// ── Types ────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string
  type: "issue" | "pr" | "push" | "star"
  title: string
  description: string
  time: string
  url: string
  repo: string
  avatarUrl?: string
  meta?: {
    number?: number
    branch?: string
    labels?: { name: string; color: string }[]
    draft?: boolean
    comments?: number
    state?: string
    language?: string
    stars?: number
    additions?: number
    deletions?: number
  }
}

// ── Build events from GitHub data ────────────────────────────────────

export function buildActivityEvents(
  repos: GitHubRepo[],
  issues: GitHubIssue[],
  prs: GitHubPR[]
): ActivityEvent[] {
  const events: ActivityEvent[] = []

  for (const issue of issues) {
    events.push({
      id: `issue-${issue.id}`,
      type: "issue",
      title: issue.title,
      description: `#${issue.number} opened by ${issue.user.login}`,
      time: issue.created_at,
      url: issue.html_url,
      repo: issue.html_url.split("/").slice(3, 5).join("/"),
      avatarUrl: issue.user.avatar_url,
      meta: {
        number: issue.number,
        labels: issue.labels?.map((l) => ({ name: l.name, color: l.color })),
        comments: issue.comments,
        state: issue.state,
      },
    })
  }

  for (const pr of prs) {
    events.push({
      id: `pr-${pr.id}`,
      type: "pr",
      title: pr.title,
      description: `#${pr.number} by ${pr.user.login} → ${pr.base.ref}`,
      time: pr.created_at,
      url: pr.html_url,
      repo: pr.base.label.split(":")[0] || "unknown",
      avatarUrl: pr.user.avatar_url,
      meta: {
        number: pr.number,
        branch: pr.head.ref,
        draft: pr.draft,
        state: pr.state,
        additions: pr.additions,
        deletions: pr.deletions,
      },
    })
  }

  for (const repo of repos.filter((r) => !r.fork)) {
    events.push({
      id: `push-${repo.id}`,
      type: "push",
      title: `Push to ${repo.name}`,
      description: `${repo.default_branch} · ${repo.language ?? "—"}`,
      time: repo.pushed_at,
      url: repo.html_url,
      repo: repo.full_name,
      avatarUrl: repo.owner.avatar_url,
      meta: {
        branch: repo.default_branch,
        language: repo.language ?? undefined,
        stars: repo.stargazers_count,
      },
    })

    // Also add starred / popular repos as star events
    if (repo.stargazers_count > 10) {
      events.push({
        id: `star-${repo.id}`,
        type: "star",
        title: `${repo.name} is trending`,
        description: `${repo.stargazers_count} stars · ${repo.language ?? "—"}`,
        time: repo.updated_at,
        url: repo.html_url,
        repo: repo.full_name,
        avatarUrl: repo.owner.avatar_url,
        meta: {
          stars: repo.stargazers_count,
          language: repo.language ?? undefined,
        },
      })
    }
  }

  events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  return events
}

// ── Helpers ──────────────────────────────────────────────────────────

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"

  const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "long" })

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  })
}

function groupByDate(events: ActivityEvent[]): Map<string, ActivityEvent[]> {
  const groups = new Map<string, ActivityEvent[]>()
  for (const event of events) {
    const key = formatDate(event.time)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(event)
  }
  return groups
}

// ── Event type config ────────────────────────────────────────────────

const EVENT_CONFIG = {
  issue: {
    label: "Issues",
    icon: CircleDotIcon,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800/40",
    badgeClass: "border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    dotColor: "bg-green-500",
  },
  pr: {
    label: "Pull Requests",
    icon: GitPullRequestIcon,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800/40",
    badgeClass: "border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    dotColor: "bg-purple-500",
  },
  push: {
    label: "Pushes",
    icon: GitCommitHorizontalIcon,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800/40",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  star: {
    label: "Stars",
    icon: StarIcon,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
}

const LABEL_STYLES: Record<string, string> = {
  bug: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  enhancement: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  documentation: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  "good first issue": "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  question: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  feature: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
}

// ── Component ────────────────────────────────────────────────────────

type FilterType = "all" | "issue" | "pr" | "push" | "star"

interface ActivityContentProps {
  isSignedIn: boolean
  events: ActivityEvent[]
  username: string | null
  githubUser: GitHubUser | null
  totalRepos: number
  totalIssues: number
  totalPRs: number
}

export function ActivityContent({
  isSignedIn,
  events,
  username,
  githubUser,
  totalRepos,
  totalIssues,
  totalPRs,
}: ActivityContentProps) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [showCount, setShowCount] = useState(30)

  const filtered = useMemo(() => {
    if (filter === "all") return events
    return events.filter((e) => e.type === filter)
  }, [events, filter])

  const shown = filtered.slice(0, showCount)
  const grouped = useMemo(() => groupByDate(shown), [shown])

  const counts = useMemo(() => {
    const c = { issue: 0, pr: 0, push: 0, star: 0 }
    for (const e of events) c[e.type]++
    return c
  }, [events])

  if (!isSignedIn) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-muted-foreground">
          <ActivityIcon className="size-12 opacity-30" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Sign in to view activity</p>
            <p className="mt-1 text-sm">
              Connect your GitHub account to see your combined activity feed
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Hero Section ── */}
      <div className="px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 md:p-8">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 size-24 rounded-full bg-primary/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-primary/3 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {githubUser && (
                <div className="relative">
                  <img
                    src={githubUser.avatar_url}
                    alt={githubUser.login}
                    className="size-14 rounded-full ring-2 ring-primary/20"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-green-500">
                    <span className="size-2 animate-pulse rounded-full bg-green-300" />
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Activity Feed
                  </h2>
                  <Badge
                    variant="secondary"
                    className="gap-1 border-primary/20 bg-primary/10 text-primary"
                  >
                    <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Combined GitHub timeline for{" "}
                  <span className="font-medium text-foreground">@{username}</span> across{" "}
                  {totalRepos} repos
                </p>
              </div>
            </div>

            {/* Summary pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                <ActivityIcon className="size-3.5 text-muted-foreground" />
                <span className="font-medium">{events.length}</span>
                <span className="text-muted-foreground">events</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                <CircleDotIcon className="size-3.5 text-green-500" />
                <span className="font-medium">{totalIssues}</span>
                <span className="text-muted-foreground">issues</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                <GitPullRequestIcon className="size-3.5 text-purple-500" />
                <span className="font-medium">{totalPRs}</span>
                <span className="text-muted-foreground">PRs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-3 px-4 lg:px-6 @sm/main:grid-cols-2 @xl/main:grid-cols-4">
        {(["issue", "pr", "push", "star"] as const).map((type) => {
          const config = EVENT_CONFIG[type]
          const Icon = config.icon
          const isActive = filter === type
          return (
            <button
              key={type}
              onClick={() => setFilter(isActive ? "all" : type)}
              className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md ${
                isActive
                  ? `${config.borderColor} ${config.bgColor} shadow-md`
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${config.bgColor}`}
                  >
                    <Icon className={`size-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {config.label}
                    </p>
                    <p className="text-2xl font-bold tabular-nums">{counts[type]}</p>
                  </div>
                </div>
                {isActive && (
                  <Badge variant="secondary" className="text-[10px]">
                    Filtered
                  </Badge>
                )}
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${config.dotColor} transition-all duration-500`}
                  style={{
                    width: `${events.length > 0 ? (counts[type] / events.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Timeline + List ── */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="timeline" className="gap-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="timeline" className="gap-1.5">
                <CalendarIcon className="size-3.5" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="compact" className="gap-1.5">
                <FilterIcon className="size-3.5" />
                Compact
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Showing {shown.length} of {filtered.length}</span>
              {filter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setFilter("all")}
                >
                  Clear filter
                </Button>
              )}
            </div>
          </div>

          {/* ── Timeline View ── */}
          <TabsContent value="timeline">
            {shown.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                  <ClockIcon className="size-12 text-muted-foreground opacity-30" />
                  <div className="text-center">
                    <p className="text-lg font-medium">No activity found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {filter !== "all"
                        ? "Try changing the filter to see more events."
                        : "No recent events across your repositories."}
                    </p>
                  </div>
                  {filter !== "all" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilter("all")}
                      className="mt-2"
                    >
                      Clear filter
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-6">
                {Array.from(grouped.entries()).map(([date, dateEvents]) => (
                  <div key={date}>
                    {/* Date header */}
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                        <CalendarIcon className="size-3 text-muted-foreground" />
                        {date}
                      </div>
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {dateEvents.length} event{dateEvents.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Events */}
                    <div className="relative ml-4 border-l-2 border-border pl-6">
                      {dateEvents.map((event, idx) => (
                        <TimelineEventCard key={event.id} event={event} isLast={idx === dateEvents.length - 1} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Compact View ── */}
          <TabsContent value="compact">
            {shown.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                  <ClockIcon className="size-12 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">No events to display.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {shown.map((event) => (
                      <CompactEventRow key={event.id} event={event} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Load more */}
        {showCount < filtered.length && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCount((c) => c + 20)}
              className="gap-1.5"
            >
              Load more events
              <ArrowRightIcon className="size-3" />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

// ── Timeline Event Card ──────────────────────────────────────────────

function TimelineEventCard({ event, isLast }: { event: ActivityEvent; isLast: boolean }) {
  const config = EVENT_CONFIG[event.type]
  const Icon = config.icon

  return (
    <div className={`relative ${isLast ? "pb-0" : "pb-5"}`}>
      {/* Dot on timeline */}
      <div
        className={`absolute -left-[calc(1.5rem+5px)] top-2.5 flex size-3 items-center justify-center rounded-full ring-2 ring-background ${config.dotColor}`}
      />

      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {event.avatarUrl ? (
            <img src={event.avatarUrl} alt="" className="size-8 rounded-full ring-1 ring-border" />
          ) : (
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}>
              <Icon className={`size-4 ${config.color}`} />
            </div>
          )}

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                  {event.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">{relativeTime(event.time)}</span>
                <ExternalLinkIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className={`gap-1 py-0 text-[10px] ${config.badgeClass}`}>
                <Icon className="size-2.5" />
                {config.label}
              </Badge>
              <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                {event.repo}
              </Badge>
              {event.meta?.number && (
                <Badge variant="outline" className="py-0 text-[10px]">
                  #{event.meta.number}
                </Badge>
              )}
              {event.meta?.branch && (
                <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                  <GitBranchIcon className="size-2.5" />
                  {event.meta.branch}
                </Badge>
              )}
              {event.meta?.draft && (
                <Badge variant="secondary" className="py-0 text-[10px]">
                  Draft
                </Badge>
              )}
              {event.meta?.comments !== undefined && event.meta.comments > 0 && (
                <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                  <MessageSquareIcon className="size-2.5" />
                  {event.meta.comments}
                </Badge>
              )}
              {event.meta?.stars !== undefined && event.meta.stars > 0 && (
                <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                  <StarIcon className="size-2.5 text-amber-500" />
                  {event.meta.stars}
                </Badge>
              )}
              {event.meta?.additions !== undefined && (
                <Badge variant="outline" className="gap-0.5 py-0 text-[10px]">
                  <span className="text-green-600">+{event.meta.additions}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-500">-{event.meta.deletions ?? 0}</span>
                </Badge>
              )}
              {event.meta?.labels?.slice(0, 2).map((label) => (
                <span
                  key={label.name}
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    LABEL_STYLES[label.name.toLowerCase()] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

// ── Compact Event Row ────────────────────────────────────────────────

function CompactEventRow({ event }: { event: ActivityEvent }) {
  const config = EVENT_CONFIG[event.type]
  const Icon = config.icon

  return (
    <li>
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
      >
        {/* Type icon */}
        <div className={`flex size-7 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}>
          <Icon className={`size-3.5 ${config.color}`} />
        </div>

        {/* Avatar */}
        {event.avatarUrl && (
          <img src={event.avatarUrl} alt="" className="size-6 rounded-full ring-1 ring-border" />
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium leading-snug">{event.title}</p>
            <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(event.time)}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{event.repo}</span>
            {event.meta?.number && (
              <>
                <span>·</span>
                <span>#{event.meta.number}</span>
              </>
            )}
            {event.meta?.branch && (
              <>
                <span>·</span>
                <GitBranchIcon className="size-3" />
                <span className="truncate">{event.meta.branch}</span>
              </>
            )}
          </div>
        </div>

        <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
      </a>
    </li>
  )
}
