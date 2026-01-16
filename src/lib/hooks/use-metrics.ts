import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { DailyMetric } from '@/lib/database.types'
import { useDashboardStore } from '@/lib/stores/dashboard-store'

// Query key factory for consistent cache management
export const metricsKeys = {
  all: ['metrics'] as const,
  daily: () => [...metricsKeys.all, 'daily'] as const,
  dailyRange: (days: number) => [...metricsKeys.daily(), { days }] as const,
  dailyDateRange: (startDate: string, endDate: string) =>
    [...metricsKeys.daily(), { startDate, endDate }] as const,
  summary: () => [...metricsKeys.all, 'summary'] as const,
}

async function fetchDailyMetrics(days: number = 30): Promise<DailyMetric[]> {
  const supabase = createClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch daily metrics: ${error.message}`)
  }

  return data ?? []
}

async function fetchDailyMetricsByDateRange(
  startDate: string,
  endDate: string
): Promise<DailyMetric[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch daily metrics: ${error.message}`)
  }

  return data ?? []
}

export function useDailyMetrics(days: number = 30) {
  return useQuery({
    queryKey: metricsKeys.dailyRange(days),
    queryFn: () => fetchDailyMetrics(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook that uses the date range from Zustand store
export function useDailyMetricsWithDateRange() {
  const { dateRange } = useDashboardStore()

  return useQuery({
    queryKey: metricsKeys.dailyDateRange(dateRange.startDate, dateRange.endDate),
    queryFn: () => fetchDailyMetricsByDateRange(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export interface AnalyticsSummary {
  totalEngagement: number
  averageEngagementRate: number
  topPerformingPost: {
    id: string
    caption: string | null
    platform: string
    engagement: number
    thumbnail_url: string | null
  } | null
  trendPercentage: number
  currentPeriodEngagement: number
  previousPeriodEngagement: number
  totalPosts: number
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: metricsKeys.summary(),
    queryFn: async (): Promise<AnalyticsSummary> => {
      const response = await fetch('/api/analytics/summary')

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch analytics summary')
      }

      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to fetch metrics from the edge route
export function useDailyMetricsEdge(days: number = 30) {
  return useQuery({
    queryKey: [...metricsKeys.dailyRange(days), 'edge'],
    queryFn: async (): Promise<DailyMetric[]> => {
      const response = await fetch(`/api/metrics/daily?days=${days}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch daily metrics')
      }

      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
