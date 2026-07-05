import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUser, getUserActivity } from "@/lib/github"
import type { GitHubUser, GitHubRepo, GitHubIssue, GitHubPR } from "@/lib/github"
import { redirect } from "next/navigation"
import DashboardView from "@/components/dashboard-view"

export default async function Page() {
  // Get session — we need the GitHub login
  const session = await getServerSession(authOptions)
  const username: string | null =
    (session?.user as { login?: string } | undefined)?.login ?? null

  if (!username) {
    redirect("/auth")
  }

  // Fetch all GitHub data in parallel
  let githubUser: GitHubUser | null = null
  let repos: GitHubRepo[] = []
  let issues: GitHubIssue[] = []
  let prs: GitHubPR[] = []

  try {
    const [user, activity] = await Promise.all([
      getUser(username),
      getUserActivity(username, 6), // fetch 6 items for the layout grid
    ])
    githubUser = user
    repos = activity.repos
    issues = activity.issues
    prs = activity.prs
  } catch (err) {
    console.warn("[dashboard] GitHub API error:", err)
  }

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
        <DashboardView 
          githubUser={githubUser}
          repos={repos}
          issues={issues}
          prs={prs}
          username={username}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
