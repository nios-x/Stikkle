"use client"

import * as React from "react"
import type { GitHubRepo } from "@/lib/github"

interface ChartAreaInteractiveProps {
  repos: GitHubRepo[]
  username?: string | null
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Ruby: "#701516",
}

export function ChartAreaInteractive({ repos }: ChartAreaInteractiveProps) {
  // Calculate language distribution
  const langCount: Record<string, number> = {}
  let totalValidRepos = 0

  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1
      totalValidRepos++
    }
  })

  // Sort and convert to percentages
  const languages = Object.entries(langCount)
    .map(([name, count]) => {
      const percentage = totalValidRepos > 0 ? (count / totalValidRepos) * 100 : 0
      const color = LANG_COLORS[name] || "#71717a"
      return { name, count, percentage, color }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6) // Top 6 languages

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 backdrop-blur-md rounded-xl p-6 hover:border-zinc-800/80 transition-colors duration-200">
      <div className="space-y-1 pb-4 border-b border-zinc-900">
        <h3 className="text-sm font-medium text-zinc-200">Language Distribution</h3>
        <p className="text-xs text-zinc-500">Breakdown of primary technologies used across repositories</p>
      </div>

      {languages.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          No language data available.
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Stacked Percentage Bar */}
          <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
            {languages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* Grid list of languages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <div key={lang.name} className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-xs font-medium text-zinc-300">{lang.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-sm font-semibold text-zinc-200">
                    {lang.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    ({lang.count} {lang.count === 1 ? "repo" : "repos"})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
