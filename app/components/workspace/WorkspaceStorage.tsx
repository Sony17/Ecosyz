'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Filter, Loader2, Edit2, Trash2, FileText, Link as LinkIcon,
  LayoutGrid, List, Clock, Tag, Search, Check, Download, ChevronRight,
  File, Image, FileArchive, Music, Video, Code, PanelLeft, Bookmark
} from 'lucide-react';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'link' | 'file' | 'note' | 'image' | 'document' | 'code' | 'other';
  url?: string;
  content?: string;
  fileType?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  workspaceId: string;
}

interface WorkspaceStorageProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string | null;
  onResourceSelected?: (resourceId: string) => void;
}

export default function WorkspaceStorage({ 
  isOpen, 
  onClose, 
  workspaceId,
  onResourceSelected
}: WorkspaceStorageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editResourceId, setEditResourceId] = useState<string | null>(null);
  const [editResourceTitle, setEditResourceTitle] = useState('');
  const [editResourceDescription, setEditResourceDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchResources();
    }
  }, [isOpen, workspaceId]);

  useEffect(() => {
    if (searchQuery.trim() === '' && !selectedType && !selectedTag) {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(resource => {
        const matchesQuery = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = selectedType ? resource.type === selectedType : true;
        
        const matchesTag = selectedTag ? resource.tags?.includes(selectedTag) : true;
        
        return matchesQuery && matchesType && matchesTag;
      });
      setFilteredResources(filtered);
    }
  }, [searchQuery, selectedType, selectedTag, resources]);

  const fetchResources = async () => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/workspaces/${workspaceId}/resources`);
      // const data = await response.json();
      
      // Mock data for demo
      setTimeout(() => {
        const mockResources: Resource[] = [
          {
            id: 'r1',
            title: 'Research Paper on AI Ethics',
            description: 'Academic paper discussing ethical implications of AI',
            type: 'document',
            url: 'https://example.com/paper.pdf',
            fileType: 'pdf',
            tags: ['research', 'ai', 'ethics'],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            workspaceId: workspaceId
          },
          {
            id: 'r2',
            title: 'Market Analysis Dashboard',
            description: 'Interactive dashboard showing market trends',
            type: 'link',
            url: 'https://example.com/dashboard',
            tags: ['dashboard', 'analytics', 'market'],
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            workspaceId: workspaceId
          },
          {
            id: 'r3',
            title: 'Project Roadmap',
            description: 'Q4 product development roadmap',
            type: 'image',
            url: 'https://example.com/roadmap.png',
            fileType: 'png',
            tags: ['roadmap', 'planning', 'product'],
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            workspaceId: workspaceId
          },
          {
            id: 'r4',
            title: 'Meeting Notes',
            description: 'Notes from the weekly team meeting',
            type: 'note',
            content: 'Discussed project timeline and resource allocation',
            tags: ['meeting', 'notes', 'team'],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            workspaceId: workspaceId
          },
          {
            id: 'r5',
            title: 'Authentication Service Code',
            description: 'Source code for the authentication microservice',
            type: 'code',
            url: 'https://github.com/example/auth-service',
            tags: ['code', 'auth', 'service'],
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            workspaceId: workspaceId
          }
        ];
        
        setResources(mockResources);
        setFilteredResources(mockResources);
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
      setIsLoading(false);
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editResourceId || !editResourceTitle.trim()) {
      toast.error('Resource title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/resources/${editResourceId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: editResourceTitle,
      //     description: editResourceDescription,
      //   }),
      // });
      
      // Mock update for demo
      setTimeout(() => {
        setResources(prev => prev.map(resource => 
          resource.id === editResourceId 
            ? { 
                ...resource, 
                title: editResourceTitle, 
                description: editResourceDescription,
                updatedAt: new Date().toISOString()
              }
            : resource
        ));
        
        setEditResourceId(null);
        setEditResourceTitle('');
        setEditResourceDescription('');
        toast.success('Resource updated successfully!');
        setIsSubmitting(false);
      }, 800);
      
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource');
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        // In a real app, this would be a fetch to your API
        // const response = await fetch(`/api/resources/${resourceId}`, {
        //   method: 'DELETE',
        // });
        
        // Mock delete for demo
        setTimeout(() => {
          setResources(prev => prev.filter(resource => resource.id !== resourceId));
          toast.success('Resource deleted successfully!');
        }, 500);
        
      } catch (error) {
        console.error('Error deleting resource:', error);
        toast.error('Failed to delete resource');
      }
    }
  };

  const handleSelectResource = (resourceId: string) => {
    if (onResourceSelected) {
      onResourceSelected(resourceId);
    }
    onClose();
  };

  const startEditResource = (resource: Resource) => {
    setEditResourceId(resource.id);
    setEditResourceTitle(resource.title);
    setEditResourceDescription(resource.description || '');
  };

  const allTags = [...new Set(resources.flatMap(resource => resource.tags || []))];
  
  const resourceTypes = [
    { id: 'document', label: 'Documents', icon: FileText },
    { id: 'link', label: 'Links', icon: LinkIcon },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'note', label: 'Notes', icon: FileText },
    { id: 'code', label: 'Code', icon: Code }
  ];

  const getResourceIcon = (type: string, fileType?: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-full h-full p-3 text-amber-400" />;
      case 'link':
        return <LinkIcon className="w-full h-full p-3 text-blue-400" />;
      case 'image':
        return <Image className="w-full h-full p-3 text-emerald-400" />;
      case 'note':
        return <FileText className="w-full h-full p-3 text-violet-400" />;
      case 'code':
        return <Code className="w-full h-full p-3 text-red-400" />;
      case 'file':
        if (fileType?.includes('audio')) return <Music className="w-full h-full p-3 text-yellow-400" />;
        if (fileType?.includes('video')) return <Video className="w-full h-full p-3 text-pink-400" />;
        if (fileType?.includes('zip') || fileType?.includes('rar')) return <FileArchive className="w-full h-full p-3 text-orange-400" />;
        return <File className="w-full h-full p-3 text-gray-400" />;
      default:
        return <File className="w-full h-full p-3 text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-100">Workspace Storage</h2>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <div className="w-64 border-r border-zinc-800 p-4 overflow-y-auto flex flex-col">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Resource Type</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedType(null)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                        selectedType === null ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                      } transition-colors`}
                    >
                      <span>All Resources</span>
                      {selectedType === null && <ChevronRight className="w-4 h-4" />}
                    </button>
                    
                    {resourceTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                          selectedType === type.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                        {selectedType === type.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                {allTags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-zinc-300 mb-2">Tags</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedTag(null)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                          selectedTag === null ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                        } transition-colors`}
                      >
                        <span>All Tags</span>
                        {selectedTag === null && <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                            selectedTag === tag ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            <span>{tag}</span>
                          </div>
                          {selectedTag === tag && <ChevronRight className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Search and View Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setView('grid')}
                      className={`p-2 rounded-md ${view === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={`p-2 rounded-md ${view === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Resources Display */}
                <div className={`${isLoading ? 'flex justify-center items-center py-12' : ''}`}>
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                      <p className="text-zinc-400">Loading resources...</p>
                    </div>
                  ) : filteredResources.length > 0 ? (
                    <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                      {filteredResources.map(resource => (
                        <div 
                          key={resource.id}
                          className={`
                            ${view === 'grid' 
                              ? 'bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden'
                              : 'bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden'
                            }
                            transition-all hover:border-zinc-600
                          `}
                        >
                          {editResourceId === resource.id ? (
                            <form onSubmit={handleUpdateResource} className="p-4">
                              <div className="mb-3">
                                <label htmlFor="title" className="block text-xs font-medium text-zinc-400 mb-1">
                                  Resource Title
                                </label>
                                <input
                                  id="title"
                                  type="text"
                                  value={editResourceTitle}
                                  onChange={(e) => setEditResourceTitle(e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Enter resource title"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label htmlFor="description" className="block text-xs font-medium text-zinc-400 mb-1">
                                  Description (Optional)
                                </label>
                                <textarea
                                  id="description"
                                  value={editResourceDescription}
                                  onChange={(e) => setEditResourceDescription(e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                  placeholder="Enter resource description"
                                  rows={3}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditResourceId(null)}
                                  className="px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-md text-sm transition-colors hover:bg-zinc-600"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-sm transition-colors hover:bg-emerald-700 flex items-center gap-1 disabled:opacity-50"
                                >
                                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                  Save
                                </button>
                              </div>
                            </form>
                          ) : view === 'grid' ? (
                            // Grid View
                            <div>
                              <div className="flex items-center justify-center h-32 bg-zinc-900">
                                {getResourceIcon(resource.type, resource.fileType)}
                              </div>
                              
                              <div className="p-4">
                                <h3 className="text-zinc-200 font-medium mb-1 truncate">{resource.title}</h3>
                                <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{resource.description || 'No description'}</p>
                                
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Updated {new Date(resource.updatedAt).toLocaleDateString()}</span>
                                </div>
                                
                                {resource.tags && resource.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {resource.tags.map(tag => (
                                      <span 
                                        key={tag}
                                        className="px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-md text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex border-t border-zinc-700 bg-zinc-800">
                                {resource.url && (
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors flex justify-center items-center gap-1"
                                  >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    Open
                                  </a>
                                )}
                                {!resource.url && (
                                  <button
                                    onClick={() => handleSelectResource(resource.id)}
                                    className="flex-1 py-2 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors"
                                  >
                                    View
                                  </button>
                                )}
                                <button
                                  onClick={() => startEditResource(resource)}
                                  className="flex-1 py-2 text-zinc-300 hover:bg-zinc-700 border-l border-zinc-700 text-sm transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="flex-1 py-2 text-red-400 hover:bg-red-500/10 border-l border-zinc-700 text-sm transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            // List View
                            <div className="p-3 flex items-center">
                              <div className="w-10 h-10 rounded-md bg-zinc-900 flex-shrink-0 flex items-center justify-center">
                                {getResourceIcon(resource.type, resource.fileType)}
                              </div>
                              
                              <div className="ml-3 flex-grow">
                                <h3 className="text-zinc-200 font-medium truncate">{resource.title}</h3>
                                <p className="text-zinc-400 text-sm truncate">{resource.description || 'No description'}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(resource.updatedAt).toLocaleDateString()}</span>
                                  </div>
                                  {resource.tags && resource.tags.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                                      <Tag className="w-3.5 h-3.5" />
                                      <span>{resource.tags.join(', ')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2 ml-3">
                                {resource.url && (
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                                    title="Open Link"
                                  >
                                    <LinkIcon className="w-4 h-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => startEditResource(resource)}
                                  className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                                  title="Edit Resource"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete Resource"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                      <h3 className="text-zinc-300 text-lg font-medium mb-1">No resources found</h3>
                      <p className="text-zinc-500 mb-4">
                        {searchQuery || selectedType || selectedTag 
                          ? 'Try adjusting your search or filters'
                          : 'Add resources to this workspace to get started'}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedType(null);
                          setSelectedTag(null);
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md inline-flex items-center gap-2 transition-colors"
                      >
                        {searchQuery || selectedType || selectedTag ? 'Clear filters' : 'Add Resource'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}