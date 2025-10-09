'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FolderPlus, Loader2, Edit2, Trash2, FileText, 
  LayoutGrid, Clock, Tag, Check, Plus, Search 
} from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  resources?: number;
  tags?: string[];
}

interface ProjectsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string | null;
  onProjectSelected?: (projectId: string) => void;
}

export default function ProjectsManager({ 
  isOpen, 
  onClose, 
  workspaceId,
  onProjectSelected
}: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchProjects();
    }
  }, [isOpen, workspaceId]);

  useEffect(() => {
    if (searchQuery.trim() === '' && !selectedTag) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => {
        const matchesQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             project.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = selectedTag ? project.tags?.includes(selectedTag) : true;
        
        return matchesQuery && matchesTag;
      });
      setFilteredProjects(filtered);
    }
  }, [searchQuery, selectedTag, projects]);

  const fetchProjects = async () => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/workspaces/${workspaceId}/projects`);
      // const data = await response.json();
      
      // Mock data for demo
      setTimeout(() => {
        const mockProjects = [
          {
            id: 'p1',
            title: 'Research Project',
            description: 'Research on emerging technologies and market trends',
            workspaceId: workspaceId,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            resources: 12,
            tags: ['research', 'technology', 'market']
          },
          {
            id: 'p2',
            title: 'Marketing Campaign',
            description: 'Q4 marketing campaign planning and resources',
            workspaceId: workspaceId,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            resources: 8,
            tags: ['marketing', 'planning']
          },
          {
            id: 'p3',
            title: 'Product Development',
            description: 'New product feature development and roadmap',
            workspaceId: workspaceId,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            resources: 25,
            tags: ['product', 'development', 'roadmap']
          }
        ];
        
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceId) {
      toast.error('Please select a workspace first');
      return;
    }
    
    if (!newProjectTitle.trim()) {
      toast.error('Project title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/workspaces/${workspaceId}/projects`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: newProjectTitle,
      //     description: newProjectDescription,
      //   }),
      // });
      // const data = await response.json();
      
      // Mock response for demo
      setTimeout(() => {
        const newProject = {
          id: `p${Math.random().toString(36).substr(2, 9)}`,
          title: newProjectTitle,
          description: newProjectDescription,
          workspaceId: workspaceId as string,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          resources: 0,
          tags: []
        };
        
        setProjects(prev => [...prev, newProject]);
        setShowNewProjectForm(false);
        setNewProjectTitle('');
        setNewProjectDescription('');
        toast.success('Project created successfully!');
        setIsSubmitting(false);
      }, 800);
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editProjectId || !editProjectTitle.trim()) {
      toast.error('Project title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/projects/${editProjectId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: editProjectTitle,
      //     description: editProjectDescription,
      //   }),
      // });
      
      // Mock update for demo
      setTimeout(() => {
        setProjects(prev => prev.map(project => 
          project.id === editProjectId 
            ? { 
                ...project, 
                title: editProjectTitle, 
                description: editProjectDescription,
                updatedAt: new Date().toISOString()
              }
            : project
        ));
        
        setEditProjectId(null);
        setEditProjectTitle('');
        setEditProjectDescription('');
        toast.success('Project updated successfully!');
        setIsSubmitting(false);
      }, 800);
      
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        // In a real app, this would be a fetch to your API
        // const response = await fetch(`/api/projects/${projectId}`, {
        //   method: 'DELETE',
        // });
        
        // Mock delete for demo
        setTimeout(() => {
          setProjects(prev => prev.filter(project => project.id !== projectId));
          toast.success('Project deleted successfully!');
        }, 500);
        
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    if (onProjectSelected) {
      onProjectSelected(projectId);
    }
    onClose();
  };

  const startEditProject = (project: Project) => {
    setEditProjectId(project.id);
    setEditProjectTitle(project.title);
    setEditProjectDescription(project.description || '');
  };

  const allTags = [...new Set(projects.flatMap(project => project.tags || []))];

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
            className="bg-zinc-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-100">Project Manager</h2>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="flex gap-2">
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
                    <FileText className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowNewProjectForm(true)}
                    className="ml-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-2 transition-colors"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">New Project</span>
                  </button>
                </div>
              </div>
              
              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedTag === null ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    } transition-colors`}
                  >
                    All
                  </button>
                  
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tag === selectedTag ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Projects Display */}
              <div className={`${isLoading ? 'flex justify-center items-center py-12' : ''}`}>
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-zinc-400">Loading projects...</p>
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id}
                        className={`
                          ${view === 'grid' 
                            ? 'bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden'
                            : 'bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden'
                          }
                          ${selectedProject === project.id ? 'ring-2 ring-emerald-500' : ''}
                          transition-all hover:border-zinc-600
                        `}
                      >
                        {editProjectId === project.id ? (
                          <form onSubmit={handleUpdateProject} className="p-4">
                            <div className="mb-3">
                              <label htmlFor="title" className="block text-xs font-medium text-zinc-400 mb-1">
                                Project Title
                              </label>
                              <input
                                id="title"
                                type="text"
                                value={editProjectTitle}
                                onChange={(e) => setEditProjectTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter project title"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="description" className="block text-xs font-medium text-zinc-400 mb-1">
                                Description (Optional)
                              </label>
                              <textarea
                                id="description"
                                value={editProjectDescription}
                                onChange={(e) => setEditProjectDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                placeholder="Enter project description"
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditProjectId(null)}
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
                            <div className="p-4 flex flex-col h-full">
                              <h3 className="text-zinc-200 font-medium mb-1 truncate">{project.title}</h3>
                              <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{project.description || 'No description'}</p>
                              
                              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{project.resources} resources</span>
                              </div>
                              
                              {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {project.tags.map(tag => (
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
                              <button
                                onClick={() => handleSelectProject(project.id)}
                                className="flex-1 py-2 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors"
                              >
                                Open
                              </button>
                              <button
                                onClick={() => startEditProject(project)}
                                className="flex-1 py-2 text-zinc-300 hover:bg-zinc-700 border-l border-zinc-700 text-sm transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="flex-1 py-2 text-red-400 hover:bg-red-500/10 border-l border-zinc-700 text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          // List View
                          <div className="p-3 flex items-center">
                            <div className="flex-grow">
                              <h3 className="text-zinc-200 font-medium truncate">{project.title}</h3>
                              <p className="text-zinc-400 text-sm truncate">{project.description || 'No description'}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>{project.resources} resources</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSelectProject(project.id)}
                                className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => startEditProject(project)}
                                className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
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
                    <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <h3 className="text-zinc-300 text-lg font-medium mb-1">No projects found</h3>
                    <p className="text-zinc-500 mb-4">
                      {searchQuery || selectedTag 
                        ? 'Try adjusting your search or filters'
                        : 'Create your first project to get started'}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTag(null);
                        if (!projects.length) {
                          setShowNewProjectForm(true);
                        }
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md inline-flex items-center gap-2 transition-colors"
                    >
                      {searchQuery || selectedTag ? <span>Clear filters</span> : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Create Project</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* New Project Form Modal */}
            <AnimatePresence>
              {showNewProjectForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowNewProjectForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                      <h3 className="text-lg font-medium text-zinc-100">Create New Project</h3>
                      <button 
                        onClick={() => setShowNewProjectForm(false)}
                        className="text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleCreateProject} className="p-6">
                      <div className="mb-4">
                        <label htmlFor="projectTitle" className="block text-sm font-medium text-zinc-300 mb-1">
                          Project Title
                        </label>
                        <input
                          id="projectTitle"
                          type="text"
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          placeholder="Enter project title"
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-zinc-300 mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          id="projectDescription"
                          value={newProjectDescription}
                          onChange={(e) => setNewProjectDescription(e.target.value)}
                          placeholder="Enter project description"
                          rows={3}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowNewProjectForm(false)}
                          className="px-4 py-2 text-zinc-300 hover:text-zinc-100 transition-colors"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                          {isSubmitting ? 'Creating...' : 'Create Project'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}