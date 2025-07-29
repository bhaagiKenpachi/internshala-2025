export interface DashboardMetrics {
  revenue: number
  users: number
  conversions: number
  growth: number
}

export interface ChartData {
  name: string
  value: number
  revenue?: number
  users?: number
  conversions?: number
}

export interface TableData {
  id: number
  campaign: string
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
}

export const dashboardMetrics: DashboardMetrics = {
  revenue: 124500,
  users: 8432,
  conversions: 1247,
  growth: 12.5
}

export const revenueData: ChartData[] = [
  { name: 'Jan', value: 65000 },
  { name: 'Feb', value: 78000 },
  { name: 'Mar', value: 82000 },
  { name: 'Apr', value: 95000 },
  { name: 'May', value: 108000 },
  { name: 'Jun', value: 124500 },
]

export const performanceData: ChartData[] = [
  {
    name: 'Jan', revenue: 65000, users: 5200, conversions: 890,
    value: 0
  },
  {
    name: 'Feb', revenue: 78000, users: 6100, conversions: 1020,
    value: 0
  },
  {
    name: 'Mar', revenue: 82000, users: 6800, conversions: 1150,
    value: 0
  },
  {
    name: 'Apr', revenue: 95000, users: 7200, conversions: 1180,
    value: 0
  },
  {
    name: 'May', revenue: 108000, users: 7800, conversions: 1220,
    value: 0
  },
  {
    name: 'Jun', revenue: 124500, users: 8432, conversions: 1247,
    value: 0
  },
]

export const channelData: ChartData[] = [
  { name: 'Google Ads', value: 45 },
  { name: 'Facebook', value: 30 },
  { name: 'Instagram', value: 15 },
  { name: 'LinkedIn', value: 10 },
]

