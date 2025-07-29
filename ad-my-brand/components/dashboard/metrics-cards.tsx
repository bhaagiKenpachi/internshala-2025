"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Target, Activity, TrendingUp } from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface DashboardMetrics {
  revenue: number
  users: number
  conversions: number
  growth: number
}

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${formatNumber(metrics.revenue)}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +12.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Active Users
          </CardTitle>
          <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatNumber(metrics.users)}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +8.2% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Conversions
          </CardTitle>
          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatNumber(metrics.conversions)}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +15.3% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Growth Rate
          </CardTitle>
          <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {metrics.growth}%
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +2.1% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
