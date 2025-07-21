import { BalanceSheetWithCompany } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface FinancialChartsProps {
  data: BalanceSheetWithCompany[]
}

export function FinancialCharts({ data }: FinancialChartsProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No financial data available for charts</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for charts
  const chartData = data.map(sheet => ({
    period: `Q${sheet.period_quarter} ${sheet.period_year}`,
    assets: sheet.assets.total_assets || 0,
    liabilities: sheet.liabilities.total_liabilities || 0,
    equity: sheet.equity.total_equity || 0,
    revenue: sheet.revenue || 0,
    netIncome: sheet.net_income || 0,
  })).reverse() // Show chronological order

  // Latest balance sheet for pie chart
  const latestSheet = data[0]
  const pieData = [
    { name: 'Current Assets', value: latestSheet.assets.current_assets || 0, fill: '#8884d8' },
    { name: 'Non-Current Assets', value: latestSheet.assets.non_current_assets || 0, fill: '#82ca9d' },
  ]

  const liabilitiesPieData = [
    { name: 'Current Liabilities', value: latestSheet.liabilities.current_liabilities || 0, fill: '#ffc658' },
    { name: 'Non-Current Liabilities', value: latestSheet.liabilities.non_current_liabilities || 0, fill: '#ff7c7c' },
  ]

  const chartConfig = {
    assets: {
      label: "Assets",
      color: "hsl(var(--chart-1))",
    },
    liabilities: {
      label: "Liabilities", 
      color: "hsl(var(--chart-2))",
    },
    equity: {
      label: "Equity",
      color: "hsl(var(--chart-3))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-4))",
    },
    netIncome: {
      label: "Net Income",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assets vs Liabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Assets vs Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="assets" fill="var(--color-assets)" />
                <Bar dataKey="liabilities" fill="var(--color-liabilities)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Revenue Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Net Income Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-revenue)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="netIncome" 
                  stroke="var(--color-netIncome)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Asset Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Composition (Latest)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Liability Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Liability Composition (Latest)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={liabilitiesPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {liabilitiesPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}