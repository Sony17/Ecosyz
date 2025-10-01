import { FileText, BookOpen, StickyNote, Sparkles, Users, Share2 } from 'lucide-react';

type ProjectSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function ProjectSidebar({ activeTab, setActiveTab }: ProjectSidebarProps) {
  const tabs = [
    { key: 'details', label: 'Project Details', icon: FileText },
    { key: 'resources', label: 'Resources', icon: BookOpen },
    { key: 'annotations', label: 'Annotations', icon: StickyNote },
    { key: 'brainstorm', label: 'Brainstorm', icon: Sparkles },
    { key: 'team', label: 'Team', icon: Users },
    { key: 'share', label: 'Share', icon: Share2 },
  ];

  return (
    <aside className="w-72 bg-black/30 border-r border-white/10 p-6 flex flex-col gap-6 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-emerald-400" />
        <span className="text-2xl font-bold">Project</span>
      </div>
      <nav className="flex flex-col gap-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 text-lg font-medium hover:text-emerald-400 ${activeTab === tab.key ? 'text-emerald-400' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
