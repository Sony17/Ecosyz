'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/ui';

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived' | 'draft';
  category: string;
  createdAt: string;
  updatedAt: string;
  collaborators: number;
  tasks: number;
  progress: number;
  thumbnail?: string;
  tags: string[];
}

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onClick: (projectId: string) => void;
}

export default function ProjectCard({ project, viewMode, onClick }: ProjectCardProps) {
  // Status colors
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all cursor-pointer",
        viewMode === 'list' ? "flex" : ""
      )}
      onClick={() => onClick(project.id)}
    >
      {/* Project Thumbnail */}
      {viewMode === 'grid' && (
        <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <div className="text-zinc-600 text-4xl font-bold">
            {project.title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className={cn(
        "p-4",
        viewMode === 'list' ? "flex-grow" : ""
      )}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-zinc-100 font-medium line-clamp-2 flex-grow mr-2">
            {project.title}
          </h3>
          <span className={cn(
            "px-2 py-1 text-xs rounded-full border flex-shrink-0",
            getStatusColor(project.status)
          )}>
            {project.status}
          </span>
        </div>

        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center space-x-3">
            <span>{project.collaborators} collaborators</span>
            <span>{project.tasks} tasks</span>
          </div>
          <span>
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}