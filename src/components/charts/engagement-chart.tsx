'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useDailyMetricsWithDateRange } from '@/lib/hooks/use-metrics'
import { useDashboardStore, type DateRangePreset } from '@/lib/stores/dashboard-store'

const chartConfig = {
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--chart-1))',
  },
  reach: {
    label: 'Reach',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

const presetLabels: Record<DateRangePreset, string> = {
  last7days: 'Last 7 days',
  last30days: 'Last 30 days',
  last90days: 'Last 90 days',
  allTime: 'All time',
  custom: 'Custom',
}

export function EngagementChart() {
  const { chartType, setChartType, dateRange, setDateRangePreset } = useDashboardStore()
  const { data: metrics, isLoading, error } = useDailyMetricsWithDateRange()

  const chartData = useMemo(() => {
    if (!metrics) return []
    return metrics.map((metric) => ({
      date: metric.date,
      engagement: metric.engagement,
      reach: metric.reach,
    }))
  }, [metrics])

  // Calculate totals for the footer
  const totals = useMemo(() => {
    if (!chartData.length) return { engagement: 0, reach: 0, trend: 0 }

    const totalEngagement = chartData.reduce((sum, d) => sum + d.engagement, 0)
    const totalReach = chartData.reduce((sum, d) => sum + d.reach, 0)

    // Calculate trend (compare first half to second half)
    const midpoint = Math.floor(chartData.length / 2)
    const firstHalf = chartData.slice(0, midpoint).reduce((sum, d) => sum + d.engagement, 0)
    const secondHalf = chartData.slice(midpoint).reduce((sum, d) => sum + d.engagement, 0)
    const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0

    return { engagement: totalEngagement, reach: totalReach, trend }
  }, [chartData])

  // Format the date range for display
  const dateRangeLabel = useMemo(() => {
    try {
      const start = format(parseISO(dateRange.startDate), 'MMM d, yyyy')
      const end = format(parseISO(dateRange.endDate), 'MMM d, yyyy')
      return `${start} - ${end}`
    } catch {
      return `${dateRange.startDate} - ${dateRange.endDate}`
    }
  }, [dateRange])

  const handlePresetChange = (value: string) => {
    setDateRangePreset(value as DateRangePreset)
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
          <CardDescription>Failed to load chart data</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          <p>Unable to load engagement data. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
          <CardDescription>{dateRangeLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>{dateRangeLabel}</CardDescription>
          </div>
          <Select value={dateRange.preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[140px]" aria-label="Select date range">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">{presetLabels.last7days}</SelectItem>
              <SelectItem value="last30days">{presetLabels.last30days}</SelectItem>
              <SelectItem value="last90days">{presetLabels.last90days}</SelectItem>
              <SelectItem value="allTime">{presetLabels.allTime}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>No engagement data available for the selected date range.</p>
            <p className="mt-2 text-sm">Try selecting &quot;All time&quot; to see historical data.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Engagement Over Time</CardTitle>
          <CardDescription>{dateRangeLabel}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={(v) => setChartType(v as 'line' | 'area')}>
            <SelectTrigger className="w-[100px]" aria-label="Select chart type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="line">Line</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange.preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[140px]" aria-label="Select date range">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">{presetLabels.last7days}</SelectItem>
              <SelectItem value="last30days">{presetLabels.last30days}</SelectItem>
              <SelectItem value="last90days">{presetLabels.last90days}</SelectItem>
              <SelectItem value="allTime">{presetLabels.allTime}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-engagement)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-engagement)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-reach)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-reach)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="reach"
                type="natural"
                fill="url(#fillReach)"
                stroke="var(--color-reach)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="engagement"
                type="natural"
                fill="url(#fillEngagement)"
                stroke="var(--color-engagement)"
                strokeWidth={2}
                stackId="b"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    }}
                    indicator="line"
                  />
                }
              />
              <Line
                dataKey="engagement"
                type="natural"
                stroke="var(--color-engagement)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                dataKey="reach"
                type="natural"
                stroke="var(--color-reach)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totals.trend >= 0 ? (
            <>
              Trending up by {totals.trend.toFixed(1)}% this period
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(totals.trend).toFixed(1)}% this period
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total engagement: {totals.engagement.toLocaleString()} | Total reach: {totals.reach.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  )
}
