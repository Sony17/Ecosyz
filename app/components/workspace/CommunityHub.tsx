'use client';

import { useState, useEffect } from 'react';
import { User, MessageSquare, ThumbsUp, Share2, Clock, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  isLiked?: boolean;
}

interface CommunityFeed {
  featured: CommunityPost[];
  recent: CommunityPost[];
  popular: CommunityPost[];
}

export default function CommunityHub() {
  const [feed, setFeed] = useState<CommunityFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'recent' | 'popular'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Fetch community feed
  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        // Mock data
        const mockFeed: CommunityFeed = {
          featured: [
            {
              id: 'post-1',
              title: 'Best practices for organizing research workspaces',
              content: "I've been using Ecosyz for my PhD research and wanted to share how I organize my academic papers and notes...",
              author: {
                id: 'user-1',
                name: 'Emma Watson',
                avatar: 'https://i.pravatar.cc/150?img=1'
              },
              likes: 45,
              comments: 12,
              tags: ['organization', 'research', 'academic'],
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'post-2',
              title: 'Using Ecosyz for collaborative writing projects',
              content: "Our team has been using Ecosyz for a multi-author book project. Here's our workflow...",
              author: {
                id: 'user-2',
                name: 'David Chen',
                avatar: 'https://i.pravatar.cc/150?img=8'
              },
              likes: 37,
              comments: 8,
              tags: ['collaboration', 'writing', 'teams'],
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
          recent: [
            {
              id: 'post-3',
              title: 'Integrating Ecosyz with my note-taking system',
              content: "I've been using a combination of Obsidian and Ecosyz for my personal knowledge management. Here's how I set it up...",
              author: {
                id: 'user-3',
                name: 'Sophie Turner',
                avatar: 'https://i.pravatar.cc/150?img=5'
              },
              likes: 12,
              comments: 4,
              tags: ['PKM', 'notes', 'integration'],
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'post-4',
              title: 'Feature request: Enhanced PDF highlighting',
              content: "I'd love to see more advanced PDF annotation features like...",
              author: {
                id: 'user-4',
                name: 'Marcus Johnson',
                avatar: 'https://i.pravatar.cc/150?img=12'
              },
              likes: 24,
              comments: 16,
              tags: ['feature-request', 'PDF', 'annotation'],
              createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
            },
          ],
          popular: [
            {
              id: 'post-5',
              title: 'How I use Ecosyz for medical research',
              content: "As a medical researcher, I've found Ecosyz particularly useful for organizing clinical studies...",
              author: {
                id: 'user-5',
                name: 'Dr. Sarah Williams',
                avatar: 'https://i.pravatar.cc/150?img=9'
              },
              likes: 87,
              comments: 24,
              tags: ['medical', 'research', 'clinical'],
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'post-6',
              title: 'Building a second brain with Ecosyz',
              content: "I've been applying the PARA method within Ecosyz to build my second brain...",
              author: {
                id: 'user-6',
                name: 'Alex Thompson',
                avatar: 'https://i.pravatar.cc/150?img=3'
              },
              likes: 65,
              comments: 18,
              tags: ['productivity', 'PKM', 'second-brain'],
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        };
        
        setFeed(mockFeed);
      } catch (error) {
        console.error('Error fetching community feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeed();
  }, []);
  
  const handleLike = (postId: string) => {
    setFeed(prevFeed => {
      if (!prevFeed) return null;
      
      const updatePost = (post: CommunityPost) => {
        if (post.id === postId) {
          return { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          };
        }
        return post;
      };
      
      return {
        featured: prevFeed.featured.map(updatePost),
        recent: prevFeed.recent.map(updatePost),
        popular: prevFeed.popular.map(updatePost),
      };
    });
  };
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Get all unique tags from feed
  const allTags = feed ? [
    ...new Set([
      ...feed.featured.flatMap(post => post.tags),
      ...feed.recent.flatMap(post => post.tags),
      ...feed.popular.flatMap(post => post.tags)
    ])
  ] : [];
  
  // Filter posts based on search and tags
  const filteredPosts = feed ? {
    featured: feed.featured.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    }),
    recent: feed.recent.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    }),
    popular: feed.popular.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    }),
  } : null;
  
  // Format date relative to now
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  const getActivePosts = () => {
    if (!filteredPosts) return [];
    return filteredPosts[activeTab];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 mb-6">
              <h2 className="font-semibold text-lg mb-4">Community Hub</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('featured')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'featured' ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-300'}`}
                >
                  <span className="flex-grow text-left">Featured</span>
                </button>
                <button 
                  onClick={() => setActiveTab('recent')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'recent' ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-300'}`}
                >
                  <span className="flex-grow text-left">Recent</span>
                  <Clock className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('popular')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'popular' ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-300'}`}
                >
                  <span className="flex-grow text-left">Popular</span>
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filter by Tags</h2>
                {selectedTags.length > 0 && (
                  <button 
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-grow">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Discussions</h1>
              
              {/* Search */}
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 pl-9 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              </div>
            </div>
            
            {isLoading ? (
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-zinc-700 rounded-full mb-4"></div>
                  <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                </div>
              </div>
            ) : getActivePosts().length === 0 ? (
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No discussions found</h2>
                <p className="text-zinc-400 mb-6">
                  {searchQuery || selectedTags.length > 0 
                    ? 'Try adjusting your filters or search terms'
                    : 'Be the first to start a discussion in this category'}
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                  Start a Discussion
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {getActivePosts().map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-zinc-800/80 transition-colors"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-zinc-700 rounded-full overflow-hidden mr-3">
                        <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link href={`/profile/${post.author.id}`} className="text-sm font-medium hover:text-indigo-400">
                          {post.author.name}
                        </Link>
                        <div className="text-xs text-zinc-500">
                          {formatRelativeTime(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/community/post/${post.id}`}>
                      <h2 className="text-lg font-semibold mb-2 hover:text-indigo-400">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-zinc-300 mb-3">
                      {post.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-zinc-700 text-zinc-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-sm text-zinc-400 space-x-4">
                      <button 
                        className={`flex items-center space-x-1 ${post.isLiked ? 'text-indigo-400' : ''}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      
                      <Link href={`/community/post/${post.id}`} className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </Link>
                      
                      <button className="flex items-center space-x-1 ml-auto">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <button className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700">
                  1
                </button>
                <button className="px-3 py-1 bg-zinc-700 text-zinc-200 rounded">
                  2
                </button>
                <button className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700">
                  3
                </button>
                <button className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700">
                  ...
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}