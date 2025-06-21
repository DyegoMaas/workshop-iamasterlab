export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  lastUpdated: string
}

export interface StockTimeSeries {
  symbol: string
  data: Array<{
    date: string
    close: number
    volume: number
  }>
}

const ALPHA_VANTAGE_URL = process.env.ALPHA_VANTAGE_URL || 'https://www.alphavantage.co/query'
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo'

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  if (process.env.FETCH_STOCKS_OFFLINE === 'true') {
    return getMockQuote(symbol)
  }

  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}`)
    }

    const data = await response.json()
    const quote = data['Global Quote']

    if (!quote) {
      throw new Error(`No quote data found for ${symbol}`)
    }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      lastUpdated: quote['07. latest trading day'],
    }
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)
    return getMockQuote(symbol)
  }
}

export async function fetchStockTimeSeries(symbol: string): Promise<StockTimeSeries> {
  if (process.env.FETCH_STOCKS_OFFLINE === 'true') {
    const { getMockTimeSeries } = await import('./mockSeries')
    return getMockTimeSeries(symbol)
  }

  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_URL}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${ALPHA_VANTAGE_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch time series for ${symbol}`)
    }

    const data = await response.json()
    const timeSeries = data['Time Series (Daily)']

    if (!timeSeries) {
      throw new Error(`No time series data found for ${symbol}`)
    }

    const seriesData = Object.entries(timeSeries)
      .slice(0, 365) // Last 365 days
      .map(([date, values]: [string, unknown]) => {
        const valuesObj = values as Record<string, string>
        return {
          date,
          close: parseFloat(valuesObj['5. adjusted close']),
          volume: parseInt(valuesObj['6. volume']),
        }
      })
      .reverse() // Chronological order

    return {
      symbol,
      data: seriesData,
    }
  } catch (error) {
    console.error(`Error fetching time series for ${symbol}:`, error)
    const { getMockTimeSeries } = await import('./mockSeries')
    return getMockTimeSeries(symbol)
  }
}

function getMockQuote(symbol: string): StockQuote {
  const mockPrices: Record<string, number> = {
    NVDA: 875.28,
    GOOG: 2756.35,
    AMZN: 3342.88,
    MSFT: 411.22,
    META: 563.27,
  }

  const basePrice = mockPrices[symbol] || 100
  const change = (Math.random() - 0.5) * 20
  const changePercent = (change / basePrice) * 100

  return {
    symbol,
    price: basePrice + change,
    change,
    changePercent,
    lastUpdated: new Date().toISOString().split('T')[0],
  }
} 