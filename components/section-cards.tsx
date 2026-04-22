"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      <Card className="@container/card relative overflow-hidden border-0 shadow-lg hover:shadow-xl">
        <CardHeader className="relative">
          <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">کۆی هاتوچۆ</CardDescription>
          <CardTitle className="text-3xl font-bold text-primary tabular-nums @[250px]/card:text-4xl mt-2">
            $1,250.00
          </CardTitle>
          <CardAction className="mt-3">
            <Badge className="bg-green-100 text-green-700 border-0">
              <TrendingUpIcon className="size-3 mr-1" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm relative">
          <div className="line-clamp-1 flex gap-2 font-semibold text-foreground">
            ئەم مانگە بەرز دەچێت{" "}
            <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground">
            سەردانکارانی 6 مانگەی دوایی
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 shadow-lg hover:shadow-xl">
        <CardHeader className="relative">
          <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">کاسێرەکانی نوێ</CardDescription>
          <CardTitle className="text-3xl font-bold text-primary tabular-nums @[250px]/card:text-4xl mt-2">
            1,234
          </CardTitle>
          <CardAction className="mt-3">
            <Badge className="bg-red-100 text-red-700 border-0">
              <TrendingDownIcon className="size-3 mr-1" />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm relative">
          <div className="line-clamp-1 flex gap-2 font-semibold text-foreground">
            ئەم سێی کاتێ 20% خوار{" "}
            <TrendingDownIcon className="size-4 text-red-500" />
          </div>
          <div className="text-xs text-muted-foreground">
            بیژاردن پێویستی تۆجهێ هەیە
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 shadow-lg hover:shadow-xl">
        <CardHeader className="relative">
          <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ئەژمیرەی فریا</CardDescription>
          <CardTitle className="text-3xl font-bold text-primary tabular-nums @[250px]/card:text-4xl mt-2">
            45,678
          </CardTitle>
          <CardAction className="mt-3">
            <Badge className="bg-green-100 text-green-700 border-0">
              <TrendingUpIcon className="size-3 mr-1" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm relative">
          <div className="line-clamp-1 flex gap-2 font-semibold text-foreground">
            پاسادانی بەکارهێنەر بەھێز{" "}
            <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground">هاوبەشیکردن جێگرتن دەست ئەنجام دا</div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 shadow-lg hover:shadow-xl">
        <CardHeader className="relative">
          <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ڕۆژەی بەرزبوون</CardDescription>
          <CardTitle className="text-3xl font-bold text-primary tabular-nums @[250px]/card:text-4xl mt-2">
            4.5%
          </CardTitle>
          <CardAction className="mt-3">
            <Badge className="bg-green-100 text-green-700 border-0">
              <TrendingUpIcon className="size-3 mr-1" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm relative">
          <div className="line-clamp-1 flex gap-2 font-semibold text-foreground">
            بەرزبوونی بەردەوام{" "}
            <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground">لەگەڵ پیشبینیکردنەکانی بەرزبوون</div>
        </CardFooter>
      </Card>
    </div>
  )
}
