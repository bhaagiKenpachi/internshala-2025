import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { TableData, DashboardMetrics } from './mock-data'
import { formatCurrency, formatNumber } from './utils'

export function exportToPDF(campaigns: TableData[], metrics: DashboardMetrics) {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text('AdMyBrand Dashboard Report', 20, 20)
  
  // Add date
  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
  
  // Add metrics summary
  doc.setFontSize(14)
  doc.text('Key Metrics', 20, 55)
  doc.setFontSize(10)
  doc.text(`Total Revenue: ${formatCurrency(metrics.revenue)}`, 20, 70)
  doc.text(`Active Users: ${formatNumber(metrics.users)}`, 20, 80)
  doc.text(`Conversions: ${formatNumber(metrics.conversions)}`, 20, 90)
  doc.text(`Growth Rate: ${metrics.growth}%`, 20, 100)
  
  // Add campaigns table
  const tableData = campaigns.map(campaign => [
    campaign.campaign,
    campaign.status,
    formatCurrency(campaign.budget),
    formatCurrency(campaign.spent),
    formatNumber(campaign.impressions),
    formatNumber(campaign.clicks),
    formatNumber(campaign.conversions),
    `${campaign.ctr}%`,
    formatCurrency(campaign.cpc)
  ])
  
  autoTable(doc, {
    head: [['Campaign', 'Status', 'Budget', 'Spent', 'Impressions', 'Clicks', 'Conversions', 'CTR', 'CPC']],
    body: tableData,
    startY: 120,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }
  })
  
  doc.save('admybrand-report.pdf')
}

export function exportToCSV(campaigns: TableData[]) {
  const headers = [
    'Campaign',
    'Status',
    'Budget',
    'Spent',
    'Impressions',
    'Clicks',
    'Conversions',
    'CTR',
    'CPC'
  ]
  
  const csvContent = [
    headers.join(','),
    ...campaigns.map(campaign => [
      `"${campaign.campaign}"`,
      campaign.status,
      campaign.budget,
      campaign.spent,
      campaign.impressions,
      campaign.clicks,
      campaign.conversions,
      campaign.ctr,
      campaign.cpc
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'admybrand-campaigns.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}