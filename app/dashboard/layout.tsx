import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(min(22vw, 220px))",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-background">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8 px-4 lg:px-8">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
