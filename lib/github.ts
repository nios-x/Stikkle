/**
 * lib/github.ts
 * Complete typed wrapper around the GitHub REST API.
 * Uses the OAuth access token from the user's NextAuth session.
 */

const GITHUB_API = "https://api.github.com";

function githubHeaders(accessToken?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  private: boolean;
  fork: boolean;
  topics: string[];
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  body: string | null;
  html_url: string;
  pull_request?: { url: string };
  labels: { id: number; name: string; color: string }[];
  user: { login: string; avatar_url: string };
  assignee: { login: string; avatar_url: string } | null;
  created_at: string;
  updated_at: string;
  comments: number;
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  body: string | null;
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  draft: boolean;
  head: { ref: string; label: string };
  base: { ref: string; label: string };
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GitHubGist {
  id: string;
  html_url: string;
  description: string | null;
  public: boolean;
  created_at: string;
  updated_at: string;
  files: Record<string, { filename: string; language: string | null; raw_url: string; size: number }>;
  owner: { login: string; avatar_url: string };
  comments: number;
}

/** Language name → bytes count, e.g. { "TypeScript": 48201, "CSS": 1234 } */
export type GitHubLanguages = Record<string, number>;

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * GET /users/{username}
 */
export async function getUser(username: string, accessToken?: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: githubHeaders(accessToken),
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new GitHubApiError(res.status, `User ${username} not found`);
  return res.json() as Promise<GitHubUser>;
}

/**
 * GET /users/{username}/gists
 */
export async function getUserGists(username: string, accessToken?: string): Promise<GitHubGist[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/gists?per_page=100`,
    { headers: githubHeaders(accessToken), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new GitHubApiError(res.status, `Failed to fetch gists for ${username}`);
  return res.json() as Promise<GitHubGist[]>;
}

/**
 * GET /users/{username}/repos
 */
export async function getUserRepos(username: string, accessToken?: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&direction=desc`,
    { headers: githubHeaders(accessToken), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new GitHubApiError(res.status, `Failed to fetch repos for ${username}`);
  return res.json() as Promise<GitHubRepo[]>;
}

/**
 * GET /repos/{owner}/{repo}
 */
export async function getRepo(owner: string, repo: string, accessToken?: string): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: githubHeaders(accessToken),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new GitHubApiError(res.status, `Repo ${owner}/${repo} not found`);
  return res.json() as Promise<GitHubRepo>;
}

/**
 * GET /repos/{owner}/{repo}/issues  (excludes PRs)
 */
export async function getRepoIssues(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
  accessToken?: string
): Promise<GitHubIssue[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/issues?state=${state}&per_page=100`,
    { headers: githubHeaders(accessToken), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new GitHubApiError(res.status, `Failed to fetch issues for ${owner}/${repo}`);
  const all = (await res.json()) as GitHubIssue[];
  return all.filter((item) => !item.pull_request);
}

/**
 * GET /repos/{owner}/{repo}/pulls
 */
export async function getRepoPulls(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
  accessToken?: string
): Promise<GitHubPR[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls?state=${state}&per_page=30&sort=updated&direction=desc`,
    { headers: githubHeaders(accessToken), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new GitHubApiError(res.status, `Failed to fetch PRs for ${owner}/${repo}`);
  return res.json() as Promise<GitHubPR[]>;
}

/**
 * GET /repos/{owner}/{repo}/languages
 */
export async function getRepoLanguages(
  owner: string,
  repo: string,
  accessToken?: string
): Promise<GitHubLanguages> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
    headers: githubHeaders(accessToken),
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new GitHubApiError(res.status, `Failed to fetch languages for ${owner}/${repo}`);
  return res.json() as Promise<GitHubLanguages>;
}

/**
 * Fetch issues + PRs from ALL repos of a user (top N repos by stars).
 * Returns aggregated counts and recent items.
 */
export async function getUserActivity(username: string, topN = 5, accessToken?: string) {
  const repos = await getUserRepos(username, accessToken);
  const topRepos = [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, topN);

  const results = await Promise.allSettled(
    topRepos.flatMap((repo) => [
      getRepoIssues(repo.owner.login, repo.name, "open", accessToken),
      getRepoPulls(repo.owner.login, repo.name, "open", accessToken),
    ])
  );

  const allIssues: GitHubIssue[] = [];
  const allPRs: GitHubPR[] = [];

  results.forEach((result, idx) => {
    if (result.status === "fulfilled") {
      if (idx % 2 === 0) allIssues.push(...(result.value as GitHubIssue[]));
      else allPRs.push(...(result.value as GitHubPR[]));
    }
  });

  // Sort by most recently updated
  allIssues.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  allPRs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return { repos, topRepos, issues: allIssues, prs: allPRs };
}

// ─── Error class ──────────────────────────────────────────────────────────────

export class GitHubApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}
