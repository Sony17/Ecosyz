'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquareText, 
  Settings, 
  Sparkles,
  Save, 
  ChevronRight, 
  Loader2,
  RefreshCw,
  PanelLeftOpen,
  Download,
  Upload,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import SaveResourceModal from './SaveResourceModal';
import WorkspaceStorage from './WorkspaceStorage';
import ChatInterface from './ChatInterface';

interface WorkbenchProps {
  projectId?: string;
  workspaceId: string;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

export default function Workbench({ 
  projectId, 
  workspaceId,
  sidebarVisible,
  onToggleSidebar
}: WorkbenchProps) {
  // Modals
  const [saveResourceModalOpen, setSaveResourceModalOpen] = useState(false);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  
  // Workspace state
  const [activeTab, setActiveTab] = useState<'chat' | 'editor' | 'canvas'>('chat');
  const [showSettings, setShowSettings] = useState(false);
  
  // Project information
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, fetch project data based on projectId
    if (projectId) {
      fetchProjectData();
    } else {
      // Demo data for new projects
      setProjectName('New Project');
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    setIsLoading(true);
    
    try {
      // This would be an API call in a real application
      // const response = await fetch(`/api/projects/${projectId}`);
      // const data = await response.json();
      
      // Mock data for demo
      setTimeout(() => {
        setProjectName('Web Development Project');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      toast.error('Failed to load project data');
      setIsLoading(false);
    }
  };

  const saveToWorkspace = () => {
    // This would save the current conversation or work to the workspace
    setSaveResourceModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar}
            className={`mr-3 p-1.5 rounded-md ${sidebarVisible ? 'bg-zinc-800' : 'bg-zinc-900'} hover:bg-zinc-700 transition-colors`}
          >
            <PanelLeftOpen className="w-5 h-5 text-zinc-400" />
          </button>
          <h1 className="text-lg font-medium text-zinc-200">{projectName || 'Untitled Project'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStorageModalOpen(true)}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors"
            title="Workspace Storage"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={saveToWorkspace}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors"
            title="Save to Workspace"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-md ${showSettings ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'} transition-colors`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Settings Panel - Conditionally Rendered */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-zinc-800 bg-zinc-900/50 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Workspace Settings</h3>
                  <p className="text-sm text-zinc-400">
                    Adjust workspace preferences and AI settings in the ChatInterface directly.
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                  <button
                    className="text-xs text-zinc-400 hover:text-zinc-300 px-3 py-1 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors"
                    onClick={() => setShowSettings(false)}
                  >
                    Close Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Workspace Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-zinc-400">Loading workspace...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="px-4 border-b border-zinc-800 flex">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-3 flex items-center gap-2 text-sm font-medium border-b-2 ${
                    activeTab === 'chat' 
                      ? 'border-emerald-500 text-emerald-400' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-300'
                  } transition-colors -mb-px`}
                >
                  <MessageSquareText className="w-4 h-4" />
                  Chat
                </button>
                {/* Add more tabs here as needed */}
              </div>
              
              {/* Chat Interface */}
              {activeTab === 'chat' && (
                <ChatInterface 
                  projectId={projectId} 
                  onSaveResource={() => setSaveResourceModalOpen(true)} 
                />
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <SaveResourceModal
        isOpen={saveResourceModalOpen}
        onClose={() => setSaveResourceModalOpen(false)}
        workspaceId={workspaceId}
        initialData={{
          title: projectName,
          content: "Chat conversation from workspace"
        }}
      />
      
      <WorkspaceStorage
        isOpen={storageModalOpen}
        onClose={() => setStorageModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
}