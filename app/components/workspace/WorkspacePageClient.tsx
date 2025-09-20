'use client'

import { motion } from 'framer-motion'
import WorkspaceHeader from './WorkspaceHeader'
import ResourceCard from './ResourceCard'
import AddResourceForm from './AddResourceForm'
import ShareLinksPanel from './ShareLinksPanel'
import ToastProvider from '../ui/ToastProvider'

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
  workspaceData: Workspace
}

export default function WorkspacePageClient({ workspaceData }: WorkspacePageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <ToastProvider />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <WorkspaceHeader id={workspaceData.id} title={workspaceData.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Resources Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-zinc-100 mb-6">Resources</h2>

              <AddResourceForm
                workspaceId={workspaceData.id}
                onCreated={() => {
                  // This will trigger a re-fetch on the client side
                  window.location.reload()
                }}
              />
            </motion.div>

            {workspaceData.resources.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center py-12 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl"
              >
                <div className="text-zinc-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No resources yet</h3>
                <p className="text-zinc-500 text-sm max-w-md mx-auto">
                  Add your first resource using the form above, or save resources from the search page.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
                className="space-y-4"
              >
                {workspaceData.resources.map((resource: Resource) => (
                  <motion.div
                    key={resource.id}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  >
                    <ResourceCard
                      resource={resource}
                      onDeleted={() => {
                        // This will trigger a re-fetch on the client side
                        window.location.reload()
                      }}
                      onAnnotationCreated={() => {
                        // This will trigger a re-fetch on the client side
                        window.location.reload()
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Share Links Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ShareLinksPanel workspaceId={workspaceData.id} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}