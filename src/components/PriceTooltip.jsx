import C from '../theme';
import { fmtINR } from '../utils/format';

export default function PriceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        padding: '8px 12px',
        borderRadius: 4,
        fontSize: 12,
        color: C.text,
      }}
    >
      <div style={{ color: C.accent, fontWeight: 700 }}>
        {fmtINR(payload[0]?.value)}
      </div>
      <div style={{ color: C.dim }}>{payload[0]?.payload?.time} IST</div>
    </div>
  );
}
