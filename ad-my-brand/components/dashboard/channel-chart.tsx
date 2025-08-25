"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTheme } from "next-themes"

const channelData = [
  { name: 'Organic Search', value: 35 },
  { name: 'Paid Search', value: 25 },
  { name: 'Social Media', value: 20 },
  { name: 'Direct', value: 15 },
  { name: 'Email', value: 5 },
]

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function ChannelChart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-primary font-semibold">
            {data.value}% of traffic
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '600ms' }}>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>
          Distribution of traffic by channel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              className="outline-none"
            >
              {channelData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-200 hover:opacity-80 hover:drop-shadow-lg cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: isDark ? "hsl(215 20% 65%)" : "hsl(215 25% 27%)",
                fontSize: '12px'
              }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
