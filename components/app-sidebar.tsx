"use client"

import Link from "next/link"
import * as React from "react"
import { useSession } from "next-auth/react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, CommandIcon, SparklesIcon, ActivityIcon, FileCodeIcon, GlobeIcon, DatabaseIcon, FileChartColumnIcon, FileIcon } from "lucide-react"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Recommendations",
    url: "/recommendation",
    icon: <SparklesIcon />,
  },
  {
    title: "Activity",
    url: "/activity",
    icon: <ActivityIcon />,
  },
  {
    title: "Lifecycle",
    url: "/lifecycle",
    icon: <ListIcon />,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <ChartBarIcon />,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: <FolderIcon />,
  },
  {
    title: "Team",
    url: "/team",
    icon: <UsersIcon />,
  },
  {
    title: "Gists",
    url: "/gist",
    icon: <FileCodeIcon />,
  },
  {
    title: "Public Repos",
    url: "/publicrepo",
    icon: <GlobeIcon />,
  },
]

const navClouds = [
  {
    title: "Capture",
    icon: <CameraIcon />,
    isActive: true,
    url: "/capture",
    items: [
      { title: "Active Proposals", url: "/capture/active" },
      { title: "Archived", url: "/capture/archived" },
    ],
  },
  {
    title: "Proposal",
    icon: <FileTextIcon />,
    url: "/proposal",
    items: [
      { title: "Active Proposals", url: "/proposal/active" },
      { title: "Archived", url: "/proposal/archived" },
    ],
  },
  {
    title: "Prompts",
    icon: <FileTextIcon />,
    url: "/prompts",
    items: [
      { title: "Active Proposals", url: "/prompts/active" },
      { title: "Archived", url: "/prompts/archived" },
    ],
  },
]

const navSecondary = [
  { title: "Settings", url: "/settings", icon: <Settings2Icon /> },
  { title: "Get Help", url: "/help", icon: <CircleHelpIcon /> },
  { title: "Search", url: "/search", icon: <SearchIcon /> },
]

const documents = [
  { name: "Data Library", url: "/data-library", icon: <DatabaseIcon /> },
  { name: "Reports", url: "/reports", icon: <FileChartColumnIcon /> },
  { name: "Word Assistant", url: "/word-assistant", icon: <FileIcon /> },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name ?? "Guest",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-(--header-height) justify-center px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:px-0 hover:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <CommandIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold tracking-tight">stikkle</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-2 px-2">
        <NavMain items={navMain} />
        <SidebarSeparator className="mx-2" />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

