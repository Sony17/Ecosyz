'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Code2,
  GitBranch,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  FileText,
  Terminal,
  Zap,
  Eye,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface OpenHandsWorkspace {
  id: string;
  name: string;
  status: 'creating' | 'ready' | 'working' | 'completed' | 'error';
  agent_type: 'CodeActAgent' | 'PlannerAgent' | 'ResearchAgent';
  created_at: string;
  last_activity: string;
  project_url?: string;
  github_repo?: string;
  deployment_url?: string;
}

interface OpenHandsActivity {
  current_action: string;
  progress: number;
  recent_commits: number;
  files_modified: number;
  last_update: string;
}

interface OpenHandsWorkspaceProps {
  resources?: any[];
  onWorkspaceCreated?: (workspace: OpenHandsWorkspace) => void;
}

export default function OpenHandsWorkspace({ resources = [], onWorkspaceCreated }: OpenHandsWorkspaceProps) {
  const [workspaces, setWorkspaces] = useState<OpenHandsWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<OpenHandsWorkspace | null>(null);
  const [activity, setActivity] = useState<OpenHandsActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadWorkspaces();
    const interval = setInterval(loadWorkspaces, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadActivity(selectedWorkspace.id);
      const interval = setInterval(() => loadActivity(selectedWorkspace.id), 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/api/openhands');
      const data = await response.json();
      if (data.success) {
        setWorkspaces(data.workspaces);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const loadActivity = async (workspaceId: string) => {
    try {
      const response = await fetch(`/api/openhands?workspace=${workspaceId}`);
      const data = await response.json();
      if (data.success) {
        setActivity(data.activity);
      }
    } catch (error) {
      console.error('Failed to load activity:', error);
    }
  };

  const createWorkspace = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/openhands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_workspace',
          requirements: `Generate application from ${resources.length} research resources`,
          resources
        })
      });

      const data = await response.json();
      if (data.success) {
        setWorkspaces(prev => [data.workspace, ...prev]);
        setSelectedWorkspace(data.workspace);
        setShowCreateModal(false);
        onWorkspaceCreated?.(data.workspace);
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const startGeneration = async (workspaceId: string) => {
    try {
      const response = await fetch('/api/openhands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_code',
          projectId: workspaceId,
          resources
        })
      });

      const data = await response.json();
      if (data.success) {
        loadWorkspaces(); // Refresh to see updated status
      }
    } catch (error) {
      console.error('Failed to start generation:', error);
    }
  };

  const deployProject = async (workspaceId: string) => {
    try {
      const response = await fetch('/api/openhands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy_project',
          projectId: workspaceId
        })
      });

      const data = await response.json();
      if (data.success) {
        loadWorkspaces(); // Refresh to see updated status
      }
    } catch (error) {
      console.error('Failed to deploy project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'creating': return 'text-blue-400';
      case 'ready': return 'text-green-400';
      case 'working': return 'text-yellow-400';
      case 'completed': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'creating': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'working': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">OpenHands AI Workspaces</h2>
            <p className="text-gray-400">Autonomous development with AI agents</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => loadWorkspaces()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="h-5 w-5 text-white" />
          </motion.button>
          
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <Zap className="h-5 w-5" />
            New AI Workspace
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace List */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Active Workspaces ({workspaces.length})
            </h3>
            
            <div className="space-y-3">
              {workspaces.map((workspace) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedWorkspace(workspace)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedWorkspace?.id === workspace.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{workspace.name}</span>
                    <div className={`flex items-center gap-1 ${getStatusColor(workspace.status)}`}>
                      {getStatusIcon(workspace.status)}
                      <span className="text-xs capitalize">{workspace.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Bot className="h-3 w-3" />
                    <span>{workspace.agent_type}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(workspace.created_at).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
              
              {workspaces.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No AI workspaces yet</p>
                  <p className="text-sm">Create your first autonomous workspace</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Details */}
        <div className="lg:col-span-2">
          {selectedWorkspace ? (
            <div className="space-y-6">
              {/* Workspace Info */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedWorkspace.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Bot className="h-4 w-4" />
                        <span>{selectedWorkspace.agent_type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {new Date(selectedWorkspace.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(selectedWorkspace.status)} bg-white/10`}>
                    {getStatusIcon(selectedWorkspace.status)}
                    <span className="font-medium capitalize">{selectedWorkspace.status}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {selectedWorkspace.status === 'ready' && (
                    <motion.button
                      onClick={() => startGeneration(selectedWorkspace.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Code2 className="h-4 w-4" />
                      Start AI Development
                    </motion.button>
                  )}
                  
                  {selectedWorkspace.status === 'completed' && selectedWorkspace.github_repo && (
                    <>
                      <motion.a
                        href={selectedWorkspace.github_repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <GitBranch className="h-4 w-4" />
                        View Repository
                        <ExternalLink className="h-3 w-3" />
                      </motion.a>
                      
                      {selectedWorkspace.deployment_url && (
                        <motion.a
                          href={selectedWorkspace.deployment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <Globe className="h-4 w-4" />
                          View Live Site
                          <ExternalLink className="h-3 w-3" />
                        </motion.a>
                      )}
                    </>
                  )}
                  
                  {selectedWorkspace.status === 'working' && (
                    <motion.button
                      onClick={() => deployProject(selectedWorkspace.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Globe className="h-4 w-4" />
                      Deploy Project
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Activity Monitor */}
              {activity && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    AI Agent Activity
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Current Action</span>
                        <span className="text-xs text-gray-400">
                          {new Date(activity.last_update).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white font-medium">{activity.current_action}</p>
                    </div>
                    
                    {selectedWorkspace.status === 'working' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Progress</span>
                          <span className="text-sm text-white font-medium">{activity.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${activity.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                          <GitBranch className="h-4 w-4" />
                          Recent Commits
                        </div>
                        <span className="text-xl font-bold text-white">{activity.recent_commits}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                          <FileText className="h-4 w-4" />
                          Files Modified
                        </div>
                        <span className="text-xl font-bold text-white">{activity.files_modified}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-12 text-center">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Workspace</h3>
              <p className="text-gray-400 mb-6">
                Choose an AI workspace to view details and monitor autonomous development progress
              </p>
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold mx-auto"
              >
                <Zap className="h-5 w-5" />
                Create New Workspace
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-400" />
                Create OpenHands Workspace
              </h3>
              
              <p className="text-gray-300 mb-6">
                This will create an autonomous AI workspace that will analyze your {resources.length} selected resources and generate a complete application using AI agents.
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={createWorkspace}
                  disabled={isCreating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Create Workspace
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}