'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Edit,
  Bell,
  Star,
  Clock,
  TrendingUp,
  Brain,
  Lightbulb,
  Target,
  Calendar,
  BarChart3,
  Sparkles,
  Save,
  StickyNote,
  Filter
} from 'lucide-react';

// Import existing components
import WorkspacePageClient from './WorkspacePageClient';
import AddResourceForm from './AddResourceForm';
import ProjectPanel from './ProjectPanel';
import ShareLinksPanel from './ShareLinksPanel';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
  resources: any[];
  shareLinks: any[];
}

export default function ChatGPTWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch('/api/workspaces');
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
          if (data.length > 0 && !selectedWorkspace) {
            setSelectedWorkspace(data[0].id);
            setActiveWorkspace(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    fetchWorkspaces();
  }, [selectedWorkspace]);

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

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace.id);
    setActiveWorkspace(workspace);
  };

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '0px' }}
        className={`relative flex-shrink-0 border-r border-white/10 overflow-hidden ${
          sidebarOpen ? 'flex flex-col' : 'hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Workspaces</h2>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Workspace List */}
        <div className="flex-grow overflow-y-auto">
          <nav className="p-2 space-y-1">
            {filteredWorkspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceSelect(workspace)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedWorkspace === workspace.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-white/5'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm">{workspace.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-grow overflow-hidden">
          <WorkspacePageClient workspace={activeWorkspace} />
        </div>
      </div>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddResourceModal && (
          <AddResourceForm
            workspaceId={selectedWorkspace || ''}
            onClose={() => setShowAddResourceModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareLinksPanel
            workspaceId={selectedWorkspace || ''}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}