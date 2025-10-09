'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Share2,
  Users,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Plus,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/ui';

interface Project {
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
  tags: string[];
  owner: {
    name: string;
    avatar: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'chat'>('overview');

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);

      try {
        // In a real app, this would fetch from your API
        // const response = await fetch(`/api/projects/${projectId}`);
        // const data = await response.json();

        // Mock data for demonstration
        setTimeout(() => {
          const mockProject: Project = {
            id: projectId,
            title: "E-commerce Platform Redesign",
            description: "A comprehensive redesign of our e-commerce platform focusing on improved user experience, modern design patterns, and enhanced performance. The project includes mobile optimization, accessibility improvements, and integration with our new payment system.",
            status: 'active',
            category: 'Web Development',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            collaborators: 5,
            tasks: 24,
            progress: 65,
            tags: ['React', 'TypeScript', 'TailwindCSS', 'Stripe', 'PostgreSQL'],
            owner: {
              name: 'Sarah Johnson',
              avatar: 'https://i.pravatar.cc/150?u=sarah'
            }
          };

          const mockTasks: Task[] = Array.from({ length: 8 }, (_, index) => ({
            id: `task-${index + 1}`,
            title: [
              "Design new product card component",
              "Implement responsive navigation",
              "Set up payment integration",
              "Create user authentication flow",
              "Optimize database queries",
              "Add accessibility features",
              "Write unit tests",
              "Deploy to production"
            ][index % 8],
            description: "Complete the implementation with proper testing and documentation.",
            status: ['todo', 'in-progress', 'completed'][Math.floor(Math.random() * 3)] as Task['status'],
            assignee: ['Sarah Johnson', 'Mike Chen', 'Alex Rivera', 'Emma Davis'][Math.floor(Math.random() * 4)],
            dueDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Task['priority']
          }));

          setProject(mockProject);
          setTasks(mockTasks);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading project:', error);
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

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

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'todo':
        return 'bg-zinc-500/20 text-zinc-400';
      default:
        return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-zinc-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-zinc-400 mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-zinc-400 mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/projects')}
                className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">{project.title}</h1>
                <p className="text-sm text-zinc-400">{project.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={cn(
                "px-3 py-1 text-xs rounded-full border",
                getStatusColor(project.status)
              )}>
                {project.status}
              </span>
              <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md">
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="border-b border-zinc-800">
              <div className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'tasks', label: 'Tasks' },
                  { id: 'chat', label: 'Discussion' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "py-3 border-b-2 text-sm font-medium",
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-400"
                        : "border-transparent text-zinc-400 hover:text-zinc-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Description */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-white mb-4">Description</h2>
                  <p className="text-zinc-300 leading-relaxed">{project.description}</p>
                </div>

                {/* Progress */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-white">Progress</h2>
                    <span className="text-2xl font-bold text-emerald-400">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-500 mt-2">
                    <span>{project.tasks} total tasks</span>
                    <span>{Math.round(project.tasks * project.progress / 100)} completed</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-white mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Tasks</h2>
                  <button className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md">
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              getTaskStatusColor(task.status)
                            )}>
                              {task.status === 'in-progress' ? 'In Progress' : task.status}
                            </span>
                            <span className={cn(
                              "text-xs font-medium",
                              getPriorityColor(task.priority)
                            )}>
                              {task.priority} priority
                            </span>
                          </div>
                          <h3 className="text-white font-medium mb-1">{task.title}</h3>
                          <p className="text-zinc-400 text-sm mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                            {task.assignee && <span>Assigned to {task.assignee}</span>}
                            {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                          </div>
                        </div>
                        <button className="p-1 text-zinc-400 hover:text-zinc-200">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Placeholder for chat - will be implemented */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">Project Discussion</h3>
                    <p className="text-zinc-500">Chat functionality will be available soon.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">Project Info</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-zinc-300 text-sm">{project.collaborators} collaborators</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-zinc-300 text-sm">Created {new Date(project.createdAt).toLocaleDateString()}</p>
                    <p className="text-zinc-500 text-xs">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-xs text-zinc-300">{project.owner.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-zinc-300 text-sm">Owner: {project.owner.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-md transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-md transition-colors">
                  <Users className="w-4 h-4" />
                  Invite Collaborators
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-md transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Start Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}