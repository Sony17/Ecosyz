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
      <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'chat' | 'files')}>
            <TabsList className="bg-zinc-800/50">
              <TabsTrigger value="editor" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
                <Edit className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
                <FolderTree className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Files</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative">
            <button 
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded hover:bg-zinc-800"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Actions <ChevronDown className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl p-1 min-w-[180px] z-10">
                <button className="flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-zinc-700 rounded w-full text-left text-sm">
                  <PlusCircle className="w-4 h-4" />
                  New Document
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-zinc-700 rounded w-full text-left text-sm">
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
          <div className="h-full flex items-center justify-center text-zinc-500 bg-zinc-950">
            <div className="text-center">
              <Edit className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Editor Panel</p>
              <p className="text-sm mt-2">Content editor will be displayed here</p>
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
          <div className="h-full flex items-center justify-center text-zinc-500 bg-zinc-950">
            <div className="text-center">
              <FolderTree className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">File Browser</p>
              <p className="text-sm mt-2">Workspace files will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}