'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Zap, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface NewWorkspaceModalProps {
  onClose: () => void;
  onWorkspaceCreated: (workspaceId: string) => void;
}

export default function NewWorkspaceModal({ onClose, onWorkspaceCreated }: NewWorkspaceModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Suggested workspace names for inspiration
  const suggestions = [
    "AI Innovation Lab", 
    "Creative Code Studio", 
    "Next.js Playground", 
    "React Development Hub",
    "OpenIdea Workspace",
    "Full-Stack Project"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Workspace title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create workspace');
      }

      const data = await response.json();
      toast.success('Workspace created successfully!');
      onWorkspaceCreated(data.id);
      onClose();
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-strong rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg border border-emerald-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with OpenIdea Branding */}
        <div className="relative px-6 py-5 glass-border-b">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image src="/eco.png" alt="OpenIdea" width={32} height={32} />
                <span className="text-lg font-bold gradient-text">OpenIdea</span>
              </div>
              <div className="w-px h-6 bg-gradient-to-b from-emerald-400/50 to-cyan-400/50"></div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Create Workspace
              </h2>
            </div>
            <motion.button 
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </motion.button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Inspiring Description */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">Start your next big idea</span>
            </div>
          </motion.div>

          {/* Workspace Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-3">
              Workspace Name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/60 transition-all duration-200"
              required
            />
            
            {/* Quick Suggestions */}
            {!title && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3 }}
                className="mt-3"
              >
                <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTitle(suggestion)}
                      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-lg text-gray-300 hover:text-emerald-300 transition-all duration-200"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="description" className="block text-sm font-semibold text-gray-200 mb-3">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'll build in this workspace..."
              rows={3}
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/60 resize-none transition-all duration-200"
            />
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex justify-between items-center pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-gray-900 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-400/25 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Create Workspace
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}