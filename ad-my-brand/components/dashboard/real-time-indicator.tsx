"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"

interface RealTimeIndicatorProps {
  lastUpdated: Date
  isLoading: boolean
  onRefresh: () => void
}

export function RealTimeIndicator({ lastUpdated, isLoading, onRefresh }: RealTimeIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)
      
      if (diff < 60) {
        setTimeAgo(`${diff}s ago`)
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}m ago`)
      } else {
        setTimeAgo(`${Math.floor(diff / 3600)}h ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 1000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-3">
      <Badge 
        variant="outline" 
        className="flex items-center gap-2 animate-pulse"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
        <Wifi className="h-3 w-3" />
        Live Data
      </Badge>
      
      <span className="text-xs text-muted-foreground">
        Updated {timeAgo}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="h-8 w-8 p-0"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )
}