"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDownIcon, CalendarIcon, PhoneIcon, UserIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Appointment {
  id: number
  name: string
  gender: string
  phone: string
  age: number
  treatmentType: string
  appointmentDate: string
  money: string
  createdAt: string
}

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:bg-[#3dc1d3]/15 hover:text-[#3dc1d3]"
        >
          <UserIcon className="size-4" />
          ناوی نەخۆش
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#3dc1d3] to-[#2ba8b8] text-white text-xs font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold">{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "تەلەفۆن",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#3dc1d3]/10">
          <PhoneIcon className="size-3.5 text-[#3dc1d3]" />
        </div>
        <span className="font-medium">{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "treatmentType",
    header: "جۆری چارەسەر",
    cell: ({ row }) => (
      <Badge className="bg-gradient-to-r from-[#3dc1d3]/20 to-[#2ba8b8]/20 text-[#3dc1d3] border-[#3dc1d3]/30 font-medium">
        {row.getValue("treatmentType")}
      </Badge>
    ),
  },
  {
    accessorKey: "appointmentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:bg-[#3dc1d3]/15 hover:text-[#3dc1d3]"
        >
          <CalendarIcon className="size-4" />
          بەرواری دانیشتن
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("appointmentDate"))
      return (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#3dc1d3]/10">
            <CalendarIcon className="size-3.5 text-[#3dc1d3]" />
          </div>
          <span className="font-medium">
            {date.toLocaleDateString("ku-IQ", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "money",
    header: "بڕ",
    cell: ({ row }) => {
      const amount = Number(row.getValue("money"))
      return (
        <div className="flex items-center justify-end gap-2">
          <span className="font-bold text-lg text-[#3dc1d3]">
            {new Intl.NumberFormat("ku-IQ", {
              style: "currency",
              currency: "IQD",
              maximumFractionDigits: 0,
            }).format(amount)}
          </span>
        </div>
      )
    },
  },
]

export function AppointmentsTable({ data }: { data: Appointment[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-[#3dc1d3]/20 to-[#2ba8b8]/10 rounded-full blur-3xl" />
      <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-gradient-to-br from-[#3dc1d3]/10 to-transparent rounded-full blur-3xl" />
      <div className="relative p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              دانیشتنەکانی کۆتایی
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              لیستی ١٠ دانیشتنی کۆتایی
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#3dc1d3] to-[#2ba8b8] flex items-center justify-center shadow-lg shadow-[#3dc1d3]/30">
            <CalendarIcon className="size-6 text-white" />
          </div>
        </div>
        <div className="flex items-center py-4 gap-2">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input
              placeholder="گەڕان بە ناوی نەخۆش..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pr-12 h-12 rounded-xl bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:border-[#3dc1d3] focus:ring-2 focus:ring-[#3dc1d3]/20 shadow-sm text-base"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-slate-700 dark:text-slate-300 font-bold py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gradient-to-r hover:from-[#3dc1d3]/5 hover:to-transparent transition-all duration-300 border-b border-slate-100 dark:border-slate-700/30 last:border-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    هیچ دانیشتنێک نەدۆزرایەوە
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-6">
          <div className="flex-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
            {table.getFilteredSelectedRowModel().rows.length} لە{" "}
            {table.getFilteredRowModel().rows.length} سەر(hێڵ) هەڵبژێردراوە.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 px-6 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-[#3dc1d3] hover:to-[#2ba8b8] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm font-semibold"
            >
              پێشوو
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 px-6 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-[#3dc1d3] hover:to-[#2ba8b8] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm font-semibold"
            >
              دواتر
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
            
