import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUser, getUserActivity } from "@/lib/github"
import type { GitHubUser, GitHubRepo, GitHubIssue, GitHubPR } from "@/lib/github"
import { RecommendationsContent } from "@/components/recommendations-content"

// ── Types ────────────────────────────────────────────────────────────
export interface Recommendation {
  id: string
  priority: "critical" | "high" | "medium" | "low"
  category: "bug" | "pr-review" | "stale-issue" | "popular-repo" | "maintenance" | "contribution"
  title: string
  description: string
  reason: string
  url: string
  repoName: string
  meta?: {
    stars?: number
    openIssues?: number
    daysSinceUpdate?: number
    labels?: string[]
  }
}

// ── Recommendation Engine ────────────────────────────────────────────
function generateRecommendations(
  repos: GitHubRepo[],
  issues: GitHubIssue[],
  prs: GitHubPR[],
  username: string
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const now = Date.now()

  // 1. Stale PRs that need attention (open > 7 days)
  for (const pr of prs) {
    const daysSinceUpdate = Math.floor(
      (now - new Date(pr.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceUpdate > 7) {
      recommendations.push({
        id: `stale-pr-${pr.id}`,
        priority: daysSinceUpdate > 30 ? "critical" : "high",
        category: "pr-review",
        title: `Review stale PR: ${pr.title}`,
        description: `PR #${pr.number} hasn't been updated in ${daysSinceUpdate} days. Consider merging, closing, or updating it.`,
        reason: `This PR has been idle for ${daysSinceUpdate} days — stale PRs slow down development velocity and create merge conflicts.`,
        url: pr.html_url,
        repoName: pr.base.label.split(":")[0] || "unknown",
        meta: {
          daysSinceUpdate,
        },
      })
    }
  }

  // 2. Critical bugs (issues with "bug" label)
  for (const issue of issues) {
    const isBug = issue.labels?.some(
      (l) => l.name.toLowerCase() === "bug" || l.name.toLowerCase() === "critical"
    )
    if (isBug) {
      const daysSinceCreated = Math.floor(
        (now - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      recommendations.push({
        id: `bug-${issue.id}`,
        priority: daysSinceCreated > 14 ? "critical" : "high",
        category: "bug",
        title: `Fix bug: ${issue.title}`,
        description: `Issue #${issue.number} is tagged as a bug and has been open for ${daysSinceCreated} days.`,
        reason: `Bugs directly impact users. This issue has ${issue.comments} comment${issue.comments !== 1 ? "s" : ""} indicating community attention.`,
        url: issue.html_url,
        repoName: issue.html_url.split("/").slice(3, 5).join("/"),
        meta: {
          daysSinceUpdate: daysSinceCreated,
          labels: issue.labels?.map((l) => l.name),
        },
      })
    }
  }

  // 3. High-activity repos with many open issues
  for (const repo of repos.filter((r) => !r.fork)) {
    if (repo.open_issues_count > 10 && repo.stargazers_count > 5) {
      recommendations.push({
        id: `triage-${repo.id}`,
        priority: repo.open_issues_count > 30 ? "high" : "medium",
        category: "maintenance",
        title: `Triage issues in ${repo.name}`,
        description: `${repo.name} has ${repo.open_issues_count} open issues. Triaging and labeling will help prioritize work.`,
        reason: `Popular repos (${repo.stargazers_count}★) with untriaged issues can overwhelm contributors and discourage new contributions.`,
        url: `${repo.html_url}/issues`,
        repoName: repo.full_name,
        meta: {
          stars: repo.stargazers_count,
          openIssues: repo.open_issues_count,
        },
      })
    }
  }

  // 4. Repos not updated recently (potential maintenance)
  for (const repo of repos.filter((r) => !r.fork && r.stargazers_count > 2)) {
    const daysSincePush = Math.floor(
      (now - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSincePush > 90) {
      recommendations.push({
        id: `stale-repo-${repo.id}`,
        priority: "medium",
        category: "maintenance",
        title: `Update ${repo.name}`,
        description: `This repo hasn't had a push in ${daysSincePush} days. Consider updating dependencies or archiving.`,
        reason: `Stale repos with stars (${repo.stargazers_count}★) may have security vulnerabilities in outdated dependencies.`,
        url: repo.html_url,
        repoName: repo.full_name,
        meta: {
          stars: repo.stargazers_count,
          daysSinceUpdate: daysSincePush,
        },
      })
    }
  }

  // 5. Enhancement issues (feature work)
  for (const issue of issues) {
    const isEnhancement = issue.labels?.some(
      (l) =>
        l.name.toLowerCase() === "enhancement" ||
        l.name.toLowerCase() === "feature"
    )
    if (isEnhancement) {
      recommendations.push({
        id: `feature-${issue.id}`,
        priority: "low",
        category: "contribution",
        title: `Implement: ${issue.title}`,
        description: `Feature request #${issue.number} — ${issue.comments} comment${issue.comments !== 1 ? "s" : ""} from the community.`,
        reason: `Enhancements improve user satisfaction and project adoption. This feature has community interest.`,
        url: issue.html_url,
        repoName: issue.html_url.split("/").slice(3, 5).join("/"),
        meta: {
          labels: issue.labels?.map((l) => l.name),
        },
      })
    }
  }

  // 6. Open PRs by the user that are drafts
  for (const pr of prs.filter((p) => p.draft)) {
    recommendations.push({
      id: `draft-pr-${pr.id}`,
      priority: "medium",
      category: "pr-review",
      title: `Finish draft PR: ${pr.title}`,
      description: `Draft PR #${pr.number} on branch ${pr.head.ref} is waiting to be completed.`,
      reason: `Draft PRs represent work-in-progress. Completing them frees up mental overhead and moves the project forward.`,
      url: pr.html_url,
      repoName: pr.base.label.split(":")[0] || "unknown",
    })
  }

  // 7. Issues assigned to user
  for (const issue of issues) {
    if (issue.assignee?.login === username) {
      const daysSinceAssigned = Math.floor(
        (now - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      // Avoid duplicates if already added as bug
      if (!recommendations.some((r) => r.id === `bug-${issue.id}`)) {
        recommendations.push({
          id: `assigned-${issue.id}`,
          priority: daysSinceAssigned > 14 ? "high" : "medium",
          category: "contribution",
          title: `Work on: ${issue.title}`,
          description: `Issue #${issue.number} is assigned to you and has been open for ${daysSinceAssigned} days.`,
          reason: `Assigned issues represent commitments. Completing them builds trust and keeps the project moving.`,
          url: issue.html_url,
          repoName: issue.html_url.split("/").slice(3, 5).join("/"),
          meta: {
            daysSinceUpdate: daysSinceAssigned,
            labels: issue.labels?.map((l) => l.name),
          },
        })
      }
    }
  }

  // Sort by priority: critical > high > medium > low
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return recommendations
}

// ── Page ─────────────────────────────────────────────────────────────
export default async function RecommendationPage() {
  const session = await getServerSession(authOptions)
  const username: string | null =
    (session?.user as { login?: string } | undefined)?.login ?? null

  let githubUser: GitHubUser | null = null
  let repos: GitHubRepo[] = []
  let issues: GitHubIssue[] = []
  let prs: GitHubPR[] = []

  if (username) {
    try {
      const [user, activity] = await Promise.all([
        getUser(username),
        getUserActivity(username, 10),
      ])
      githubUser = user
      repos = activity.repos
      issues = activity.issues
      prs = activity.prs
    } catch (err) {
      console.warn("[recommendation] GitHub API error:", err)
    }
  }

  const isSignedIn = !!username && repos.length > 0
  const recommendations = isSignedIn
    ? generateRecommendations(repos, issues, prs, username)
    : []

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <RecommendationsContent
                isSignedIn={isSignedIn}
                recommendations={recommendations}
                username={username}
                githubUser={githubUser}
                totalRepos={repos.length}
                totalIssues={issues.length}
                totalPRs={prs.length}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
