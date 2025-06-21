import { StockTimeSeries } from './fetchAlpha'

export function getMockTimeSeries(symbol: string): StockTimeSeries {
  const mockPrices: Record<string, number> = {
    NVDA: 875.28,
    GOOG: 2756.35,
    AMZN: 3342.88,
    MSFT: 411.22,
    META: 563.27,
  }

  const basePrice = mockPrices[symbol] || 100
  const data: Array<{ date: string; close: number; volume: number }> = []
  const today = new Date()

  // Generate 365 days of mock data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Generate realistic price movement
    const volatility = 0.02 // 2% daily volatility
    const trend = 0.0002 // Slight upward trend
    const randomChange = (Math.random() - 0.5) * volatility * 2
    const priceChange = trend + randomChange
    
    const previousPrice: number = i === 364 ? basePrice : data[data.length - 1]?.close || basePrice
    const newPrice: number = previousPrice * (1 + priceChange)
    
    data.push({
      date: date.toISOString().split('T')[0],
      close: Math.round(newPrice * 100) / 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000, // 1M to 11M volume
    })
  }

  return {
    symbol,
    data,
  }
} 