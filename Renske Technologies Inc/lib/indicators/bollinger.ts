
import type { OHLCV, BollingerInputs, BollingerPoint } from '../types';

// Population standard deviation over the last `length` values
function stddev(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

export function sma(values: number[], length: number): Array<number | null> {
  const out: Array<number | null> = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= length) sum -= values[i - length];
    if (i >= length - 1) {
      out.push(sum / length);
    } else {
      out.push(null);
    }
  }
  return out;
}

export function computeBollingerBands(data: OHLCV[], options: BollingerInputs): BollingerPoint[] {
  const { length, multiplier, offset } = options;
  
  if (!data || data.length === 0) {
    return [];
  }
  
  const source = data.map(d => d.close);
  const basisArr = sma(source, length);
  
  // Create result array with exact same length as input data
  const result: BollingerPoint[] = new Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    if (i >= length - 1) {
      const window = source.slice(i - length + 1, i + 1);
      const s = stddev(window);
      const basis = basisArr[i];
      if (basis !== null) {
        const upper = basis + multiplier * s;
        const lower = basis - multiplier * s;
        result[i] = { basis, upper, lower };
      } else {
        result[i] = { basis: null, upper: null, lower: null };
      }
    } else {
      result[i] = { basis: null, upper: null, lower: null };
    }
  }

  // Apply offset (positive shifts forward/right by adding nulls at the start)
  if (offset !== 0) {
    const shifted: BollingerPoint[] = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      const j = i + offset;
      if (j >= 0 && j < data.length) {
        shifted[j] = result[i];
      } else {
        shifted[i] = { basis: null, upper: null, lower: null };
      }
    }
    return shifted;
  }

  return result;
}
