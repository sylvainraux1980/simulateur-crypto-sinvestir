'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { ChartPoint } from '@/lib/types';

interface Props {
  data: ChartPoint[];
  totalInvested: number;
}

function formatEur(v: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(v);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const portfolio = payload.find((p: any) => p.dataKey === 'portfolioValue');
  const invested = payload.find((p: any) => p.dataKey === 'totalInvested');
  const gain = (portfolio?.value ?? 0) - (invested?.value ?? 0);
  const isPos = gain >= 0;

  return (
    <div className="bg-[#0e1424] border border-[#1e2a3a] rounded-xl p-3 text-sm shadow-xl">
      <p className="text-gray-400 mb-2 font-medium">
        {new Date(label + 'T00:00:00Z').toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        })}
      </p>
      <p className="text-white">
        <span className="text-gray-400">Portefeuille : </span>
        <span className="text-[#f9d147] font-semibold">{formatEur(portfolio?.value ?? 0)}</span>
      </p>
      <p className="text-white">
        <span className="text-gray-400">Investi : </span>
        <span className="font-semibold">{formatEur(invested?.value ?? 0)}</span>
      </p>
      <p className={`font-semibold mt-1 ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPos ? '+' : ''}{formatEur(gain)}
      </p>
    </div>
  );
}

export default function EvolutionChart({ data, totalInvested }: Props) {
  if (!data.length) return null;

  // Reduce X axis tick density
  const tickCount = Math.min(8, data.length);
  const step = Math.floor(data.length / tickCount);
  const ticks = data
    .filter((_, i) => i % step === 0 || i === data.length - 1)
    .map((d) => d.date);

  return (
    <div className="w-full h-72 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f9d147" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f9d147" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#244d9c" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#244d9c" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />

          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={formatDate}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#1f2538' }}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(v) => formatEur(v)}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            formatter={(value) =>
              value === 'portfolioValue' ? 'Valeur du portefeuille' : 'Montant investi'
            }
            wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 12 }}
          />

          <Area
            type="monotone"
            dataKey="totalInvested"
            stroke="#244d9c"
            strokeWidth={2}
            fill="url(#gradInvested)"
            dot={false}
            activeDot={false}
          />

          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke="#f9d147"
            strokeWidth={2}
            fill="url(#gradPortfolio)"
            dot={false}
            activeDot={{ r: 4, fill: '#f9d147', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
