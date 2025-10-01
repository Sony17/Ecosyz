"use client";
import React, { useState } from 'react';
import ProjectSidebar from './ProjectSidebar';
import { FileText, BookOpen, StickyNote, Sparkles, Users, Share2, Save, Plus } from 'lucide-react';

type Workspace = {
  id: string;
  title: string;
  createdAt: string;
  resources: any[];
  shareLinks: any[];
};

type ProjectPanelProps = {
  workspaces: Workspace[];
  onSelectWorkspace: (ws: Workspace) => void;
};

export default function ProjectPanel({ workspaces, onSelectWorkspace }: ProjectPanelProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [projects, setProjects] = useState([{
    id: 'new-1',
    title: '',
    description: '',
    resources: [],
    annotations: [],
    brainstorm: [],
    team: [],
    shareLink: ''
  }]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const currentProject = projects[currentProjectIndex];

  // Placeholder handlers
  const handleSave = () => {/* Save logic */};
  const handleAddResource = () => {/* Add resource logic */};
  const handleAddAnnotation = () => {/* Add annotation logic */};
  const handleBrainstorm = () => {/* Brainstorm logic */};
  const handleInvite = () => {/* Invite logic */};
  const handleShare = () => {/* Share logic */};

  const addNewProject = () => {
    const newProject = {
      id: `new-${projects.length + 1}`,
      title: '',
      description: '',
      resources: [],
      annotations: [],
      brainstorm: [],
      team: [],
      shareLink: ''
    };
    setProjects([...projects, newProject]);
    setCurrentProjectIndex(projects.length);
  };

  const updateCurrentProject = (field: string, value: any) => {
    const updatedProjects = [...projects];
    updatedProjects[currentProjectIndex] = { ...currentProject, [field]: value };
    setProjects(updatedProjects);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#181c20] text-white">
      {/* Header with Create New Project */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Project Management</h2>
          <button
            onClick={addNewProject}
            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Project
          </button>
        </div>

        {/* Project Tabs */}
        {projects.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setCurrentProjectIndex(index)}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  index === currentProjectIndex
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                {project.title || `Project ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Existing Projects List */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Existing Projects</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => onSelectWorkspace(ws)}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg truncate"
              >
                {ws.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Creation Interface */}
      <div className="flex flex-1">
        {/* Feature Tabs Sidebar */}
        <div className="w-64 border-r border-white/10 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Project Features</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeTab === 'details'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Project Details</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeTab === 'resources'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Resources</span>
            </button>
            <button
              onClick={() => setActiveTab('annotations')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeTab === 'annotations'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <StickyNote className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Annotations</span>
            </button>
            <button
              onClick={() => setActiveTab('brainstorm')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeTab === 'brainstorm'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Brainstorm</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeTab === 'team'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Team</span>
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeTab === 'share'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {activeTab === 'details' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" /> Project Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={currentProject.title}
                    onChange={e => updateCurrentProject('title', e.target.value)}
                    placeholder="Enter project title..."
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Description</label>
                  <textarea
                    value={currentProject.description}
                    onChange={e => updateCurrentProject('description', e.target.value)}
                    placeholder="Describe your project or idea..."
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none"
                    rows={6}
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-lg shadow hover:scale-105 transition"
                >
                  <Save className="w-4 h-4 inline mr-2" /> Save Project
                </button>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Resources
              </h2>
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <button
                  onClick={handleAddResource}
                  className="px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Resource
                </button>
              </div>
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No resources added yet</p>
              </div>
            </div>
          )}

          {activeTab === 'annotations' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <StickyNote className="w-6 h-6" /> Annotations
              </h2>
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <button
                  onClick={handleAddAnnotation}
                  className="px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Annotation
                </button>
              </div>
              <div className="text-center py-8 text-gray-400">
                <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No annotations added yet</p>
              </div>
            </div>
          )}

          {activeTab === 'brainstorm' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6" /> Brainstorm
              </h2>
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <button
                  onClick={handleBrainstorm}
                  className="px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Idea
                </button>
              </div>
              <div className="text-center py-8 text-gray-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No ideas brainstormed yet</p>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" /> Team
              </h2>
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <button
                  onClick={handleInvite}
                  className="px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Invite Member
                </button>
              </div>
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No team members added yet</p>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Share2 className="w-6 h-6" /> Share
              </h2>
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <button
                  onClick={handleShare}
                  className="px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Generate Share Link
                </button>
              </div>
              <div className="text-center py-8 text-gray-400">
                <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No share links created yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
