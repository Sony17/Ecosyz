'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Folder, MessageSquare, FilePlus, FolderPlus } from 'lucide-react';

export default function WorkspaceDemo() {
  const router = useRouter();
  
  // Redirect to our demo workspace
  const startDemo = () => {
    router.push('/workspace-chat-demo');
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <Folder className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            Workspace Experience
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Experience the ChatGPT-like workspace with intelligent AI assistance, 
            project management, and resource organization.
          </p>
          
          <button
            onClick={startDemo}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-lg font-medium transition-colors"
          >
            Start Demo Workspace
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
        >
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">AI Chat Interface</h3>
            <p className="text-zinc-400 text-sm">Interact with AI to get assistance, generate content, and solve problems.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 flex items-center justify-center mb-4">
              <FilePlus className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Resource Management</h3>
            <p className="text-zinc-400 text-sm">Save and organize resources like links, notes, and files in your workspace.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 flex items-center justify-center mb-4">
              <FolderPlus className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Project Organization</h3>
            <p className="text-zinc-400 text-sm">Create and manage projects with dedicated workspaces for different topics.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}