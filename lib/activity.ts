/**
 * lib/activity.ts
 * Shared activity event builder — usable from both server and client components.
 */

import type { GitHubRepo, GitHubIssue, GitHubPR } from "@/lib/github"

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
