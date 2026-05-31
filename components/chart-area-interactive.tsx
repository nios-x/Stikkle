"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Pie, PieChart } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { GitHubRepo } from "@/lib/github"

// ── Language colors matching GitHub's palette ─────────────────────────────────
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
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  SCSS: "#c6538c",
}

const CHART_PALETTE = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
  "#3b82f6", "#6d28d9",
]

interface ChartAreaInteractiveProps {
  repos: GitHubRepo[]
}

export function ChartAreaInteractive({ repos }: ChartAreaInteractiveProps) {
  const [view, setView] = React.useState("stars")

  // ── Stars per repo (top 10) ────────────────────────────────────────────────
  const starsData = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((r) => ({
      name: r.name.length > 16 ? r.name.slice(0, 14) + "…" : r.name,
      stars: r.stargazers_count,
      forks: r.forks_count,
    }))

  // ── Language breakdown (pie) ───────────────────────────────────────────────
  const langMap: Record<string, number> = {}
  for (const r of repos) {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1
  }
  const langData = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count], i) => ({
      name,
      value: count,
      fill: LANG_COLORS[name] ?? CHART_PALETTE[i % CHART_PALETTE.length],
    }))

  // ── Recent activity (repos by push date, last 12) ──────────────────────────
  const activityData = [...repos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 12)
    .reverse()
    .map((r) => ({
      name: r.name.length > 12 ? r.name.slice(0, 10) + "…" : r.name,
      issues: r.open_issues_count,
      stars: r.stargazers_count,
    }))

  const views: Record<string, { title: string; description: string }> = {
    stars: { title: "Stars & Forks by Repository", description: "Your most popular repos ranked by stargazer count" },
    languages: { title: "Language Distribution", description: "Breakdown of programming languages across your repos" },
    activity: { title: "Recent Activity", description: "Open issues & stars in recently pushed repos" },
  }
  const cur = views[view]

  if (repos.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
          <CardDescription>Sign in to see your repository analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
          <p className="text-sm">No repository data available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{cur.title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{cur.description}</span>
          <span className="@[540px]/card:hidden">Repository analytics</span>
        </CardDescription>
        <CardAction>
          <Select value={view} onValueChange={setView}>
            <SelectTrigger
              className="flex w-44 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select chart view"
            >
              <SelectValue placeholder="Stars & Forks" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="stars" className="rounded-lg">Stars & Forks</SelectItem>
              <SelectItem value="languages" className="rounded-lg">Languages</SelectItem>
              <SelectItem value="activity" className="rounded-lg">Recent Activity</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">

        {/* ── Stars & Forks bar chart ─────────────────────────────────────── */}
        {view === "stars" && (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={starsData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                />
                <Bar dataKey="stars" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={36} name="Stars" />
                <Bar dataKey="forks" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} maxBarSize={36} name="Forks" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-primary" />Stars</span>
              <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-primary/30" />Forks</span>
            </div>
          </>
        )}

        {/* ── Language pie chart ───────────────────────────────────────────── */}
        {view === "languages" && (
          <div className="flex flex-col items-center gap-4 @[540px]/card:flex-row @[540px]/card:gap-8">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={langData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {langData.map((entry, idx) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                  formatter={(value, name) => [`${value} repos`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
              {langData.map((lang) => (
                <span key={lang.name} className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: lang.fill }} />
                  {lang.name} <span className="text-muted-foreground">({lang.value})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Activity bar chart ──────────────────────────────────────────── */}
        {view === "activity" && (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={activityData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                />
                <Bar dataKey="issues" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={36} name="Open Issues" />
                <Bar dataKey="stars" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={36} name="Stars" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-red-500" />Open Issues</span>
              <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-yellow-500" />Stars</span>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  )
}
