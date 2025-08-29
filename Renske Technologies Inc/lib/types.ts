
export type OHLCV = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type BollingerInputs = {
  length: number;
  multiplier: number;
  offset: number;
};

export type BollingerPoint = {
  basis: number | null;
  upper: number | null;
  lower: number | null;
};
