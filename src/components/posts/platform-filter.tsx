'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardStore, type Platform } from '@/lib/stores/dashboard-store'

export function PlatformFilter() {
  const { platformFilter, setPlatformFilter } = useDashboardStore()

  return (
    <Select
      value={platformFilter}
      onValueChange={(value: Platform) => setPlatformFilter(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select platform" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Platforms</SelectItem>
        <SelectItem value="instagram">Instagram</SelectItem>
        <SelectItem value="tiktok">TikTok</SelectItem>
      </SelectContent>
    </Select>
  )
}
