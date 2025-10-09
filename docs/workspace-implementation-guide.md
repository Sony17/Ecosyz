# ChatGPT-Like Workspace Implementation Guide

This guide provides step-by-step instructions for implementing the remaining components of the ChatGPT-like workspace interface.

## 1. Left Sidebar Navigation

### Implementation Steps:

1. **Update ChatGPTWorkspace.tsx**:
   - Enhance the existing sidebar with proper collapsing animation
   - Add workspace categories (Recent, Pinned, Archived)
   - Include project filtering functionality

```tsx
// Example sidebar enhancement
<motion.div
  initial={false}
  animate={{ width: sidebarOpen ? '280px' : '0px' }}
  className={`relative flex-shrink-0 border-r border-white/10 overflow-hidden ${
    sidebarOpen ? 'flex flex-col' : 'hidden'
  }`}
>
  {/* Sidebar Header with Logo */}
  <div className="p-4 border-b border-white/10 flex items-center">
    <div className="flex-1">
      <h2 className="text-xl font-semibold">OpenIdea</h2>
    </div>
    <button
      onClick={() => setSidebarOpen(false)}
      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  </div>
  
  {/* New Project Button */}
  <div className="p-2">
    <button
      onClick={() => setShowAddResourceModal(true)}
      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
    >
      <Plus className="w-5 h-5" />
      <span>New Project</span>
    </button>
  </div>
  
  {/* Workspace Navigation */}
  <div className="px-2 py-4 border-b border-white/10">
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg">
      <Home className="w-5 h-5" />
      <span className="text-sm">Home</span>
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg">
      <Star className="w-5 h-5" />
      <span className="text-sm">Starred</span>
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg">
      <Clock className="w-5 h-5" />
      <span className="text-sm">Recent</span>
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg">
      <Lightbulb className="w-5 h-5" />
      <span className="text-sm">Community</span>
    </button>
  </div>
  
  {/* Rest of sidebar content... */}
</motion.div>
```

2. **Create Collapsible Button**:
   - Add a button to expand the sidebar when it's collapsed
   - Ensure smooth transitions between states

```tsx
// Collapsed sidebar button
{!sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(true)}
    className="fixed left-4 top-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
)}
```

## 2. User Profile System

### Implementation Steps:

1. **Enhance ProfileForm.tsx**:
   - Add subscription management section
   - Include user preferences (theme, notifications)
   - Add avatar upload functionality

2. **Create User Settings Component**:

```tsx
// UserSettings.tsx
import { useState, useEffect } from 'react';
import { User, Settings, Bell, CreditCard, Shield } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

export default function UserSettings({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 flex items-center gap-2 ${
            activeTab === 'profile' ? 'border-b-2 border-emerald-500' : ''
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
        
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-3 flex items-center gap-2 ${
            activeTab === 'subscription' ? 'border-b-2 border-emerald-500' : ''
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Subscription</span>
        </button>
        
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-3 flex items-center gap-2 ${
            activeTab === 'appearance' ? 'border-b-2 border-emerald-500' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Appearance</span>
        </button>
        
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-3 flex items-center gap-2 ${
            activeTab === 'notifications' ? 'border-b-2 border-emerald-500' : ''
          }`}
        >
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </button>
      </div>
      
      <div className="p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <AvatarUploader currentUser={user} />
              <div>
                <h3 className="text-xl font-medium">{user?.name || 'User'}</h3>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
            
            {/* Profile form fields */}
            {/* ... */}
          </div>
        )}
        
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Subscription</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Subscription plan cards */}
              {/* ... */}
            </div>
          </div>
        )}
        
        {/* Other tabs */}
        {/* ... */}
      </div>
    </div>
  );
}
```

## 3. Project Creation & Management

### Implementation Steps:

1. **Enhance AddResourceForm.tsx**:
   - Rename to ProjectCreationModal.tsx
   - Add project templates
   - Include privacy settings

2. **Create Project Card Component**:

```tsx
// ProjectCard.tsx
import { useState } from 'react';
import { MoreHorizontal, Star, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectCard({ project, onSelect }) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden hover:ring-1 hover:ring-emerald-500 transition-all"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium truncate">{project.title}</h3>
          
          {showActions && (
            <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 hover:text-emerald-500 transition-colors">
                <Star className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-400 truncate mb-4">
          {project.description || 'No description'}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(project.createdAt))} ago</span>
          </div>
          <span>{project.resources?.length || 0} resources</span>
        </div>
      </div>
      
      <button
        onClick={() => onSelect(project)}
        className="w-full p-2 text-center text-sm bg-gray-700 hover:bg-emerald-600 transition-colors"
      >
        Open Project
      </button>
    </div>
  );
}
```

3. **Create Project Grid Component**:

```tsx
// ProjectGrid.tsx
import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects, onSelectProject }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={onSelectProject}
        />
      ))}
      
      {projects.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-center">No projects yet</p>
          <button className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
            Create your first project
          </button>
        </div>
      )}
    </div>
  );
}
```

## 4. Chat-Style Interaction

### Implementation Steps:

1. **Create ChatInterface Component**:

```tsx
// ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, PaperclipIcon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a sample response from the AI. In a real implementation, this would come from the backend API.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Message history */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <div className="text-xs opacity-70 text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <PaperclipIcon className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-400 rounded-full transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 5. Community Features

### Implementation Steps:

1. **Create CommunitySection Component**:

```tsx
// CommunitySection.tsx
import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function CommunitySection() {
  const [communityProjects, setCommunityProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch community projects based on activeTab
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from the API
        // const res = await fetch(`/api/community/projects?filter=${activeTab}`);
        // const data = await res.json();
        // setCommunityProjects(data.projects);
        
        // Mock data
        setCommunityProjects([
          {
            id: '1',
            title: 'Machine Learning Research Compilation',
            description: 'A collection of ML papers and code repositories',
            createdAt: new Date().toISOString(),
            createdBy: 'ai_researcher',
            resources: Array(12).fill(null),
            likes: 120,
          },
          {
            id: '2',
            title: 'Web Development Best Practices',
            description: 'Frontend and backend guides and resources',
            createdAt: new Date().toISOString(),
            createdBy: 'web_dev_pro',
            resources: Array(8).fill(null),
            likes: 84,
          },
        ]);
      } catch (error) {
        console.error('Error fetching community projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [activeTab]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold mb-4">Community</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
              activeTab === 'trending'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
              activeTab === 'featured'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'hover:bg-white/5'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Featured</span>
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
              activeTab === 'following'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Following</span>
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg h-40 animate-pulse"
                ></div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Next Steps

After implementing these components, you should:

1. **Integrate Components**:
   - Update ChatGPTWorkspace.tsx to use all the new components
   - Create proper navigation between workspace views

2. **Test Responsiveness**:
   - Add responsive styles for mobile and tablet views
   - Test on different device sizes

3. **Add Animations**:
   - Use Framer Motion for smooth transitions between states
   - Add loading animations and feedback

4. **Connect to Backend**:
   - Wire up all components to the actual API endpoints
   - Implement proper error handling

5. **User Testing**:
   - Get feedback from users
   - Refine the UI based on feedback