'use client'

import Image from 'next/image'
import { ExternalLink, Heart, MessageCircle, Share2, Bookmark, Eye, BarChart3, Instagram } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/lib/stores/dashboard-store'
import { formatNumber, formatDate, formatEngagementRate } from '@/lib/utils'

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

export function PostDetailModal() {
  const { selectedPost, isModalOpen, setIsModalOpen, setSelectedPost } =
    useDashboardStore()

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  if (!selectedPost) return null

  const totalEngagement =
    selectedPost.likes + selectedPost.comments + selectedPost.shares

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedPost.platform === 'instagram' ? (
              <Instagram className="h-5 w-5 text-pink-500" />
            ) : (
              <TikTokIcon className="h-5 w-5" />
            )}
            <span className="capitalize">{selectedPost.platform} Post</span>
          </DialogTitle>
          <DialogDescription>
            Posted on {formatDate(selectedPost.posted_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image section */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {selectedPost.thumbnail_url ? (
              <Image
                src={selectedPost.thumbnail_url}
                alt="Post thumbnail"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
            {selectedPost.media_type === 'video' && (
              <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                Video
              </div>
            )}
            {selectedPost.media_type === 'carousel' && (
              <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                Carousel
              </div>
            )}
          </div>

          {/* Metrics section */}
          <div className="space-y-4">
            {/* Caption */}
            {selectedPost.caption && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                  Caption
                </h4>
                <p className="text-sm">{selectedPost.caption}</p>
              </div>
            )}

            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">Likes</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatNumber(selectedPost.likes)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">Comments</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatNumber(selectedPost.comments)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Shares</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatNumber(selectedPost.shares)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bookmark className="h-4 w-4" />
                  <span className="text-xs">Saves</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatNumber(selectedPost.saves)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">Reach</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatNumber(selectedPost.reach)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs">Impressions</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatNumber(selectedPost.impressions)}
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Engagement
                  </p>
                  <p className="text-xl font-bold">
                    {formatNumber(totalEngagement)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Engagement Rate
                  </p>
                  <p className="text-xl font-bold">
                    {formatEngagementRate(selectedPost.engagement_rate)}
                  </p>
                </div>
              </div>
            </div>

            {/* View on Platform Button */}
            {selectedPost.permalink && (
              <Button asChild className="w-full">
                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on {selectedPost.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
