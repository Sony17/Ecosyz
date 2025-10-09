'use client';

import { useState, useEffect } from 'react';
import WorkspaceSidebar from './WorkspaceSidebar';
import Workbench from './Workbench';
import { toast } from 'sonner';

interface WorkspaceContainerProps {
  userId: string;
  initialWorkspaceId?: string;
  initialProjectId?: string;
}

export default function WorkspaceContainer({
  userId,
  initialWorkspaceId,
  initialProjectId
}: WorkspaceContainerProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(initialWorkspaceId || '');
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(initialProjectId);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If no workspace is provided, we'll fetch the default workspace for the user
    if (!initialWorkspaceId) {
      fetchDefaultWorkspace();
    } else {
      setIsLoading(false);
    }
  }, [initialWorkspaceId]);

  const fetchDefaultWorkspace = async () => {
    setIsLoading(true);
    
    try {
      // This would be a real API call in a production app
      // const response = await fetch(`/api/users/${userId}/default-workspace`);
      // const data = await response.json();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 800));
      setActiveWorkspaceId('ws-default-123');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch default workspace:', error);
      toast.error('Failed to load your workspace');
      setIsLoading(false);
    }
  };

  const handleWorkspaceChange = (workspaceId: string | null) => {
    setActiveWorkspaceId(workspaceId || '');
    setActiveProjectId(undefined); // Reset project when changing workspaces
  };

  const handleProjectSelect = (projectId: string | null) => {
    setActiveProjectId(projectId || undefined);
  };

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <div className="h-screen flex bg-zinc-950">
      <div 
        className={`
          h-full transition-all duration-300 ease-in-out overflow-hidden border-r border-zinc-800
          ${sidebarVisible ? 'w-64' : 'w-0'}
        `}
      >
        {sidebarVisible && (
          <WorkspaceSidebar
            userId={userId}
            selectedWorkspaceId={activeWorkspaceId}
            setSelectedWorkspaceId={handleWorkspaceChange}
            selectedProjectId={activeProjectId}
            setSelectedProjectId={handleProjectSelect}
            sidebarOpen={true}
            setSidebarOpen={(isOpen) => setSidebarVisible(isOpen)}
          />
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Workbench 
          projectId={activeProjectId}
          workspaceId={activeWorkspaceId}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}