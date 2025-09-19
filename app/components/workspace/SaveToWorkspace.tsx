'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../src/lib/ui'
import { json } from '../../../src/lib/api'

interface Workspace {
  id: string
  title: string
}

interface SaveToWorkspaceProps {
  result: {
    title: string
    url: string
    type?: string
    tags?: string[]
    description?: string
    authors?: string[]
    year?: string
    source?: string
  }
  onSaved?: () => void
}

export default function SaveToWorkspace({ result, onSaved }: SaveToWorkspaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [creatingWorkspace, setCreatingWorkspace] = useState(false)
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaces()
    }
  }, [isOpen])

  const fetchWorkspaces = async () => {
    try {
      const data = await json<Workspace[]>(await fetch('/api/workspaces'))
      setWorkspaces(data)
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    }
  }

  const handleSave = async () => {
    if (!selectedWorkspaceId) return

    setLoading(true)
    try {
      await json(await fetch(`/api/workspaces/${selectedWorkspaceId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          url: result.url,
          type: result.type,
          tags: result.tags,
          data: {
            description: result.description,
            authors: result.authors,
            year: result.year,
            source: result.source,
            snippet: result.description,
          },
        }),
      }))

      toast.success(`Saved "${result.title}" to workspace!`)
      setIsOpen(false)
      onSaved?.()
    } catch (error) {
      toast.error('Failed to save to workspace')
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceTitle.trim()) return

    setCreatingWorkspace(true)
    try {
      const data = await json<{ id: string }>(await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newWorkspaceTitle.trim() }),
      }))

      // Add the new workspace to the list and select it
      const newWorkspace = { id: data.id, title: newWorkspaceTitle.trim() }
      setWorkspaces(prev => [...prev, newWorkspace])
      setSelectedWorkspaceId(data.id)
      setNewWorkspaceTitle('')
      toast.success('Workspace created!')
    } catch (error) {
      toast.error('Failed to create workspace')
      console.error('Create workspace error:', error)
    } finally {
      setCreatingWorkspace(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "px-4 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300",
          "rounded-lg text-xs font-semibold border border-emerald-600/30",
          "hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        )}
      >
        <Save className="w-3 h-3 inline mr-1" />
        Save
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl",
                "shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-zinc-100">Save to Workspace</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-zinc-300 mb-2">Select a workspace:</p>
                  <select
                    value={selectedWorkspaceId}
                    onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg",
                      "text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    )}
                  >
                    <option value="">Choose a workspace...</option>
                    {workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-zinc-300 mb-2">Or create a new workspace:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                      placeholder="New workspace title..."
                      className={cn(
                        "flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg",
                        "text-zinc-100 placeholder-zinc-400",
                        "focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                      )}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                    />
                    <button
                      onClick={handleCreateWorkspace}
                      disabled={creatingWorkspace || !newWorkspaceTitle.trim()}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-all",
                        "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300",
                        "border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {creatingWorkspace ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 mb-6 p-3 bg-zinc-800/30 rounded-lg">
                  <strong>{result.title}</strong>
                  {result.url && (
                    <div className="mt-1 truncate">{result.url}</div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                      "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-300 border border-zinc-600/30"
                    )}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={loading || !selectedWorkspaceId}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
                      "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300",
                      "border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}