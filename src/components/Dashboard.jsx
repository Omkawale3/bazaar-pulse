import { useState, useEffect, useRef } from 'react';
import C from '../theme';
import { initStockData, tickStock, istTime, SHARES } from '../utils/stockData';
import { calcRSI, calcMACD } from '../utils/indicators';
import { pct, fmtINR, fmtVol, fmtMktCap } from '../utils/format';
import Watchlist   from './Watchlist';
import ChartPanel  from './ChartPanel';
import MarketTable from './MarketTable';

export default function Dashboard() {
  const [stocks,   setStocks]   = useState(() => initStockData());
  const [selected, setSelected] = useState('RELIANCE');
  const [range,    setRange]    = useState(60);
  const [tab,      setTab]      = useState('chart');
  const [live,     setLive]     = useState(true);
  const [clock,    setClock]    = useState(istTime());
  const tickRef = useRef(null);

  // IST clock tick
  useEffect(() => {
    const id = setInterval(() => setClock(istTime()), 1000);
    return () => clearInterval(id);
  }, []);

  // Live price tick every 1.5s
  useEffect(() => {
    if (!live) { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(() => {
      setStocks(prev => {
        const next = { ...prev };
        for (const sym of Object.keys(next)) next[sym] = tickStock(next[sym]);
        return next;
      });
    }, 1500);
    return () => clearInterval(tickRef.current);
  }, [live]);

  const s         = stocks[selected];
  const changeAmt = +(s.price - s.prevClose).toFixed(2);
  const changePct = pct(s.price, s.prevClose);
  const positive  = changeAmt >= 0;
  const prices    = s.history.map(h => h.price);
  const rsi       = calcRSI(prices);
  const macd      = calcMACD(prices);
  const totalVol  = s.history.reduce((a, h) => a + h.volume, 0);

  // ── Style helpers ──────────────────────────────────────────────────────────
  const panel = {
    background: C.panel, border: `1px solid ${C.border}`,
    borderRadius: 4, padding: '12px 16px', marginBottom: 12,
  };
  const kpiBx = {
    flex: 1, minWidth: 90, background: C.panel,
    border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 14px',
  };
  const tabBtn = (a) => ({
    padding: '5px 14px', fontSize: 11, letterSpacing: 1,
    cursor: 'pointer', fontFamily: 'inherit',
    background: a ? C.accent : 'transparent',
    color: a ? '#0a0e17' : C.dim,
    border: `1px solid ${a ? C.accent : C.border}`,
    borderRadius: 3,
  });
  const rngBtn = (a) => ({
    padding: '3px 10px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
    background: a ? '#1a0f00' : 'transparent',
    color: a ? C.accent : C.dim,
    border: `1px solid ${a ? C.accent : C.border}`,
    borderRadius: 3,
  });
  const badge = (val, lo, hi) => ({
    fontSize: 10, padding: '2px 8px', borderRadius: 3,
    background: val < lo ? '#1a1000' : val > hi ? '#1a0000' : '#001a10',
    color:      val < lo ? C.gold   : val > hi ? C.red    : C.green,
    border: `1px solid ${val < lo ? C.gold : val > hi ? C.red : C.green}`,
  });

  return (
    <div style={{
      fontFamily: "'JetBrains Mono','Courier New',monospace",
      background: C.bg, minHeight: '100vh', color: C.text,
    }}>

      {/* ── Header ── */}
      <div style={{
        background: C.panel, borderBottom: `1px solid ${C.border}`,
        padding: '10px 20px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Tricolour dots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: '#ff9933' }} />
            <div style={{ width: 4, height: 4, borderRadius: 2, background: '#ffffff' }} />
            <div style={{ width: 4, height: 4, borderRadius: 2, background: '#138808' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent, letterSpacing: 3 }}>
            BAZAAR PULSE
          </span>
          <span style={{
            fontSize: 9, background: '#1a0f00', color: C.accent,
            border: `1px solid ${C.accent}`, padding: '2px 8px',
            borderRadius: 3, letterSpacing: 1,
          }}>NSE / BSE</span>
          <span style={{
            fontSize: 9,
            background: live ? '#001a08' : '#1a1000',
            color: live ? C.green : C.gold,
            border: `1px solid ${live ? C.green : C.gold}`,
            padding: '2px 8px', borderRadius: 3, letterSpacing: 1,
          }}>
            {live ? '● LIVE' : '⏸ PAUSED'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: C.dim }}>{clock} IST</span>
          <button
            onClick={() => setLive(l => !l)}
            style={{
              ...tabBtn(false),
              color: live ? C.red : C.green,
              borderColor: live ? C.red : C.green,
              fontSize: 10, padding: '4px 12px',
            }}
          >
            {live ? '⏸ PAUSE' : '▶ RESUME'}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', height: 'calc(100vh - 49px)' }}>

        <Watchlist stocks={stocks} selected={selected} onSelect={setSelected} />

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

          {/* Hero price block */}
          <div style={panel}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', flexWrap: 'wrap', gap: 8,
            }}>
              <div>
                <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, marginBottom: 3 }}>
                  {s.exchange} · {s.name.toUpperCase()}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: C.accent }}>
                    ₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: 15, color: positive ? C.green : C.red, fontWeight: 600 }}>
                    {positive ? '▲' : '▼'} {positive ? '+' : ''}
                    ₹{Math.abs(changeAmt).toFixed(2)} ({positive ? '+' : ''}{changePct}%)
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {rsi && <span style={badge(rsi, 30, 70)}>RSI {rsi}</span>}
                <span style={badge(macd.hist, -1, 1)}>
                  MACD {macd.hist > 0 ? '+' : ''}{macd.hist}
                </span>
                <span style={{
                  fontSize: 9, color: C.dim,
                  border: `1px solid ${C.border}`,
                  padding: '2px 8px', borderRadius: 3,
                }}>
                  Mkt Cap {fmtMktCap(s.price, SHARES[selected] || 1e9)}
                </span>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'OPEN',       value: fmtINR(s.open) },
              { label: 'HIGH',       value: fmtINR(s.high),      color: C.green },
              { label: 'LOW',        value: fmtINR(s.low),       color: C.red },
              { label: 'PREV CLOSE', value: fmtINR(s.prevClose) },
              { label: 'VOLUME',     value: fmtVol(totalVol) },
              { label: '52W HIGH',   value: fmtINR(+(s.base * 1.38).toFixed(2)), color: C.green },
              { label: '52W LOW',    value: fmtINR(+(s.base * 0.72).toFixed(2)), color: C.red },
            ].map(({ label, value, color }) => (
              <div key={label} style={kpiBx}>
                <div style={{ fontSize: 8, color: C.dim, letterSpacing: 1.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: color || C.text }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Tab bar + range selector */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['chart', 'rsi', 'volume', 'macd'].map(t => (
                <button key={t} style={tabBtn(tab === t)} onClick={() => setTab(t)}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[30, 60, 120, 180].map(r => (
                <button key={r} style={rngBtn(range === r)} onClick={() => setRange(r)}>
                  {r === 30 ? '30m' : r === 60 ? '1H' : r === 120 ? '2H' : '3H'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart panel */}
          <div style={{ ...panel, padding: '16px 8px' }}>
            <ChartPanel stock={s} tab={tab} range={range} positive={positive} />
          </div>

          {/* Market overview table */}
          <MarketTable stocks={stocks} selected={selected} onSelect={setSelected} />

          {/* Footer */}
          <div style={{
            fontSize: 9, color: C.muted, textAlign: 'center',
            padding: '8px 0 16px', letterSpacing: 1,
          }}>
            BAZAAR PULSE · NSE / BSE INDIA · DATA SIMULATED FOR DEMO · NOT SEBI INVESTMENT ADVICE
          </div>

        </div>
      </div>
    </div>
  );
}
