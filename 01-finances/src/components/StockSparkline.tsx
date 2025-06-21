'use client'

import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface StockSparklineProps {
  data: Array<{ date: string; close: number }>
  isPositive: boolean
}

export function StockSparkline({ data, isPositive }: StockSparklineProps) {
  // Use only last 30 days for sparkline
  const sparklineData = data.slice(-30)

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sparklineData}>
          <Line
            type="monotone"
            dataKey="close"
            stroke={isPositive ? '#22c55e' : '#ef4444'}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 