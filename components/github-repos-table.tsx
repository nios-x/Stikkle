"use client"

import * as React from "react"
import { GitForkIcon, StarIcon, ExternalLinkIcon, CodeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GitHubRepo } from "@/lib/github"

interface GitHubReposTableProps {
  repos: GitHubRepo[]
  username: string
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  "C++": "bg-purple-500",
  C: "bg-gray-500",
  HTML: "bg-orange-400",
  CSS: "bg-blue-400",
  Shell: "bg-green-600",
  Ruby: "bg-red-400",
}

function LangDot({ lang }: { lang: string | null }) {
  if (!lang) return null
  const color = LANG_COLORS[lang] ?? "bg-gray-400"
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block size-2.5 rounded-full ${color}`} />
      <span className="text-sm text-muted-foreground">{lang}</span>
    </span>
  )
}

export function GitHubReposTable({ repos, username }: GitHubReposTableProps) {
  const [filter, setFilter] = React.useState("")

  const filtered = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(filter.toLowerCase())
  )

  if (repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-muted-foreground">
        <CodeIcon className="size-8 opacity-40" />
        <p className="text-sm">No repositories found for <strong>{username}</strong>.</p>
        <p className="text-xs opacity-60">Make sure your GITHUB_TOKEN is set in .env</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Repositories</h2>
          <p className="text-sm text-muted-foreground">
            {repos.length} repos for{" "}
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              @{username}
            </a>
          </p>
        </div>
        <input
          type="search"
          placeholder="Filter repositories…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 w-52 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead className="w-[280px]">Repository</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[130px]">Language</TableHead>
              <TableHead className="w-[90px] text-right">
                <StarIcon className="ml-auto size-3.5" />
              </TableHead>
              <TableHead className="w-[90px] text-right">
                <GitForkIcon className="ml-auto size-3.5" />
              </TableHead>
              <TableHead className="w-[80px]">Updated</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No repositories match &ldquo;{filter}&rdquo;
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {repo.private && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          Private
                        </Badge>
                      )}
                      <span className="truncate">{repo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate text-sm text-muted-foreground">
                    {repo.description ?? <span className="opacity-40 italic">No description</span>}
                  </TableCell>
                  <TableCell>
                    <LangDot lang={repo.language} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {repo.stargazers_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {repo.forks_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(repo.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={`Open ${repo.name} on GitHub`}
                    >
                      <ExternalLinkIcon className="size-3.5" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
