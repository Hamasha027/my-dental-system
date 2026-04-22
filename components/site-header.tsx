'use client'

import { usePathname } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const pageNames: Record<string, string> = {
  '/dashboard': 'داشبۆرد',
  '/dashboard/appointments': 'سەرەبڕین',
  '/dashboard/patients': ' بەشی فرۆشتن',
  '/dashboard/patients/new': 'تۆمارکردنی نەخۆشی نوێ',
  '/dashboard/dental-map': 'نەخشەی ددان و چارەسەر',
  '/dashboard/prescriptions': 'ڕەچەتەی دەرمان',
  '/dashboard/installments': ' قیستەکان',
  '/dashboard/expenses': 'خەرجیەکان',
  '/dashboard/reports': 'راپۆرتەکان',
  '/dashboard/settings': 'ڕێکخستنەکان',
  '/dashboard/seller': 'بەشی فرۆشتن',
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = pageNames[pathname] || 'کارمەندەکان'

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-bold text-primary">{pageTitle}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 lg:px-6">
        <ThemeToggle />
      </div>
    </header>
  )
}
