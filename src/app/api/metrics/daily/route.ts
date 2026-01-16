import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Run at the edge for low latency
export const runtime = 'edge'

export async function GET(request: NextRequest) {
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    const daysParam = searchParams.get('days')

    // Date validation helper
    const isValidDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    }

    let startDate: string
    let endDate: string

    // If explicit date range provided, use that
    if (startDateParam && endDateParam) {
      if (!isValidDate(startDateParam) || !isValidDate(endDateParam)) {
        return NextResponse.json(
          {
            error: 'Invalid Parameter',
            message: 'Dates must be in YYYY-MM-DD format',
          },
          { status: 400 }
        )
      }
      startDate = startDateParam
      endDate = endDateParam
    } else {
      // Fall back to days parameter
      let days = 30 // default
      if (daysParam !== null) {
        const parsedDays = parseInt(daysParam, 10)
        if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
          return NextResponse.json(
            {
              error: 'Invalid Parameter',
              message: 'Days must be a number between 1 and 365',
            },
            { status: 400 }
          )
        }
        days = parsedDays
      }

      // Calculate date range from days
      const now = new Date()
      endDate = now.toISOString().split('T')[0]
      const start = new Date()
      start.setDate(start.getDate() - days)
      startDate = start.toISOString().split('T')[0]
    }

    // Fetch daily metrics (RLS will automatically filter by user)
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (metricsError) {
      console.error('Error fetching daily metrics:', metricsError)
      return NextResponse.json(
        { error: 'Database Error', message: 'Failed to fetch metrics' },
        { status: 500 }
      )
    }

    // Return empty array if no metrics (valid for new users)
    return NextResponse.json(metrics ?? [])
  } catch (error) {
    console.error('Unexpected error in daily metrics:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
