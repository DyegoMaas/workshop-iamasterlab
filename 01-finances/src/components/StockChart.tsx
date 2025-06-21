'use client'

import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO, subMonths, startOfYear } from 'date-fns'
import { StockTimeSeries } from '../lib/fetchAlpha'

interface StockChartProps {
  data: StockTimeSeries
  period: 'YTD' | '6M' | '1M' | 'ALL'
}

export function StockChart({ data, period }: StockChartProps) {
  const filteredData = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'YTD':
        startDate = startOfYear(now)
        break
      case '6M':
        startDate = subMonths(now, 6)
        break
      case '1M':
        startDate = subMonths(now, 1)
        break
      case 'ALL':
      default:
        return data.data
    }

    return data.data.filter(point => {
      const pointDate = parseISO(point.date)
      return pointDate >= startDate
    })
  }, [data.data, period])

  const formatPrice = (value: number) => `$${value.toFixed(2)}`
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd')
    } catch {
      return dateStr
    }
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={filteredData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            className="text-xs"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatPrice}
            className="text-xs"
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelFormatter={(dateStr: string) => {
              try {
                return format(parseISO(dateStr), 'MMM dd, yyyy')
              } catch {
                return dateStr
              }
            }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 