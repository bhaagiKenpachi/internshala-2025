import { useState, useEffect } from 'react'
import { mockCampaigns } from '@/lib/mock-data'

export function useRealTimeData() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  // Mock data matching DashboardMetrics interface
  const metrics = {
    revenue: 2847392,
    users: 18429,
    conversions: 1247,
    growth: 12.5
  }

  const revenue = [
    { name: 'Jan', value: 650000 },
    { name: 'Feb', value: 780000 },
    { name: 'Mar', value: 820000 },
    { name: 'Apr', value: 950000 },
    { name: 'May', value: 1080000 },
    { name: 'Jun', value: 1245000 },
  ]

  const performance = [
    { name: 'Jan', revenue: 650000, users: 52003, conversions: 89023, value: 0 },
    { name: 'Feb', revenue: 780000, users: 61003, conversions: 102032, value: 0 },
    { name: 'Mar', revenue: 820000, users: 68004, conversions: 115034, value: 0 },
    { name: 'Apr', revenue: 950000, users: 72002, conversions: 118024, value: 0 },
    { name: 'May', revenue: 1080000, users: 78001, conversions: 122002, value: 0 },
    { name: 'Jun', revenue: 1245000, users: 84320, conversions: 124723, value: 0 },
  ]

  return {
    metrics,
    revenue,
    performance,
    campaigns: mockCampaigns, // Now returns all 30 campaigns
    isLoading,
    lastUpdated,
    refreshData
  }
}
