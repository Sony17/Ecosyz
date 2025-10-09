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
import AddResourceForm from './AddResourceForm';
import NewWorkspaceModal from './NewWorkspaceModal';

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
  
  // Workspace selection props
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
  onShareWorkspace
}: WorkspaceSidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showProjectsManager, setShowProjectsManager] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [activeContextMenuId, setActiveContextMenuId] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch workspaces for the user
    const fetchWorkspaces = async () => {
      try {
        // This would be a real API call in a production app
        // const response = await fetch(`/api/users/${userId}/workspaces`);
        // const data = await response.json();
        
        // Mock response for demo purposes
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mockWorkspaces = [
          {
            id: selectedWorkspaceId || 'ws-default-123',
            title: 'Main Workspace',
            description: 'My primary workspace',
            createdAt: new Date().toISOString(),
            pinned: true
          },
          {
            id: 'ws-123',
            title: 'Project Research',
            description: 'Research notes and resources',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            pinned: true
          },
          {
            id: 'ws-456',
            title: 'Development Ideas',
            description: 'Tech ideas and concepts',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            pinned: false
          },
        ];
        
        setWorkspaces(mockWorkspaces);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, [selectedWorkspaceId]);
  
  useEffect(() => {
    // Fetch projects for the selected workspace
    const fetchProjects = async () => {
      try {
        if (selectedWorkspaceId) {
          // This would be a real API call in a production app
          // const response = await fetch(`/api/workspaces/${activeWorkspaceId}/projects`);
          // const data = await response.json();
          
          // Mock response for demo purposes
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const mockProjects = [
            {
              id: selectedProjectId || 'proj-1',
              title: 'Getting Started',
              description: 'Introduction to the platform',
              workspaceId: selectedWorkspaceId
            },
            {
              id: 'proj-2',
              title: 'Research Notes',
              description: 'Compiled research information',
              workspaceId: selectedWorkspaceId
            },
            {
              id: 'proj-3',
              title: 'Project Plan',
              description: 'Planning and roadmap documents',
              workspaceId: selectedWorkspaceId
            },
          ];
          
          setProjects(mockProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [selectedWorkspaceId, selectedProjectId]);

  const handleWorkspaceSelect = (workspaceId: string) => {
    // Close the context menu if it's open
    setContextMenuPos(null);
    setActiveContextMenuId(null);
    
    if (setSelectedWorkspaceId) {
      setSelectedWorkspaceId(workspaceId);
    }

    // Navigate to the workspace
    router.push(`/workspaces/${workspaceId}`);
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceTitle.trim()) {
      alert('Please enter a workspace title');
      return;
    }
    
    try {
      setLoading(true);
      
      // This would be a real API call in a production app
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
        
        if (setSelectedWorkspaceId) {
          setSelectedWorkspaceId(newWorkspace.id);
        }
        
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

  const handleCreateDemoWorkspace = () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll just add the workspace without a real API call
      const newWorkspace = {
        id: `ws-${Date.now()}`,
        title: newWorkspaceTitle || 'New Workspace',
        description: newWorkspaceDesc || 'Created workspace',
        createdAt: new Date().toISOString(),
        pinned: false
      };
      
      setWorkspaces(prev => [newWorkspace, ...prev]);
      
      if (setSelectedWorkspaceId) {
        setSelectedWorkspaceId(newWorkspace.id);
      }
      
      setShowCreateWorkspaceModal(false);
      setNewWorkspaceTitle('');
      setNewWorkspaceDesc('');
    } catch (error) {
      console.error('Error creating workspace:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProjectSelect = (projectId: string) => {
    if (setSelectedProjectId) {
      setSelectedProjectId(projectId);
    }
    
    // Navigate to the project
    if (selectedWorkspaceId) {
      router.push(`/workspaces/${selectedWorkspaceId}/projects/${projectId}`);
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    workspaceId: string
  ) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setActiveContextMenuId(workspaceId);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Close context menu when clicking outside
      if (contextMenuPos && !(e.target as Element).closest('.context-menu')) {
        setContextMenuPos(null);
        setActiveContextMenuId(null);
      }
      
      // Close user menu when clicking outside
      if (
        showUserMenu &&
        userMenuRef.current &&
        !(e.target as Element).closest('.user-menu') &&
        !(e.target as Element).closest('.user-menu-trigger')
      ) {
        setShowUserMenu(false);
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenuPos, showUserMenu]);

  const pinnedWorkspaces = workspaces.filter(w => w.pinned);
  const recentWorkspaces = workspaces.filter(w => !w.pinned).slice(0, 5);
  
  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100 relative">
      {/* Collapse/Expand Button */}
      <div className="absolute top-5 -right-3 z-10">
        <button
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 shadow-md transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
      
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="px-3 py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                A
              </div>
              <div className="flex-grow">
                <div className="text-sm font-medium">Alex Smith</div>
                <div className="text-xs text-zinc-400">Free Plan</div>
              </div>
            </div>
            <div className="relative user-menu-container">
              <button
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Settings size={16} />
              </button>
              
              {showUserMenu && (
                <div
                  ref={userMenuRef}
                  className="absolute right-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10 py-1 user-menu"
                >
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    <User size={16} className="mr-2" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/billing"
                    className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    <FileText size={16} className="mr-2" />
                    Billing & Plans
                  </Link>
                  <div className="border-t border-zinc-700 my-1"></div>
                  <Link
                    href="/auth/logout"
                    className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 rounded-md border border-zinc-700 px-8 py-1.5 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-zinc-500" />
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 px-2 py-2">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-1.5 text-sm rounded-md text-zinc-300 hover:bg-zinc-800 group"
            >
              <Home size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-300" />
              Dashboard
            </Link>
            <Link
              href="/resources"
              className="flex items-center px-3 py-1.5 text-sm rounded-md text-zinc-300 hover:bg-zinc-800 group"
            >
              <BookOpen size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-300" />
              Resources
            </Link>
            <Link
              href="/community"
              className="flex items-center px-3 py-1.5 text-sm rounded-md text-zinc-300 hover:bg-zinc-800 group"
            >
              <Users size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-300" />
              Community
            </Link>
          </nav>
          
          {/* Pinned Workspaces */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-1">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Pinned Workspaces</h3>
            </div>
            
            <div className="space-y-1">
              {pinnedWorkspaces.map(workspace => (
                <div key={workspace.id} className="group relative">
                  <button
                    className={`group flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md ${workspace.id === selectedWorkspaceId ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'} transition-colors`}
                    onClick={() => handleWorkspaceSelect(workspace.id)}
                    onContextMenu={(e) => handleContextMenu(e, workspace.id)}
                  >
                    <div className="flex items-center">
                      <Folder size={16} className="mr-2 text-indigo-400" />
                      <span>{workspace.title}</span>
                    </div>
                    <Star size={14} className="text-yellow-500 opacity-100" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Workspaces */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-1">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Recent Workspaces</h3>
              <button
                onClick={() => setShowCreateWorkspaceModal(true)}
                className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-1">
              {recentWorkspaces.map(workspace => (
                <div key={workspace.id} className="group relative">
                  <button
                    className={`group flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md ${workspace.id === selectedWorkspaceId ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'} transition-colors`}
                    onClick={() => handleWorkspaceSelect(workspace.id)}
                    onContextMenu={(e) => handleContextMenu(e, workspace.id)}
                  >
                    <div className="flex items-center">
                      <Folder size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-400" />
                      <span>{workspace.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, workspace.id);
                      }}
                      className="p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Current Workspace Tools */}
          {selectedWorkspaceId && (
            <div className="mt-6">
              <div className="flex items-center justify-between px-3 mb-1">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Workspace Tools</h3>
              </div>
              
              <div className="space-y-1">
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                  onClick={() => setShowAddResourceModal(true)}
                >
                  <FolderPlus size={16} className="mr-2 text-zinc-500" />
                  Add Resource
                </button>
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                  onClick={() => setShowProjectsManager(true)}
                >
                  <PanelLeft size={16} className="mr-2 text-zinc-500" />
                  Manage Projects
                </button>
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                  onClick={() => onShareWorkspace && onShareWorkspace()}
                >
                  <Share2 size={16} className="mr-2 text-zinc-500" />
                  Share Workspace
                </button>
              </div>
            </div>
          )}

          {/* Projects (only show if a workspace is selected) */}
          {selectedWorkspaceId && projects.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between px-3 mb-1">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Projects</h3>
                <button
                  onClick={() => setShowProjectsManager(true)}
                  className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="space-y-1">
                {projects.map(project => (
                  <div key={project.id} className="group relative">
                    <button
                      className={`group flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md ${project.id === selectedProjectId ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'} transition-colors`}
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-400" />
                        <span>{project.title}</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help & Support */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-1">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Help & Support</h3>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/docs"
                className="flex items-center px-3 py-1.5 text-sm rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 group"
              >
                <FileQuestion size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-400" />
                Documentation
              </Link>
              <Link
                href="/feedback"
                className="flex items-center px-3 py-1.5 text-sm rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 group"
              >
                <MessageSquare size={16} className="mr-2 text-zinc-500 group-hover:text-zinc-400" />
                Send Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenuPos && (
          <WorkspaceContextMenu
            position={contextMenuPos}
            workspaceId={activeContextMenuId || ''}
            onClose={() => {
              setContextMenuPos(null);
              setActiveContextMenuId(null);
            }}
          />
        )}
      </AnimatePresence>
      
      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <UserProfileModal
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showCreateWorkspaceModal && (
          <NewWorkspaceModal
            title={newWorkspaceTitle}
            setTitle={setNewWorkspaceTitle}
            description={newWorkspaceDesc}
            setDescription={setNewWorkspaceDesc}
            onSubmit={handleCreateDemoWorkspace}
            onClose={() => setShowCreateWorkspaceModal(false)}
            isLoading={loading}
          />
        )}
      </AnimatePresence>
      
      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddResourceModal && (
          <AddResourceForm
            workspaceId={selectedWorkspaceId || ''}
            onClose={() => setShowAddResourceModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Projects Manager Modal */}
      <AnimatePresence>
        {showProjectsManager && (
          <ProjectsManager
            workspaceId={selectedWorkspaceId || ''}
            onClose={() => setShowProjectsManager(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}