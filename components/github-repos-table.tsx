"use client"

import * as React from "react"
import { StarIcon, GitForkIcon, SearchIcon, CodeIcon, ArrowUpRightIcon } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface GitHubReposTableProps {
  repos: GitHubRepo[]
  username: string
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500 border-blue-400/20",
  JavaScript: "bg-yellow-500 border-yellow-400/20",
  Python: "bg-green-500 border-green-400/20",
  Rust: "bg-orange-500 border-orange-400/20",
  Go: "bg-cyan-500 border-cyan-400/20",
  Java: "bg-red-500 border-red-400/20",
  "C++": "bg-purple-500 border-purple-400/20",
  C: "bg-gray-500 border-gray-400/20",
  HTML: "bg-orange-400 border-orange-400/20",
  CSS: "bg-blue-400 border-blue-400/20",
  Shell: "bg-zinc-600 border-zinc-500/20",
  Ruby: "bg-red-400 border-red-400/20",
}

function LangDot({ lang }: { lang: string | null }) {
  if (!lang) return null
  const color = LANG_COLORS[lang] ?? "bg-zinc-700 border-zinc-600/20"
  return (
    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
      <span className={`inline-block size-2 rounded-full ${color}`} />
      <span className="font-medium text-zinc-400">{lang}</span>
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

  function getRelativeTime(iso: string) {
    const diff = new Date().getTime() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return (
    <div className="px-4 lg:px-6 space-y-5">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-sm font-medium text-zinc-200">Repositories</h3>
          <p className="text-xs text-zinc-500">Active public repositories on GitHub</p>
        </div>
        <div className="relative max-w-xs w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all font-medium"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-16 text-zinc-500 bg-zinc-950/10">
          <CodeIcon className="size-6 text-zinc-700" />
          <p className="text-xs">No matching repositories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((repo) => (
            <div
              key={repo.id}
              className="border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800/80 hover:bg-zinc-950/40 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-zinc-200 hover:text-zinc-100 hover:underline truncate inline-flex items-center gap-1 group/link"
                    >
                      {repo.name}
                      <ArrowUpRightIcon className="size-3 text-zinc-600 group-hover/link:text-zinc-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800/60 px-1.5 py-0.5 rounded leading-none">
                      Public
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 shrink-0">
                    {getRelativeTime(repo.pushed_at)}
                  </span>
                </div>

                {repo.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pt-1 border-t border-zinc-900/60">
                <LangDot lang={repo.language} />
                
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                    <StarIcon className="size-3 text-zinc-600" />
                    {repo.stargazers_count}
                  </span>
                )}

                {repo.forks_count > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                    <GitForkIcon className="size-3 text-zinc-600" />
                    {repo.forks_count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
