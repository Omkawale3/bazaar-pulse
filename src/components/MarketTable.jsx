import C from '../theme';
import { pct, fmtVol, fmtMktCap } from '../utils/format';
import { calcRSI } from '../utils/indicators';
import { SHARES } from '../utils/stockData';

export default function MarketTable({ stocks, selected, onSelect }) {
  const badge = (val, lo, hi) => ({
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 3,
    background: val < lo ? '#1a1000' : val > hi ? '#1a0000' : '#001a10',
    color:      val < lo ? C.gold   : val > hi ? C.red    : C.green,
    border: `1px solid ${val < lo ? C.gold : val > hi ? C.red : C.green}`,
  });

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: '12px 16px',
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, marginBottom: 10 }}>
        NSE MARKET OVERVIEW
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ color: C.dim, borderBottom: `1px solid ${C.border}` }}>
              {['SYMBOL', 'PRICE (₹)', 'CHANGE', '%', 'HIGH', 'LOW', 'VOLUME', 'MKT CAP', 'RSI'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '4px 8px',
                    textAlign: 'left',
                    fontWeight: 400,
                    letterSpacing: 1,
                    fontSize: 9,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.values(stocks).map((st, idx) => {
              const chg   = +(st.price - st.prevClose).toFixed(2);
              const pos   = chg >= 0;
              const stRsi = calcRSI(st.history.map(h => h.price));

              return (
                <tr
                  key={st.symbol}
                  onClick={() => onSelect(st.symbol)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: `1px solid ${C.border}`,
                    background:
                      st.symbol === selected
                        ? '#1a0f00'
                        : idx % 2 === 0
                        ? 'transparent'
                        : '#0c1320',
                  }}
                >
                  <td style={{ padding: '6px 8px', color: C.accent, fontWeight: 700 }}>
                    {st.symbol}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    ₹{st.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '6px 8px', color: pos ? C.green : C.red }}>
                    {pos ? '+' : ''}₹{Math.abs(chg).toFixed(2)}
                  </td>
                  <td style={{ padding: '6px 8px', color: pos ? C.green : C.red }}>
                    {pos ? '+' : ''}{pct(st.price, st.prevClose)}%
                  </td>
                  <td style={{ padding: '6px 8px', color: C.green }}>
                    ₹{st.high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '6px 8px', color: C.red }}>
                    ₹{st.low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '6px 8px', color: C.dim }}>
                    {fmtVol(st.history.reduce((a, h) => a + h.volume, 0))}
                  </td>
                  <td style={{ padding: '6px 8px', color: C.dim, fontSize: 10 }}>
                    {fmtMktCap(st.price, SHARES[st.symbol] || 1e9)}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    {stRsi && <span style={badge(stRsi, 30, 70)}>{stRsi}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
