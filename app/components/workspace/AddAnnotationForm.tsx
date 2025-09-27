'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../src/lib/ui'
import { json } from '../../../src/lib/api'

interface AddAnnotationFormProps {
  resourceId: string
  onCreated?: (annotation: { id: string; resourceId: string; body: string; highlights: Array<{ start: number; end: number; text: string }>; createdAt: string }) => void
  onCancel?: () => void
}

export default function AddAnnotationForm({ resourceId, onCreated, onCancel }: AddAnnotationFormProps) {
  const [body, setBody] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setCreating(true)
    try {
      const data = await json<{ id: string; resourceId: string; body: string; highlights: Array<{ start: number; end: number; text: string }>; createdAt: string }>(await fetch(`/api/resources/${resourceId}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body.trim(),
        }),
      }))

      toast.success('Annotation added successfully!')
      setBody('')
      onCreated?.(data)
      onCancel?.()
    } catch (error) {
      toast.error('Failed to add annotation')
      console.error('Create annotation error:', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 border-t border-zinc-800"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Add Annotation
          </h4>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your annotation here..."
          className={cn(
            "w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg",
            "text-zinc-200 placeholder-zinc-500 text-sm resize-none",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500",
            "transition-colors"
          )}
          rows={3}
          required
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={creating || !body.trim()}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
              "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {creating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <MessageSquare className="w-3 h-3" />
            )}
            Add
          </button>
        </div>
      </form>
    </motion.div>
  )
}