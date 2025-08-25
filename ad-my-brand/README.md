# AdMyBrand Dashboard

A beautiful, modern advertising dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📊 **Interactive Dashboard** - Overview with key metrics cards
- 📈 **Beautiful Charts** - Line, bar, and pie charts with Recharts
- 📋 **Data Table** - Sortable, filterable campaigns table with pagination
- 🌙 **Dark/Light Mode** - Complete theme toggle
- 📱 **Responsive Design** - Perfect on all devices
- ⚡ **Modern Stack** - Next.js 14, TypeScript, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ad-my-brand
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Theme:** next-themes

## Project Structure

```
ad-my-brand/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── metrics-cards.tsx
│   │   ├── revenue-chart.tsx
│   │   ├── performance-chart.tsx
│   │   └── campaigns-table.tsx
│   └── providers/        # Context providers
│       └── theme-provider.tsx
├── lib/                  # Utility functions and data
│   ├── utils.ts         # Utility functions
│   └── data.ts          # Mock data
└── public/              # Static assets
```

## Dashboard Features

### 📊 **Metrics Cards**
- **Total Revenue** - Monthly revenue tracking
- **Active Users** - User engagement metrics
- **Conversions** - Conversion rate tracking
- **Growth Rate** - Business growth indicators

### 📈 **Charts & Analytics**
- **Revenue Chart** - Monthly revenue trends (Bar chart)
- **Performance Chart** - Multi-metric performance tracking (Line chart)
- **Interactive tooltips** and responsive design

### 📋 **Campaigns Table**
- **Sortable columns** - Click headers to sort by any field
- **Search functionality** - Filter campaigns by name
- **Pagination** - 10 campaigns per page with navigation
- **Status indicators** - Visual campaign status badges
- **Responsive design** - Mobile-friendly table layout

### 🌙 **Theme Support**
- **Light/Dark mode** toggle
- **System preference** detection
- **Persistent theme** selection

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## Data Structure

### Campaign Data
```typescript
interface Campaign {
  id: string
  campaign: string
  status: 'Active' | 'Paused' | 'Completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
}
```

### Metrics Data
```typescript
interface DashboardMetrics {
  revenue: number
  users: number
  conversions: number
  growth: number
}
```

## Customization

### Adding New Metrics
1. Update the `DashboardMetrics` interface in `lib/data.ts`
2. Add new card in `components/dashboard/metrics-cards.tsx`
3. Update mock data in `lib/data.ts`

### Adding New Chart Types
1. Install additional Recharts components if needed
2. Create new chart component in `components/dashboard/`
3. Add to main dashboard page

### Styling Customization
- **Colors:** Modify `tailwind.config.js` for custom color schemes
- **Components:** Update shadcn/ui components in `components/ui/`
- **Layout:** Adjust spacing and layout in dashboard components

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify:** Build command: `npm run build`, Publish directory: `out`
- **AWS Amplify:** Supports Next.js out of the box
- **Docker:** Create Dockerfile for containerized deployment

### Build for Production
```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [shadcn/ui documentation](https://ui.shadcn.com)

---

Built with ❤️ using Next.js 14 and TypeScript
