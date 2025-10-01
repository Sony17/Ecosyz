'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Share, Copy, Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../src/lib/ui'
import { json, copy } from '../../../src/lib/api'

interface ShareLink {
  id: string
  token: string
  createdAt: string
  expiresAt?: string
}

interface ShareLinksPanelProps {
  workspaceId: string
  onClose: () => void
}

export default function ShareLinksPanel({ workspaceId }: ShareLinksPanelProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchShareLinks = useCallback(async () => {
    try {
      const data = await json<ShareLink[]>(await fetch(`/api/workspaces/${workspaceId}/share`))
      setShareLinks(data)
    } catch (error) {
      console.error('Failed to fetch share links:', error)
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  const createShareLink = async () => {
    setCreating(true)
    try {
      const data = await json<{ token: string }>(await fetch(`/api/workspaces/${workspaceId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }))

      const shareUrl = `${window.location.origin}/share/${data.token}`
      await copy(shareUrl)
      toast.success('Share link created and copied to clipboard!')
      fetchShareLinks()
    } catch (error) {
      toast.error('Failed to create share link')
      console.error('Share creation error:', error)
    } finally {
      setCreating(false)
    }
  }

  const copyShareUrl = async (token: string) => {
    const shareUrl = `${window.location.origin}/share/${token}`
    try {
      await copy(shareUrl)
      toast.success('Share URL copied to clipboard!')
    } catch {
      // Error already handled by fetchShareLinks
      toast.error('Failed to copy URL')
    }
  }

  const openShareUrl = (token: string) => {
    window.open(`${window.location.origin}/share/${token}`, '_blank', 'noopener,noreferrer')
  }

  // Fetch share links on mount and when workspaceId changes
  useEffect(() => {
    fetchShareLinks()
  }, [fetchShareLinks])

  if (loading) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-800/50 rounded mb-4"></div>
          <div className="h-4 bg-zinc-800/50 rounded mb-2"></div>
          <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6",
        "shadow-lg hover:shadow-zinc-900/50 transition-all duration-200"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
          <Share className="w-5 h-5" />
          Share Links
        </h2>

        <button
          onClick={createShareLink}
          disabled={creating}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30",
            "hover:shadow-lg hover:shadow-emerald-500/20",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share className="w-4 h-4" />
          )}
          Create Link
        </button>
      </div>

      {shareLinks.length === 0 ? (
        <div className="text-center py-8">
          <Share className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">
            No share links created yet.
            <br />
            Create one to share your workspace publicly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shareLinks.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-zinc-800/50 border border-zinc-700 rounded-lg p-4",
                "hover:bg-zinc-800/70 transition-colors"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Share className="w-4 h-4" />
                  <span className="text-sm font-medium">Share Link</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyShareUrl(link.token)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                    )}
                    title="Copy share URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openShareUrl(link.token)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                    )}
                    title="Open share page"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-zinc-500 font-mono bg-zinc-900/50 p-2 rounded break-all">
                {window.location.origin}/share/{link.token}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                {link.expiresAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires {new Date(link.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}