import { LineChart, Line, ResponsiveContainer } from 'recharts';
import C from '../theme';

export default function Sparkline({ history, positive }) {
  return (
    <ResponsiveContainer width={90} height={36}>
      <LineChart data={history.slice(-30)}>
        <Line
          type="monotone"
          dataKey="price"
          dot={false}
          stroke={positive ? C.green : C.red}
          strokeWidth={1.5}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
