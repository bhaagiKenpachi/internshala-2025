"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { useTheme } from "next-themes"
import type { ChartData } from "@/lib/mock-data"

interface PerformanceChartProps {
  data: ChartData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">{entry.name}:</span> {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomBar = (props: any) => {
    const { fill, ...rest } = props
    return (
      <Bar 
        {...rest} 
        fill={fill}
        className="transition-all duration-200 hover:opacity-80 hover:drop-shadow-lg"
      />
    )
  }

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '500ms' }}>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>
          Revenue, users, and conversions comparison
        </CardDescription>
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: isDark ? "hsl(215 20% 65%)" : "hsl(215 25% 27%)",
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--primary))" 
              name="Revenue ($)"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200 hover:opacity-80"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  className="hover:drop-shadow-lg transition-all duration-200"
                />
              ))}
            </Bar>
            <Bar 
              dataKey="users" 
              fill="hsl(var(--chart-2))" 
              name="Users"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200 hover:opacity-80"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  className="hover:drop-shadow-lg transition-all duration-200"
                />
              ))}
            </Bar>
            <Bar 
              dataKey="conversions" 
              fill="hsl(var(--chart-3))" 
              name="Conversions"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200 hover:opacity-80"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  className="hover:drop-shadow-lg transition-all duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
