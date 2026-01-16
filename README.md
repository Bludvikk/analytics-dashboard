# Social Media Analytics Dashboard

A production-quality social media analytics dashboard built with Next.js 15, Supabase, and modern React patterns. Features secure data isolation with Row Level Security (RLS), real-time metrics visualization, and a responsive design.

## Live Demo

[Live](analytics-dashboard-blush-seven.vercel.app)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **UI Components**: shadcn/ui
- **Charts**: shadcn/ui Charts (built on Recharts)
- **Styling**: Tailwind CSS
- **Global State**: Zustand
- **Server State**: TanStack Query (React Query)
- **Table**: TanStack Table
- **Icons**: Lucide React

## Features

- **Secure Authentication**: Email/password authentication with Supabase Auth
- **Data Isolation**: Row Level Security ensures users only see their own data
- **Posts Table**: Sortable, filterable table with platform filter (Instagram/TikTok)
- **Engagement Chart**: shadcn/ui chart with gradient fills, tooltips, and legends
- **Date Range Picker**: Preset options (7/30/90 days, All time) via dropdown select
- **Summary Cards**: Total engagement, average rate, top post, and trend indicators
- **Post Detail Modal**: Click any post to view detailed metrics
- **Responsive Design**: Works on mobile and desktop
- **Edge Functions**: Low-latency API routes for metrics

---

## Architecture Decisions

### Decision 1: Where should engagement metrics be aggregated?

**Choice: Hybrid approach - API Route for summary, Edge Function for chart, client for table**

**Data Flow Architecture:**
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Summary Cards  │────▶│ /api/analytics/  │────▶│    Supabase     │
│                 │     │    summary       │     │   (with RLS)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘

┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Engagement Chart│────▶│ /api/metrics/    │────▶│    Supabase     │
│ (shadcn/ui)     │     │   daily (Edge)   │     │   (with RLS)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘

┌─────────────────┐     ┌──────────────────┐
│  Posts Table    │────▶│    Supabase      │  (Direct client query)
│ (TanStack Table)│     │   (with RLS)     │
└─────────────────┘     └──────────────────┘
```

**Why this split:**

| Component | Data Source | Reasoning |
|-----------|-------------|-----------|
| Summary Cards | API Route | Complex aggregations (trend %, averages) computed server-side |
| Engagement Chart | Edge Function | Low-latency globally, flexible date range params |
| Posts Table | Direct Supabase | Real-time sorting/filtering, RLS handles auth |

**Chart Implementation with shadcn/ui:**
```typescript
// Chart config defines colors via CSS variables
const chartConfig = {
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--chart-1))',  // Blue
  },
  reach: {
    label: 'Reach',
    color: 'hsl(var(--chart-2))',  // Light blue
  },
} satisfies ChartConfig

// ChartContainer provides responsive sizing + theme injection
<ChartContainer config={chartConfig}>
  <AreaChart data={chartData}>
    <defs>
      {/* Gradient fills for area charts */}
      <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-engagement)" stopOpacity={0.8} />
        <stop offset="95%" stopColor="var(--color-engagement)" stopOpacity={0.1} />
      </linearGradient>
    </defs>
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Area dataKey="engagement" fill="url(#fillEngagement)" />
  </AreaChart>
</ChartContainer>
```

**Trade-offs:**

| Aspect | Benefit | Cost |
|--------|---------|------|
| Performance | Heavy calculations on server | Multiple request patterns |
| Caching | Query-key based invalidation | Cache coordination complexity |
| Security | Server validates all requests | More surface area to secure |
| Latency | Edge functions for speed | Initial load has waterfall |
| Theming | CSS variables for consistent colors | Requires CSS setup |

---

### Decision 2: State Management Mapping (Zustand vs TanStack Query vs URL)

| State | Location | Why This Location? |
|-------|----------|-------------------|
| Platform filter | **Zustand** | UI-only, changes frequently, no persistence needed |
| Sort column/direction | **Zustand** | UI state affecting query params |
| Selected post (modal) | **Zustand** | Ephemeral, clears on modal close |
| Chart type (line/area) | **Zustand** | User preference, instant toggle |
| **Date range** | **Zustand** | UI state that affects chart query params |
| Modal open state | **Zustand** | UI state for modal visibility |
| Posts data | **TanStack Query** | Server state, caching/refetching/deduplication |
| Daily metrics | **TanStack Query** | Server state, keyed by date range for cache |
| Analytics summary | **TanStack Query** | Server state from API route, cached |

**Why NOT URL state for this dashboard:**
- **Personal dashboard**: RLS-scoped data can't be shared via URL anyway
- **No deep linking need**: Users don't bookmark specific filter states
- **Simpler implementation**: No URL parsing/serialization complexity
- **Better UX**: Filters reset on reload (expected for private dashboards)

**When URL state WOULD be appropriate:**
- Team dashboards with shareable filtered views
- Public analytics pages
- If adding "share this view" feature

**Why Zustand over React Context:**
```typescript
// Zustand: No provider needed, synchronous updates
const { dateRange, setDateRangePreset } = useDashboardStore()

