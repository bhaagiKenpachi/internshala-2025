"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react"
import type { TableData } from "@/lib/mock-data"

type SortField = keyof TableData
type SortDirection = 'asc' | 'desc'

interface CampaignsTableProps {
  campaigns: TableData[]
}

const ITEMS_PER_PAGE = 10

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const [sortField, setSortField] = useState<SortField>('campaign')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (field: SortField) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(direction)
    setCurrentPage(1)
  }

  // Filter data based on search term
  const filteredData = campaigns.filter(campaign =>
    campaign.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = sortedData.slice(startIndex, endIndex)

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
      case 'paused':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
      case 'completed':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
      default:
        return baseClasses
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
  }

  const PaginationButton = ({ page, isActive, onClick }: { page: number, isActive: boolean, onClick: () => void }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="w-8 h-8 p-0"
    >
      {page}
    </Button>
  )

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '700ms' }}>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>
          Detailed view of all advertising campaigns ({sortedData.length} total campaigns)
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('campaign')}
                    className="font-semibold"
                  >
                    Campaign <SortIcon field="campaign" />
                  </Button>
                </th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('budget')}
                    className="font-semibold"
                  >
                    Budget <SortIcon field="budget" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('spent')}
                    className="font-semibold"
                  >
                    Spent <SortIcon field="spent" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('impressions')}
                    className="font-semibold"
                  >
                    Impressions <SortIcon field="impressions" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('clicks')}
                    className="font-semibold"
                  >
                    Clicks <SortIcon field="clicks" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('conversions')}
                    className="font-semibold"
                  >
                    Conversions <SortIcon field="conversions" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('ctr')}
                    className="font-semibold"
                  >
                    CTR <SortIcon field="ctr" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('cpc')}
                    className="font-semibold"
                  >
                    CPC <SortIcon field="cpc" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-2 font-medium">{campaign.campaign}</td>
                  <td className="p-2">
                    <span className={getStatusBadge(campaign.status)}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-2">{formatCurrency(campaign.budget)}</td>
                  <td className="p-2">{formatCurrency(campaign.spent)}</td>
                  <td className="p-2">{formatNumber(campaign.impressions)}</td>
                  <td className="p-2">{formatNumber(campaign.clicks)}</td>
                  <td className="p-2">{formatNumber(campaign.conversions)}</td>
                  <td className="p-2">{campaign.ctr.toFixed(2)}%</td>
                  <td className="p-2">{formatCurrency(campaign.cpc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} campaigns
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {/* Show first page */}
                {currentPage > 3 && (
                  <>
                    <PaginationButton page={1} isActive={false} onClick={() => setCurrentPage(1)} />
                    {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                  </>
                )}

                {/* Show pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                  .map(page => (
                    <PaginationButton
                      key={page}
                      page={page}
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    />
                  ))}

                {/* Show last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">...</span>}
                    <PaginationButton page={totalPages} isActive={false} onClick={() => setCurrentPage(totalPages)} />
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
