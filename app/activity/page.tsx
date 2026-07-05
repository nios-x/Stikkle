import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUser, getUserActivity } from "@/lib/github"
import type { GitHubUser, GitHubRepo, GitHubIssue, GitHubPR } from "@/lib/github"
import { ActivityContent } from "@/components/activity-content"
import { buildActivityEvents } from "@/lib/activity"
import { redirect } from "next/navigation"

// ── Page ─────────────────────────────────────────────────────────────
export default async function ActivityPage() {
  const session = await getServerSession(authOptions)
  const username: string | null =
    (session?.user as { login?: string } | undefined)?.login ??
    session?.user?.name?.replace(/\s+/g, "") ??
    (session?.user?.email ? session.user.email.split("@")[0] : null) ??
    null

  const hasConnectedGithub = !!username

  if (!hasConnectedGithub) {
    redirect("/api/auth/signin")
  }

  let githubUser: GitHubUser | null = null
  let repos: GitHubRepo[] = []
  let issues: GitHubIssue[] = []
  let prs: GitHubPR[] = []

  try {
    const token = (session?.user as { accessToken?: string })?.accessToken
    const [user, activity] = await Promise.all([
      getUser(username!, token),
      getUserActivity(username!, 10, token),
    ])
    githubUser = user
    repos = activity.repos
    issues = activity.issues
    prs = activity.prs
  } catch (err) {
    console.warn("[activity] GitHub API error:", err)
  }

  const isSignedIn = true
  const events = buildActivityEvents(repos, issues, prs)

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
              <ActivityContent
                isSignedIn={isSignedIn}
                events={events}
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
