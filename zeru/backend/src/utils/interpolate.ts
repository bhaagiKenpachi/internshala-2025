export function interpolate(
    ts_q: number,
    ts_before: number,
    price_before: number,
    ts_after: number,
    price_after: number
): number {
    if (ts_after === ts_before) return price_before;
    const ratio = (ts_q - ts_before) / (ts_after - ts_before);
    return price_before + (price_after - price_before) * ratio;
} 