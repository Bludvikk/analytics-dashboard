'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Instagram } from 'lucide-react'
import Image from 'next/image'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePosts } from '@/lib/hooks/use-posts'
import { useDashboardStore } from '@/lib/stores/dashboard-store'
import { formatNumber, formatDate, formatEngagementRate, truncateCaption } from '@/lib/utils'
import type { Post } from '@/lib/database.types'

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === 'instagram') {
    return <Instagram className="h-4 w-4 text-pink-500" />
  }
  return <TikTokIcon className="h-4 w-4" />
}

export function PostsTable() {
  const {
    platformFilter,
    sortColumn,
    sortDirection,
    setSorting,
    setSelectedPost,
    setIsModalOpen,
  } = useDashboardStore()

  const { data: posts, isLoading, error } = usePosts({
    platform: platformFilter,
    sortColumn,
    sortDirection,
  })

  const sorting: SortingState = useMemo(
    () => [{ id: sortColumn, desc: sortDirection === 'desc' }],
    [sortColumn, sortDirection]
  )

  const columns: ColumnDef<Post>[] = useMemo(
    () => [
      {
        id: 'thumbnail',
        header: '',
        cell: ({ row }) => (
          <div className="relative h-12 w-12 overflow-hidden rounded">
            {row.original.thumbnail_url ? (
              <Image
                src={row.original.thumbnail_url}
                alt="Post thumbnail"
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'caption',
        header: 'Caption',
        cell: ({ row }) => (
          <span className="max-w-[200px] truncate">
            {truncateCaption(row.original.caption, 50)}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'platform',
        header: 'Platform',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <PlatformIcon platform={row.original.platform} />
            <span className="capitalize">{row.original.platform}</span>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'likes',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc = sortColumn === 'likes' && sortDirection === 'asc'
              setSorting('likes', isAsc ? 'desc' : 'asc')
            }}
            className="-ml-4"
          >
            Likes
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatNumber(row.original.likes),
      },
      {
        accessorKey: 'comments',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc = sortColumn === 'comments' && sortDirection === 'asc'
              setSorting('comments', isAsc ? 'desc' : 'asc')
            }}
            className="-ml-4"
          >
            Comments
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatNumber(row.original.comments),
      },
      {
        accessorKey: 'shares',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc = sortColumn === 'shares' && sortDirection === 'asc'
              setSorting('shares', isAsc ? 'desc' : 'asc')
            }}
            className="-ml-4"
          >
            Shares
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatNumber(row.original.shares),
      },
      {
        accessorKey: 'engagement_rate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc = sortColumn === 'engagement_rate' && sortDirection === 'asc'
              setSorting('engagement_rate', isAsc ? 'desc' : 'asc')
            }}
            className="-ml-4"
          >
            Eng. Rate
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatEngagementRate(row.original.engagement_rate),
      },
      {
        accessorKey: 'posted_at',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc = sortColumn === 'posted_at' && sortDirection === 'asc'
              setSorting('posted_at', isAsc ? 'desc' : 'asc')
            }}
            className="-ml-4"
          >
            Posted
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.posted_at),
      },
    ],
    [sortColumn, sortDirection, setSorting]
  )

  const table = useReactTable({
    data: posts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    manualSorting: true,
  })

  const handleRowClick = (post: Post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        <p>Failed to load posts. Please try again.</p>
      </div>
    )
  }

  if (isLoading) {
    return <PostsTableSkeleton />
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        <p>No posts found. Start creating content to see your analytics!</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => handleRowClick(row.original)}
              className="cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PostsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Caption</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Shares</TableHead>
            <TableHead>Eng. Rate</TableHead>
            <TableHead>Posted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-12 w-12 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
