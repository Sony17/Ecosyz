'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Figma, 
  GitBranch, 
  Globe, 
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Code2
} from 'lucide-react';
import OpenHandsPanel from '../components/integrations/OpenHandsPanel';
import FigmaPanel from '../components/integrations/FigmaPanel';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'beta' | 'coming_soon';
  color: string;
  features: string[];
}

export default function IntegrationsPage() {
  const [activeIntegration, setActiveIntegration] = useState<string>('openhands');

  const integrations: Integration[] = [
    {
      id: 'openhands',
      name: 'OpenHands AI',
      description: 'Autonomous AI development framework for intelligent code generation and optimization',
      icon: Bot,
      status: 'active',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Autonomous code generation',
        'Intelligent debugging',
        'Performance optimization',
        'Architecture recommendations',
        'Best practices implementation',
        'Real-time code analysis'
      ]
    },
    {
      id: 'figma',
      name: 'Figma Design',
      description: 'Seamless design-to-code workflow with automated component generation',
      icon: Figma,
      status: 'active', 
      color: 'from-purple-500 to-pink-500',
      features: [
        'Design system import',
        'Component code generation',
        'Asset optimization',
        'Multi-framework support',
        'Real-time synchronization',
        'Design token extraction'
      ]
    },
    {
      id: 'github',
      name: 'GitHub Advanced',
      description: 'Enhanced GitHub integration with automated workflows and AI-powered reviews',
      icon: GitBranch,
      status: 'beta',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Automated repository creation',
        'AI-powered code reviews',
        'Intelligent branch management',
        'CI/CD pipeline setup',
        'Issue auto-resolution',
        'Code quality analysis'
      ]
    },
    {
      id: 'vercel',
      name: 'Vercel Pro',
      description: 'Advanced deployment pipeline with performance monitoring and optimization',
      icon: Globe,
      status: 'beta',
      color: 'from-orange-500 to-red-500', 
      features: [
        'One-click deployments',
        'Performance monitoring',
        'Edge function optimization',
        'Automatic scaling',
        'Security scanning',
        'Analytics integration'
      ]
    }
  ];

  const stats = [
    { label: 'Active Integrations', value: '4', icon: Zap, color: 'text-blue-400' },
    { label: 'Projects Enhanced', value: '127', icon: Code2, color: 'text-green-400' },
    { label: 'Development Hours Saved', value: '340', icon: Clock, color: 'text-purple-400' },
    { label: 'Teams Using', value: '23', icon: Users, color: 'text-pink-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Phase 3 Integrations
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Advanced AI-powered integrations that transform your development workflow with autonomous 
            code generation, design-to-code automation, and intelligent optimization.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveIntegration(integration.id)}
              className={`cursor-pointer relative overflow-hidden bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
                activeIntegration === integration.id 
                  ? 'border-white/40 shadow-2xl' 
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-10`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <integration.icon className="h-8 w-8 text-white" />
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    integration.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {integration.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                  {integration.description}
                </p>
                
                <div className="space-y-1 mb-4">
                  {integration.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-blue-300 font-medium">
                  <span>Open Integration</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Integration Panel */}
        <motion.div
          key={activeIntegration}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {activeIntegration === 'openhands' && <OpenHandsPanel />}
          {activeIntegration === 'figma' && <FigmaPanel />}
          
          {activeIntegration === 'github' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
              <GitBranch className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">GitHub Advanced Integration</h3>
              <p className="text-gray-300 mb-6">
                Enhanced GitHub workflows with AI-powered automation coming soon in Phase 4.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4 mr-2" />
                Beta Release - Q2 2024
              </div>
            </div>
          )}
          
          {activeIntegration === 'vercel' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
              <Globe className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Vercel Pro Integration</h3>
              <p className="text-gray-300 mb-6">
                Advanced deployment pipeline with performance monitoring and edge optimization.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4 mr-2" />
                Beta Release - Q2 2024
              </div>
            </div>
          )}
        </motion.div>

        {/* Phase Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-blue-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Development Roadmap</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Phase 3 - Active</h3>
              <p className="text-gray-300 text-sm">
                OpenHands AI and Figma integrations with autonomous development capabilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Phase 4 - Q2 2024</h3>
              <p className="text-gray-300 text-sm">
                Advanced GitHub and Vercel integrations with enhanced automation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Phase 5 - Q3 2024</h3>
              <p className="text-gray-300 text-sm">
                AI marketplace, custom plugins, and enterprise features
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}