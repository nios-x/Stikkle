/**
 * GET /api/github/repos?username=<github_username>
 *
 * Fetches the user's repos from GitHub, upserts them into Postgres,
 * and returns the list as JSON.
 */
import { NextRequest } from "next/server";
import { getUserRepos, GitHubApiError } from "@/lib/github";
import { db } from "@/config/drizzle";
import { repos } from "@/src/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json(
      { error: "Missing required query param: username" },
      { status: 400 }
    );
  }

  try {
    const ghRepos = await getUserRepos(username);

    // Upsert all repos into Postgres (conflict on primary key → update)
    if (ghRepos.length > 0) {
      await db
        .insert(repos)
        .values(
          ghRepos.map((r) => ({
            id: r.full_name,
            name: r.name,
            owner: r.owner.login,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language ?? null,
            description: r.description ?? null,
            htmlUrl: r.html_url,
            updatedAt: new Date(r.updated_at),
          }))
        )
        .onConflictDoUpdate({
          target: repos.id,
          set: {
            stars: sql`excluded.stars`,
            forks: sql`excluded.forks`,
            language: sql`excluded.language`,
            description: sql`excluded.description`,
            updatedAt: sql`excluded.updated_at`,
            syncedAt: sql`now()`,
          },
        });
    }

    return Response.json({ username, count: ghRepos.length, repos: ghRepos });
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error("[/api/github/repos]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
