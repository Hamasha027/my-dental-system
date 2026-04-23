"use client"

import { useEffect, useState, memo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, CalendarIcon, UsersIcon, CreditCardIcon, ShoppingCartIcon, ReceiptIcon, ArrowUpRightIcon } from "lucide-react"

interface DashboardStats {
  totalRevenue: number
  appointmentsRevenue: number
  salesRevenue: number
  totalExpenses: number
  todayExpenses: number
  todayPatientsCount: number
  netProfit: number
  appointmentsCount: number
  uniquePatients: number
  activeStaff: number
  pendingInstallmentsAmount: number
  monthlyInstallmentAmount: number
  patientsWithInstallments: number
  totalSalaries: number
  totalAdvancesThisMonth: number
  appointmentTrend: number
  revenueTrend: number
}

// Simple in-memory cache
let statsCache: DashboardStats | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 30000 // 30 seconds

export const SectionCards = memo(function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(() => statsCache)
  const [loading, setLoading] = useState(() => !statsCache)

  useEffect(() => {
    let isMounted = true
    
    // Use cache if valid
    const now = Date.now()
    if (statsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setStats(statsCache)
      setLoading(false)
      return
    }

    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats', {
          cache: 'no-store'
        })
        const data = await response.json()
        if (isMounted) {
          setStats(data.stats)
          statsCache = data.stats
          cacheTimestamp = Date.now()
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchStats()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ku-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
  }

  const formatCompact = (amount: number | undefined) => {
    const val = amount || 0
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(0)} هەزار`
    return val.toString()
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ku-IQ').format(num)
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <DollarSignIcon className="size-6" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm ${stats.revenueTrend >= 0 ? '' : ''}`}>
            {stats.revenueTrend >= 0 ? <TrendingUpIcon className="size-3.5" /> : <TrendingDownIcon className="size-3.5" />}
            {stats.revenueTrend >= 0 ? '+' : ''}{stats.revenueTrend.toFixed(1)}%
          </div>
        </div>
        <p className="text-sm font-medium text-white/80 mb-1">کۆی داهات</p>
        <h3 className="text-2xl font-bold mb-4">{formatCurrency(stats.totalRevenue)}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">دانیشتەکان</span>
            </div>
            <span className="text-sm font-semibold">{formatCompact(stats.appointmentsRevenue)}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">فرۆشتن</span>
            </div>
            <span className="text-sm font-semibold">{formatCompact(stats.salesRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Appointments Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <CalendarIcon className="size-6" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm ${stats.appointmentTrend >= 0 ? '' : ''}`}>
            {stats.appointmentTrend >= 0 ? <TrendingUpIcon className="size-3.5" /> : <TrendingDownIcon className="size-3.5" />}
            {stats.appointmentTrend >= 0 ? '+' : ''}{stats.appointmentTrend.toFixed(1)}%
          </div>
        </div>
        <p className="text-sm font-medium text-white/80 mb-1">کۆی موچەی کارمەندەکان</p>
        <h3 className="text-2xl font-bold mb-4">{formatCurrency(stats.totalSalaries)}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">کارمەند</span>
            </div>
            <span className="text-sm font-semibold">{stats.activeStaff}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">دانیشتەکان</span>
            </div>
            <span className="text-sm font-semibold">{stats.appointmentsCount}</span>
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <DollarSignIcon className="size-6" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm">
            داهات
          </div>
        </div>
        <p className="text-sm font-medium text-white/80 mb-1">کۆی داهاتی فرۆشتن</p>
        <h3 className="text-2xl font-bold mb-4">{formatCurrency(stats.salesRevenue)}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">نەخۆشەکان</span>
            </div>
            <span className="text-sm font-semibold">{stats.appointmentsCount}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">فرۆشتن</span>
            </div>
            <span className="text-sm font-semibold">{formatCompact(stats.salesRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Installments Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <CreditCardIcon className="size-6" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm">
            چاوەڕوان
          </div>
        </div>
        <p className="text-sm font-medium text-white/80 mb-1">قەرزی مانگانە</p>
        <h3 className="text-2xl font-bold mb-4">{formatCurrency(stats.pendingInstallmentsAmount)}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <DollarSignIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">قیستی مانگانە</span>
            </div>
            <span className="text-sm font-semibold">{formatCompact(stats.monthlyInstallmentAmount)}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-3.5 text-white/80" />
              <span className="text-xs text-white/80">نەخۆشانی قیست</span>
            </div>
            <span className="text-sm font-semibold">{stats.patientsWithInstallments || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
})
