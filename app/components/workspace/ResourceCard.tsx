'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Trash2, Copy, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../src/lib/ui'
import { json, copy } from '../../../src/lib/api'
import AddAnnotationForm from './AddAnnotationForm'

interface Resource {
  id: string
  title: string
  url?: string
  notes?: string
  createdAt: string
  tags?: string[]
  annotationCount?: number
}

interface ResourceCardProps {
  resource: Resource
  onDeleted?: (id: string) => void
  onAnnotationCreated?: (resourceId: string) => void
}

export default function ResourceCard({ resource, onDeleted, onAnnotationCreated }: ResourceCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    setDeleting(true)
    try {
      await json(await fetch(`/api/resources/${resource.id}`, {
        method: 'DELETE',
      }))
      toast.success('Resource deleted')
      onDeleted?.(resource.id)
    } catch (error) {
      toast.error('Failed to delete resource')
      console.error('Delete error:', error)
      setDeleting(false)
    }
  }

  const handleCopyLink = async () => {
    if (!resource.url) {
      toast.error('No URL to copy')
      return
    }

    try {
      await copy(resource.url)
      toast.success('URL copied to clipboard!')
    } catch {
      // Error handling not needed for this case
      toast.error('Failed to copy URL')
    }
  }

  const handleOpenUrl = () => {
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cn(
        "bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6",
        "shadow-lg hover:shadow-zinc-900/50 transition-all duration-200"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex-1 mr-4">
          {resource.title}
        </h3>

        <div className="flex gap-2">
          {resource.url && (
            <>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenUrl}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleDelete}
            disabled={deleting}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "text-zinc-400 hover:text-red-400 hover:bg-red-900/20",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Delete resource"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {resource.url && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 text-sm break-all block mb-3"
        >
          {resource.url}
        </a>
      )}

      {resource.notes && (
        <p className="text-zinc-300 text-sm mb-4 line-clamp-3">
          {resource.notes}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {resource.annotationCount !== undefined && resource.annotationCount > 0 && (
            <div className="flex items-center gap-1 text-zinc-400 text-sm">
              <MessageSquare className="w-4 h-4" />
              {resource.annotationCount} annotation{resource.annotationCount !== 1 ? 's' : ''}
            </div>
          )}

          <span className="text-zinc-500 text-xs">
            {new Date(resource.createdAt).toLocaleDateString()}
          </span>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex gap-2">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-zinc-800/50 text-zinc-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-zinc-500 text-xs">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add annotation section */}
      {!showAnnotationForm && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <button
            onClick={() => setShowAnnotationForm(true)}
            className={cn(
              "flex items-center gap-2 text-emerald-400 hover:text-emerald-300",
              "text-sm font-medium transition-colors"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Add Annotation
          </button>
        </div>
      )}

      {showAnnotationForm && (
        <AddAnnotationForm
          resourceId={resource.id}
          onCreated={() => {
            onAnnotationCreated?.(resource.id)
            setShowAnnotationForm(false)
          }}
          onCancel={() => setShowAnnotationForm(false)}
        />
      )}
    </motion.div>
  )
}