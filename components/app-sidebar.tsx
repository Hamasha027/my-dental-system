"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, UsersIcon, DollarSignIcon, TrendingDownIcon, BarChart3Icon, Cog, CalendarIcon } from "lucide-react"

const data = {
  user: {
    name: "بەکارهێنەر",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "داشبۆرد",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "سەرەبڕین ",
      url: "/dashboard/appointments",
      icon: (
        <CalendarIcon
        />
      ),
    },
    {
      title: " بەشی فرۆشتن",
      url: "/dashboard/seller",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: " كارمەندەکان",
      url: "/dashboard/staff",
      icon: (
       <UsersIcon
        />
      ),
    },
    {
      title: " قیستەکان",
      url: "/dashboard/installments",
      icon: (
        <DollarSignIcon
        />
      ),
    },
    {
      title: "خەرجییەکان",
      url: "/dashboard/expenses",
      icon: (
        <TrendingDownIcon
        />
      ),
    },
    {
      title: "ڕاپۆرتەکان",
      url: "#",
      icon: (
        <BarChart3Icon
        />
      ),
      children: [
        {
          title: " خەرجیەکان",
          url: "/dashboard/reports?type=expenses",
        },
        {
          title: " کارمەندەکان",
          url: "/dashboard/reports?type=employees",
        },
        {
          title: " قیسەکان",
          url: "/dashboard/reports?type=installments",
        },
        {
          title: " فرۆشتن",
          url: "/dashboard/reports?type=sales",
        },
      ],
    },
    {
      title: "ڕێکخستن",
      url: "/dashboard/settings",
      icon: (
        <Cog
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" side="right" {...props}>
      <SidebarHeader className="py-4 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-[#3dc1d3]/15 hover:text-[#3dc1d3] active:bg-[#3dc1d3]/25 active:text-[#3dc1d3] transition-colors duration-150"
            >
              <a href="#" className="flex items-center gap-2 justify-end md:justify-start">
               
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image 
                    src="/icon/tooth.png" 
                    alt="Logo" 
                    width={32} 
                    height={32}
                    className="w-full h-full object-cover dark:invert"
                  />
                </div>
                 <span className="text-lg font-bold"> شـــــــــا سیستەم</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
