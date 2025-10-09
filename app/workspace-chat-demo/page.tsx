'use client';

import { useState } from 'react';
import Workbench from '../components/workspace/Workbench';
import WorkspaceSidebarNew from '../components/workspace/WorkspaceSidebarNew';
import { motion } from 'framer-motion';

export default function WorkspaceChatDemo() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeView, setActiveView] = useState<'chat' | 'resources' | 'settings'>('chat');
  
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };
  
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200">
      {/* Sidebar */}
      <WorkspaceSidebarNew 
        workspaceId="demo"
        isVisible={sidebarVisible}
        activeView={activeView}
        onChangeView={setActiveView}
      />
      
      {/* Main Content */}
      <Workbench 
        workspaceId="demo"
        sidebarVisible={sidebarVisible}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}