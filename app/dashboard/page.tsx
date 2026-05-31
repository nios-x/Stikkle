import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { GitHubReposTable } from "@/components/github-repos-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  UserProfileCard,
  RecentPRsCard,
  OpenIssuesCard,
  ActivityFeedCard,
} from "@/components/dashboard-sections"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUser, getUserActivity } from "@/lib/github"
import type { GitHubUser, GitHubRepo, GitHubIssue, GitHubPR } from "@/lib/github"

import data from "./data.json"

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function Page() {
  // Get session — we need the GitHub login
  const session = await getServerSession(authOptions)
  const username: string | null =
    (session?.user as { login?: string } | undefined)?.login ?? null

  // Fetch all GitHub data in parallel
  let githubUser: GitHubUser | null = null
  let repos: GitHubRepo[] = []
  let issues: GitHubIssue[] = []
  let prs: GitHubPR[] = []

  if (username) {
    try {
      const [user, activity] = await Promise.all([
        getUser(username),
        getUserActivity(username, 5),
      ])
      githubUser = user
      repos = activity.repos
      issues = activity.issues
      prs = activity.prs
    } catch (err) {
      console.warn("[dashboard] GitHub API error:", err)
    }
  }

  const isSignedIn = !!username && repos.length > 0

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

              {/* ── Section 0: User Profile ── */}
              {isSignedIn && (
                <div className="px-4 lg:px-6">
                  <UserProfileCard user={githubUser} repos={repos} />
                </div>
              )}

              {/* ── Section 1: GitHub Stats Cards ── */}
              {isSignedIn ? (
                <SectionCards
                  repos={repos}
                  totalIssues={issues.length}
                  totalPRs={prs.length}
                  username={username}
                />
              ) : (
                <div className="px-4 lg:px-6">
                  <div className="flex items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
                    <p className="text-sm">Sign in with GitHub to see your dashboard stats</p>
                  </div>
                </div>
              )}

              {/* ── Section 2: PRs + Issues (2-col grid) ── */}
              {isSignedIn && (
                <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
                  <RecentPRsCard prs={prs} username={username} />
                  <OpenIssuesCard issues={issues} username={username} />
                </div>
              )}

              {/* ── Section 3: Chart + Activity Feed (2/3 + 1/3 grid) ── */}
              {isSignedIn && (
                <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
                  <div className="@xl/main:col-span-2">
                    <ChartAreaInteractive repos={repos} />
                  </div>
                  <div className="@xl/main:col-span-1">
                    <ActivityFeedCard repos={repos} issues={issues} prs={prs} />
                  </div>
                </div>
              )}

              {/* ── Section 4: GitHub Repos Table ── */}
              {isSignedIn && (
                <GitHubReposTable repos={repos} username={username} />
              )}

              {/* ── Section 5: Proposal Data Table (always shown) ── */}
              <DataTable data={data} />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
