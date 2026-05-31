"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExternalLinkIcon, FileCodeIcon, MessageSquareIcon } from "lucide-react"
import type { GitHubGist } from "@/lib/github"

interface GitHubGistsTableProps {
  gists: GitHubGist[]
  username: string
}

export function GitHubGistsTable({ gists, username }: GitHubGistsTableProps) {
  return (
    <div className="px-4 lg:px-6">
      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">GitHub Gists</CardTitle>
              <CardDescription className="text-sm">
                Snippets and gists by <span className="font-semibold text-foreground">@{username}</span>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1 border-border/50 bg-muted/20">
              {gists.length} Gists
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[400px]">Description / Files</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No gists found for this user.
                  </TableCell>
                </TableRow>
              ) : (
                gists.map((gist) => {
                  const files = Object.values(gist.files)
                  return (
                    <TableRow key={gist.id} className="group hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium truncate max-w-[380px]">
                            {gist.description || "No description"}
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {files.map((file, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] py-0 h-4 flex gap-1 items-center font-mono">
                                <FileCodeIcon className="size-2.5 text-muted-foreground" />
                                {file.filename}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {gist.public ? (
                          <Badge variant="secondary" className="bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-2 py-0 text-[10px]">Public</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-2 py-0">Secret</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs tabular-nums">
                        {new Date(gist.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MessageSquareIcon className="size-3" />
                          {gist.comments}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a href={gist.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon className="size-4" />
                            <span className="sr-only">Open Gist</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
