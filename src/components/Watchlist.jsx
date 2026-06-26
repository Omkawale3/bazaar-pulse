import C from '../theme';
import { pct } from '../utils/format';
import Sparkline from './Sparkline';

export default function Watchlist({ stocks, selected, onSelect }) {
  return (
    <div
      style={{
        width: 228,
        borderRight: `1px solid ${C.border}`,
        overflowY: 'auto',
        background: C.panel,
      }}
    >
      <div
        style={{
          padding: '8px 14px',
          fontSize: 9,
          color: C.dim,
          letterSpacing: 2,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        NIFTY WATCHLIST
      </div>

      {Object.values(stocks).map((st) => {
        const chg    = +(st.price - st.prevClose).toFixed(2);
        const pos    = chg >= 0;
        const active = st.symbol === selected;

        return (
          <div
            key={st.symbol}
            onClick={() => onSelect(st.symbol)}
            style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${C.border}`,
              cursor: 'pointer',
              background: active ? '#1a0f00' : 'transparent',
              borderLeft: active
                ? `2px solid ${C.accent}`
                : '2px solid transparent',
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: C.dim,
                marginBottom: 2,
                letterSpacing: 0.5,
              }}
            >
              {st.name.split(' ').slice(0, 2).join(' ').toUpperCase()}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: C.accent }}
                >
                  {st.symbol}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  ₹
                  {st.price.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Sparkline history={st.history} positive={pos} />
                <div style={{ fontSize: 10, color: pos ? C.green : C.red }}>
                  {pos ? '▲' : '▼'} {pos ? '+' : ''}
                  {pct(st.price, st.prevClose)}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
