"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRightIcon,
  BugIcon,
  GitPullRequestIcon,
  AlertTriangleIcon,
  WrenchIcon,
  RocketIcon,
  SparklesIcon,
  FilterIcon,
  TrendingUpIcon,
  ClockIcon,
  StarIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ZapIcon,
  TargetIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react"
import type { Recommendation } from "@/app/recommendation/page"
import type { GitHubUser } from "@/lib/github"

// ── Priority config ──────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  critical: {
    label: "Critical",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900/40",
    badgeClass: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    icon: AlertCircleIcon,
    glow: "shadow-red-500/10",
  },
  high: {
    label: "High",
    color: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-900/40",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    icon: AlertTriangleIcon,
    glow: "shadow-orange-500/10",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-500",
    textColor: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900/40",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    icon: ClockIcon,
    glow: "shadow-blue-500/10",
  },
  low: {
    label: "Low",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-900/40",
    badgeClass: "border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    icon: CheckCircle2Icon,
    glow: "shadow-green-500/10",
  },
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof BugIcon; color: string }> = {
  bug: { label: "Bug Fix", icon: BugIcon, color: "text-red-500" },
  "pr-review": { label: "PR Review", icon: GitPullRequestIcon, color: "text-purple-500" },
  "stale-issue": { label: "Stale Issue", icon: ClockIcon, color: "text-amber-500" },
  "popular-repo": { label: "Popular Repo", icon: StarIcon, color: "text-yellow-500" },
  maintenance: { label: "Maintenance", icon: WrenchIcon, color: "text-blue-500" },
  contribution: { label: "Contribution", icon: RocketIcon, color: "text-emerald-500" },
}

type FilterPriority = "all" | "critical" | "high" | "medium" | "low"
type FilterCategory = "all" | string

// ── Main Component ───────────────────────────────────────────────────

interface RecommendationsContentProps {
  isSignedIn: boolean
  recommendations: Recommendation[]
  username: string | null
  githubUser: GitHubUser | null
  totalRepos: number
  totalIssues: number
  totalPRs: number
}

