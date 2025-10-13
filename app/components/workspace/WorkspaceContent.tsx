'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit, MessageSquare, FolderTree, ChevronDown, PlusCircle } from 'lucide-react';
import WorkspaceChat from '../ai/EnhancedWorkspaceChat';

interface WorkspaceContentProps {
  activeTab: 'editor' | 'chat' | 'files';
  setActiveTab: (tab: 'editor' | 'chat' | 'files') => void;
  workspaceId?: string;
  projectId?: string;
  onSendMessage?: (message: string) => Promise<string | void>;
  suggestions?: string[];
  isProcessing?: boolean;
}

export default function WorkspaceContent({
  activeTab,
  setActiveTab,
  workspaceId,
  projectId,
  onSendMessage,
  suggestions,
  isProcessing
}: WorkspaceContentProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 glass-border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'chat' | 'files')}>
            <TabsList className="bg-dark-secondary/50">
              <TabsTrigger value="editor" className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
                <Edit className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple">
                <FolderTree className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Files</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative">
            <button 
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded hover:bg-white/10 transition-all"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Actions <ChevronDown className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full right-0 mt-1 glass-strong rounded-lg shadow-xl p-1 min-w-[180px] z-10">
                <button className="flex items-center gap-2 px-3 py-2 text-white hover:bg-neon-green/20 hover:text-neon-green rounded w-full text-left text-sm transition-all">
                  <PlusCircle className="w-4 h-4" />
                  New Document
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-white hover:bg-neon-blue/20 hover:text-neon-blue rounded w-full text-left text-sm transition-all">
                  <PlusCircle className="w-4 h-4" />
                  New Folder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-grow overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] p-8">
            <div className="text-center glass-card p-8 rounded-2xl max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 icon-neon">
                <Edit className="w-8 h-8" />
              </div>
              <p className="text-xl font-medium text-white mb-2">Code Editor</p>
              <p className="text-gray-300">Choose a file from the explorer to start editing</p>
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <WorkspaceChat 
            workspaceId={workspaceId}
            context={{
              currentPage: 'workspace',
              selectedText: undefined,
              recentActions: []
            }}
          />
        )}
        
        {activeTab === 'files' && (
          <div className="h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] p-8">
            <div className="text-center glass-card p-8 rounded-2xl max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 icon-neon">
                <FolderTree className="w-8 h-8" />
              </div>
              <p className="text-xl font-medium text-white mb-2">File Explorer</p>
              <p className="text-gray-300">Upload or create files to start organizing your project</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}