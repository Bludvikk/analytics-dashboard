import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatEngagementRate(rate: number | null): string {
  if (rate === null) return '0.00%'
  return `${rate.toFixed(2)}%`
}

export function truncateCaption(caption: string | null, maxLength: number = 50): string {
  if (!caption) return ''
  if (caption.length <= maxLength) return caption
  return caption.slice(0, maxLength) + '...'
}

export function calculateEngagement(likes: number, comments: number, shares: number): number {
  return likes + comments + shares
}

export function calculateTrendPercentage(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}
