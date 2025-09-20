'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Share, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn, useDebouncedCallback } from '../../../src/lib/ui'
import { json } from '../../../src/lib/api'
import { copy } from '../../../src/lib/clipboard'

interface ShareLink {
  id: string
  token: string
  createdAt: string
  expiresAt?: string
}

interface WorkspaceHeaderProps {
  id: string
  title: string
}

export default function WorkspaceHeader({ id, title: initialTitle }: WorkspaceHeaderProps) {
  const [title, setTitle] = useState(initialTitle)
  const [saving, setSaving] = useState(false)
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [creatingShare, setCreatingShare] = useState(false)

  // Fetch share links on mount
  useEffect(() => {
    fetchShareLinks()
  }, [id])

  const fetchShareLinks = useCallback(async () => {
    try {
      const data = await json<ShareLink[]>(await fetch(`/api/workspaces/${id}/share`))
      setShareLinks(data)
    } catch (error) {
      console.error('Failed to fetch share links:', error)
    }
  }, [id])

  const saveTitle = useCallback(async (newTitle: string) => {
    if (newTitle.trim() === initialTitle) return

    setSaving(true)
    try {
      await json(await fetch(`/api/workspaces/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      }))
      toast.success('Workspace title saved')
    } catch (error) {
      toast.error('Failed to save title')
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }, [id, initialTitle])

  const debouncedSave = useDebouncedCallback(saveTitle, 600)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedSave(newTitle)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      saveTitle(title)
    }
  }

  const createShareLink = async () => {
    setCreatingShare(true)
    try {
      const data = await json<{ token: string }>(await fetch(`/api/workspaces/${id}/share`, {
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
      setCreatingShare(false)
    }
  }

  const copyLatestShareUrl = async () => {
    if (shareLinks.length === 0) {
      toast.error('No share links available')
      return
    }

    const latest = shareLinks[0] // Assuming sorted by creation date
    const shareUrl = `${window.location.origin}/share/${latest.token}`
    try {
      await copy(shareUrl)
      toast.success('Share URL copied to clipboard!')
    } catch {
      // Error already handled by fetchShareLinks
      toast.error('Failed to copy URL')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl" />

      <div className="relative bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full text-2xl font-bold bg-transparent border-none outline-none",
                "text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text",
                "placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500/60 rounded-lg px-3 py-2"
              )}
              placeholder="Workspace title..."
            />
            {saving && (
              <div className="flex items-center mt-2 text-sm text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={createShareLink}
              disabled={creatingShare}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30",
                "hover:shadow-lg hover:shadow-emerald-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {creatingShare ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share className="w-4 h-4" />
              )}
              Create Share Link
            </button>

            {shareLinks.length > 0 && (
              <button
                onClick={copyLatestShareUrl}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                  "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-300 border border-zinc-600/30",
                  "hover:shadow-lg hover:shadow-zinc-900/50"
                )}
              >
                <Copy className="w-4 h-4" />
                Copy Latest Share URL
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          Press <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">⌘S</kbd> or <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">Ctrl+S</kbd> to save
        </div>
      </div>
    </motion.div>
  )
}