// vs Context: Requires provider wrapping, potential re-render issues
const { dateRange, setDateRange } = useContext(DashboardContext)
```

**Query Key Factory Pattern for TanStack Query:**
```typescript
export const metricsKeys = {
  all: ['metrics'] as const,
  daily: () => [...metricsKeys.all, 'daily'] as const,
  dailyDateRange: (startDate: string, endDate: string) =>
    [...metricsKeys.daily(), { startDate, endDate }] as const,
  summary: () => [...metricsKeys.all, 'summary'] as const,
}
```
This enables automatic cache invalidation when date range changes.

---

### Decision 3: Empty State Handling

**Strategy: Actionable empty states with date range picker as solution**

**The Problem:**
Users with historical data outside the default "Last 30 days" view see empty charts. Rather than just showing "no data," we provide tools to find their data.

**Solution: Date Range Picker + Helpful Messaging**

| Component | Empty State | Action Available |
|-----------|-------------|-----------------|
| Posts Table | "No posts found. Start creating content!" | Platform filter available |
| Engagement Chart | "No data for selected range. Try 'All time'" | **Date range picker** with presets |
| Summary Cards | Shows zeros with "No data yet" | - |
| API Routes | Returns valid empty response with 200 | - |

**Empty State Message in Chart:**
```tsx
<div className="text-center">
  <p>No engagement data available for the selected date range.</p>
  <p className="mt-2 text-sm">
    Try selecting a different date range or "All time" to see historical data.
  </p>
</div>
```

**How the seed data demonstrates this:**
```
User A (testuser1):
├── Posts: March 2024 dates
├── Daily Metrics: Feb-Mar 2024 dates
└── Default view: Empty chart (last 30 days has no data)
    └── Select "All time" → Reveals historical data ✓

User B (testuser2):
├── Posts: January 2026 dates (current)
├── Daily Metrics: Dec 2025 - Jan 2026
└── Default view: Populated chart ✓
```

**API Response for empty results:**
```json
{
  "totalEngagement": 0,
  "averageEngagementRate": 0,
  "topPerformingPost": null,
  "trendPercentage": 0,
  "totalPosts": 0
}
```
Returns 200 status (not 404) - empty is a valid state, not an error.

---

### Decision 4: Trend Percentage Calculation

**Choice: Last 7 days vs. previous 7 days comparison**

**Formula:**
```typescript
const trendPercentage = previousPeriod === 0
  ? (currentPeriod > 0 ? 100 : 0)
  : ((currentPeriod - previousPeriod) / previousPeriod) * 100
