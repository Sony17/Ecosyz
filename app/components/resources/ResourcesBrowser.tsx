'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, FileText, Image, Video, File, Download, Bookmark, Share2, MoreHorizontal, Star, Clock, ChevronDown, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import useResponsive from '../../../src/lib/hooks/useResponsive';
import { cn } from '../../../src/lib/ui';

// Resource types with their icons
const resourceTypeIcons = {
  document: <FileText className="w-5 h-5" />,
  image: <Image className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  file: <File className="w-5 h-5" />
};

// Mock category data
const categories = [
  { id: 'all', name: 'All Resources' },
  { id: 'programming', name: 'Programming' },
  { id: 'machine-learning', name: 'Machine Learning' },
  { id: 'ai', name: 'Artificial Intelligence' },
  { id: 'web-dev', name: 'Web Development' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'design', name: 'Design' }
];

// Mock tags
const tags = [
  'JavaScript', 'Python', 'React', 'Next.js', 'TensorFlow',
  'Machine Learning', 'Deep Learning', 'Neural Networks',
  'Data Visualization', 'API', 'Frontend', 'Backend',
  'Database', 'Cloud', 'DevOps', 'UI/UX', 'Responsive'
];

interface ResourceProps {
  searchQuery?: string;
  initialCategory?: string;
  userId?: string;
}

