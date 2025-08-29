
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BollingerSettings, InputsState, StyleState } from '@/components/BollingerSettings';

const Chart = dynamic(() => import('@/components/Chart'), { ssr: false });

export default function Page() {
  const [showSettings, setShowSettings] = useState(true);

  const [inputs, setInputs] = useState<InputsState>({
    length: 20,
    maType: 'SMA',
    source: 'close',
    multiplier: 2,
    offset: 0,
  });

  const [style, setStyle] = useState<StyleState>({
    basis: { visible: true, color: '#60a5fa', width: 1, style: 'solid' },
    upper: { visible: true, color: '#3b82f6', width: 1, style: 'solid' },
    lower: { visible: true, color: '#3b82f6', width: 1, style: 'solid' },
    fill:  { visible: true, opacity: 0.15 }
  });

  return (
    <main className="p-6 grid lg:grid-cols-[1fr_360px] gap-6 min-h-screen">
      <section className="card p-4 flex flex-col">
        <header className="flex items-center justify-between mb-3 flex-shrink-0">
          <h1 className="text-lg font-semibold">Bollinger Bands (KLineCharts)</h1>
          <button className="btn" onClick={() => setShowSettings(v => !v)}>
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
        </header>
        <div className="flex-1 min-h-0">
          <Chart inputs={inputs} style={style} />
        </div>
      </section>

      <aside className="card p-4 h-fit sticky top-6">
        {showSettings && (
          <BollingerSettings
            inputs={inputs}
            style={style}
            onInputsChange={setInputs}
            onStyleChange={setStyle}
          />
        )}
      </aside>

      <section className="lg:col-span-2 card p-4 text-sm text-neutral-300">
        <h2 className="font-semibold mb-2">Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Basis = SMA(source, length)</li>
          <li>StdDev = population standard deviation of last <code>length</code> source values</li>
          <li>Upper = Basis + multiplier × StdDev</li>
          <li>Lower = Basis − multiplier × StdDev</li>
          <li>Offset shifts Basis/Upper/Lower by <code>offset</code> bars to the right (positive values)</li>
        </ul>
      </section>
    </main>
  );
}
