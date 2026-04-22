"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    children?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { setOpenMobile } = useSidebar()
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})

  const handleClick = () => {
    setOpenMobile(false)
  }

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarGroup dir="rtl">
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren = !!item.children?.length
            const isOpen = !!openDropdowns[item.title]

            return (
              <SidebarMenuItem key={item.title}>
                {hasChildren ? (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => toggleDropdown(item.title)}
                    className="relative mx-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium flex-1 text-right">{item.title}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </SidebarMenuButton>
                ) : (
                  <Link href={item.url} className="w-full" onClick={handleClick}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="relative mx-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                )}

                {hasChildren && isOpen ? (
                  <div className="mt-1 space-y-1 pr-6">
                    {item.children?.map((child) => (
                      <Link key={child.title} href={child.url} className="block" onClick={handleClick}>
                        <SidebarMenuButton className="mx-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary">
                          <span className="font-medium">{child.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
