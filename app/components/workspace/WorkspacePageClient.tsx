'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, FileText, MessageCircle } from 'lucide-react'
import WorkspaceHeader from './WorkspaceHeader'
import ResourceCard from './ResourceCard'
import AddResourceForm from './AddResourceForm'
import ShareLinksPanel from './ShareLinksPanel'
import ToastProvider from '../ui/ToastProvider'
import WorkspaceChat from '../ai/EnhancedWorkspaceChat'

interface Resource {
  id: string
  title: string
  url?: string
  notes?: string
  createdAt: string
  tags?: string[]
  annotations: { id: string; body: string; createdAt: string }[]
  annotationCount?: number
}

interface Workspace {
  id: string
  title: string
  resources: Resource[]
  shareLinks: { id: string; token: string; createdAt: string; expiresAt?: string }[]
}

interface WorkspacePageClientProps {
  workspace?: Workspace | null
}

export default function WorkspacePageClient({ workspace }: WorkspacePageClientProps) {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <p className="text-gray-400">Select a workspace or create a new one</p>
      </div>
    )
  }

  // Ensure we have arrays even if undefined
  const resources = workspace.resources || []
  const shareLinks = workspace.shareLinks || []

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <ToastProvider />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <WorkspaceHeader
          title={workspace.title}
          id={workspace.id}
        />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Resources</h2>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>

          {/* Resources Grid */}
          {resources.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl">
              <div className="mb-4">
                <FileText className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No resources yet</h3>
              <p className="text-gray-400 text-sm mb-6">
                Add your first resource to get started
              </p>
              <button
                onClick={() => setShowAddResourceModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Resource
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  workspaceId={workspace.id}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat button - fixed at the bottom right */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setShowChat(!showChat)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
          title={showChat ? "Close chat" : "Open AI assistant"}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Chat panel - slide in from the right when active */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: showChat ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed right-0 bottom-0 w-full md:w-96 h-[600px] max-h-[80vh] shadow-2xl rounded-tl-2xl overflow-hidden z-20"
      >
        <WorkspaceChat
          workspaceId={workspace.id}
          context={{
            currentPage: 'workspace',
            selectedText: undefined,
            recentActions: []
          }}
        />
      </motion.div>

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <AddResourceForm
          workspaceId={workspace.id}
          onCreated={() => setShowAddResourceModal(false)}
          onClose={() => setShowAddResourceModal(false)}
        />
      )}
    </div>
  )
}