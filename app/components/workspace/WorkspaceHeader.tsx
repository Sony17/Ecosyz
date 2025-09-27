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

  const fetchShareLinks = useCallback(async () => {
    try {
      const data = await json<ShareLink[]>(await fetch(`/api/workspaces/${id}/share`))
      setShareLinks(data)
    } catch (error) {
      console.error('Failed to fetch share links:', error)
    }
  }, [id])
  
  // Fetch share links on mount
  useEffect(() => {
    fetchShareLinks()
  }, [fetchShareLinks])

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
      await fetchShareLinks()
      toast.success('Share link copied to clipboard')
    } catch (error) {
      toast.error('Failed to create share link')
      console.error('Create share link error:', error)
    } finally {
      setCreatingShare(false)
    }
  }

  return (
    <header className="mb-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          placeholder="Untitled Workspace"
          className={cn(
            "flex-1 px-0 py-1 text-xl font-medium bg-transparent border-0 outline-none focus:outline-none",
            saving && "opacity-50"
          )}
          disabled={saving}
        />
        {saving && <Loader2 className="h-5 w-5 animate-spin opacity-50" />}
      </div>
      <motion.div
        className="mt-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={createShareLink}
          disabled={creatingShare}
          className={cn(
            "flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-300 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100",
            creatingShare && "opacity-50"
          )}
        >
          <Share className="h-4 w-4" />
          Share
          {creatingShare && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
        </button>

        {shareLinks.map(link => (
          <button
            key={link.id}
            onClick={() => copy(`${window.location.origin}/share/${link.token}`)}
            className="flex items-center gap-1 text-sm text-neutral-400 dark:text-neutral-500 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <Copy className="h-3 w-3" />
            {new Date(link.createdAt).toLocaleDateString()}
          </button>
        ))}
      </motion.div>
    </header>
  )
}