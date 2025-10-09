'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  Sparkles,
  Lightbulb,
  TrendingUp,
  HelpCircle,
  X,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '../../../src/lib/ui';

// AI Assistant Types
interface AISuggestion {
  id: string;
  type: 'action' | 'insight' | 'question' | 'tip';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  context: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface AIInsight {
  id: string;
  category: 'productivity' | 'collaboration' | 'analytics' | 'learning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  data?: any;
  timestamp: string;
}

interface AIAssistantProps {
  context?: {
    page: string;
    workspaceId?: string;
    projectId?: string;
    userActions?: string[];
  };
  className?: string;
}

export default function AIAssistant({ context, className }: AIAssistantProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'insights'>('chat');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Refs
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Generate contextual suggestions based on current page/context
  useEffect(() => {
    if (context) {
      generateSuggestions(context);
      generateInsights(context);
    }
  }, [context]);

  // Generate AI suggestions based on context
  const generateSuggestions = (ctx: NonNullable<AIAssistantProps['context']>) => {
    const newSuggestions: AISuggestion[] = [];

    switch (ctx.page) {
      case 'projects':
        newSuggestions.push(
          {
            id: 'create-project',
            type: 'action',
            title: 'Create New Project',
            description: 'Start a new project to organize your work and collaborate with team members.',
            priority: 'high',
            context: 'projects',
            action: {
              label: 'Create Project',
              handler: () => {
                // Navigate to create project page
                window.location.href = '/workspaces/projects/new';
              }
            }
          },
          {
            id: 'project-template',
            type: 'tip',
            title: 'Use Project Templates',
            description: 'Save time by using pre-built templates for common project types.',
            priority: 'medium',
            context: 'projects'
          },
          {
            id: 'team-invite',
            type: 'action',
            title: 'Invite Team Members',
            description: 'Add collaborators to your projects for better teamwork and productivity.',
            priority: 'medium',
            context: 'projects'
          }
        );
        break;

      case 'resources':
        newSuggestions.push(
          {
            id: 'upload-resource',
            type: 'action',
            title: 'Upload Resource',
            description: 'Share valuable resources with your team or the community.',
            priority: 'high',
            context: 'resources',
            action: {
              label: 'Upload',
              handler: () => {
                // Open upload modal
                console.log('Open upload modal');
              }
            }
          },
          {
            id: 'resource-search',
            type: 'tip',
            title: 'Advanced Search',
            description: 'Use filters and tags to find exactly what you need quickly.',
            priority: 'medium',
            context: 'resources'
          }
        );
        break;

      case 'workspace':
        newSuggestions.push(
          {
            id: 'workspace-chat',
            type: 'action',
            title: 'Start AI Chat',
            description: 'Ask me questions about your workspace or get help with tasks.',
            priority: 'high',
            context: 'workspace',
            action: {
              label: 'Chat Now',
              handler: () => setActiveTab('chat')
            }
          },
          {
            id: 'workspace-insights',
            type: 'insight',
            title: 'View Analytics',
            description: 'Check your workspace performance and team productivity metrics.',
            priority: 'medium',
            context: 'workspace'
          }
        );
        break;

      default:
        newSuggestions.push(
          {
            id: 'general-help',
            type: 'question',
            title: 'Need Help?',
            description: 'Ask me anything about Ecosyz or how to get started.',
            priority: 'low',
            context: 'general'
          }
        );
    }

    setSuggestions(newSuggestions);
  };

  // Generate AI insights based on context
  const generateInsights = (ctx: NonNullable<AIAssistantProps['context']>) => {
    const newInsights: AIInsight[] = [];

    // Mock insights - in real app, these would come from analytics
    newInsights.push(
      {
        id: 'productivity-trend',
        category: 'productivity',
        title: 'Productivity Increased 25%',
        description: 'Your team productivity has improved significantly this week.',
        impact: 'high',
        data: { trend: 'up', percentage: 25 },
        timestamp: new Date().toISOString()
      },
      {
        id: 'collaboration-boost',
        category: 'collaboration',
        title: 'Team Collaboration Up',
        description: 'More resources are being shared across your workspace.',
        impact: 'medium',
        data: { shares: 15, growth: 40 },
        timestamp: new Date().toISOString()
      },
      {
        id: 'learning-opportunity',
        category: 'learning',
        title: 'New Learning Resources',
        description: 'Discover trending topics in your field of interest.',
        impact: 'low',
        data: { topics: ['AI Ethics', 'Sustainable Tech', 'Remote Work'] },
        timestamp: new Date().toISOString()
      }
    );

    setInsights(newInsights);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // In a real app, implement speech recognition
      setTimeout(() => {
        setIsListening(false);
        // Simulate voice input
        if (chatInputRef.current) {
          chatInputRef.current.value = "How can I improve my project management?";
        }
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  // Handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
  };

  // Get insight category icon
  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'productivity':
        return <TrendingUp className="w-4 h-4" />;
      case 'collaboration':
        return <MessageCircle className="w-4 h-4" />;
      case 'analytics':
        return <Zap className="w-4 h-4" />;
      case 'learning':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          className
        )}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center",
            isOpen
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              : "bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110"
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Bot className="w-7 h-7" />
          )}
        </button>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">AI Assistant</h3>
                    <p className="text-xs text-zinc-400">Ready to help</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-6 h-6 text-zinc-400 hover:text-zinc-300 rounded"
                  >
                    <span className="text-xs">−</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-6 h-6 text-zinc-400 hover:text-zinc-300 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              {!isMinimized && (
                <div className="flex mt-3 bg-zinc-900 rounded-lg p-1">
                  {[
                    { id: 'chat', label: 'Chat', icon: MessageCircle },
                    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
                    { id: 'insights', label: 'Insights', icon: TrendingUp }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-colors",
                        activeTab === tab.id
                          ? "bg-emerald-600 text-white"
                          : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                      )}
                    >
                      <tab.icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            {!isMinimized && (
              <div className="h-96 overflow-hidden">
                {/* Chat Tab */}
                {activeTab === 'chat' && (
                  <div className="h-full flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-300">
                            Hello! I'm your AI assistant. How can I help you today?
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {context?.page ? `Currently on ${context.page} page` : 'Welcome to Ecosyz'}
                          </p>
                        </div>
                      </div>

                      {isTyping && (
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-zinc-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            ref={chatInputRef}
                            type="text"
                            placeholder="Ask me anything..."
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                setIsTyping(true);
                                setTimeout(() => setIsTyping(false), 2000);
                              }
                            }}
                          />
                        </div>
                        <button
                          onClick={handleVoiceInput}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            isListening
                              ? "bg-red-600 text-white"
                              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                          )}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions Tab */}
                {activeTab === 'suggestions' && (
                  <div className="h-full overflow-y-auto">
                    <div className="p-4 space-y-3">
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-medium text-white">{suggestion.title}</h4>
                              <span className={cn(
                                "px-2 py-0.5 text-xs rounded-full border",
                                getPriorityColor(suggestion.priority)
                              )}>
                                {suggestion.priority}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-3">{suggestion.description}</p>
                            {suggestion.action && (
                              <button
                                onClick={suggestion.action.handler}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 rounded-md transition-colors"
                              >
                                {suggestion.action.label}
                              </button>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-500">No suggestions available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <div className="h-full overflow-y-auto">
                    <div className="p-4 space-y-3">
                      {insights.length > 0 ? (
                        insights.map((insight) => (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                {getInsightIcon(insight.category)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                                  <span className={cn(
                                    "px-2 py-0.5 text-xs rounded-full",
                                    insight.impact === 'high' ? "bg-red-500/20 text-red-400" :
                                    insight.impact === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                                    "bg-green-500/20 text-green-400"
                                  )}>
                                    {insight.impact} impact
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400">{insight.description}</p>
                                <p className="text-xs text-zinc-500 mt-1">
                                  {new Date(insight.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <TrendingUp className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-500">No insights available yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}