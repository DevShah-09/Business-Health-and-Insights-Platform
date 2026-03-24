import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

export function ForecastChart({ data, loading }) {
  if (loading || !data) {
    return <div className="h-[400px] w-full animate-pulse bg-surface-card rounded-xl" />;
  }

  // Find the first month where prediction starts dynamically
  const firstPredicted = data.find(d => d.isPredicted);
  const predictionStartIndex = firstPredicted ? firstPredicted.month : null;

  return (
    <div className="h-[400px] w-full border border-[var(--color-surface-border)] rounded-xl bg-[var(--color-surface-card)] p-4">
       <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3449" vertical={false} />
            <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#171f33', borderColor: '#334155', borderRadius: '8px', color: '#dae2fd' }}
              itemStyle={{ color: '#dae2fd' }}
            />
            <ReferenceLine x={predictionStartIndex} stroke="#818cf8" strokeDasharray="3 3" label={{ position: 'top', value: 'Forecast', fill: '#818cf8', fontSize: 12 }} />
            
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#171f33', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#171f33', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="cashflow" name="Cash Flow" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
