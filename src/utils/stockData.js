// ── NSE Stock Universe (prices in INR) ────────────────────────────────────────
export const STOCKS = {
  RELIANCE:   { name: 'Reliance Industries Ltd.',  exchange: 'NSE', base: 2945.0, vol: 1.4 },
  TCS:        { name: 'Tata Consultancy Services', exchange: 'NSE', base: 3812.5, vol: 1.1 },
  HDFCBANK:   { name: 'HDFC Bank Ltd.',            exchange: 'NSE', base: 1723.8, vol: 1.3 },
  INFY:       { name: 'Infosys Ltd.',              exchange: 'NSE', base: 1548.2, vol: 1.6 },
  WIPRO:      { name: 'Wipro Ltd.',                exchange: 'NSE', base: 468.9,  vol: 2.0 },
  TATAMOTORS: { name: 'Tata Motors Ltd.',          exchange: 'NSE', base: 812.4,  vol: 3.2 },
  BAJFINANCE: { name: 'Bajaj Finance Ltd.',        exchange: 'NSE', base: 7124.6, vol: 1.9 },
  ADANIENT:   { name: 'Adani Enterprises Ltd.',   exchange: 'NSE', base: 2658.3, vol: 4.1 },
};

// Approximate shares outstanding for market cap calculation
export const SHARES = {
  RELIANCE:   6.77e9,
  TCS:        3.65e9,
  HDFCBANK:   7.58e9,
  INFY:       4.19e9,
  WIPRO:      5.22e9,
  TATAMOTORS: 3.67e9,
  BAJFINANCE: 6.02e8,
  ADANIENT:   1.14e9,
};

// ── IST time helper ───────────────────────────────────────────────────────────
export function istTime(msAgo = 0) {
  return new Date(Date.now() - msAgo).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}

// ── Seed 180 minutes of price history ────────────────────────────────────────
function seedHistory(base, vol) {
  const pts = [];
  let price = base;
  for (let i = 179; i >= 0; i--) {
    price += (Math.random() - 0.498) * vol * price * 0.003;
    price = Math.max(price, base * 0.7);
    pts.push({
      time:   istTime(i * 60000),
      price:  +price.toFixed(2),
      volume: Math.floor(Math.random() * 8e6 + 2e6),
    });
  }
  return pts;
}

// ── Initialise all stock data ─────────────────────────────────────────────────
export function initStockData() {
  const data = {};
  for (const [sym, info] of Object.entries(STOCKS)) {
    const hist = seedHistory(info.base, info.vol);
    data[sym] = {
      ...info,
      symbol:    sym,
      history:   hist,
      price:     hist[hist.length - 1].price,
      open:      hist[0].price,
      high:      Math.max(...hist.map(h => h.price)),
      low:       Math.min(...hist.map(h => h.price)),
      prevClose: +(info.base * (0.99 + Math.random() * 0.02)).toFixed(2),
    };
  }
  return data;
}

// ── Advance one price tick ─────────────────────────────────────────────────────
export function tickStock(stock) {
  const last  = stock.price;
  const delta = (Math.random() - 0.499) * stock.vol * last * 0.0012;
  const price = +Math.max(last + delta, stock.base * 0.5).toFixed(2);
  const newPt = {
    time:   istTime(),
    price,
    volume: Math.floor(Math.random() * 8e6 + 2e6),
  };
  const history = [...stock.history.slice(-239), newPt];
  return {
    ...stock,
    price,
    history,
    high: Math.max(stock.high, price),
    low:  Math.min(stock.low, price),
  };
}
