"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { AppointmentsTable } from "@/components/appointments-table"
import { SectionCards } from "@/components/section-cards"
import { QuickAccess } from "@/components/quick-access"
import { AdditionalCharts } from "@/components/additional-charts"
import { useEffect, useState } from "react"

export default function Page() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setAppointments(data.recentAppointments || [])
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  return (
    <>
      <SectionCards />
      <QuickAccess />
      <div className="px-0">
        <ChartAreaInteractive />
      </div>
      <AdditionalCharts />
      {!loading && <AppointmentsTable data={appointments} />}
    </>
  )
}
