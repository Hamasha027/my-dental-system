"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "hsl(var(--primary))",
          "--normal-text": "#ffffff",
          "--normal-border": "hsl(var(--primary))",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !bg-primary !text-white !border-primary",
          title: "!text-white",
          description: "!text-white/90",
          icon: "!text-white",
          actionButton: "!bg-white !text-primary",
          cancelButton: "!bg-white/20 !text-white",
          closeButton: "!bg-transparent !text-white !border-white/30",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
