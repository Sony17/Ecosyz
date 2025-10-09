'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Search,
  X,
  ChevronRight,
  ExternalLink,
  Play,
  FileText,
  Code,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '../../../src/lib/ui';

// Contextual Help Types
interface HelpTopic {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'features' | 'troubleshooting' | 'best-practices' | 'tutorials';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  content: {
    overview: string;
    steps?: string[];
    tips?: string[];
    resources?: Array<{
      title: string;
      type: 'article' | 'video' | 'tutorial' | 'example';
      url?: string;
      action?: () => void;
    }>;
  };
  relatedTopics?: string[];
  tags: string[];
}

interface ContextualHelpProps {
  currentPage: string;
  userRole?: 'admin' | 'member' | 'guest';
  userExperience?: 'new' | 'intermediate' | 'expert';
  recentActions?: string[];
  className?: string;
}

export default function ContextualHelp({
  currentPage,
  userRole = 'member',
  userExperience = 'intermediate',
  recentActions = [],
  className
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<HelpTopic[]>([]);

  // Comprehensive help topics database
  const helpTopics: HelpTopic[] = [
    // Projects Page Help
    {
      id: 'projects-overview',
      title: 'Getting Started with Projects',
      description: 'Learn how to create, manage, and collaborate on projects effectively.',
      category: 'getting-started',
      difficulty: 'beginner',
      estimatedTime: '5 min',
      content: {
        overview: 'Projects are the core of your workspace collaboration. Learn the fundamentals of project management in Ecosyz.',
        steps: [
          'Click "Create New Project" to start',
          'Define your project scope and goals',
          'Invite team members to collaborate',
          'Set milestones and track progress',
          'Use templates for common project types'
        ],
        tips: [
          'Start with clear objectives and success criteria',
          'Break large projects into manageable milestones',
          'Regular check-ins improve team alignment',
          'Document decisions and changes for transparency'
        ],
        resources: [
          {
            title: 'Project Management Best Practices',
            type: 'article',
            action: () => console.log('Open article')
          },
          {
            title: 'Creating Your First Project',
            type: 'tutorial',
            action: () => console.log('Start tutorial')
          }
        ]
      },
      relatedTopics: ['project-templates', 'team-collaboration'],
      tags: ['projects', 'getting-started', 'collaboration']
    },
    {
      id: 'project-templates',
      title: 'Using Project Templates',
      description: 'Save time with pre-built templates for common project types.',
      category: 'features',
      difficulty: 'beginner',
      estimatedTime: '3 min',
      content: {
        overview: 'Project templates provide a head start for common project types with predefined structure and tasks.',
        steps: [
          'Browse available templates',
          'Select a template that matches your project',
          'Customize the template content',
          'Add your specific requirements',
          'Save as a new project'
        ],
        tips: [
          'Templates are fully customizable',
          'Start with the closest match and modify as needed',
          'Save your own templates for repeated projects'
        ]
      },
      relatedTopics: ['projects-overview'],
      tags: ['templates', 'efficiency', 'projects']
    },

    // Resources Page Help
    {
      id: 'resources-discovery',
      title: 'Finding and Sharing Resources',
      description: 'Discover valuable resources and share knowledge with your team.',
      category: 'features',
      difficulty: 'beginner',
      estimatedTime: '4 min',
      content: {
        overview: 'The resources section is your knowledge hub for tutorials, tools, and shared learning materials.',
        steps: [
          'Use search and filters to find resources',
          'Browse by category or popularity',
          'Upload your own resources to share',
          'Bookmark useful resources for later',
          'Rate and review resources you find helpful'
        ],
        tips: [
          'Use specific keywords for better search results',
          'Tag resources appropriately for better discoverability',
          'Regularly review and update shared resources'
        ],
        resources: [
          {
            title: 'Resource Curation Guide',
            type: 'article',
            action: () => console.log('Open guide')
          }
        ]
      },
      relatedTopics: ['resource-upload'],
      tags: ['resources', 'sharing', 'knowledge']
    },

    // Chat/AI Help
    {
      id: 'ai-assistant',
      title: 'Using the AI Assistant',
      description: 'Get intelligent help and suggestions from your AI assistant.',
      category: 'features',
      difficulty: 'beginner',
      estimatedTime: '3 min',
      content: {
        overview: 'Your AI assistant provides contextual help, code generation, and productivity suggestions.',
        steps: [
          'Click the AI assistant button (bottom right)',
          'Ask questions in natural language',
          'Use voice input for hands-free interaction',
          'Review suggestions and insights',
          'Apply recommended actions'
        ],
        tips: [
          'Be specific about what you need help with',
          'The AI learns from your workspace context',
          'Use the assistant for code reviews and debugging',
          'Voice input works well for quick questions'
        ]
      },
      relatedTopics: ['workspace-chat'],
      tags: ['ai', 'assistant', 'help', 'productivity']
    },

    // Advanced Features
    {
      id: 'advanced-search',
      title: 'Advanced Search Techniques',
      description: 'Master powerful search features to find exactly what you need.',
      category: 'features',
      difficulty: 'intermediate',
      estimatedTime: '6 min',
      content: {
        overview: 'Advanced search helps you find projects, resources, and information quickly and accurately.',
        steps: [
          'Use quotes for exact phrase matching',
          'Combine terms with AND/OR operators',
          'Filter by date, author, or category',
          'Use wildcards for partial matches',
          'Save frequently used searches'
        ],
        tips: [
          'Search syntax: "exact phrase" + keyword',
          'Use filters to narrow results',
          'Saved searches appear in your quick access menu'
        ]
      },
      relatedTopics: ['resources-discovery'],
      tags: ['search', 'efficiency', 'advanced']
    },

    // Troubleshooting
    {
      id: 'common-issues',
      title: 'Common Issues and Solutions',
      description: 'Quick fixes for frequently encountered problems.',
      category: 'troubleshooting',
      difficulty: 'beginner',
      estimatedTime: '5 min',
      content: {
        overview: 'Most common issues have simple solutions. Check this guide first before contacting support.',
        steps: [
          'Check your internet connection',
          'Clear browser cache and cookies',
          'Try a different browser or device',
          'Check for browser extensions conflicts',
          'Contact support if issues persist'
        ],
        tips: [
          'Most issues are browser or network related',
          'Try incognito mode to rule out extensions',
          'Include error messages when reporting issues'
        ]
      },
      relatedTopics: ['account-settings'],
      tags: ['troubleshooting', 'support', 'issues']
    }
  ];

  // Filter topics based on current page and context
  useEffect(() => {
    let relevantTopics = helpTopics;

    // Filter by current page
    switch (currentPage) {
      case 'projects':
        relevantTopics = helpTopics.filter(topic =>
          topic.tags.includes('projects') || topic.relatedTopics?.some(rt =>
            helpTopics.find(t => t.id === rt)?.tags.includes('projects')
          )
        );
        break;
      case 'resources':
        relevantTopics = helpTopics.filter(topic =>
          topic.tags.includes('resources') || topic.relatedTopics?.some(rt =>
            helpTopics.find(t => t.id === rt)?.tags.includes('resources')
          )
        );
        break;
      case 'workspace':
        relevantTopics = helpTopics.filter(topic =>
          topic.tags.includes('workspace') || topic.tags.includes('ai')
        );
        break;
      default:
        // Show general help topics
        relevantTopics = helpTopics.filter(topic =>
          topic.category === 'getting-started' || topic.difficulty === 'beginner'
        );
    }

    // Filter by search query
    if (searchQuery) {
      relevantTopics = relevantTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by relevance (prioritize beginner content for new users)
    relevantTopics.sort((a, b) => {
      if (userExperience === 'new' && a.difficulty === 'beginner' && b.difficulty !== 'beginner') return -1;
      if (userExperience === 'new' && b.difficulty === 'beginner' && a.difficulty !== 'beginner') return 1;
      return 0;
    });

    setFilteredTopics(relevantTopics.slice(0, 6)); // Limit to 6 most relevant
  }, [currentPage, searchQuery, userExperience]);

  // Get category icon
  const getCategoryIcon = (category: HelpTopic['category']) => {
    switch (category) {
      case 'getting-started':
        return <Play className="w-4 h-4" />;
      case 'features':
        return <Zap className="w-4 h-4" />;
      case 'troubleshooting':
        return <HelpCircle className="w-4 h-4" />;
      case 'best-practices':
        return <Target className="w-4 h-4" />;
      case 'tutorials':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: HelpTopic['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'advanced':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
  };

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 w-12 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-full shadow-lg transition-colors flex items-center justify-center z-40",
          className
        )}
      >
        <HelpCircle className="w-6 h-6 text-zinc-300" />
      </motion.button>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              className="fixed left-6 bottom-20 w-96 max-w-[calc(100vw-3rem)] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">Help Center</h3>
                      <p className="text-xs text-zinc-400">
                        {selectedTopic ? 'Article' : 'Contextual help'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedTopic(null);
                    }}
                    className="w-6 h-6 text-zinc-400 hover:text-zinc-300 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                {!selectedTopic && (
                  <div className="mt-3 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search help topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="h-96 overflow-hidden">
                {!selectedTopic ? (
                  /* Topics List */
                  <div className="h-full overflow-y-auto">
                    <div className="p-4 space-y-3">
                      <div className="text-xs text-zinc-500 mb-2">
                        Help topics for {currentPage}
                      </div>

                      {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
                          <motion.button
                            key={topic.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSelectedTopic(topic)}
                            className="w-full text-left bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 hover:bg-zinc-800 transition-colors group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-zinc-700 rounded flex items-center justify-center">
                                  {getCategoryIcon(topic.category)}
                                </div>
                                <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                  {topic.title}
                                </h4>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                            </div>

                            <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
                              {topic.description}
                            </p>

                            <div className="flex items-center space-x-2">
                              <span className={cn(
                                "px-2 py-0.5 text-xs rounded-full border",
                                getDifficultyColor(topic.difficulty)
                              )}>
                                {topic.difficulty}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {topic.estimatedTime}
                              </span>
                            </div>
                          </motion.button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-500">No help topics found</p>
                          <p className="text-xs text-zinc-600 mt-1">
                            Try adjusting your search or browse all topics
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Topic Detail */
                  <div className="h-full overflow-y-auto">
                    <div className="p-4">
                      {/* Back Button */}
                      <button
                        onClick={() => setSelectedTopic(null)}
                        className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-zinc-300 mb-4"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span>Back to topics</span>
                      </button>

                      {/* Topic Header */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-zinc-700 rounded flex items-center justify-center">
                            {getCategoryIcon(selectedTopic.category)}
                          </div>
                          <h4 className="text-lg font-medium text-white">
                            {selectedTopic.title}
                          </h4>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full border",
                            getDifficultyColor(selectedTopic.difficulty)
                          )}>
                            {selectedTopic.difficulty}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {selectedTopic.estimatedTime} read
                          </span>
                        </div>

                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {selectedTopic.content.overview}
                        </p>
                      </div>

                      {/* Steps */}
                      {selectedTopic.content.steps && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-white mb-2">Steps:</h5>
                          <ol className="space-y-2">
                            {selectedTopic.content.steps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-zinc-300">
                                <span className="text-zinc-500 font-mono text-xs mt-0.5">
                                  {index + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Tips */}
                      {selectedTopic.content.tips && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-white mb-2">Tips:</h5>
                          <ul className="space-y-1">
                            {selectedTopic.content.tips.map((tip, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-zinc-300">
                                <span className="text-zinc-500">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Resources */}
                      {selectedTopic.content.resources && selectedTopic.content.resources.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-white mb-2">Resources:</h5>
                          <div className="space-y-2">
                            {selectedTopic.content.resources.map((resource, index) => (
                              <button
                                key={index}
                                onClick={resource.action}
                                className="w-full flex items-center justify-between p-2 bg-zinc-800/50 border border-zinc-700/50 rounded hover:bg-zinc-800 transition-colors group"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="w-5 h-5 bg-zinc-700 rounded flex items-center justify-center">
                                    {resource.type === 'video' && <Play className="w-3 h-3" />}
                                    {resource.type === 'article' && <FileText className="w-3 h-3" />}
                                    {resource.type === 'tutorial' && <BookOpen className="w-3 h-3" />}
                                    {resource.type === 'example' && <Code className="w-3 h-3" />}
                                  </div>
                                  <span className="text-sm text-zinc-300 group-hover:text-white">
                                    {resource.title}
                                  </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Topics */}
                      {selectedTopic.relatedTopics && selectedTopic.relatedTopics.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-white mb-2">Related Topics:</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedTopic.relatedTopics.map((topicId) => {
                              const relatedTopic = helpTopics.find(t => t.id === topicId);
                              return relatedTopic ? (
                                <button
                                  key={topicId}
                                  onClick={() => setSelectedTopic(relatedTopic)}
                                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white rounded-md transition-colors"
                                >
                                  {relatedTopic.title}
                                </button>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}