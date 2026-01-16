import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Post, InsertTables, UpdateTables } from '@/lib/database.types'
import type { Platform, SortColumn, SortDirection } from '@/lib/stores/dashboard-store'

// Query key factory for consistent cache management
export const postsKeys = {
  all: ['posts'] as const,
  lists: () => [...postsKeys.all, 'list'] as const,
  list: (filters: { platform: Platform; sortColumn: SortColumn; sortDirection: SortDirection }) =>
    [...postsKeys.lists(), filters] as const,
  details: () => [...postsKeys.all, 'detail'] as const,
  detail: (id: string) => [...postsKeys.details(), id] as const,
}

interface FetchPostsOptions {
  platform: Platform
  sortColumn: SortColumn
  sortDirection: SortDirection
}

async function fetchPosts({ platform, sortColumn, sortDirection }: FetchPostsOptions): Promise<Post[]> {
  const supabase = createClient()

  let query = supabase.from('posts').select('*')

  // Apply platform filter
  if (platform !== 'all') {
    query = query.eq('platform', platform)
  }

  // Apply sorting
  query = query.order(sortColumn, { ascending: sortDirection === 'asc' })

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  return data ?? []
}

export function usePosts(options: FetchPostsOptions) {
  return useQuery({
    queryKey: postsKeys.list(options),
    queryFn: () => fetchPosts(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch post: ${error.message}`)
      }

      return data
    },
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: InsertTables<'posts'>) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create post: ${error.message}`)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTables<'posts'> }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update post: ${error.message}`)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postsKeys.detail(data.id) })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('posts').delete().eq('id', id)

      if (error) {
        throw new Error(`Failed to delete post: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
  })
}
