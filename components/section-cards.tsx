"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, CalendarIcon, UsersIcon, CreditCardIcon, ArrowUpRightIcon } from "lucide-react"

interface DashboardStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  appointmentsCount: number
  uniquePatients: number
  activeStaff: number
  pendingInstallmentsAmount: number
  appointmentTrend: number
  revenueTrend: number
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ku-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ku-IQ').format(num)
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      {/* Revenue Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
              <DollarSignIcon className="size-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {stats.revenueTrend >= 0 ? <TrendingUpIcon className="size-3.5 text-white" /> : <TrendingDownIcon className="size-3.5 text-white" />}
              <span className="text-xs font-semibold text-white">{stats.revenueTrend >= 0 ? '+' : ''}{stats.revenueTrend.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wide mb-1">کۆی داهات</p>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {formatCurrency(stats.totalRevenue)}
          </h3>
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`p-1.5 rounded-lg ${stats.revenueTrend >= 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                  {stats.revenueTrend >= 0 ? <TrendingUpIcon className="size-3 text-white" /> : <TrendingDownIcon className="size-3 text-white" />}
                </div>
                <p className="text-xs font-medium text-white/90">
                  {stats.revenueTrend >= 0 ? 'بەرزبوون' : 'نزمبوون'}
                </p>
              </div>
              <span className="text-xs text-white/70">مانگی پێشوو</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
              <CalendarIcon className="size-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {stats.appointmentTrend >= 0 ? <TrendingUpIcon className="size-3.5 text-white" /> : <TrendingDownIcon className="size-3.5 text-white" />}
              <span className="text-xs font-semibold text-white">{stats.appointmentTrend >= 0 ? '+' : ''}{stats.appointmentTrend.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wide mb-1">دانیشتەکانی ئەم مانگە</p>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {stats.appointmentsCount}
          </h3>
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`p-1.5 rounded-lg ${stats.appointmentTrend >= 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                  {stats.appointmentTrend >= 0 ? <TrendingUpIcon className="size-3 text-white" /> : <TrendingDownIcon className="size-3 text-white" />}
                </div>
                <p className="text-xs font-medium text-white/90">
                  {stats.appointmentTrend >= 0 ? 'بەرزبوون' : 'نزمبوون'}
                </p>
              </div>
              <span className="text-xs text-white/70">مانگی پێشوو</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
              <UsersIcon className="size-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">کۆی گشتی</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wide mb-1">نەخۆشەکان</p>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {formatNumber(stats.uniquePatients)}
          </h3>
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-lg bg-white/20">
                  <UsersIcon className="size-3 text-white" />
                </div>
                <p className="text-xs font-medium text-white/90">
                  کارمەندان
                </p>
              </div>
              <span className="text-xs text-white/70">{stats.activeStaff} چالاک</span>
            </div>
          </div>
        </div>
      </div>

      {/* Installments Card */}
      <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
              <CreditCardIcon className="size-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">چاوەڕوان</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wide mb-1">قەرزی مانگانە</p>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {formatCurrency(stats.pendingInstallmentsAmount)}
          </h3>
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-lg bg-white/20">
                  <CreditCardIcon className="size-3 text-white" />
                </div>
                <p className="text-xs font-medium text-white/90">
                  قەرز
                </p>
              </div>
              <span className="text-xs text-white/70">پێویستی کۆکردنەوە</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
