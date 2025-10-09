'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/ui';
import ProjectCard, { Project } from '../components/projects/ProjectCard';

interface ProjectsPageProps {
  initialView?: 'grid' | 'list';
  initialFilter?: string;
  initialSort?: 'newest' | 'oldest' | 'name' | 'progress';
}

export default function ProjectsPage({
  initialView = 'grid',
  initialFilter = 'all',
  initialSort = 'newest'
}: ProjectsPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'progress'>(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);

      try {
        // In a real app, this would fetch from your API
        // const response = await fetch('/api/projects');
        // const data = await response.json();

        // Mock data for demonstration
        setTimeout(() => {
          const mockProjects: Project[] = Array.from({ length: 12 }, (_, index) => ({
            id: `project-${index + 1}`,
            title: [
              "E-commerce Platform Redesign",
              "Mobile App Development",
              "Data Analytics Dashboard",
              "AI Chatbot Implementation",
              "Content Management System",
              "API Integration Project",
              "User Research Study",
              "Brand Identity Design",
              "Database Optimization",
              "Security Audit",
              "Performance Monitoring",
              "Team Collaboration Tool"
            ][index % 12],
            description: "A comprehensive project focused on delivering high-quality solutions with modern technologies and best practices.",
            status: ['active', 'completed', 'archived', 'draft'][Math.floor(Math.random() * 4)] as Project['status'],
            category: ['Web Development', 'Mobile', 'Data Science', 'AI/ML', 'Design', 'DevOps'][Math.floor(Math.random() * 6)],
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            collaborators: Math.floor(Math.random() * 8) + 1,
            tasks: Math.floor(Math.random() * 50) + 5,
            progress: Math.floor(Math.random() * 100),
            tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'].slice(0, Math.floor(Math.random() * 4) + 1)
          }));

          setProjects(mockProjects);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading projects:', error);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

  // Handle create new project
  const handleCreateProject = () => {
    router.push('/workspaces/projects/new');
  };

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    router.push(`/workspaces/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Projects
              </h1>
              <p className="mt-2 text-lg text-zinc-400 max-w-3xl">
                Manage and track your projects, collaborate with team members, and monitor progress.
              </p>
            </div>

            {status === 'authenticated' && (
              <div className="mt-6 lg:mt-0">
                <button
                  onClick={handleCreateProject}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-3 py-2 border rounded-md flex items-center gap-2 text-sm",
                  showFilters
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                )}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <div className="flex border border-zinc-700 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-3 py-2 text-sm border-r border-zinc-700",
                    viewMode === 'grid'
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-300 hover:bg-zinc-700"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "px-3 py-2 text-sm",
                    viewMode === 'list'
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-300 hover:bg-zinc-700"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-zinc-800 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', name: 'All Projects' },
                      { id: 'active', name: 'Active' },
                      { id: 'completed', name: 'Completed' },
                      { id: 'archived', name: 'Archived' },
                      { id: 'draft', name: 'Draft' }
                    ].map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setStatusFilter(status.id)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full border",
                          statusFilter === status.id
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        )}
                      >
                        {status.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'newest', name: 'Newest', icon: SortDesc },
                      { id: 'oldest', name: 'Oldest', icon: SortAsc },
                      { id: 'name', name: 'Name', icon: null },
                      { id: 'progress', name: 'Progress', icon: null }
                    ].map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => setSortBy(sort.id as any)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                          sortBy === sort.id
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        )}
                      >
                        {sort.icon && <sort.icon className="w-3 h-3" />}
                        <span>{sort.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setSortBy('newest');
                      }}
                      className="px-3 py-1.5 text-xs rounded-full border bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Projects Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Results Info */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
          <div className="text-zinc-400 text-sm">
            Showing {filteredAndSortedProjects.length} projects
            {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
            {statusFilter !== 'all' && <span> with status {statusFilter}</span>}
          </div>
        </div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-zinc-400 mt-4">Loading projects...</p>
            </div>
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center">
            <Plus className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-300 mb-2">No projects found</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-6">
              {searchQuery || statusFilter !== 'all'
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "Get started by creating your first project."
              }
            </p>
            {(!searchQuery && statusFilter === 'all') && (
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {filteredAndSortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
