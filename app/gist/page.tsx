import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { GitHubGistsTable } from "@/components/github-gists-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserProfileCard } from "@/components/dashboard-sections"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUser, getUserGists, getUserRepos } from "@/lib/github"
import type { GitHubUser, GitHubGist, GitHubRepo } from "@/lib/github"

export default async function GistPage() {
  const session = await getServerSession(authOptions)
  const username: string | null =
    (session?.user as { login?: string } | undefined)?.login ?? null

  let githubUser: GitHubUser | null = null
  let gists: GitHubGist[] = []
  let repos: GitHubRepo[] = []

  if (username) {
    try {
      const [user, userGists, userRepos] = await Promise.all([
        getUser(username),
        getUserGists(username),
        getUserRepos(username),
      ])
      githubUser = user
      gists = userGists
      repos = userRepos
    } catch (err) {
      console.warn("[gist] GitHub API error:", err)
    }
  }

  const isSignedIn = !!username

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
        <div className="flex flex-1 flex-col p-4 md:p-8">
          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">GitHub Gists</h1>
            <p className="text-muted-foreground text-lg">Manage and view your code snippets.</p>
          </div>

          <div className="flex flex-col gap-6">
            {isSignedIn && githubUser && (
              <UserProfileCard user={githubUser} repos={repos} />
            )}

            {isSignedIn ? (
              <GitHubGistsTable gists={gists} username={username!} />
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground bg-background/50">
                <p className="text-sm">Sign in with GitHub to see your gists</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
