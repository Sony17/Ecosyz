'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  BookOpen,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../src/lib/ui';

// AI Suggestions Types
interface AISuggestion {
  id: string;
  type: 'productivity' | 'collaboration' | 'learning' | 'optimization' | 'engagement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  context: {
    page?: string;
    action?: string;
    timeBased?: boolean;
    userPattern?: string;
  };
  actions: {
    primary: {
      label: string;
      action: () => void;
    };
    secondary?: {
      label: string;
      action: () => void;
    };
  };
  metadata: {
    createdAt: string;
    expiresAt?: string;
    dismissed?: boolean;
    completed?: boolean;
  };
}

interface AISuggestionsProps {
  context?: {
    currentPage: string;
    userId?: string;
    recentActions?: string[];
    timeOfDay?: string;
    userRole?: string;
  };
  maxSuggestions?: number;
  className?: string;
}

export default function AISuggestions({
  context,
  maxSuggestions = 3,
  className
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [completedSuggestions, setCompletedSuggestions] = useState<Set<string>>(new Set());

  // Generate suggestions based on context
  useEffect(() => {
    if (context) {
      generateSuggestions(context);
    }
  }, [context]);

  // Generate contextual AI suggestions
  const generateSuggestions = (ctx: NonNullable<AISuggestionsProps['context']>) => {
    const newSuggestions: AISuggestion[] = [];
    const now = new Date();

    // Time-based suggestions
    if (ctx.timeOfDay === 'morning') {
      newSuggestions.push({
        id: 'morning-planning',
        type: 'productivity',
        title: 'Start Your Day Right',
        description: 'Review your projects and plan your tasks for today.',
        impact: 'high',
        confidence: 85,
        context: { timeBased: true, page: ctx.currentPage },
        actions: {
          primary: {
            label: 'View Projects',
            action: () => window.location.href = '/projects'
          }
        },
        metadata: {
          createdAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
        }
      });
    }

    // Page-specific suggestions
    switch (ctx.currentPage) {
      case 'projects':
        newSuggestions.push(
          {
            id: 'project-collaboration',
            type: 'collaboration',
            title: 'Boost Team Productivity',
            description: 'Invite team members to collaborate on your active projects.',
            impact: 'high',
            confidence: 78,
            context: { page: 'projects', action: 'invite' },
            actions: {
              primary: {
                label: 'Invite Members',
                action: () => console.log('Open invite modal')
              }
            },
            metadata: { createdAt: now.toISOString() }
          },
          {
            id: 'project-templates',
            type: 'optimization',
            title: 'Use Project Templates',
            description: 'Save time with pre-built templates for common project types.',
            impact: 'medium',
            confidence: 65,
            context: { page: 'projects' },
            actions: {
              primary: {
                label: 'Browse Templates',
                action: () => console.log('Open templates')
              }
            },
            metadata: { createdAt: now.toISOString() }
          }
        );
        break;

      case 'resources':
        newSuggestions.push(
          {
            id: 'resource-sharing',
            type: 'engagement',
            title: 'Share Knowledge',
            description: 'Upload resources to help your team and community grow.',
            impact: 'medium',
            confidence: 72,
            context: { page: 'resources', action: 'upload' },
            actions: {
              primary: {
                label: 'Upload Resource',
                action: () => console.log('Open upload modal')
              }
            },
            metadata: { createdAt: now.toISOString() }
          },
          {
            id: 'resource-discovery',
            type: 'learning',
            title: 'Discover New Topics',
            description: 'Explore trending resources in your field of interest.',
            impact: 'low',
            confidence: 58,
            context: { page: 'resources' },
            actions: {
              primary: {
                label: 'Explore Topics',
                action: () => console.log('Open discovery')
              }
            },
            metadata: { createdAt: now.toISOString() }
          }
        );
        break;

      case 'dashboard':
        newSuggestions.push(
          {
            id: 'dashboard-insights',
            type: 'productivity',
            title: 'Review Your Progress',
            description: 'Check your productivity metrics and team performance.',
            impact: 'high',
            confidence: 80,
            context: { page: 'dashboard' },
            actions: {
              primary: {
                label: 'View Analytics',
                action: () => console.log('Open analytics')
              }
            },
            metadata: { createdAt: now.toISOString() }
          }
        );
        break;
    }

    // User behavior-based suggestions
    if (ctx.recentActions?.includes('created_project')) {
      newSuggestions.push({
        id: 'project-setup',
        type: 'optimization',
        title: 'Complete Project Setup',
        description: 'Add team members and set up project milestones.',
        impact: 'high',
        confidence: 90,
        context: { action: 'project_created' },
        actions: {
          primary: {
            label: 'Setup Project',
            action: () => console.log('Open project setup')
          }
        },
        metadata: { createdAt: now.toISOString() }
      });
    }

    // Learning suggestions
    if (!ctx.recentActions?.includes('viewed_tutorial')) {
      newSuggestions.push({
        id: 'learning-path',
        type: 'learning',
        title: 'Level Up Your Skills',
        description: 'Take a quick tutorial to master new features.',
        impact: 'medium',
        confidence: 45,
        context: { userPattern: 'learning' },
        actions: {
          primary: {
            label: 'Start Tutorial',
            action: () => console.log('Open tutorial')
          }
        },
        metadata: { createdAt: now.toISOString() }
      });
    }

    // Filter and sort suggestions
    const filtered = newSuggestions
      .filter(s => !dismissedSuggestions.has(s.id) && !completedSuggestions.has(s.id))
      .filter(s => {
        // Check expiration
        if (s.metadata.expiresAt) {
          return new Date(s.metadata.expiresAt) > now;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by impact and confidence
        const impactScore = { high: 3, medium: 2, low: 1 };
        const aScore = impactScore[a.impact] * a.confidence;
        const bScore = impactScore[b.impact] * b.confidence;
        return bScore - aScore;
      })
      .slice(0, maxSuggestions);

    setSuggestions(filtered);
  };

  // Handle suggestion actions
  const handleSuggestionAction = (suggestion: AISuggestion, actionType: 'primary' | 'secondary') => {
    const action = actionType === 'primary' ? suggestion.actions.primary : suggestion.actions.secondary;
    if (action) {
      action.action();
      // Mark as completed
      setCompletedSuggestions(prev => new Set([...prev, suggestion.id]));
    }
  };

  const dismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  // Get suggestion type icon and color
  const getSuggestionStyle = (type: AISuggestion['type']) => {
    switch (type) {
      case 'productivity':
        return {
          icon: TrendingUp,
          color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
          bgColor: 'bg-blue-500/10'
        };
      case 'collaboration':
        return {
          icon: Users,
          color: 'text-green-400 bg-green-500/20 border-green-500/30',
          bgColor: 'bg-green-500/10'
        };
      case 'learning':
        return {
          icon: BookOpen,
          color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
          bgColor: 'bg-purple-500/10'
        };
      case 'optimization':
        return {
          icon: Target,
          color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
          bgColor: 'bg-orange-500/10'
        };
      case 'engagement':
        return {
          icon: MessageSquare,
          color: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
          bgColor: 'bg-pink-500/10'
        };
      default:
        return {
          icon: Lightbulb,
          color: 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30',
          bgColor: 'bg-zinc-500/10'
        };
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-medium text-white">AI Suggestions</h3>
      </div>

      <AnimatePresence>
        {suggestions.map((suggestion) => {
          const style = getSuggestionStyle(suggestion.type);
          const Icon = style.icon;

          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn(
                "relative bg-zinc-800/50 border rounded-lg p-4 backdrop-blur-sm",
                style.bgColor,
                "border-zinc-700/50"
              )}
            >
              {/* Dismiss button */}
              <button
                onClick={() => dismissSuggestion(suggestion.id)}
                className="absolute top-2 right-2 w-6 h-6 text-zinc-400 hover:text-zinc-300 rounded-full hover:bg-zinc-700/50 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-start space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  style.color
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-white pr-2">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full border",
                        suggestion.impact === 'high' ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        suggestion.impact === 'medium' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                        "bg-green-500/20 text-green-400 border-green-500/30"
                      )}>
                        {suggestion.impact} impact
                      </span>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-zinc-500" />
                        <span className="text-xs text-zinc-500">{suggestion.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                    {suggestion.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSuggestionAction(suggestion, 'primary')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{suggestion.actions.primary.label}</span>
                    </button>

                    {suggestion.actions.secondary && (
                      <button
                        onClick={() => handleSuggestionAction(suggestion, 'secondary')}
                        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs rounded-md transition-colors"
                      >
                        {suggestion.actions.secondary.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Context indicator */}
              {suggestion.context.timeBased && (
                <div className="mt-3 flex items-center space-x-1 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  <span>Time-based suggestion</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {suggestions.length === 0 && (
        <div className="text-center py-6">
          <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-500">No suggestions available right now</p>
          <p className="text-xs text-zinc-600 mt-1">Check back later for personalized recommendations</p>
        </div>
      )}
    </div>
  );
}