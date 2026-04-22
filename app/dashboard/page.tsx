import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-0">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
