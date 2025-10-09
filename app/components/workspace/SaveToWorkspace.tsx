'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Loader2, Plus, X, Tag, Edit, Info, ExternalLink, BookmarkPlus, Check, Search } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../src/lib/ui'
import { json } from '../../../src/lib/api'

interface Workspace {
  id: string
  title: string
  description?: string
  createdAt?: string
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
  buttonClassName?: string
  showFullModal?: boolean
}

export default function SaveToWorkspace({ 
  result, 
  onSaved, 
  buttonClassName,
  showFullModal = false
}: SaveToWorkspaceProps) {
  const [isOpen, setIsOpen] = useState(showFullModal)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [creatingWorkspace, setCreatingWorkspace] = useState(false)
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('')
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>(result.tags || [])
  const [newTag, setNewTag] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [showMetadataEditor, setShowMetadataEditor] = useState(false)
  const [resourceMetadata, setResourceMetadata] = useState({
    title: result.title,
    description: result.description || '',
    url: result.url,
    type: result.type || 'article',
  })

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaces()
    }
  }, [isOpen])

  const fetchWorkspaces = async () => {
    try {
      const data = await json<Workspace[]>(await fetch('/api/workspaces'))
      setWorkspaces(data)
      // If there's at least one workspace and none selected, select the first one
      if (data.length > 0 && !selectedWorkspaceId) {
        setSelectedWorkspaceId(data[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
      toast.error('Could not load your workspaces')
    }
  }

  const handleSaveToWorkspace = async (workspaceId: string) => {
    setLoading(true)
    try {
      // Extract only the properties that exist in the result object
      const resourceToSave = {
        title: resourceMetadata.title,
        description: resourceMetadata.description,
        url: result.url,
        type: resourceMetadata.type,
        tags: selectedTags
      }
      
      // Add optional properties if they exist in result
      if ('summary' in result) {
        (resourceToSave as any).summary = result.summary
      }
      if ('excerpt' in result) {
        (resourceToSave as any).excerpt = result.excerpt
      }
      if ('favicon' in result) {
        (resourceToSave as any).favicon = result.favicon
      }
      
      const response = await fetch(`/api/workspaces/${workspaceId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceToSave)
      })
      
      await json(response)
      
      toast.success('Resource saved to workspace', {
        description: 'The resource has been saved successfully'
      })
      
      setIsOpen(false)
      onSaved?.()
    } catch (error) {
      console.error('Failed to save resource:', error)
      toast.error('Failed to save resource', {
        description: 'Please try again or check your connection'
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleSave = async () => {
    if (!selectedWorkspaceId) return
    await handleSaveToWorkspace(selectedWorkspaceId)
  }

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceTitle.trim()) return

    setCreatingWorkspace(true)
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newWorkspaceTitle,
          description: newWorkspaceDescription 
        })
      })
      
      const newWorkspace = await json<Workspace>(response)
      
      setWorkspaces(prev => [...prev, newWorkspace])
      setSelectedWorkspaceId(newWorkspace.id)
      setNewWorkspaceTitle('')
      setNewWorkspaceDescription('')
      
      toast.success('Workspace created', {
        description: 'Your new workspace has been created successfully'
      })
      
      // Save the resource to the newly created workspace
      await handleSaveToWorkspace(newWorkspace.id)
    } catch (error) {
      toast.error('Failed to create workspace', {
        description: 'Please try again or check your connection'
      })
      console.error('Create workspace error:', error)
    } finally {
      setCreatingWorkspace(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const filteredWorkspaces = workspaces.filter(workspace => 
    workspace.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg transition-all border border-emerald-600/30 hover:shadow-lg hover:shadow-emerald-500/20 text-xs font-semibold",
          buttonClassName
        )}
      >
        <BookmarkPlus className="w-3.5 h-3.5" />
        <span>Save</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-zinc-100">Save to Workspace</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-400 hover:text-zinc-200 rounded-lg p-2 hover:bg-zinc-800/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                {/* Resource Preview */}
                <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700 rounded-xl p-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <h3 className="font-medium text-lg text-zinc-100 truncate">
                        {resourceMetadata.title}
                      </h3>
                      {resourceMetadata.description && (
                        <p className="text-zinc-300 text-sm line-clamp-2 mt-1">
                          {resourceMetadata.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowMetadataEditor(!showMetadataEditor)}
                      className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Resource Metadata Editor */}
                  <AnimatePresence>
                    {showMetadataEditor && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4"
                      >
                        <div className="border-t border-zinc-700/50 pt-4 space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">
                              Title
                            </label>
                            <input
                              id="title"
                              type="text"
                              value={resourceMetadata.title}
                              onChange={(e) => setResourceMetadata({ ...resourceMetadata, title: e.target.value })}
                              className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                            />
                          </div>
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-1">
                              Description
                            </label>
                            <textarea
                              id="description"
                              value={resourceMetadata.description}
                              onChange={(e) => setResourceMetadata({ ...resourceMetadata, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                            ></textarea>
                          </div>
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-zinc-400 mb-1">
                              Resource Type
                            </label>
                            <select
                              id="type"
                              value={resourceMetadata.type}
                              onChange={(e) => setResourceMetadata({ ...resourceMetadata, type: e.target.value })}
                              className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                            >
                              <option value="article">Article</option>
                              <option value="paper">Research Paper</option>
                              <option value="code">Code Repository</option>
                              <option value="video">Video</option>
                              <option value="book">Book</option>
                              <option value="website">Website</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tags Section */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-400 flex items-center gap-1">
                        <Tag className="w-4 h-4" /> Tags
                      </span>
                      <button
                        onClick={() => setShowTagInput(!showTagInput)}
                        className="text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        {showTagInput ? 'Done' : 'Add Tags'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <div
                          key={tag}
                          className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full flex items-center border border-emerald-500/30"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-emerald-300 hover:text-zinc-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {showTagInput && (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="Add tag..."
                            className="bg-zinc-800/50 border border-zinc-700 text-zinc-100 text-xs px-2 py-1 rounded-l-full focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                          />
                          <button
                            onClick={handleAddTag}
                            className="bg-emerald-600/80 text-zinc-100 text-xs px-2 py-1 rounded-r-full hover:bg-emerald-600 border border-emerald-600/50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Original URL */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 truncate flex-1">{result.url}</span>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-emerald-400 hover:text-emerald-300 p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Search Workspaces */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                  />
                </div>

                {/* Workspace Selection */}
                <div className="space-y-2">
                  {filteredWorkspaces.length === 0 && (
                    <div className="text-zinc-400 text-center py-4">
                      {searchQuery ? 'No matching workspaces found' : 'No workspaces yet'}
                    </div>
                  )}

                  {filteredWorkspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => setSelectedWorkspaceId(workspace.id)}
                      className={cn(
                        "w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors border",
                        selectedWorkspaceId === workspace.id
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/20"
                          : "hover:bg-zinc-800/70 text-zinc-100 border-zinc-800/50"
                      )}
                    >
                      <div>
                        <div className="font-medium">{workspace.title}</div>
                        {workspace.description && (
                          <div className="text-xs text-zinc-400">{workspace.description}</div>
                        )}
                      </div>
                      {selectedWorkspaceId === workspace.id && (
                        <Check className="w-5 h-5 text-emerald-300" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Create New Workspace Form */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <h4 className="text-lg font-medium mb-2 flex items-center gap-2 text-zinc-100">
                    <Plus className="w-5 h-5" /> Create New Workspace
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="workspaceTitle" className="block text-sm text-zinc-400 mb-1">
                        Workspace Title
                      </label>
                      <input
                        id="workspaceTitle"
                        type="text"
                        value={newWorkspaceTitle}
                        onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                        placeholder="My Research Project"
                      />
                    </div>
                    <div>
                      <label htmlFor="workspaceDescription" className="block text-sm text-zinc-400 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        id="workspaceDescription"
                        value={newWorkspaceDescription}
                        onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                        placeholder="What is this workspace about?"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-sm text-zinc-400">
                  <Info className="inline-block w-4 h-4 mr-1" />
                  Save resources to organize your research
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {newWorkspaceTitle ? (
                    <button
                      onClick={handleCreateWorkspace}
                      disabled={!newWorkspaceTitle.trim() || creatingWorkspace}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-zinc-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                      {creatingWorkspace ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Create & Save</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={!selectedWorkspaceId || loading}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-zinc-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}