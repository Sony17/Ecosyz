'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/lib/useAuth';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Folder, Eye, Trash2, Search, Grid, List, Filter } from 'lucide-react';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
}

export default function WorkspacesPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setNewTitle('');
        fetchWorkspaces();
      } else {
        const errorData = await res.json();
        alert(`Failed to create workspace: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workspace?')) return;

    try {
      const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchWorkspaces();
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  const filteredWorkspaces = workspaces
    .filter(workspace => 
      workspace.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-lg">Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 icon-neon">
              <Folder className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">My Workspaces</h1>
            <p className="text-gray-300">Access your AI-powered development environment</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-400">Please sign in to access your workspaces and start building amazing projects.</p>
            <Link 
              href="/auth"
              className="inline-block w-full px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-gray-900 font-semibold rounded-lg hover:shadow-neon-green transition-all hover:scale-105"
            >
              Sign In to Continue
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-lg">Loading workspaces...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-border-b sticky top-14 z-40 px-4 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="icon-neon">
                <Folder className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">My Workspaces</h1>
                <p className="text-gray-300 mt-1">
                  Welcome back, <span className="text-neon-green">{user?.name || user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden sm:block">
                {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Create Workspace Form */}
          <form onSubmit={createWorkspace} className="glass-card rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-neon-green" />
              Create New Workspace
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter workspace title..."
                className="flex-1 px-4 py-3 bg-dark-secondary border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 transition-all"
                required
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-gray-900 font-semibold rounded-lg hover:shadow-neon-green transition-all"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </form>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-secondary border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
                  className="px-3 py-2 bg-dark-secondary border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <div className="flex bg-dark-secondary rounded-lg p-1 border border-gray-600/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-neon-green/20 text-neon-green' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' 
                      ? 'bg-neon-blue/20 text-neon-blue' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workspaces Grid/List */}
        <AnimatePresence mode="wait">
          {filteredWorkspaces.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center">
                <Folder className="w-10 h-10 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Workspaces Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm 
                  ? `No workspaces match "${searchTerm}". Try adjusting your search.`
                  : "Create your first workspace to start building amazing projects!"
                }
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector<HTMLInputElement>('input[placeholder="Enter workspace title..."]')?.focus()}
                  className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-gray-900 font-semibold rounded-lg hover:shadow-neon-green transition-all"
                >
                  Create Your First Workspace
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="workspaces"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredWorkspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card rounded-2xl p-6 group hover:border-neon-green/30 ${
                    viewMode === 'list' ? 'flex items-center justify-between' : ''
                  }`}
                >
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center flex-shrink-0">
                        <Folder className="w-6 h-6 text-neon-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {workspace.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Created {new Date(workspace.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {viewMode === 'grid' && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span>0 resources</span>
                          <span>•</span>
                          <span>Recently updated</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/workspaces/${workspace.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-green to-neon-blue text-gray-900 font-medium rounded-lg hover:shadow-neon-green transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Open</span>
                      </Link>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteWorkspace(workspace.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete workspace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}