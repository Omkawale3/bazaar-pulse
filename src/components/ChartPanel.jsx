import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import C from '../theme';
import { fmtVol } from '../utils/format';
import { calcRSI, calcMACD } from '../utils/indicators';
import PriceTooltip from './PriceTooltip';

export default function ChartPanel({ stock, tab, range, positive }) {
  const chartData = stock.history.slice(-range);
  const macd      = calcMACD(stock.history.map(h => h.price));

  const rsiData = stock.history.slice(-range).map((h, i) => {
    const slice = stock.history.slice(0, stock.history.length - range + i + 1);
    return { time: h.time, rsi: calcRSI(slice.map(x => x.price)) };
  });

  const macdData = chartData
    .filter((_, i) => i % 2 === 0)
    .map((h, i) => {
      const idx   = stock.history.length - range + i * 2;
      const m     = calcMACD(stock.history.slice(0, idx + 1).map(x => x.price));
      return { time: h.time, hist: m.hist };
    });

  const gridProps = { strokeDasharray: '3 3', stroke: C.border };
  const xProps    = { tick: { fill: C.dim, fontSize: 9 }, tickLine: false };
  const yProps    = { tick: { fill: C.dim, fontSize: 9 }, tickLine: false };

  return (
    <>
      {/* ── Price Chart ── */}
      {tab === 'chart' && (
        <>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1.5, paddingLeft: 8, marginBottom: 8 }}>
            PRICE (INR) · {stock.symbol} · {range}MIN WINDOW · IST
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={positive ? C.green : C.red} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={positive ? C.green : C.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...xProps} interval={Math.floor(range / 6)} />
              <YAxis {...yProps} domain={['auto', 'auto']}
                tickFormatter={v => '₹' + v.toLocaleString('en-IN')} width={72} />
              <Tooltip content={<PriceTooltip />} />
              <ReferenceLine y={stock.prevClose} stroke={C.muted} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="price"
                stroke={positive ? C.green : C.red}
                fill="url(#pg)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}

      {/* ── RSI ── */}
      {tab === 'rsi' && (
        <>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1.5, paddingLeft: 8, marginBottom: 8 }}>
            RSI(14) · OVERBOUGHT &gt;70 · OVERSOLD &lt;30
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={rsiData} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...xProps} interval={Math.floor(range / 6)} />
              <YAxis domain={[0, 100]} {...yProps} width={35} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <ReferenceLine y={70} stroke={C.red}  strokeDasharray="4 4"
                label={{ value: 'OB 70', fill: C.red,  fontSize: 9 }} />
              <ReferenceLine y={30} stroke={C.gold} strokeDasharray="4 4"
                label={{ value: 'OS 30', fill: C.gold, fontSize: 9 }} />
              <ReferenceLine y={50} stroke={C.muted} strokeDasharray="2 6" />
              <Line type="monotone" dataKey="rsi" stroke={C.accent} dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {/* ── Volume ── */}
      {tab === 'volume' && (
        <>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1.5, paddingLeft: 8, marginBottom: 8 }}>
            VOLUME · {stock.symbol} (NSE)
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData.filter((_, i) => i % 3 === 0)}
              margin={{ left: 8, right: 8, top: 4, bottom: 0 }}
            >
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...xProps} interval={Math.floor(range / 18)} />
              <YAxis {...yProps} width={60} tickFormatter={v => fmtVol(v)} />
              <Tooltip
                contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }}
                formatter={v => [fmtVol(v), 'Volume']}
              />
              <Bar dataKey="volume" fill={C.accent} opacity={0.75} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* ── MACD ── */}
      {tab === 'macd' && (
        <>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1.5, paddingLeft: 8, marginBottom: 8 }}>
            MACD(12,26,9) · SIGNAL LINE CROSSOVER
          </div>
          <div style={{ padding: '0 8px', marginBottom: 12, display: 'flex', gap: 16, fontSize: 11 }}>
            <span>MACD <span style={{ color: C.accent }}>{macd.macd > 0 ? '+' : ''}{macd.macd}</span></span>
            <span>Signal <span style={{ color: C.gold }}>{macd.signal > 0 ? '+' : ''}{macd.signal}</span></span>
            <span>Histogram <span style={{ color: macd.hist > 0 ? C.green : C.red }}>
              {macd.hist > 0 ? '+' : ''}{macd.hist}
            </span></span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={macdData} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...xProps} interval={Math.floor(range / 12)} />
              <YAxis {...yProps} width={50} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <ReferenceLine y={0} stroke={C.muted} />
              <Bar dataKey="hist" radius={[2, 2, 0, 0]} fill={C.green} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
}
