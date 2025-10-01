'use client';
import { useState } from 'react';
import { Sparkles, Users, BookOpen, Share2, Save, StickyNote, Brain, FileText, Plus } from 'lucide-react';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [team, setTeam] = useState([]);
  const [brainstorm, setBrainstorm] = useState([]);
  const [shareLink, setShareLink] = useState('');

  // Placeholder handlers
  const handleSave = () => {/* Save logic */};
  const handleAddResource = () => {/* Add resource logic */};
  const handleAddAnnotation = () => {/* Add annotation logic */};
  const handleInvite = () => {/* Invite logic */};
  const handleBrainstorm = () => {/* Brainstorm logic */};
  const handleShare = () => {/* Share logic */};

  return (
    <div className="min-h-screen flex bg-[#181c20] text-white">
      {/* Sidebar */}
      <aside className="w-80 bg-black/30 border-r border-white/10 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-bold">Create Project</span>
        </div>
        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-2 text-lg font-medium hover:text-emerald-400">
            <FileText className="w-5 h-5" /> Project Details
          </button>
          <button className="flex items-center gap-2 text-lg font-medium hover:text-emerald-400">
            <BookOpen className="w-5 h-5" /> Resources
          </button>
          <button className="flex items-center gap-2 text-lg font-medium hover:text-emerald-400">
            <StickyNote className="w-5 h-5" /> Annotations
          </button>
          <button className="flex items-center gap-2 text-lg font-medium hover:text-emerald-400">
            <Sparkles className="w-5 h-5" /> Brainstorm
          </button>
          <button className="flex items-center gap-2 text-lg font-medium hover:text-emerald-400">
            <Users className="w-5 h-5" /> Team
          </button>
          <button className="flex items-center gap-2 text-lg font-medium hover:text-emerald-400">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Project Details */}
          <section className="bg-black/30 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Project Details</h2>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Project Title"
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400"
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your project or idea..."
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400"
              rows={4}
            />
            <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-lg shadow hover:scale-105 transition">
              <Save className="w-4 h-4 inline mr-2" /> Save Project
            </button>
          </section>
          {/* Resources */}
          <section className="bg-black/30 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Resources</h2>
            {/* Resource list and add form placeholder */}
            <button onClick={handleAddResource} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Resource
            </button>
          </section>
          {/* Annotations */}
          <section className="bg-black/30 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><StickyNote className="w-5 h-5" /> Annotations</h2>
            {/* Annotation list and add form placeholder */}
            <button onClick={handleAddAnnotation} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Annotation
            </button>
          </section>
          {/* Brainstorming */}
          <section className="bg-black/30 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Brainstorm</h2>
            {/* Brainstorm ideas placeholder */}
            <button onClick={handleBrainstorm} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Idea
            </button>
          </section>
          {/* Team */}
          <section className="bg-black/30 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Team</h2>
            {/* Team management placeholder */}
            <button onClick={handleInvite} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Invite Member
            </button>
          </section>
          {/* Share */}
          <section className="bg-black/30 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Share2 className="w-5 h-5" /> Share</h2>
            {/* Share link and permissions placeholder */}
            <button onClick={handleShare} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Generate Share Link
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
