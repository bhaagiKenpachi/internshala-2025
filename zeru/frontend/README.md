# Zeru - Historical Token Price Oracle Frontend

A modern, responsive web interface for the Zeru historical token price oracle. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎯 **Price Query**
- Query token prices at specific timestamps
- Support for multiple networks (Ethereum, Polygon)
- Quick selection for common tokens (USDC, UNI, USDT, WBTC)
- Quick timestamp selection (Now, 1 Day Ago, 1 Week Ago, 1 Month Ago)
- Real-time price display with source indicators

### 📅 **Schedule Historical Data Fetch**
- Schedule background jobs to fetch historical price data
- Visual job status and confirmation
- Worker status monitoring
- Support for token creation date to present data fetching

### 📊 **Price History & Charts**
- Interactive price charts for the last 30 days
- Price statistics (Current, High, Low, Data Points)
- Historical price table with source indicators
- Sample data generation for demonstration

## Tech Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks + Zustand
- **HTTP Client**: Axios
- **UI Components**: Headless UI + Heroicons
- **Development**: Turbopack for fast builds

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on `http://localhost:4000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Application header
│   ├── PriceQuery.tsx     # Price query interface
│   ├── ScheduleFetch.tsx  # Historical data scheduling
│   └── PriceHistory.tsx   # Price charts and history
└── services/              # API services
    └── api.ts            # Backend API integration
```

## API Integration

The frontend integrates with the Zeru backend API through the following endpoints:

### Price Query
```typescript
POST /api/price
{
  "token": "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "network": "ethereum",
  "timestamp": 1721088000
}
```

### Schedule Historical Fetch
```typescript
POST /api/schedule
{
  "token": "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "network": "ethereum"
}
```

## Key Components

### PriceQuery Component
- Form for token address, network, and timestamp input
- Quick selection buttons for common tokens and timestamps
- Real-time price display with source indicators
- Error handling and loading states

### ScheduleFetch Component
- Interface for scheduling historical data fetching
- Job status display and confirmation
- Worker status monitoring
- Educational information about the process

### PriceHistory Component
- Interactive price charts using CSS gradients
- Price statistics dashboard
- Historical price table with source indicators
- Sample data generation for demonstration

## Styling

The application uses a modern glassmorphism design with:
- Dark gradient background (slate-900 to purple-900)
- Glass-like components with backdrop blur
- Purple and blue accent colors
- Responsive design for all screen sizes
- Smooth animations and transitions

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture
- Responsive design patterns

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

### Build for Production

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Zeru historical token price oracle system.
