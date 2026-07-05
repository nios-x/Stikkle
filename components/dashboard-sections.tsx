"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CircleIcon, AlertCircleIcon, GitPullRequestIcon, GitMergeIcon, MessageSquareIcon } from "lucide-react"
import Link from "next/link"
import type { GitHubRepo, GitHubIssue, GitHubPR, GitHubUser } from "@/lib/github"

// ── 1. User Profile Card (Header Block) ──────────────────────────────────────────

interface UserProfileCardProps {
  user: GitHubUser | null
  repos: GitHubRepo[]
}

export function UserProfileCard({ user, repos }: UserProfileCardProps) {
  if (!user) return null

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
      <div className="flex items-center gap-5">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="size-16 rounded-xl object-cover border border-zinc-800 bg-zinc-950"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100">{user.name || user.login}</h1>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded">
              @{user.login}
            </span>
          </div>
          {user.bio ? (
            <p className="text-sm text-zinc-400 max-w-xl font-normal leading-relaxed">{user.bio}</p>
          ) : (
            <p className="text-sm text-zinc-500">GitHub Developer Profile</p>
          )}
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono pt-1">
            <span>{user.public_repos} repos</span>
            <span>·</span>
            <span>{user.followers} followers</span>
            <span>·</span>
            <span>{user.following} following</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-medium text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          View GitHub Profile
        </a>
      </div>
    </div>
  )
}

// ── 2. Recent PRs Card (Linear Style List) ──────────────────────────────────────

interface RecentPRsCardProps {
  prs: GitHubPR[]
  username: string
}

export function RecentPRsCard({ prs, username }: RecentPRsCardProps) {
  const shown = prs.slice(0, 5)

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/30">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-zinc-200">Active Pull Requests</h3>
          <p className="text-xs text-zinc-500">Assigned or open by @{username}</p>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
          {prs.length} queue
        </span>
      </div>

      <div className="flex-1">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GitPullRequestIcon className="size-6 text-zinc-700 mb-2" />
            <p className="text-xs text-zinc-500 font-medium">No active pull requests found</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-900">
            {shown.map((pr) => (
              <li key={pr.id} className="hover:bg-zinc-950/50 transition-colors duration-150">
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-6 py-3.5 group"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    <GitPullRequestIcon className={cn("size-4 shrink-0", pr.draft ? "text-zinc-600" : "text-violet-500")} />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                        {pr.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                        <span className="text-zinc-600 font-bold">#{pr.number}</span>
                        <span>·</span>
                        <span>{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <span>·</span>
                        <span className="truncate max-w-[150px]">{pr.head.ref}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRightIcon className="size-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {prs.length > 5 && (
        <div className="p-3 border-t border-zinc-900 bg-zinc-950/40 text-center">
          <Link href="/activity" className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5">
            <span>View all {prs.length} pull requests</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

// ── 3. Open Issues Card (Linear Style List) ─────────────────────────────────────

interface OpenIssuesCardProps {
  issues: GitHubIssue[]
  username: string
}

export function OpenIssuesCard({ issues, username }: OpenIssuesCardProps) {
  const shown = issues.slice(0, 5)

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/30">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-zinc-200">Active Issues</h3>
          <p className="text-xs text-zinc-500">Tracked issues for @{username}</p>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
          {issues.length} active
        </span>
      </div>

      <div className="flex-1">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircleIcon className="size-6 text-zinc-700 mb-2" />
            <p className="text-xs text-zinc-500 font-medium">All active issues resolved</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-900">
            {shown.map((issue) => (
              <li key={issue.id} className="hover:bg-zinc-950/50 transition-colors duration-150">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-6 py-3.5 group"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    <AlertCircleIcon className="size-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                        {issue.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                        <span className="text-zinc-600 font-bold">#{issue.number}</span>
                        <span>·</span>
                        <span>{new Date(issue.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        {issue.comments > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <MessageSquareIcon className="size-2.5 text-zinc-600" />
                              {issue.comments}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRightIcon className="size-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {issues.length > 5 && (
        <div className="p-3 border-t border-zinc-900 bg-zinc-950/40 text-center">
          <Link href="/activity" className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5">
            <span>View all {issues.length} issues</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

// ── 4. Activity Feed Card (Build/Deploy Feed) ───────────────────────────────────

interface ActivityFeedCardProps {
  repos: GitHubRepo[]
  issues: GitHubIssue[]
  prs: GitHubPR[]
}

interface ActivityItem {
  id: string
  icon: "issue" | "pr" | "push"
  title: string
  description: string
  time: string
  url: string
}

export function ActivityFeedCard({ repos, issues, prs }: ActivityFeedCardProps) {
  const items: ActivityItem[] = []

  // Issues
  issues.slice(0, 3).forEach((issue) => {
    items.push({
      id: `issue-${issue.id}`,
      icon: "issue",
      title: "Opened Issue",
      description: `${issue.title} (#${issue.number})`,
      time: issue.created_at,
      url: issue.html_url,
    })
  })

  // PRs
  prs.slice(0, 3).forEach((pr) => {
    items.push({
      id: `pr-${pr.id}`,
      icon: "pr",
      title: "Opened Pull Request",
      description: `${pr.title} (#${pr.number})`,
      time: pr.created_at,
      url: pr.html_url,
    })
  })

  // Pushes
  repos.slice(0, 3).forEach((repo) => {
    items.push({
      id: `push-${repo.id}`,
      icon: "push",
      title: "Pushed Commit",
      description: `Updates on ${repo.name} [${repo.default_branch}]`,
      time: repo.pushed_at,
      url: repo.html_url,
    })
  })

  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  const shown = items.slice(0, 6)

  function getRelativeTime(iso: string) {
    const diff = new Date().getTime() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const iconColor: Record<string, string> = {
    issue: "text-emerald-500 border-emerald-950 bg-emerald-950/10",
    pr: "text-violet-500 border-violet-950 bg-violet-950/10",
    push: "text-blue-500 border-blue-950 bg-blue-950/10",
  }

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/30">
        <div className="space-y-0.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h3 className="text-sm font-medium text-zinc-200">Activity Timeline</h3>
        </div>
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Stream</span>
      </div>

      <div className="flex-1">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xs text-zinc-500">No recent activities on timeline</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-900">
            {shown.map((item) => (
              <li key={item.id} className="hover:bg-zinc-950/50 transition-colors duration-150">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 px-6 py-4 group"
                >
                  <div className={cn("flex size-7 items-center justify-center rounded-lg border text-xs shrink-0 mt-0.5", iconColor[item.icon])}>
                    {item.icon === "issue" && <AlertCircleIcon className="size-3.5" />}
                    {item.icon === "pr" && <GitPullRequestIcon className="size-3.5" />}
                    {item.icon === "push" && <GitMergeIcon className="size-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">{item.title}</p>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">{getRelativeTime(item.time)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-zinc-900 bg-zinc-950/40 text-center">
        <Link href="/activity" className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5">
          <span>View Full Activity Log</span>
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>
    </div>
  )
}
