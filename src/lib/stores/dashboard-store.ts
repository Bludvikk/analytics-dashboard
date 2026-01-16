import { create } from 'zustand'
import type { Post } from '@/lib/database.types'

export type Platform = 'all' | 'instagram' | 'tiktok'
export type SortColumn = 'posted_at' | 'likes' | 'comments' | 'shares' | 'engagement_rate' | 'reach' | 'impressions'
export type SortDirection = 'asc' | 'desc'
export type ChartType = 'line' | 'area'
export type DateRangePreset = 'last7days' | 'last30days' | 'last90days' | 'allTime' | 'custom'

export interface DateRange {
  startDate: string // ISO date string YYYY-MM-DD
  endDate: string   // ISO date string YYYY-MM-DD
  preset: DateRangePreset
}

// Helper to calculate date ranges
const getDateRange = (preset: DateRangePreset): DateRange => {
  const today = new Date()
  const endDate = today.toISOString().split('T')[0]

  let startDate: string
  switch (preset) {
    case 'last7days':
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'last30days':
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'last90days':
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'allTime':
      startDate = '2020-01-01' // Far enough back to capture all data
      break
    default:
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  return { startDate, endDate, preset }
}

interface DashboardState {
  // Filter state
  platformFilter: Platform
  setPlatformFilter: (platform: Platform) => void

  // Sort state
  sortColumn: SortColumn
  sortDirection: SortDirection
  setSorting: (column: SortColumn, direction: SortDirection) => void

  // Modal state
  selectedPost: Post | null
  setSelectedPost: (post: Post | null) => void
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void

  // Chart state
  chartType: ChartType
  setChartType: (type: ChartType) => void

  // Date range state for chart
  dateRange: DateRange
  setDateRangePreset: (preset: DateRangePreset) => void
  setCustomDateRange: (startDate: string, endDate: string) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Filter state
  platformFilter: 'all',
  setPlatformFilter: (platform) => set({ platformFilter: platform }),

  // Sort state
  sortColumn: 'posted_at',
  sortDirection: 'desc',
  setSorting: (column, direction) => set({ sortColumn: column, sortDirection: direction }),

  // Modal state
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  // Chart state
  chartType: 'line',
  setChartType: (type) => set({ chartType: type }),

  // Date range state - default to last 30 days
  dateRange: getDateRange('last30days'),
  setDateRangePreset: (preset) => set({ dateRange: getDateRange(preset) }),
  setCustomDateRange: (startDate, endDate) => set({
    dateRange: { startDate, endDate, preset: 'custom' }
  }),
}))
