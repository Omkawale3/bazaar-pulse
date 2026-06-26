// ── RSI (Relative Strength Index) ────────────────────────────────────────────
export function calcRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  const gains   = changes.map(c => (c > 0 ? c : 0));
  const losses  = changes.map(c => (c < 0 ? -c : 0));

  let ag = gains.slice(0, period).reduce((a, b) => a + b) / period;
  let al = losses.slice(0, period).reduce((a, b) => a + b) / period;

  for (let i = period; i < changes.length; i++) {
    ag = (ag * (period - 1) + gains[i]) / period;
    al = (al * (period - 1) + losses[i]) / period;
  }
  if (al === 0) return 100;
  return +(100 - 100 / (1 + ag / al)).toFixed(1);
}

// ── Exponential Moving Average ────────────────────────────────────────────────
export function ema(prices, period) {
  const k = 2 / (period + 1);
  let e = prices[0];
  return prices.map(p => {
    e = p * k + e * (1 - k);
    return +e.toFixed(4);
  });
}

// ── MACD (12, 26, 9) ─────────────────────────────────────────────────────────
export function calcMACD(prices) {
  if (prices.length < 26) return { macd: 0, signal: 0, hist: 0 };
  const e12      = ema(prices, 12);
  const e26      = ema(prices, 26);
  const macdLine = e12.map((v, i) => +(v - e26[i]).toFixed(4));
  const sigLine  = ema(macdLine.slice(-9), 9);
  const m  = macdLine[macdLine.length - 1];
  const sg = sigLine[sigLine.length - 1];
  return { macd: m, signal: sg, hist: +(m - sg).toFixed(4) };
}
