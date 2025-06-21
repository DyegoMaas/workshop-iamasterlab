import { Suspense } from 'react'
import { fetchStockQuote, fetchStockTimeSeries } from '../src/lib/fetchAlpha'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/ui/card'
import { Button } from '../src/ui/button'
import { StockSparkline } from '../src/components/StockSparkline'
import { StockChart } from '../src/components/StockChart'
import { TrendingUp, TrendingDown, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

const TECH_STOCKS = ['NVDA', 'GOOG', 'AMZN', 'MSFT', 'META']

async function StockGrid() {
  const stockPromises = TECH_STOCKS.map(async (symbol) => {
    const [quote, timeSeries] = await Promise.all([
      fetchStockQuote(symbol),
      fetchStockTimeSeries(symbol)
    ])
    return { quote, timeSeries }
  })

  const stocks = await Promise.all(stockPromises)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stocks.map(({ quote, timeSeries }) => (
        <Card key={quote.symbol} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{quote.symbol}</CardTitle>
            <StockSparkline 
              data={timeSeries.data} 
              isPositive={quote.change >= 0} 
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${quote.price.toFixed(2)}</div>
            <div className={`flex items-center text-xs ${
              quote.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quote.change >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {quote.change >= 0 ? '+' : ''}
              {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Updated: {quote.lastUpdated}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function ChartSection() {
  // Default to NVDA for the main chart
  const timeSeries = await fetchStockTimeSeries('NVDA')
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>NVDA Stock Chart</CardTitle>
        <CardDescription>
          Historical price data with period filters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Button variant="outline" size="sm">YTD</Button>
          <Button variant="outline" size="sm">6M</Button>
          <Button variant="outline" size="sm">1M</Button>
          <Button variant="default" size="sm">ALL</Button>
        </div>
        <StockChart data={timeSeries} period="ALL" />
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold text-xl">💹 TechStocks Pro</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="#" className="text-foreground/60 hover:text-foreground/80">Dashboard</a>
              <a href="#" className="text-foreground/60 hover:text-foreground/80">Portfolio</a>
              <a href="#" className="text-foreground/60 hover:text-foreground/80">Watchlist</a>
              <a href="#" className="text-foreground/60 hover:text-foreground/80">Analytics</a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Track Your Tech Investments
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Real-time stock tracking for leading technology companies. 
                Monitor prices, analyze trends, and make informed decisions.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Stock to Portfolio
              </Button>
              <Button variant="outline" size="lg">
                View Analytics
              </Button>
            </div>
          </div>
        </section>

        {/* Stock Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Market Overview</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-0 pb-2">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }>
            <StockGrid />
          </Suspense>
        </section>

        {/* Chart Section */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Historical Analysis</h2>
          <Suspense fallback={
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded"></div>
              </CardContent>
            </Card>
          }>
            <ChartSection />
          </Suspense>
        </section>
      </main>
    </div>
  )
} 