```

**Visual Timeline:**
```
Day:  -14  -13  -12  -11  -10  -9  -8  │  -7   -6   -5   -4   -3   -2   -1   Today
      └──────── Previous 7 days ───────┘  └────────── Current 7 days ──────────┘
              (comparison baseline)               (what we're measuring)
```

**Why 7-day comparison:**
- **Weekly cycle alignment**: Content performance often follows weekly patterns
- **Meaningful trends**: Long enough to smooth daily variance
- **Recent enough**: Captures actual recent changes, not stale trends
- **Industry standard**: Common in social media analytics tools

**Edge Case Handling:**

| Scenario | Previous | Current | Result | Reasoning |
|----------|----------|---------|--------|-----------|
| New growth | 0 | 1000 | +100% | Any growth from zero is significant |
| No data | 0 | 0 | 0% | No change to report |
| Decline | 1000 | 500 | -50% | Standard calculation |
| Growth | 500 | 750 | +50% | Standard calculation |

**Display in UI:**
- Positive: Green up arrow with "+X%"
- Negative: Red down arrow with "-X%"
- Zero: Gray dash

---

## Project Structure

```
analytics-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/summary/route.ts   # Summary metrics API
│   │   │   └── metrics/daily/route.ts       # Edge function for daily metrics
│   │   ├── auth/
│   │   │   ├── page.tsx                     # Login/signup page
│   │   │   └── callback/route.ts            # Auth callback handler
│   │   ├── dashboard/
│   │   │   ├── page.tsx                     # Dashboard server component
│   │   │   └── dashboard-content.tsx        # Dashboard client component
│   │   ├── layout.tsx
│   │   ├── page.tsx                         # Redirects to auth/dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                              # shadcn/ui components
│   │   │   ├── chart.tsx                    # shadcn/ui chart wrapper
│   │   │   ├── button.tsx, card.tsx, etc.   # Core UI components
│   │   ├── posts/
│   │   │   ├── posts-table.tsx              # TanStack Table implementation
│   │   │   ├── platform-filter.tsx          # Platform dropdown
│   │   │   └── post-detail-modal.tsx        # Radix Dialog modal
│   │   ├── charts/
│   │   │   ├── engagement-chart.tsx         # shadcn/ui area/line chart
│   │   │   └── summary-cards.tsx            # Metrics cards
│   │   └── providers/
│   │       └── query-provider.tsx           # TanStack Query provider
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts                    # Browser client
│       │   ├── server.ts                    # Server client
│       │   └── middleware.ts                # Auth middleware
│       ├── stores/
│       │   └── dashboard-store.ts           # Zustand store
│       ├── hooks/
│       │   ├── use-posts.ts                 # Posts query hooks
│       │   └── use-metrics.ts               # Metrics query hooks
│       ├── database.types.ts                # TypeScript types
│       └── utils.ts                         # Utility functions
├── supabase/
│   ├── migrations/
│   │   └── 20240101000000_initial_schema.sql
│   └── seed.sql                             # Sample data for 2 users
└── .env.example
```

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd analytics-dashboard
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### 3. Configure Environment

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Database Migrations

Option A - Using Supabase CLI:
```bash
npx supabase link --project-ref <your-project-id>
npx supabase db push
```

Option B - Using Supabase Dashboard:
1. Go to SQL Editor in your Supabase dashboard
2. Copy contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Run the SQL

### 5. Create Test Users

1. Go to Authentication > Users in Supabase dashboard
2. Create two test users:
   - `test1@example.com` / `password123`
   - `test2@example.com` / `password123`
3. Note the user IDs from the users table

### 6. Seed Sample Data

1. Update `supabase/seed.sql` with the actual user IDs
2. Run the seed SQL in Supabase SQL Editor

### 7. Generate TypeScript Types (Optional)

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/database.types.ts
```

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

```sql
-- Users can only SELECT their own data
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can only INSERT data where user_id matches
CREATE POLICY "Users can create own posts" ON posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for UPDATE and DELETE
```

### Environment Security

- `SUPABASE_SERVICE_ROLE_KEY` is server-only (never exposed to client)
- All API routes verify authentication before returning data
- Middleware protects routes requiring authentication

### API Route Validation

All API routes:
1. Verify Supabase session
2. Return 401 for unauthenticated requests
3. Validate query parameters
4. Handle errors with appropriate HTTP status codes

---

## Testing RLS

### Verify Data Isolation

1. Log in as `test1@example.com`
2. Verify you only see User A's posts
3. Log out and log in as `test2@example.com`
4. Verify you only see User B's posts

### Verify API Security

```bash
# Without auth - should return 401
curl http://localhost:3000/api/analytics/summary

# With invalid token - should return 401
curl -H "Authorization: Bearer invalid" http://localhost:3000/api/analytics/summary
```

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Vercel

Add these in Settings > Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## What I'd Improve With More Time

1. **Add Pagination**: Implement cursor-based pagination for posts table
2. **Add Date Range Filter**: Allow filtering posts by date range
3. **Add Data Export**: CSV/PDF export of analytics
4. **Add Real-time Updates**: Use Supabase realtime for live metrics
5. **Add Dark Mode**: Theme toggle with system preference detection
6. **Add Error Boundaries**: Better error handling with fallback UI
7. **Add Unit Tests**: Jest tests for utility functions and hooks
8. **Add E2E Tests**: Playwright tests for critical user flows
9. **Add Visx Charts**: Replace Recharts with Visx for better customization
10. **Add Skeleton Animations**: More polished loading states

---

## License

MIT
