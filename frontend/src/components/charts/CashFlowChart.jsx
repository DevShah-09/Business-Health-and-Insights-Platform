import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function CashFlowChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-surface-muted-foreground">
        No cash flow data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3449" />
        <XAxis
          dataKey="date"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a2436',
            border: '1px solid #2d3449',
            borderRadius: '8px',
          }}
          formatter={(value) => `₹${value.toLocaleString()}`}
          labelStyle={{ color: '#cbd5e1' }}
        />
        <Legend wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="cumulative_cash"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          name="Cumulative Cash"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}