"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from "next-themes"
import type { ChartData } from "@/lib/mock-data"

interface RevenueChartProps {
  data: ChartData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">Revenue:</span> ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 animate-fade-in hover:shadow-lg transition-all duration-300">
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
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "hsl(217 32% 17%)" : "hsl(210 40% 92%)"} 
            />
            <XAxis 
              dataKey="name" 
              stroke={isDark ? "hsl(215 20% 65%)" : "hsl(215 25% 27%)"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={isDark ? "hsl(215 20% 65%)" : "hsl(215 25% 27%)"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="url(#colorRevenue)"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200 hover:opacity-80"
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