export function RecommendationsContent({
  isSignedIn,
  recommendations,
  username,
  githubUser,
  totalRepos,
  totalIssues,
  totalPRs,
}: RecommendationsContentProps) {
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all")
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return recommendations.filter((r) => {
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false
      return true
    })
  }, [recommendations, priorityFilter, categoryFilter])

  // Count by priority
  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 }
    for (const r of recommendations) c[r.priority]++
    return c
  }, [recommendations])

  // Count by category
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const r of recommendations) c[r.category] = (c[r.category] || 0) + 1
    return c
  }, [recommendations])

  if (!isSignedIn) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-muted-foreground">
          <SparklesIcon className="size-12 opacity-30" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Sign in to get recommendations</p>
            <p className="mt-1 text-sm">
              Connect your GitHub account to receive personalized task recommendations
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
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 size-24 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {githubUser && (
                <img
                  src={githubUser.avatar_url}
                  alt={githubUser.login}
                  className="size-14 rounded-full ring-2 ring-primary/20"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Recommendations
                  </h2>
                  <Badge
                    variant="secondary"
                    className="gap-1 border-primary/20 bg-primary/10 text-primary"
                  >
                    <SparklesIcon className="size-3" />
                    AI-powered
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Priority-based task suggestions for{" "}
                  <span className="font-medium text-foreground">@{username}</span> across{" "}
                  {totalRepos} repos
                </p>
              </div>
            </div>

            {/* Summary pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                <TargetIcon className="size-3.5 text-muted-foreground" />
                <span className="font-medium">{recommendations.length}</span>
                <span className="text-muted-foreground">tasks</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                <AlertCircleIcon className="size-3.5 text-red-500" />
                <span className="font-medium">{counts.critical + counts.high}</span>
                <span className="text-muted-foreground">urgent</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
                <TrendingUpIcon className="size-3.5 text-emerald-500" />
                <span className="font-medium">{totalPRs}</span>
                <span className="text-muted-foreground">open PRs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Priority Overview Cards ── */}
      <div className="grid gap-3 px-4 lg:px-6 @sm/main:grid-cols-2 @xl/main:grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((p) => {
          const config = PRIORITY_CONFIG[p]
          const Icon = config.icon
          const isActive = priorityFilter === p
          return (
            <button
              key={p}
              onClick={() => setPriorityFilter(isActive ? "all" : p)}
              className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md ${
                isActive
                  ? `${config.borderColor} ${config.bgColor} shadow-md ${config.glow}`
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${config.bgColor}`}
                  >
                    <Icon className={`size-4 ${config.textColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {config.label}
                    </p>
                    <p className="text-2xl font-bold tabular-nums">{counts[p]}</p>
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
                  className={`h-full rounded-full ${config.color} transition-all duration-500`}
                  style={{
                    width: `${recommendations.length > 0 ? (counts[p] / recommendations.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Category Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 lg:px-6">
        <FilterIcon className="size-4 shrink-0 text-muted-foreground" />
        <div className="flex items-center gap-1.5">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            className="h-7 rounded-full px-3 text-xs"
            onClick={() => setCategoryFilter("all")}
          >
            All
          </Button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const count = categoryCounts[key] || 0
            if (count === 0) return null
            const Icon = config.icon
            return (
              <Button
                key={key}
                variant={categoryFilter === key ? "default" : "outline"}
                size="sm"
                className="h-7 gap-1.5 rounded-full px-3 text-xs"
                onClick={() => setCategoryFilter(categoryFilter === key ? "all" : key)}
              >
                <Icon className={`size-3 ${categoryFilter !== key ? config.color : ""}`} />
                {config.label}
                <span className="ml-0.5 opacity-60">{count}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* ── Recommendations List ── */}
      <div className="px-4 lg:px-6">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
              <CheckCircle2Icon className="size-12 text-emerald-500 opacity-40" />
              <div className="text-center">
                <p className="text-lg font-medium">
                  {recommendations.length === 0
                    ? "You're all caught up!"
                    : "No matching recommendations"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {recommendations.length === 0
                    ? "No urgent tasks detected across your repositories. Great work! 🎉"
                    : "Try adjusting your filters to see more suggestions."}
                </p>
              </div>
              {priorityFilter !== "all" || categoryFilter !== "all" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPriorityFilter("all")
                    setCategoryFilter("all")
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Top recommendation highlight */}
            {filtered[0] && priorityFilter === "all" && categoryFilter === "all" && (
              <TopRecommendationCard recommendation={filtered[0]} />
            )}

            {/* Remaining list */}
            {filtered.slice(priorityFilter === "all" && categoryFilter === "all" ? 1 : 0).map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isExpanded={expandedId === rec.id}
                onToggle={() =>
                  setExpandedId(expandedId === rec.id ? null : rec.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── Top Recommendation Card ──────────────────────────────────────────

function TopRecommendationCard({ recommendation: rec }: { recommendation: Recommendation }) {
  const config = PRIORITY_CONFIG[rec.priority]
  const catConfig = CATEGORY_CONFIG[rec.category]
  const CatIcon = catConfig?.icon || RocketIcon

  return (
    <Card className={`relative overflow-hidden border-2 ${config.borderColor} ${config.bgColor}`}>
      {/* Animated gradient border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ZapIcon className="size-4 text-amber-500" />
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Top Priority
          </CardDescription>
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor} ring-1 ring-inset ${config.borderColor}`}
            >
              <CatIcon className={`size-5 ${catConfig?.color || "text-primary"}`} />
            </div>
            <div>
              <CardTitle className="text-lg leading-snug">{rec.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
            </div>
          </div>
          <Badge className={config.badgeClass}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Reason box */}
        <div className="rounded-lg border bg-background/60 p-3 backdrop-blur-sm">
          <p className="flex items-start gap-2 text-sm">
            <SparklesIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">{rec.reason}</span>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="gap-1 text-[10px]">
              <CatIcon className="size-3" />
              {catConfig?.label}
            </Badge>
            <span>·</span>
            <span className="truncate">{rec.repoName}</span>
            {rec.meta?.daysSinceUpdate && (
              <>
                <span>·</span>
                <span>{rec.meta.daysSinceUpdate}d idle</span>
              </>
            )}
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <a href={rec.url} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ExternalLinkIcon className="size-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Individual Recommendation Card ───────────────────────────────────

function RecommendationCard({
  recommendation: rec,
  isExpanded,
  onToggle,
}: {
  recommendation: Recommendation
  isExpanded: boolean
  onToggle: () => void
}) {
  const config = PRIORITY_CONFIG[rec.priority]
  const catConfig = CATEGORY_CONFIG[rec.category]
  const CatIcon = catConfig?.icon || RocketIcon

  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-md ${
        isExpanded ? `${config.bgColor} ${config.borderColor}` : "hover:border-primary/20"
      }`}
    >
      <div
        className="flex cursor-pointer items-start gap-3 p-4"
        onClick={onToggle}
      >
        {/* Priority indicator */}
        <div className="flex flex-col items-center gap-1.5 pt-0.5">
          <div className={`size-2.5 rounded-full ${config.color}`} />
          <div className={`h-6 w-px ${isExpanded ? config.color : "bg-border"} transition-colors`} />
        </div>

        {/* Icon */}
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${config.bgColor} transition-transform group-hover:scale-105`}
        >
          <CatIcon className={`size-4 ${catConfig?.color || "text-primary"}`} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">{rec.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{rec.repoName}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="outline" className={`text-[10px] ${config.badgeClass}`}>
                {config.label}
              </Badge>
              <ChevronRightIcon
                className={`size-4 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>

          {/* Meta pills */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="gap-1 py-0 text-[10px]">
              <CatIcon className="size-2.5" />
              {catConfig?.label}
            </Badge>
            {rec.meta?.stars && rec.meta.stars > 0 && (
              <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                <StarIcon className="size-2.5 text-amber-500" />
                {rec.meta.stars}
              </Badge>
            )}
            {rec.meta?.openIssues && (
              <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                <AlertCircleIcon className="size-2.5" />
                {rec.meta.openIssues} issues
              </Badge>
            )}
            {rec.meta?.daysSinceUpdate && (
              <Badge variant="outline" className="gap-1 py-0 text-[10px]">
                <ClockIcon className="size-2.5" />
                {rec.meta.daysSinceUpdate}d ago
              </Badge>
            )}
            {rec.meta?.labels?.slice(0, 2).map((label) => (
              <Badge key={label} variant="secondary" className="py-0 text-[10px]">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t px-4 pb-4 pt-3">
          <p className="text-sm text-muted-foreground">{rec.description}</p>

          <div className="mt-3 rounded-lg border bg-background/60 p-3 backdrop-blur-sm">
            <p className="flex items-start gap-2 text-sm">
              <SparklesIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{rec.reason}</span>
            </p>
          </div>

          <div className="mt-3 flex justify-end">
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <a href={rec.url} target="_blank" rel="noopener noreferrer">
                Open on GitHub
                <ExternalLinkIcon className="size-3" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