export default function ResourcesBrowser({ searchQuery = '', initialCategory = 'all', userId }: ResourceProps) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [resources, setResources] = useState<any[]>([]);
  const [query, setQuery] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUserResources, setIsUserResources] = useState(Boolean(userId));
  
  // Responsive detection
  const { isMobile, isTablet } = useResponsive();
  
  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch from an API with proper filtering
        // const response = await fetch(`/api/resources?category=${activeCategory}&q=${query}`);
        
        // Mock data for demo purposes
        setTimeout(() => {
          // Generate mock resources
          const mockResources = Array.from({ length: 20 }, (_, index) => {
            const types = ['document', 'image', 'video', 'file'];
            const type = types[Math.floor(Math.random() * types.length)];
            const viewCount = Math.floor(Math.random() * 500) + 20;
            const downloadCount = Math.floor(Math.random() * 100) + 5;
            const timestamp = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString();
            const tagCount = Math.floor(Math.random() * 4) + 1;
            const resourceTags = Array.from({ length: tagCount }, () => {
              return tags[Math.floor(Math.random() * tags.length)];
            });
            
            return {
              id: `res-${index}`,
              title: [
                "Introduction to Machine Learning Algorithms",
                "Building Responsive Web Interfaces with React",
                "Data Visualization Techniques and Best Practices",
                "Advanced Python for Data Science",
                "Neural Network Architectures Explained",
                "Modern JavaScript Frameworks Comparison",
                "Cloud Computing Fundamentals",
                "API Design Principles and Patterns",
                "UI/UX Design Process",
                "Containerization with Docker"
              ][index % 10],
              description: "Comprehensive guide covering concepts, implementation, and practical applications with examples and case studies.",
              type,
              createdAt: timestamp,
              updatedAt: timestamp,
              author: {
                id: `user-${Math.floor(Math.random() * 10)}`,
                name: ["Alex Johnson", "Samantha Lee", "Michael Chen", "Jessica Taylor", "David Kim"][Math.floor(Math.random() * 5)],
                avatar: `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000)}`
              },
              stats: {
                views: viewCount,
                downloads: downloadCount,
                stars: Math.floor(Math.random() * 20)
              },
              category: categories[Math.floor(Math.random() * categories.length)].id,
              tags: resourceTags,
              isFavorited: Math.random() > 0.7
            };
          });
          
          // Apply sorting
          const sortedResources = [...mockResources].sort((a, b) => {
            if (sortOrder === 'newest') {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortOrder === 'oldest') {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
              // popular
              return b.stats.views - a.stats.views;
            }
          });
          
          // Filter by type if selected
          const typeFiltered = selectedResourceType.length > 0
            ? sortedResources.filter(res => selectedResourceType.includes(res.type))
            : sortedResources;
          
          // Filter by tags if selected
          const tagFiltered = selectedTags.length > 0
            ? typeFiltered.filter(res => 
                res.tags.some((tag: string) => selectedTags.includes(tag))
              )
            : typeFiltered;
          
          // Apply search query filter
          const searchFiltered = query
            ? tagFiltered.filter(res => 
                res.title.toLowerCase().includes(query.toLowerCase()) || 
                res.description.toLowerCase().includes(query.toLowerCase())
              )
            : tagFiltered;
          
          // Final filtering based on category
          const categoryFiltered = activeCategory === 'all'
            ? searchFiltered
            : searchFiltered.filter(res => res.category === activeCategory);
          
          setResources(categoryFiltered);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching resources:', error);
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [activeCategory, query, sortOrder, selectedResourceType, selectedTags]);
  
  // Toggle resource type selection
  const toggleResourceType = (type: string) => {
    setSelectedResourceType(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedResourceType([]);
    setSelectedTags([]);
    setQuery('');
  };
  
  // Get icon for resource type
  const getResourceIcon = (type: string) => {
    return resourceTypeIcons[type as keyof typeof resourceTypeIcons] || <File className="w-5 h-5" />;
  };
  
  // Toggle favorite resource
  const toggleFavorite = (resourceId: string) => {
    setResources(prev => 
      prev.map(res => 
        res.id === resourceId 
          ? { ...res, isFavorited: !res.isFavorited } 
          : res
      )
    );
  };

  return (
    <div className="min-h-full bg-zinc-950">
      {/* Top Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            {isUserResources ? 'My Resources' : 'Explore Resources'}
          </h1>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            
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
              {(selectedResourceType.length > 0 || selectedTags.length > 0) && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-emerald-500 text-white rounded-full">
                  {selectedResourceType.length + selectedTags.length}
                </span>
              )}
            </button>
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
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Resource Type</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleResourceType('document')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      selectedResourceType.includes('document')
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <FileText className="w-3 h-3" />
                    <span>Documents</span>
                  </button>
                  <button
                    onClick={() => toggleResourceType('image')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      selectedResourceType.includes('image')
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <Image className="w-3 h-3" />
                    <span>Images</span>
                  </button>
                  <button
                    onClick={() => toggleResourceType('video')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      selectedResourceType.includes('video')
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <Video className="w-3 h-3" />
                    <span>Videos</span>
                  </button>
                  <button
                    onClick={() => toggleResourceType('file')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      selectedResourceType.includes('file')
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <File className="w-3 h-3" />
                    <span>Other Files</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border",
                        selectedTags.includes(tag)
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                          : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="px-3 py-1.5 text-xs rounded-full border border-zinc-700 text-zinc-400 hover:bg-zinc-700">
                    +{tags.length - 8} more
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortOrder('newest')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      sortOrder === 'newest'
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Newest</span>
                  </button>
                  <button
                    onClick={() => setSortOrder('oldest')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      sortOrder === 'oldest'
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Oldest</span>
                  </button>
                  <button
                    onClick={() => setSortOrder('popular')}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5",
                      sortOrder === 'popular'
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={clearFilters}
                className="text-xs text-zinc-400 hover:text-zinc-300"
              >
                Clear all filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                Apply filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 bg-zinc-900/30 p-4 border-b md:border-b-0 md:border-r border-zinc-800 md:min-h-[calc(100vh-120px)] shrink-0">
          <h2 className="text-zinc-300 font-medium mb-4">Categories</h2>
          <nav>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      activeCategory === category.id
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Tags Section */}
          <div className="mt-8">
            <h2 className="text-zinc-300 font-medium mb-4 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Popular Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md",
                    selectedTags.includes(tag)
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Resources List */}
        <div className="flex-grow p-4 sm:p-6">
          {/* Results Info */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
            <div className="text-zinc-400 text-sm">
              Showing {resources.length} resources
              {query && <span> for &ldquo;{query}&rdquo;</span>}
              {activeCategory !== 'all' && <span> in {categories.find(c => c.id === activeCategory)?.name}</span>}
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>My Bookmarks</span>
              </button>
            </div>
          </div>
          
          {/* Resources Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-zinc-400 mt-4">Loading resources...</p>
              </div>
            </div>
          ) : resources.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center">
              <File className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">No resources found</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <div 
                  key={resource.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className={`
                        p-2 rounded-md mr-3 flex-shrink-0
                        ${resource.type === 'document' ? 'bg-blue-500/20 text-blue-400' : ''}
                        ${resource.type === 'image' ? 'bg-purple-500/20 text-purple-400' : ''}
                        ${resource.type === 'video' ? 'bg-red-500/20 text-red-400' : ''}
                        ${resource.type === 'file' ? 'bg-orange-500/20 text-orange-400' : ''}
                      `}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-zinc-100 font-medium line-clamp-2">{resource.title}</h3>
                        <div className="mt-1 flex items-center text-xs text-zinc-400">
                          <span>By {resource.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(resource.id)}
                        className={`ml-2 p-1 rounded-md ${
                          resource.isFavorited
                            ? 'text-amber-400 hover:bg-zinc-800'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={resource.isFavorited ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    
                    <p className="text-zinc-400 text-sm mt-3 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resource.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-zinc-800 p-3 flex justify-between items-center">
                    <div className="flex space-x-4 text-xs text-zinc-500">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 mr-1" />
                        <span>{resource.stats.stars}</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="w-3.5 h-3.5 mr-1" />
                        <span>{resource.stats.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && resources.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400">
                  &lt;
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-emerald-600 text-white">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                  3
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400">
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}