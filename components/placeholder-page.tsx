import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"

interface PlaceholderPageProps {
  title: string
  description: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-muted/20">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-8">
          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
          
          <Card className="flex-1 flex items-center justify-center border-dashed bg-background/50 border border-border/50">
            <CardContent className="flex flex-col items-center gap-4 text-center py-20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <div className="h-10 w-10 animate-pulse rounded-full bg-primary/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Page Under Construction
                </h3>
                <p className="max-w-sm text-muted-foreground">
                  We&apos;re currently building the {title.toLowerCase()} module to provide you with the best experience. Check back soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
