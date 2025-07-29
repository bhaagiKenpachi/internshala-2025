"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from "next-themes"
import type { ChartData } from "@/lib/mock-data"

interface RevenueChartProps {
  data: ChartData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Revenue Overview</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Monthly revenue trends for the past 6 months
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-sm"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-sm"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="url(#colorRevenue)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