// Generate more comprehensive campaign data for pagination
export const generateCampaignData = (): TableData[] => {
  const campaigns = [
    // Page 1 campaigns
    { id: 1, campaign: "Summer Sale 2024", status: 'active' as const, budget: 15000, spent: 12500, impressions: 125000, clicks: 3750, conversions: 187, ctr: 3.0, cpc: 3.33 },
    { id: 2, campaign: "Black Friday Mega Deal", status: 'active' as const, budget: 25000, spent: 18750, impressions: 187500, clicks: 5625, conversions: 281, ctr: 3.0, cpc: 3.33 },
    { id: 3, campaign: "Holiday Collection", status: 'paused' as const, budget: 8000, spent: 6400, impressions: 64000, clicks: 1920, conversions: 96, ctr: 3.0, cpc: 3.33 },
    { id: 4, campaign: "New Year Promotion", status: 'completed' as const, budget: 12000, spent: 12000, impressions: 120000, clicks: 3600, conversions: 180, ctr: 3.0, cpc: 3.33 },
    { id: 5, campaign: "Spring Collection Launch", status: 'active' as const, budget: 20000, spent: 15000, impressions: 150000, clicks: 4500, conversions: 225, ctr: 3.0, cpc: 3.33 },
    { id: 6, campaign: "Valentine's Day Special", status: 'completed' as const, budget: 5000, spent: 5000, impressions: 50000, clicks: 1500, conversions: 75, ctr: 3.0, cpc: 3.33 },
    { id: 7, campaign: "Mother's Day Campaign", status: 'active' as const, budget: 10000, spent: 7500, impressions: 75000, clicks: 2250, conversions: 112, ctr: 3.0, cpc: 3.33 },
    { id: 8, campaign: "Back to School", status: 'paused' as const, budget: 18000, spent: 13500, impressions: 135000, clicks: 4050, conversions: 202, ctr: 3.0, cpc: 3.33 },
    { id: 9, campaign: "Flash Sale Weekend", status: 'active' as const, budget: 7500, spent: 6000, impressions: 60000, clicks: 1800, conversions: 90, ctr: 3.0, cpc: 3.33 },
    { id: 10, campaign: "Cyber Monday Deals", status: 'completed' as const, budget: 30000, spent: 30000, impressions: 300000, clicks: 9000, conversions: 450, ctr: 3.0, cpc: 3.33 },

    // Page 2 campaigns
    { id: 11, campaign: "Winter Clearance", status: 'active' as const, budget: 14000, spent: 10500, impressions: 105000, clicks: 3150, conversions: 157, ctr: 3.0, cpc: 3.33 },
    { id: 12, campaign: "Easter Promotion", status: 'paused' as const, budget: 9000, spent: 6750, impressions: 67500, clicks: 2025, conversions: 101, ctr: 3.0, cpc: 3.33 },
    { id: 13, campaign: "Father's Day Special", status: 'active' as const, budget: 11000, spent: 8250, impressions: 82500, clicks: 2475, conversions: 123, ctr: 3.0, cpc: 3.33 },
    { id: 14, campaign: "Independence Day Sale", status: 'completed' as const, budget: 16000, spent: 16000, impressions: 160000, clicks: 4800, conversions: 240, ctr: 3.0, cpc: 3.33 },
    { id: 15, campaign: "Labor Day Weekend", status: 'active' as const, budget: 13000, spent: 9750, impressions: 97500, clicks: 2925, conversions: 146, ctr: 3.0, cpc: 3.33 },
    { id: 16, campaign: "Halloween Spooktacular", status: 'paused' as const, budget: 8500, spent: 6375, impressions: 63750, clicks: 1912, conversions: 95, ctr: 3.0, cpc: 3.33 },
    { id: 17, campaign: "Thanksgiving Special", status: 'active' as const, budget: 19000, spent: 14250, impressions: 142500, clicks: 4275, conversions: 213, ctr: 3.0, cpc: 3.33 },
    { id: 18, campaign: "End of Year Blowout", status: 'completed' as const, budget: 22000, spent: 22000, impressions: 220000, clicks: 6600, conversions: 330, ctr: 3.0, cpc: 3.33 },
    { id: 19, campaign: "New Product Launch", status: 'active' as const, budget: 17500, spent: 13125, impressions: 131250, clicks: 3937, conversions: 196, ctr: 3.0, cpc: 3.33 },
    { id: 20, campaign: "Customer Appreciation", status: 'paused' as const, budget: 6000, spent: 4500, impressions: 45000, clicks: 1350, conversions: 67, ctr: 3.0, cpc: 3.33 },

    // Page 3 campaigns
    { id: 21, campaign: "Brand Awareness Q1", status: 'active' as const, budget: 21000, spent: 15750, impressions: 157500, clicks: 4725, conversions: 236, ctr: 3.0, cpc: 3.33 },
    { id: 22, campaign: "Retargeting Campaign", status: 'active' as const, budget: 12500, spent: 9375, impressions: 93750, clicks: 2812, conversions: 140, ctr: 3.0, cpc: 3.33 },
    { id: 23, campaign: "Mobile App Install", status: 'paused' as const, budget: 15500, spent: 11625, impressions: 116250, clicks: 3487, conversions: 174, ctr: 3.0, cpc: 3.33 },
    { id: 24, campaign: "Video Ad Campaign", status: 'completed' as const, budget: 18500, spent: 18500, impressions: 185000, clicks: 5550, conversions: 277, ctr: 3.0, cpc: 3.33 },
    { id: 25, campaign: "Influencer Collaboration", status: 'active' as const, budget: 24000, spent: 18000, impressions: 180000, clicks: 5400, conversions: 270, ctr: 3.0, cpc: 3.33 },
    { id: 26, campaign: "Local Store Promotion", status: 'paused' as const, budget: 7000, spent: 5250, impressions: 52500, clicks: 1575, conversions: 78, ctr: 3.0, cpc: 3.33 },
    { id: 27, campaign: "Email Remarketing", status: 'active' as const, budget: 9500, spent: 7125, impressions: 71250, clicks: 2137, conversions: 106, ctr: 3.0, cpc: 3.33 },
    { id: 28, campaign: "Social Media Boost", status: 'completed' as const, budget: 13500, spent: 13500, impressions: 135000, clicks: 4050, conversions: 202, ctr: 3.0, cpc: 3.33 },
    { id: 29, campaign: "Search Engine Marketing", status: 'active' as const, budget: 26000, spent: 19500, impressions: 195000, clicks: 5850, conversions: 292, ctr: 3.0, cpc: 3.33 },
    { id: 30, campaign: "Display Network Campaign", status: 'paused' as const, budget: 11500, spent: 8625, impressions: 86250, clicks: 2587, conversions: 129, ctr: 3.0, cpc: 3.33 },
  ]

  return campaigns
}

export const mockCampaigns = generateCampaignData()
