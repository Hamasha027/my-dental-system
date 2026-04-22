"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const description = "An interactive area chart"

interface ChartData {
  month: string
  revenue: number
  appointments: number
}

const chartConfig = {
  revenue: {
    label: "داهات",
    color: "hsl(142 76% 36%)",
  },
  appointments: {
    label: "دانیشتن",
    color: "hsl(217 91% 60%)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("6m")
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [chartType, setChartType] = React.useState("area")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("3m")
    }
  }, [isMobile])

  React.useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        let filteredData = data.chartData || []
        
        if (timeRange === "3m") {
          filteredData = filteredData.slice(-3)
        } else if (timeRange === "6m") {
          filteredData = filteredData.slice(-6)
        }
        
        setChartData(filteredData)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchChartData()
  }, [timeRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ku-IQ', { 
      style: 'currency', 
      currency: 'IQD',
      maximumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
        <CardHeader className="relative">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent className="relative px-6 pt-6">
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-white">نەخشەی داهات و دانیشتن</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              کۆی ئەنجامەکانی 6 مانگی دوایی
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="6m">6 مانگ</ToggleGroupItem>
              <ToggleGroupItem value="3m">3 مانگ</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="6 مانگ" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="6m" className="rounded-lg">6 مانگ</SelectItem>
                <SelectItem value="3m" className="rounded-lg">3 مانگ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative px-6 pt-6">
        <Tabs value={chartType} onValueChange={setChartType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 max-w-[300px]">
            <TabsTrigger value="area">نەخشەی ناوچەیی</TabsTrigger>
            <TabsTrigger value="bar">نەخشەی ستوونی</TabsTrigger>
          </TabsList>
          
          <TabsContent value="area">
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-appointments)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-appointments)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  className="text-xs text-slate-600 dark:text-slate-400"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatCurrency}
                  className="text-xs text-slate-600 dark:text-slate-400"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                  formatter={(value: number, name: string) => {
                    if (name === 'داهات') return formatCurrency(value)
                    return `${value}`
                  }}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="bar">
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  className="text-xs text-slate-600 dark:text-slate-400"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatCurrency}
                  className="text-xs text-slate-600 dark:text-slate-400"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                  formatter={(value: number, name: string) => {
                    if (name === 'داهات') return formatCurrency(value)
                    return `${value}`
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
