'use client';

import { useState, useEffect } from 'react';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceChat from '../ai/EnhancedWorkspaceChat';
import MobileNavigation from './MobileNavigation';
import { useMediaQuery } from '../../../src/lib/hooks/useResponsive';

interface ResponsiveWorkspaceProps {
  children: React.ReactNode;
  workspaceId?: string;
  projectId?: string;
}

export default function ResponsiveWorkspace({
  children,
  workspaceId,
  projectId
}: ResponsiveWorkspaceProps) {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  
  // Detect mobile screens
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [activeView, setActiveView] = useState<'sidebar' | 'chat' | null>(null);
  
  // Handle mobile navigation
  const handleOpenSidebar = () => {
    if (activeView === 'sidebar') {
      setActiveView(null);
    } else {
      setActiveView('sidebar');
      setSidebarOpen(true);
    }
  };
  
  const handleOpenChat = () => {
    if (activeView === 'chat') {
      setActiveView(null);
    } else {
      setActiveView('chat');
      setChatOpen(true);
    }
  };
  
  // Adjust for mobile/desktop on resize
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(activeView === 'sidebar');
      setChatOpen(activeView === 'chat');
    } else {
      setSidebarOpen(true);
      setChatOpen(false);
      setActiveView(null);
    }
  }, [isMobile, activeView]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016]">
      {/* Sidebar */}
      <WorkspaceSidebar 
        selectedWorkspaceId={workspaceId}
        selectedProjectId={projectId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col ${isMobile && activeView ? 'hidden' : ''}`}>
        {children}
      </div>
      
      {/* Chat Panel */}
      {chatOpen && (
        <div className={`flex-shrink-0 w-full lg:max-w-md border-l border-white/10 glass ${isMobile && activeView !== 'chat' ? 'hidden' : ''}`}>
          <WorkspaceChat 
            workspaceId={workspaceId}
            context={{
              currentPage: 'workspace',
              selectedText: undefined,
              recentActions: []
            }}
          />
        </div>
      )}
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        onOpenSidebar={handleOpenSidebar}
        onOpenChat={handleOpenChat}
        activeView={activeView}
      />
    </div>
  );
}