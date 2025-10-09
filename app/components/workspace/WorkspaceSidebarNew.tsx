'use client';

import { useState } from 'react';
import { 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  Search, 
  PanelLeftClose,
  Plus,
  History,
  Star,
  FileText,
  Sparkles,
  Users,
  ChevronRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspaceSidebarProps {
  workspaceId: string;
  isVisible: boolean;
  activeView: 'chat' | 'resources' | 'settings';
  onChangeView: (view: 'chat' | 'resources' | 'settings') => void;
}

export default function WorkspaceSidebar({ 
  workspaceId, 
  isVisible,
  activeView,
  onChangeView
}: WorkspaceSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSections, setShowSections] = useState({
    recents: true,
    favorites: true,
    projects: true
  });
  
  // Mock data
  const conversations = [
    { id: '1', title: 'React Component Design', date: 'Oct 6', pinned: true },
    { id: '2', title: 'Database Schema Planning', date: 'Oct 5' },
    { id: '3', title: 'API Integration Help', date: 'Oct 3' },
    { id: '4', title: 'Deployment Strategy', date: 'Sep 29' },
    { id: '5', title: 'Performance Optimization', date: 'Sep 28' },
    { id: '6', title: 'Mobile Responsiveness', date: 'Sep 27' },
  ];
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery ? 
    conversations.filter(conv => 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) : conversations;
  
  // Group conversations
  const pinnedConversations = filteredConversations.filter(conv => conv.pinned);
  const recentConversations = filteredConversations.filter(conv => !conv.pinned);
  
  return (
    <motion.div 
      initial={false}
      animate={{ width: isVisible ? '280px' : '0px' }}
      className="relative flex-shrink-0 border-r border-zinc-800 overflow-hidden h-screen bg-zinc-900/95 backdrop-blur-md z-20"
    >
      {/* Sidebar content - only render when visible */}
      {isVisible && (
        <div className="h-full flex flex-col">
          {/* Header with search */}
          <div className="p-4 border-b border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full bg-zinc-800 pl-9 pr-3 py-2 text-sm rounded-md border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-zinc-200 placeholder-zinc-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Main sidebar content with scrolling */}
          <div className="flex-1 overflow-y-auto py-2 space-y-4">
            {/* New Chat button */}
            <div className="px-4">
              <button 
                className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => {
                  onChangeView('chat');
                  // Logic to start new chat would go here
                }}
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </button>
            </div>
            
            {/* Recent Conversations */}
            <div>
              <div 
                className="px-4 flex items-center justify-between cursor-pointer py-1"
                onClick={() => setShowSections(prev => ({ ...prev, recents: !prev.recents }))}
              >
                <div className="flex items-center gap-2 text-zinc-400">
                  <History className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Recent</span>
                </div>
                <ChevronRight 
                  className={`h-4 w-4 text-zinc-500 transition-transform ${showSections.recents ? 'rotate-90' : ''}`} 
                />
              </div>
              
              <AnimatePresence>
                {showSections.recents && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 space-y-0.5">
                      {recentConversations.map(conv => (
                        <button 
                          key={conv.id}
                          className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-300 flex items-center justify-between group rounded-sm"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <MessageSquare className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                            <span className="truncate">{conv.title}</span>
                          </div>
                          <span className="text-xs text-zinc-500">{conv.date}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Pinned/Favorites */}
            {pinnedConversations.length > 0 && (
              <div>
                <div 
                  className="px-4 flex items-center justify-between cursor-pointer py-1"
                  onClick={() => setShowSections(prev => ({ ...prev, favorites: !prev.favorites }))}
                >
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Star className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Favorites</span>
                  </div>
                  <ChevronRight 
                    className={`h-4 w-4 text-zinc-500 transition-transform ${showSections.favorites ? 'rotate-90' : ''}`} 
                  />
                </div>
                
                <AnimatePresence>
                  {showSections.favorites && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1 space-y-0.5">
                        {pinnedConversations.map(conv => (
                          <button 
                            key={conv.id}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-300 flex items-center justify-between group rounded-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                              <span className="truncate">{conv.title}</span>
                            </div>
                            <span className="text-xs text-zinc-500">{conv.date}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Projects Section */}
            <div>
              <div 
                className="px-4 flex items-center justify-between cursor-pointer py-1"
                onClick={() => setShowSections(prev => ({ ...prev, projects: !prev.projects }))}
              >
                <div className="flex items-center gap-2 text-zinc-400">
                  <FolderOpen className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Projects</span>
                </div>
                <ChevronRight 
                  className={`h-4 w-4 text-zinc-500 transition-transform ${showSections.projects ? 'rotate-90' : ''}`} 
                />
              </div>
              
              <AnimatePresence>
                {showSections.projects && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 space-y-0.5">
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-300 flex items-center gap-2 rounded-sm"
                      >
                        <FolderOpen className="h-4 w-4 text-emerald-500" />
                        <span className="truncate">Web Development</span>
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-300 flex items-center gap-2 rounded-sm"
                      >
                        <FolderOpen className="h-4 w-4 text-blue-500" />
                        <span className="truncate">Mobile App</span>
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-300 flex items-center gap-2 rounded-sm"
                      >
                        <FolderOpen className="h-4 w-4 text-purple-500" />
                        <span className="truncate">Research Paper</span>
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 text-sm flex items-center gap-2 rounded-sm"
                      >
                        <Plus className="h-4 w-4" />
                        <span>New Project</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Footer navigation */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center justify-around">
              <button 
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md ${activeView === 'chat' ? 'text-emerald-400 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-300'}`}
                onClick={() => onChangeView('chat')}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Chat</span>
              </button>
              <button 
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md ${activeView === 'resources' ? 'text-emerald-400 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-300'}`}
                onClick={() => onChangeView('resources')}
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Resources</span>
              </button>
              <button 
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md ${activeView === 'settings' ? 'text-emerald-400 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-300'}`}
                onClick={() => onChangeView('settings')}
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}