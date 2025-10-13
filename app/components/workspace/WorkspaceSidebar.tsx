'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  BookOpen,
  User,
  Settings,
  Share2,
  Plus,
  Search,
  MessageSquare,
  FileText,
  Users,
  LogOut,
  Edit,
  ChevronLeft,
  ChevronRight,
  Folder,
  Clock,
  Star,
  Trash2,
  MoreHorizontal,
  PanelLeft,
  FolderPlus,
  FileQuestion
} from 'lucide-react';
import { cn } from '../../../src/lib/ui';
import WorkspaceContextMenu from './WorkspaceContextMenu';
import UserProfileModal from './UserProfileModal';
import ProjectsManager from './ProjectsManager';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
  description?: string;
  pinned?: boolean;
}

interface Project {
  id: string;
  title: string;
  workspaceId: string;
}

interface WorkspaceSidebarProps {
  // Core props for all use cases
  userId?: string;
  
  // Workspace selection props (unified naming)
  selectedWorkspaceId?: string | null;
  setSelectedWorkspaceId?: (workspaceId: string | null) => void;
  
  // Project selection props
  selectedProjectId?: string | null;
  setSelectedProjectId?: (projectId: string | null) => void;
  
  // Sidebar control
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  
  // Action handlers
  onAddResource?: () => void;
  onCreateWorkspace?: () => void;
  onShareWorkspace?: () => void;
}

