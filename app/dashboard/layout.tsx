import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserProvider } from "@/contexts/user-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" className="no-scrollbar">
      <UserProvider>
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
            <div className="flex flex-1 flex-col bg-background overflow-y-auto no-scrollbar">
              <div className="@container/main flex flex-1 flex-col gap-2 overflow-y-auto no-scrollbar">
                <div className="flex flex-col gap-6 pt-20 px-6 md:gap-8 md:pt-20 md:px-8 overflow-y-auto no-scrollbar">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </div>
  )
}
