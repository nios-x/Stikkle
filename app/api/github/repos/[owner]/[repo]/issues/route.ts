/**
 * GET /api/github/repos/[owner]/[repo]/issues?state=open|closed|all
 *
 * Fetches issues from GitHub (excluding PRs), caches them in Postgres,
 * and returns them as JSON.
 */
import { NextRequest } from "next/server";
import { getRepoIssues, GitHubApiError } from "@/lib/github";
import { db } from "@/config/drizzle";
import { issues, repos } from "@/src/db/schema";
import { sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/github/repos/[owner]/[repo]/issues">
) {
  const { owner, repo } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const state = (searchParams.get("state") ?? "open") as "open" | "closed" | "all";

  try {
    const ghIssues = await getRepoIssues(owner, repo, state);
    const repoId = `${owner}/${repo}`;

    // Ensure the parent repo row exists (insert-or-ignore) so FK is satisfied
    await db
      .insert(repos)
      .values({
        id: repoId,
        name: repo,
        owner,
        stars: 0,
        forks: 0,
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    // Upsert all fetched issues
    if (ghIssues.length > 0) {
      await db
        .insert(issues)
        .values(
          ghIssues.map((i) => ({
            id: i.id,
            repoId,
            number: i.number,
            title: i.title,
            state: i.state,
            body: i.body ?? null,
            htmlUrl: i.html_url,
            isPullRequest: false,
            createdAt: new Date(i.created_at),
            updatedAt: new Date(i.updated_at),
          }))
        )
        .onConflictDoUpdate({
          target: issues.id,
          set: {
            title: sql`excluded.title`,
            state: sql`excluded.state`,
            body: sql`excluded.body`,
            updatedAt: sql`excluded.updated_at`,
            syncedAt: sql`now()`,
          },
        });
    }

    return Response.json({ owner, repo, state, count: ghIssues.length, issues: ghIssues });
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(`[/api/github/repos/${owner}/${repo}/issues]`, err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
