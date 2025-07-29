"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, X, Download, FileText } from "lucide-react"
import { subDays, subMonths, startOfMonth, endOfMonth } from "date-fns"

interface FiltersProps {
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  onStatusFilter: (status: string[]) => void
  onExportPDF: () => void
  onExportCSV: () => void
  activeFilters: {
    dateRange: { start?: Date; end?: Date }
    status: string[]
  }
}

const statusOptions = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-500' }
]

const quickDateRanges = [
  { label: 'Last 7 days', getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: 'This month', getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
  { label: 'Last month', getValue: () => ({ start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) }) }
]

export function Filters({ onDateRangeChange, onStatusFilter, onExportPDF, onExportCSV, activeFilters }: FiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(activeFilters.dateRange.start)
  const [endDate, setEndDate] = useState<Date | undefined>(activeFilters.dateRange.end)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(activeFilters.status)

  const handleQuickDateRange = (range: { start: Date; end: Date }) => {
    setStartDate(range.start)
    setEndDate(range.end)
    onDateRangeChange(range.start, range.end)
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status]
    
    setSelectedStatuses(newStatuses)
    onStatusFilter(newStatuses)
  }

  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedStatuses([])
    onDateRangeChange(undefined, undefined)
    onStatusFilter([])
  }

  const hasActiveFilters = startDate || endDate || selectedStatuses.length > 0

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Filters */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Date Range</h4>
          
          {/* Quick Date Ranges */}
          <div className="flex flex-wrap gap-2">
            {quickDateRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickDateRange(range.getValue())}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
          
          {/* Custom Date Pickers */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Start Date</label>
              <DatePicker
                date={startDate}
                onDateChange={(date) => {
                  setStartDate(date)
                  onDateRangeChange(date, endDate)
                }}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">End Date</label>
              <DatePicker
                date={endDate}
                onDateChange={(date) => {
                  setEndDate(date)
                  onDateRangeChange(startDate, date)
                }}
                placeholder="Select end date"
              />
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Campaign Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Badge
                key={status.value}
                variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleStatusToggle(status.value)}
              >
                <div className={`w-2 h-2 rounded-full ${status.color} mr-2`} />
                {status.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Active Filters</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {startDate && (
                <Badge variant="secondary">
                  From: {startDate.toLocaleDateString()}
                </Badge>
              )}
              {endDate && (
                <Badge variant="secondary">
                  To: {endDate.toLocaleDateString()}
                </Badge>
              )}
              {selectedStatuses.map((status) => (
                <Badge key={status} variant="secondary">
                  Status: {status}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium">Export Data</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}