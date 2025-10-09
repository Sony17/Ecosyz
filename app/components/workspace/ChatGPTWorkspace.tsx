'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { toast } from 'sonner';

// Import existing components
import WorkspacePageClient from './WorkspacePageClient';
import AddResourceForm from './AddResourceForm';
import ShareLinksPanel from './ShareLinksPanel';
import WorkspaceSidebar from './WorkspaceSidebar';
import NewWorkspaceModal from './NewWorkspaceModal';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
  resources: any[];
  shareLinks: any[];
}

export default function ChatGPTWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const router = useRouter();

  // Fetch the active workspace when selectedWorkspace changes
  useEffect(() => {
    const fetchActiveWorkspace = async () => {
      if (selectedWorkspace) {
        try {
          const response = await fetch(`/api/workspaces/${selectedWorkspace}`);
          if (response.ok) {
            const data = await response.json();
            setActiveWorkspace(data);
          }
        } catch (error) {
          console.error('Error fetching active workspace:', error);
        }
      }
    };
    fetchActiveWorkspace();
  }, [selectedWorkspace]);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      {/* Enhanced Sidebar */}
      <WorkspaceSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedWorkspaceId={selectedWorkspace}
        setSelectedWorkspaceId={setSelectedWorkspace}
        onAddResource={() => setShowAddResourceModal(true)}
        onCreateWorkspace={() => setShowNewWorkspaceModal(true)}
        onShareWorkspace={() => setShowShareModal(true)}
      />

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        {/* Sidebar Toggle Button - Only visible when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-4 p-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors z-10"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        {/* Main Content Area */}
        <div className="flex-grow overflow-auto">
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

      {/* New Workspace Modal */}
      <AnimatePresence>
        {showNewWorkspaceModal && (
          <NewWorkspaceModal
            onClose={() => setShowNewWorkspaceModal(false)}
            onWorkspaceCreated={(workspaceId) => {
              setSelectedWorkspace(workspaceId);
              toast.success("Workspace created! You've been switched to the new workspace.");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}