'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PanelLeft, Sparkles, Zap } from 'lucide-react';
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
    <div className="flex h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] text-zinc-100">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-emerald-400/5 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Sidebar with Animation */}
      <motion.div
        initial={{ x: sidebarOpen ? 0 : -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3 
        }}
        className="relative z-10"
      >
        <WorkspaceSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedWorkspaceId={selectedWorkspace}
          setSelectedWorkspaceId={setSelectedWorkspace}
          onAddResource={() => setShowAddResourceModal(true)}
          onCreateWorkspace={() => setShowNewWorkspaceModal(true)}
          onShareWorkspace={() => setShowShareModal(true)}
        />
      </motion.div>

      {/* Main Content with Glass Effect */}
      <motion.div 
        className="flex-grow flex flex-col overflow-hidden relative backdrop-blur-sm bg-black/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Professional Header Bar */}
        {activeWorkspace && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-border-b px-6 py-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h1 className="text-xl font-semibold gradient-text">
                    {activeWorkspace.title}
                  </h1>
                </div>
                <motion.div
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 text-xs font-medium text-emerald-300 border border-emerald-400/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Zap className="w-3 h-3 inline mr-1" />
                  AI-Enhanced
                </motion.div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Created</span>
                <span className="text-emerald-400">
                  {new Date(activeWorkspace.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sidebar Toggle Button - Enhanced */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="absolute left-4 top-4 p-3 glass rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-200 z-20 group shadow-lg"
            >
              <PanelLeft className="w-5 h-5" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main Content Area with Fade In */}
        <motion.div 
          className="flex-grow overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <WorkspacePageClient workspace={activeWorkspace} />
        </motion.div>
      </motion.div>

      {/* Enhanced Modals with Professional Animations */}
      <AnimatePresence mode="wait">
        {showAddResourceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <AddResourceForm
                workspaceId={selectedWorkspace || ''}
                onClose={() => setShowAddResourceModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ShareLinksPanel
                workspaceId={selectedWorkspace || ''}
                onClose={() => setShowShareModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showNewWorkspaceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <NewWorkspaceModal
                onClose={() => setShowNewWorkspaceModal(false)}
                onWorkspaceCreated={(workspaceId) => {
                  setSelectedWorkspace(workspaceId);
                  toast.success("Workspace created successfully! 🎉", {
                    description: "You've been switched to your new workspace.",
                    duration: 5000,
                    style: {
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                    },
                  });
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}