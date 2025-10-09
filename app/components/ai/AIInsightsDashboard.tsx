'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Award,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../../src/lib/ui';

// AI Insights Types
interface Metric {
  id: string;
  label: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data?: any;
  recommendations?: string[];
  timestamp: string;
}

interface TimeRange {
  label: string;
  value: '7d' | '30d' | '90d' | '1y';
}

interface AIInsightsDashboardProps {
  userId?: string;
  workspaceId?: string;
  className?: string;
}

export default function AIInsightsDashboard({
  userId,
  workspaceId,
  className
}: AIInsightsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange['value']>('30d');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const timeRanges: TimeRange[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' }
  ];

  // Generate mock data - in real app, this would come from analytics API
  useEffect(() => {
    generateMockData();
  }, [selectedTimeRange, userId, workspaceId]);

  const generateMockData = () => {
    setIsLoading(true);

    // Mock metrics
    const mockMetrics: Metric[] = [
      {
        id: 'productivity',
        label: 'Productivity Score',
        value: 87,
        change: 12,
        changeType: 'increase',
        unit: '%',
        icon: TrendingUp,
        color: 'text-green-400',
        description: 'Based on task completion and time management'
      },
      {
        id: 'collaboration',
        label: 'Collaboration Index',
        value: 73,
        change: -5,
        changeType: 'decrease',
        unit: '%',
        icon: Users,
        color: 'text-blue-400',
        description: 'Team interactions and resource sharing'
      },
      {
        id: 'projects-completed',
        label: 'Projects Completed',
        value: 8,
        change: 2,
        changeType: 'increase',
        icon: Target,
        color: 'text-purple-400',
        description: 'Successfully finished projects'
      },
      {
        id: 'active-hours',
        label: 'Active Hours',
        value: 42,
        change: 8,
        changeType: 'increase',
        unit: 'hrs',
        icon: Clock,
        color: 'text-orange-400',
        description: 'Time spent actively working'
      },
      {
        id: 'resources-shared',
        label: 'Resources Shared',
        value: 15,
        change: 3,
        changeType: 'increase',
        icon: FileText,
        color: 'text-pink-400',
        description: 'Knowledge shared with team'
      },
      {
        id: 'efficiency',
        label: 'Efficiency Rating',
        value: 'A-',
        change: 5,
        changeType: 'increase',
        unit: 'grade',
        icon: Award,
        color: 'text-emerald-400',
        description: 'Overall performance grade'
      }
    ];

    // Mock insights
    const mockInsights: Insight[] = [
      {
        id: 'productivity-peak',
        type: 'trend',
        title: 'Productivity Peak Detected',
        description: 'Your productivity reached its highest point this week. Great job maintaining focus!',
        impact: 'high',
        confidence: 92,
        data: { peakDay: 'Wednesday', peakHours: 6.5 },
        recommendations: [
          'Schedule important tasks for Wednesday mornings',
          'Maintain your current work routine'
        ],
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'collaboration-dip',
        type: 'warning',
        title: 'Collaboration Decrease',
        description: 'Team interactions have decreased by 15% compared to last month.',
        impact: 'medium',
        confidence: 78,
        data: { decrease: 15, period: '30d' },
        recommendations: [
          'Schedule a team meeting this week',
          'Share a resource or update in your workspace'
        ],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'learning-opportunity',
        type: 'opportunity',
        title: 'Learning Opportunity',
        description: 'Trending topics in your field: AI Ethics, Sustainable Tech, Remote Collaboration.',
        impact: 'low',
        confidence: 65,
        data: { topics: ['AI Ethics', 'Sustainable Tech', 'Remote Collaboration'] },
        recommendations: [
          'Explore resources on AI Ethics',
          'Join a webinar on Sustainable Tech'
        ],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'streak-achievement',
        type: 'achievement',
        title: '7-Day Streak!',
        description: 'Congratulations! You\'ve been consistently productive for 7 days straight.',
        impact: 'high',
        confidence: 100,
        data: { streakDays: 7, badge: 'Consistency Champion' },
        timestamp: new Date().toISOString()
      }
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setInsights(mockInsights);
      setIsLoading(false);
    }, 1000);
  };

  // Get insight type styling
  const getInsightStyle = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return {
          icon: TrendingUp,
          color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
          bgColor: 'bg-blue-500/10'
        };
      case 'anomaly':
        return {
          icon: AlertTriangle,
          color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
          bgColor: 'bg-orange-500/10'
        };
      case 'opportunity':
        return {
          icon: Zap,
          color: 'text-green-400 bg-green-500/20 border-green-500/30',
          bgColor: 'bg-green-500/10'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
          bgColor: 'bg-yellow-500/10'
        };
      case 'achievement':
        return {
          icon: Award,
          color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
          bgColor: 'bg-purple-500/10'
        };
      default:
        return {
          icon: Activity,
          color: 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30',
          bgColor: 'bg-zinc-500/10'
        };
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-800 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">AI Insights Dashboard</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Personalized analytics and recommendations for your productivity
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-1 bg-zinc-800 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedTimeRange(range.value)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-md transition-colors",
                selectedTimeRange === range.value
                  ? "bg-emerald-600 text-white"
                  : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.changeType === 'increase';
          const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", metric.color, "bg-current/20")}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={cn(
                  "flex items-center space-x-1 px-2 py-0.5 text-xs rounded-full",
                  isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  <ChangeIcon className="w-3 h-3" />
                  <span>{Math.abs(metric.change)}{metric.unit || ''}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">
                  {metric.value}{metric.unit && ` ${metric.unit}`}
                </p>
                <p className="text-sm text-zinc-400">{metric.label}</p>
                {metric.description && (
                  <p className="text-xs text-zinc-500 mt-2">{metric.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-medium text-white">AI Insights</h3>
        </div>

        <div className="space-y-3">
          {insights.map((insight) => {
            const style = getInsightStyle(insight.type);
            const Icon = style.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "border rounded-lg p-4 backdrop-blur-sm",
                  style.bgColor,
                  "border-zinc-700/50"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    style.color
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-white pr-2">
                        {insight.title}
                      </h4>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full border",
                          insight.impact === 'high' ? "bg-red-500/20 text-red-400 border-red-500/30" :
                          insight.impact === 'medium' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                          "bg-green-500/20 text-green-400 border-green-500/30"
                        )}>
                          {insight.impact} impact
                        </span>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-zinc-500" />
                          <span className="text-xs text-zinc-500">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
                      {insight.description}
                    </p>

                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-zinc-400">Recommendations:</p>
                        <ul className="space-y-1">
                          {insight.recommendations.map((rec, index) => (
                            <li key={index} className="text-xs text-zinc-400 flex items-start space-x-2">
                              <span className="text-zinc-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-700/50">
                      <div className="flex items-center space-x-1 text-xs text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                      </div>

                      <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'View Projects', icon: Target, action: () => window.location.href = '/projects' },
            { label: 'Share Resource', icon: FileText, action: () => console.log('Share resource') },
            { label: 'Team Chat', icon: Users, action: () => console.log('Open team chat') },
            { label: 'View Analytics', icon: BarChart3, action: () => console.log('View detailed analytics') }
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="flex flex-col items-center space-y-2 p-3 bg-zinc-700/50 hover:bg-zinc-700 rounded-lg transition-colors group"
            >
              <action.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
              <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}