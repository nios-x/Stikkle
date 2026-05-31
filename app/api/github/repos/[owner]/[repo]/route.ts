/**
 * GET /api/github/repos/[owner]/[repo]
 *
 * Returns full details for a single repository.
 */
import { NextRequest } from "next/server";
import { getRepo, GitHubApiError } from "@/lib/github";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/github/repos/[owner]/[repo]">
) {
  const { owner, repo } = await ctx.params;

  try {
    const data = await getRepo(owner, repo);
    return Response.json(data);
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(`[/api/github/repos/${owner}/${repo}]`, err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
