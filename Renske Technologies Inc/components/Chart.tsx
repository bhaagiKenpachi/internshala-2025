
'use client';

import { useEffect, useRef, useState } from 'react';
import { init, dispose } from 'klinecharts';
import { computeBollingerBands } from '@/lib/indicators/bollinger';
import type { InputsState, StyleState } from './BollingerSettings';

type Props = {
  inputs: InputsState;
  style: StyleState;
};

export default function Chart({ inputs, style }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const indicatorIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chart
  useEffect(() => {
    try {
      if (!chartRef.current || initializedRef.current) return;

      console.log('🔄 Initializing KLineCharts...');
      const chart = init(chartRef.current);
      chartInstanceRef.current = chart;
      initializedRef.current = true;

      // Set chart styles
      if (chart) {
        chart.setStyles({
          grid: {
            show: true,
            horizontal: {
              show: true,
              color: '#2B2B43',
              size: 1,
            },
            vertical: {
              show: true,
              color: '#2B2B43',
              size: 1,
            },
          },
          candle: {
            type: 'candle_solid' as any,
            bar: {
              upColor: '#26a69a',
              downColor: '#ef5350',
              noChangeColor: '#888888',
            },
            priceMark: {
              show: false,
            },
          },
        });
        console.log('✅ Chart styles set successfully');
      }

      // Load data
      fetch('/data/ohlcv.json')
        .then(r => r.json())
        .then((data) => {
          // Convert data to KLineCharts format
          const klineData = data.map((item: any) => ({
            timestamp: item.timestamp,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume || 0,
          }));

          if (chart) {
            chart.applyNewData(klineData);
            console.log('✅ KLineCharts data loaded successfully');
            console.log('Data points:', klineData.length);
            setError(null);
          }
        })
        .catch(error => {
          console.error('❌ Failed to load chart data:', error);
          setError('Failed to load chart data');
        });

      return () => {
        if (chartInstanceRef.current) {
          dispose(chartRef.current!);
          chartInstanceRef.current = null;
          initializedRef.current = false;
        }
      };
    } catch (err) {
      console.error('❌ Error initializing chart:', err);
      setError('Failed to initialize chart');
    }
  }, []);

  // Create Bollinger Bands using built-in indicator and custom overlay
  useEffect(() => {
    try {
      if (!chartInstanceRef.current) return;

      const chart = chartInstanceRef.current;

      // Remove existing indicator if any
      if (indicatorIdRef.current) {
        chart.removeIndicator(indicatorIdRef.current);
        indicatorIdRef.current = null;
      }

      // Create the built-in BOLL indicator first
      const indicatorId = chart.createIndicator('BOLL', false, {
        length: inputs.length,
        multiplier: inputs.multiplier,
      });

      indicatorIdRef.current = indicatorId;

      console.log('✅ Built-in BOLL indicator created');
      console.log('Length:', inputs.length, 'Multiplier:', inputs.multiplier);

    } catch (err) {
      console.error('❌ Error creating BOLL indicator:', err);
      setError('Failed to create BOLL indicator');
    }

  }, [inputs]);

  // Update indicator styles
  useEffect(() => {
    try {
      if (!chartInstanceRef.current || !indicatorIdRef.current) return;

      const chart = chartInstanceRef.current;

      // Update indicator styles for built-in BOLL
      chart.setIndicatorStyles(indicatorIdRef.current, {
        upper: {
          show: style.upper.visible,
          color: '#00ff00',
          size: 2,
        },
        middle: {
          show: style.basis.visible,
          color: '#ff0000',
          size: 2,
        },
        lower: {
          show: style.lower.visible,
          color: '#0000ff',
          size: 2,
        },
      });

      console.log('✅ BOLL indicator styles updated');
      console.log('Upper visible:', style.upper.visible);
      console.log('Middle visible:', style.basis.visible);
      console.log('Lower visible:', style.lower.visible);

    } catch (err) {
      console.error('❌ Error updating indicator styles:', err);
      setError('Failed to update indicator styles');
    }

  }, [style]);

  if (error) {
    return (
      <div className="w-full h-full min-h-[500px] bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <div className="text-lg font-semibold mb-2">Chart Error</div>
          <div className="text-sm">{error}</div>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] bg-gray-900">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}

