
# FindScan – Bollinger Bands (KLineCharts)

Production-ready Bollinger Bands indicator implemented **with KLineCharts only** (no other chart libs). Built on Next.js + React + TypeScript + Tailwind.

https://klinecharts.com/ (v9.x API used).

## Quickstart

```bash
npm i
npm run dev
```

Navigate to http://localhost:3000

## Features

- Candlestick price series + **custom Bollinger Bands indicator** (`FB_BB`) rendered on the price pane
- Settings panel with **Inputs** and **Style** tabs (inspired by TradingView):
  - Inputs: Length (default 20), Basic MA Type (SMA), Source (Close), StdDev Multiplier (default 2), Offset (default 0)
  - Style: visibility, color, line width, **line style (solid/dashed)** for Basis/Upper/Lower plus **background fill toggle + opacity**
- Crosshair tooltip shows **Basis / Upper / Lower** at the hovered bar
- Smooth interaction on 200–1,000 candles
- Clean Tailwind UI that respects a dark background

## Formulas

- Basis (middle) = SMA(source, length)
- StdDev = **population** standard deviation of the last *length* source values  
  `sqrt( sum( (x - mean)^2 ) / length )`
- Upper = Basis + (multiplier × StdDev)
- Lower = Basis − (multiplier × StdDev)
- Offset: shifts Basis/Upper/Lower by *offset* bars (positive = shift to the right)

> We consistently use **population** standard deviation. Trading platforms differ; this choice is documented and consistent across the app.

## KLineCharts version

- `"klinecharts": "^9.8.5"`

API references used:
- Instance API: `createIndicator`, `overrideIndicator`, and tooltip/draw hooks (v10 docs are compatible)  
- Type definitions show supported **line styles** (`solid`/`dashed`).

## Project Structure

```
/app
  /page.tsx          # renders chart + settings
  /layout.tsx        # global layout
  /globals.css
/components
  Chart.tsx          # init KLineCharts, register & update indicator
  BollingerSettings.tsx
/lib
  /types.ts
  /indicators/bollinger.ts  # computeBollingerBands(data, options)
/public/data/ohlcv.json     # demo OHLCV data (300 candles)
next.config.mjs
package.json
tailwind.config.ts
postcss.config.js
tsconfig.json
```

## Known Notes / Trade-offs

- The shaded **fill between Upper & Lower** is drawn via the indicator `draw` hook and respects opacity and visibility.  
  If you're on a very old KLineCharts v9 build that lacks `registerIndicator`/`draw` signatures, upgrade to `^9.8.5`.
- Only **SMA** and **Close** are exposed (as required). The fields are present for parity with TradingView.
- Data is static demo JSON. Replace `/public/data/ohlcv.json` or wire a loader.

## Screenshots

Add two screenshots or a short GIF of the indicator + settings after you run locally.

---

© 2025-08-29
