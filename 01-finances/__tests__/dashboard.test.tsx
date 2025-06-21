import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dashboard from '../app/page'

// Mock the fetch functions
vi.mock('../src/lib/fetchAlpha', () => ({
  fetchStockQuote: vi.fn().mockResolvedValue({
    symbol: 'NVDA',
    price: 875.28,
    change: 12.50,
    changePercent: 1.45,
    lastUpdated: '2024-01-15',
  }),
  fetchStockTimeSeries: vi.fn().mockResolvedValue({
    symbol: 'NVDA',
    data: [
      { date: '2024-01-01', close: 850.00, volume: 1000000 },
      { date: '2024-01-02', close: 860.00, volume: 1100000 },
      { date: '2024-01-03', close: 875.28, volume: 1200000 },
    ],
  }),
}))

// Mock Recharts components
vi.mock('recharts', () => ({
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
}))

describe('Dashboard', () => {
  it('renders the main dashboard elements', async () => {
    render(await Dashboard())
    
    // Check for main title
    expect(screen.getByText('💹 TechStocks Pro')).toBeInTheDocument()
    expect(screen.getByText('Track Your Tech Investments')).toBeInTheDocument()
    
    // Check for sections
    expect(screen.getByText('Market Overview')).toBeInTheDocument()
    expect(screen.getByText('Historical Analysis')).toBeInTheDocument()
  })

  it('renders NVDA chart component', async () => {
    render(await Dashboard())
    
    // Check if chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })
}) 