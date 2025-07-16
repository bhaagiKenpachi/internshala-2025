'use client';

import { useState } from 'react';
import PriceQuery from '@/components/PriceQuery';
import ScheduleFetch from '@/components/ScheduleFetch';
import PriceHistory from '@/components/PriceHistory';
import Header from '@/components/Header';

export default function Home() {
  const [activeTab, setActiveTab] = useState('query');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('query')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'query'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Price Query
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Schedule Fetch
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Price History
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'query' && <PriceQuery />}
          {activeTab === 'schedule' && <ScheduleFetch />}
          {activeTab === 'history' && <PriceHistory />}
        </div>
      </main>
    </div>
  );
}
