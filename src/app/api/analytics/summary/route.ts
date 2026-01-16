import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface AnalyticsSummary {
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

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch all posts for the user (RLS will filter automatically)
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('posted_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return NextResponse.json(
        { error: 'Database Error', message: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    // Handle empty state
    if (!posts || posts.length === 0) {
      const emptyResponse: AnalyticsSummary = {
        totalEngagement: 0,
        averageEngagementRate: 0,
        topPerformingPost: null,
        trendPercentage: 0,
        currentPeriodEngagement: 0,
        previousPeriodEngagement: 0,
        totalPosts: 0,
      }
      return NextResponse.json(emptyResponse)
    }

    // Calculate total engagement
    const totalEngagement = posts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares,
      0
    )

    // Calculate average engagement rate
    const totalEngagementRate = posts.reduce(
      (sum, post) => sum + (post.engagement_rate || 0),
      0
    )
    const averageEngagementRate =
      posts.length > 0 ? totalEngagementRate / posts.length : 0

    // Find top performing post
    const postsWithEngagement = posts.map((post) => ({
      ...post,
      totalEngagement: post.likes + post.comments + post.shares,
    }))

    const topPost = postsWithEngagement.reduce(
      (max, post) =>
        post.totalEngagement > (max?.totalEngagement || 0) ? post : max,
      postsWithEngagement[0]
    )

    const topPerformingPost = topPost
      ? {
          id: topPost.id,
          caption: topPost.caption,
          platform: topPost.platform,
          engagement: topPost.totalEngagement,
          thumbnail_url: topPost.thumbnail_url,
        }
      : null

    // Calculate trend (last 7 days vs previous 7 days)
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    // Fetch daily metrics for trend calculation
    const { data: recentMetrics } = await supabase
      .from('daily_metrics')
      .select('*')
      .gte('date', fourteenDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false })

    let currentPeriodEngagement = 0
    let previousPeriodEngagement = 0

    if (recentMetrics && recentMetrics.length > 0) {
      recentMetrics.forEach((metric) => {
        const metricDate = new Date(metric.date)
        if (metricDate >= sevenDaysAgo) {
          currentPeriodEngagement += metric.engagement
        } else if (metricDate >= fourteenDaysAgo) {
          previousPeriodEngagement += metric.engagement
        }
      })
    }

    // Calculate trend percentage
    let trendPercentage = 0
    if (previousPeriodEngagement > 0) {
      trendPercentage =
        ((currentPeriodEngagement - previousPeriodEngagement) /
          previousPeriodEngagement) *
        100
    } else if (currentPeriodEngagement > 0) {
      trendPercentage = 100 // 100% increase if there was no previous engagement
    }

    const response: AnalyticsSummary = {
      totalEngagement,
      averageEngagementRate,
      topPerformingPost,
      trendPercentage,
      currentPeriodEngagement,
      previousPeriodEngagement,
      totalPosts: posts.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error in analytics summary:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
