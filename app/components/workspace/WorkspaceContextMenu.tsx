'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Share2, Plus, Star, Trash2, Edit, BookOpen } from 'lucide-react';

interface WorkspaceContextMenuProps {
  workspaceId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddResource?: () => void;
  onShare?: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export default function WorkspaceContextMenu({
  workspaceId,
  position,
  onClose,
  onEdit,
  onDelete,
  onAddResource,
  onShare,
  isPinned = false,
  onTogglePin
}: WorkspaceContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg py-1 w-48"
      style={{
        top: position.y,
        left: position.x,
        transformOrigin: 'top right'
      }}
    >
      <button
        onClick={() => {
          if (onAddResource) onAddResource();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 text-left"
      >
        <Plus className="w-4 h-4" />
        <span>Add resource</span>
      </button>
      
      <button
        onClick={() => {
          if (onShare) onShare();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 text-left"
      >
        <Share2 className="w-4 h-4" />
        <span>Share workspace</span>
      </button>
      
      <button
        onClick={() => {
          if (onTogglePin) onTogglePin();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 text-left"
      >
        <Star className={`w-4 h-4 ${isPinned ? 'text-yellow-400' : ''}`} />
        <span>{isPinned ? 'Unpin workspace' : 'Pin to top'}</span>
      </button>
      
      <button
        onClick={() => {
          if (onEdit) onEdit();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 text-left"
      >
        <Edit className="w-4 h-4" />
        <span>Rename</span>
      </button>
      
      <div className="border-t border-zinc-800 my-1"></div>
      
      <button
        onClick={() => {
          if (onDelete) onDelete();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 text-left"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete workspace</span>
      </button>
    </motion.div>
  );
}