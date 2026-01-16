'use client'

import { useRouter } from 'next/navigation'
import { LogOut, BarChart3 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PostsTable } from '@/components/posts/posts-table'
import { PlatformFilter } from '@/components/posts/platform-filter'
import { PostDetailModal } from '@/components/posts/post-detail-modal'
import { EngagementChart } from '@/components/charts/engagement-chart'
import { SummaryCards } from '@/components/charts/summary-cards'
import { createClient } from '@/lib/supabase/client'

interface DashboardContentProps {
  userEmail: string
}

export function DashboardContent({ userEmail }: DashboardContentProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto space-y-8 px-4 py-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your social media performance and engagement metrics
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Engagement Chart */}
        <EngagementChart />

        {/* Posts Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Posts</h2>
              <p className="text-sm text-muted-foreground">
                Click on a row to view detailed metrics
              </p>
            </div>
            <PlatformFilter />
          </div>
          <PostsTable />
        </div>
      </main>

      {/* Post Detail Modal */}
      <PostDetailModal />
    </div>
  )
}
