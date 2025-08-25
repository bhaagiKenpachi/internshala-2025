"use client"

import { useState } from "react"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { ChannelChart } from "@/components/dashboard/channel-chart"
import { CampaignsTable } from "@/components/dashboard/campaigns-table"
import { Filters } from "@/components/dashboard/filters"
import { RealTimeIndicator } from "@/components/dashboard/real-time-indicator"
import { MetricsCardsSkeleton, ChartSkeleton, TableSkeleton } from "@/components/dashboard/loading-skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import { exportToPDF, exportToCSV } from "@/lib/export-utils"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

export default function Dashboard() {
  const { metrics, revenue, performance, campaigns, isLoading, lastUpdated, refreshData } = useRealTimeData()
  const [filters, setFilters] = useState({
    dateRange: { start: undefined as Date | undefined, end: undefined as Date | undefined },
    status: [] as string[]
  })

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setFilters(prev => ({ ...prev, dateRange: { start, end } }))
  }

  const handleStatusFilter = (status: string[]) => {
    setFilters(prev => ({ ...prev, status }))
  }

  const handleExportPDF = () => {
    exportToPDF(campaigns, metrics)
  }

  const handleExportCSV = () => {
    exportToCSV(campaigns)
  }

  // Filter campaigns based on active filters
  const filteredCampaigns = campaigns.filter(campaign => {
    if (filters.status.length > 0 && !filters.status.includes(campaign.status)) {
      return false
    }
    // Add date filtering logic here if needed
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AdMyBrand
                </h1>
              </div>
              <div className="hidden md:block text-muted-foreground">
                Analytics Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <RealTimeIndicator 
                lastUpdated={lastUpdated}
                isLoading={isLoading}
                onRefresh={refreshData}
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your advertising campaigns today.
            </p>
          </div>

          {/* Metrics Cards */}
          {isLoading ? (
            <MetricsCardsSkeleton />
          ) : (
            <MetricsCards metrics={metrics} />
          )}

          {/* Filters */}
          <Filters
            onDateRangeChange={handleDateRangeChange}
            onStatusFilter={handleStatusFilter}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            activeFilters={filters}
          />

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {isLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <RevenueChart data={revenue} />
                <ChannelChart />
              </>
            )}
          </div>

          {/* Performance Chart */}
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <PerformanceChart data={performance} />
          )}

          {/* Campaigns Table */}
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <CampaignsTable campaigns={filteredCampaigns} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
              <span>© 2024 AdMyBrand. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Insights</span>
              </span>
              <span className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Performance</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