export default function WorkspaceSidebar({
  // Core props
  userId,
  
  // Workspace selection props - support both naming conventions for backward compatibility
  selectedWorkspaceId,
  setSelectedWorkspaceId,
  
  // Project selection props
  selectedProjectId,
  setSelectedProjectId,
  
  // Sidebar control
  sidebarOpen = true,
  setSidebarOpen,
  
  // Action handlers
  onAddResource,
  onCreateWorkspace,
  onShareWorkspace,
  
  // Legacy props for backward compatibility
  activeWorkspaceId,
  activeProjectId,
  onWorkspaceChange,
  onProjectSelect,
  selectedWorkspace,
  setSelectedWorkspace
}: WorkspaceSidebarProps & {
  // Legacy props
  activeWorkspaceId?: string;
  activeProjectId?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  onProjectSelect?: (projectId?: string) => void;
  selectedWorkspace?: string | null;
  setSelectedWorkspace?: (workspace: string | null) => void;
}) {
  // Use the appropriate props based on what's provided
  const effectiveWorkspaceId = selectedWorkspaceId || activeWorkspaceId || selectedWorkspace;
  const effectiveProjectId = selectedProjectId || activeProjectId;
  
  // Function to set the workspace ID using whatever prop is available
  const setEffectiveWorkspaceId = (workspaceId: string | null) => {
    if (setSelectedWorkspaceId) {
      setSelectedWorkspaceId(workspaceId);
    } else if (setSelectedWorkspace) {
      setSelectedWorkspace(workspaceId);
    }
    
    if (workspaceId && onWorkspaceChange) {
      onWorkspaceChange(workspaceId);
    }
  };
  
  // Function to set the project ID using whatever prop is available
  const setEffectiveProjectId = (projectId: string | null) => {
    if (setSelectedProjectId) {
      setSelectedProjectId(projectId);
    }
    
    if (onProjectSelect) {
      onProjectSelect(projectId || undefined);
    }
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'workspaces' | 'projects' | 'recent'>('workspaces');
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showProjectsManager, setShowProjectsManager] = useState(false);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        // In a real app, this would be a fetch to your API
        // const response = await fetch('/api/workspaces');
        
        // Mock data for demo
        setTimeout(() => {
          const mockWorkspaces = [
            {
              id: activeWorkspaceId || 'ws-default-123',
              title: 'Main Workspace',
              createdAt: new Date().toISOString(),
              pinned: true
            },
            {
              id: 'ws-2',
              title: 'Project Research',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'ws-3',
              title: 'Learning Resources',
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ];
          setWorkspaces(mockWorkspaces);
        }, 500);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    fetchWorkspaces();
  }, [activeWorkspaceId]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (activeWorkspaceId) {
        try {
          // In a real app, this would be a fetch to your API
          // const response = await fetch(`/api/workspaces/${activeWorkspaceId}/projects`);
          
          // Mock data for demo
          setTimeout(() => {
            const mockProjects = [
              {
                id: activeProjectId || 'proj-1',
                title: 'Web Application',
                workspaceId: activeWorkspaceId
              },
              {
                id: 'proj-2',
                title: 'Mobile App Design',
                workspaceId: activeWorkspaceId
              },
              {
                id: 'proj-3',
                title: 'API Documentation',
                workspaceId: activeWorkspaceId
              }
            ];
            setProjects(mockProjects);
          }, 700);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };
    fetchProjects();
  }, [activeWorkspaceId, activeProjectId]);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    onWorkspaceChange?.(workspaceId);
    
    // Support for new props structure
    if (setSelectedWorkspace) {
      setSelectedWorkspace(workspaceId);
    }
    // In a real app, you might want to navigate
    // router.push(`/workspaces/${workspaceId}`);
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceTitle.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newWorkspaceTitle,
          description: newWorkspaceDesc,
        }),
      });
      
      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces([...workspaces, newWorkspace]);
        setEffectiveWorkspaceId(newWorkspace.id);
        setShowCreateWorkspaceModal(false);
        setNewWorkspaceTitle('');
        setNewWorkspaceDesc('');
        router.push(`/workspaces/${newWorkspace.id}`);
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkspaces = workspaces
    .filter(workspace => workspace.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Sort pinned workspaces first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const pinnedWorkspaces = filteredWorkspaces.filter(w => w.pinned);
  const recentWorkspaces = filteredWorkspaces.slice(0, 5);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '0px' }}
        transition={{ duration: 0.2 }}
        className="relative flex-shrink-0 border-r border-white/10 overflow-hidden h-screen glass backdrop-blur-xl z-20"
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-30 glass-strong border border-white/20 p-1 rounded-full text-gray-400 hover:text-neon-green transition-colors duration-200"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {sidebarOpen && (
          <div className="flex flex-col h-full">
            {/* Header with User Profile */}
            <div className="p-2 sm:p-3 border-b border-white/10 flex items-center gap-2 sm:gap-3">
              <div 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 flex items-center justify-center cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.image ? (
                  <img src={user.image} alt={user?.name || 'User'} className="rounded-full w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-medium text-sm sm:text-base">{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div className="flex-grow" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="text-xs sm:text-sm font-medium text-white truncate cursor-pointer">{user?.name || 'User'}</div>
                <div className="text-[10px] sm:text-xs text-gray-300 truncate">{user?.email || ''}</div>
              </div>
              <button className="p-1 sm:p-1.5 hover:bg-white/10 rounded-md transition-colors">
                <PanelLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-14 left-3 right-3 glass-strong rounded-lg shadow-xl z-30"
                  >
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-neon-green/20 hover:text-neon-green rounded-md transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>
                      <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-white hover:bg-neon-blue/20 hover:text-neon-blue rounded-md transition-colors w-full text-left">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </Link>
                      <hr className="my-1 border-white/20" />
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Workspace Button */}
            <div className="p-2 sm:p-3">
              <button 
                onClick={onCreateWorkspace || (() => setShowCreateWorkspaceModal(true))}
                className="w-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 hover:from-neon-green/30 hover:to-neon-blue/30 text-neon-green border border-neon-green/30 rounded-md py-1.5 sm:py-2 px-2 sm:px-3 flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:shadow-neon-green"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                <span className="text-xs sm:text-sm font-medium">New Workspace</span>
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-secondary/50 border border-white/10 rounded-md pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50 focus:border-neon-green/50"
                />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-3 mb-1">
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveSection('workspaces')}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium text-center transition-colors",
                    activeSection === 'workspaces' 
                      ? "text-neon-green border-b-2 border-neon-green" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Workspaces
                </button>
                <button 
                  onClick={() => setActiveSection('projects')}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium text-center transition-colors",
                    activeSection === 'projects' 
                      ? "text-neon-blue border-b-2 border-neon-blue" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Projects
                </button>
                <button 
                  onClick={() => setActiveSection('recent')}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium text-center transition-colors",
                    activeSection === 'recent' 
                      ? "text-neon-purple border-b-2 border-neon-purple" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Recent
                </button>
              </div>
            </div>

            {/* List Content - Scrollable */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {/* Workspaces Section */}
              {activeSection === 'workspaces' && (
                <div className="p-1">
                  {pinnedWorkspaces.length > 0 && (
                    <div className="mb-2">
                      <h3 className="text-xs font-medium text-gray-400 px-3 py-1">Pinned</h3>
                      {pinnedWorkspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={() => handleWorkspaceSelect(workspace.id)}
                          className={cn(
                            "w-full flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors text-left mb-0.5",
                            selectedWorkspace === workspace.id
                              ? "bg-neon-green/20 text-neon-green"
                              : "hover:bg-white/10 text-white"
                          )}
                        >
                          <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate flex-grow">{workspace.title}</span>
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xs font-medium text-gray-400 px-3 py-1">All workspaces</h3>
                  {filteredWorkspaces.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">
                      {searchQuery ? 'No matching workspaces' : 'No workspaces yet'}
                    </div>
                  ) : (
                    filteredWorkspaces.map((workspace) => (
                      <button
                        key={workspace.id}
                        onClick={() => handleWorkspaceSelect(workspace.id)}
                        className={cn(
                          "w-full flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors text-left mb-0.5 group",
                          selectedWorkspace === workspace.id
                            ? "bg-neon-green/20 text-neon-green"
                            : "hover:bg-white/10 text-white"
                        )}
                      >
                        <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate flex-grow">{workspace.title}</span>
                        <div 
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setContextMenu({ 
                              id: workspace.id, 
                              x: rect.right, 
                              y: rect.bottom 
                            });
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div className="p-1">
                  <div className="flex items-center justify-between px-3 py-1">
                    <h3 className="text-xs font-medium text-gray-400">Projects</h3>
                    <button 
                      onClick={() => setShowProjectsManager(true)} 
                      className="text-gray-400 hover:text-neon-blue p-0.5 rounded"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {projects.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-6 px-3">
                      <FileQuestion className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                      <p>No projects in this workspace yet</p>
                      <button 
                        onClick={() => setShowProjectsManager(true)}
                        className="mt-3 text-xs bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue px-3 py-1.5 rounded-md transition-colors"
                      >
                        Create your first project
                      </button>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <button
                        key={project.id}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-left mb-0.5 hover:bg-white/10 text-white"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{project.title}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Recent Section */}
              {activeSection === 'recent' && (
                <div className="p-1">
                  <h3 className="text-xs font-medium text-gray-400 px-3 py-1">Recently opened</h3>
                  {recentWorkspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleWorkspaceSelect(workspace.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-left mb-0.5 hover:bg-white/10 text-white"
                    >
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <div className="overflow-hidden flex-grow">
                        <span className="text-sm truncate block">{workspace.title}</span>
                        <span className="text-xs text-gray-400 truncate block">
                          {new Date(workspace.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-3">
              <Link href="/trash" className="flex items-center gap-2.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-md transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Trash</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showCreateWorkspaceModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Create New Workspace</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm text-gray-300 mb-1">
                    Workspace Name
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={newWorkspaceTitle}
                    onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                    placeholder="My Awesome Workspace"
                    className="w-full bg-dark-secondary/50 border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={newWorkspaceDesc}
                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    placeholder="What is this workspace for?"
                    className="w-full bg-dark-secondary/50 border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setShowCreateWorkspaceModal(false)}
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspaceTitle.trim() || loading}
                  className="px-4 py-2 bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-neon-green text-gray-900 font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Workspace Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <WorkspaceContextMenu
            workspaceId={contextMenu.id}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onClose={() => setContextMenu(null)}
            onAddResource={onAddResource}
            onShare={onShareWorkspace}
            onEdit={() => {
              // Future implementation: workspace renaming
              setContextMenu(null);
            }}
            onDelete={() => {
              // Future implementation: workspace deletion
              setContextMenu(null);
            }}
            onTogglePin={() => {
              // Future implementation: workspace pinning
              setContextMenu(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Projects Manager */}
      <ProjectsManager
        isOpen={showProjectsManager}
        onClose={() => setShowProjectsManager(false)}
        workspaceId={effectiveWorkspaceId || ''}
        onProjectSelected={(projectId) => {
          // Handle project selection
          setEffectiveProjectId(projectId);
        }}
      />
    </>
  );
}