'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Code2, 
  Bug, 
  Zap, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileText,
  GitBranch
} from 'lucide-react';

interface OpenHandsAction {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  estimatedTime: string;
}

interface OpenHandsSession {
  sessionId: string;
  status: 'initialized' | 'in_progress' | 'completed' | 'error';
  action: string;
  logs: string[];
  result?: any;
}

export default function OpenHandsPanel() {
  const [activeSession, setActiveSession] = useState<OpenHandsSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  const actions: OpenHandsAction[] = [
    {
      id: 'create_project',
      name: 'Create Project',
      description: 'Generate a new project with AI-powered architecture',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      estimatedTime: '15-30 seconds'
    },
    {
      id: 'enhance_code',
      name: 'Enhance Code',
      description: 'Improve existing code with best practices and optimizations',
      icon: Code2,
      color: 'from-purple-500 to-pink-500',
      estimatedTime: '10-20 seconds'
    },
    {
      id: 'debug_project',
      name: 'Debug Project',
      description: 'Automatically find and fix common issues',
      icon: Bug,
      color: 'from-red-500 to-orange-500',
      estimatedTime: '12-25 seconds'
    },
    {
      id: 'optimize_performance',
      name: 'Optimize Performance',
      description: 'Analyze and improve application performance',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      estimatedTime: '8-15 seconds'
    }
  ];

  const handleExecuteAction = async (actionId: string) => {
    setIsProcessing(true);
    setSelectedAction(actionId);
    
    try {
      const response = await fetch('/api/openhands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionId,
          requirements: 'Create modern, performant application following best practices',
          codebase: {
            files: [],
            framework: 'nextjs',
            language: 'typescript'
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setActiveSession({
          sessionId: result.sessionId,
          status: result.status,
          action: actionId,
          logs: result.logs || [],
          result: result.result
        });
      } else {
        console.error('OpenHands execution failed:', result.error);
      }
    } catch (error) {
      console.error('Error executing OpenHands action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">OpenHands AI Assistant</h2>
          <p className="text-sm text-gray-300">Autonomous development and optimization</p>
        </div>
      </div>

      {/* Action Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            onClick={() => handleExecuteAction(action.id)}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedAction === action.id && isProcessing
                ? 'border-white/60 bg-white/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 rounded-lg`} />
            <div className="relative flex items-start gap-3">
              <action.icon className="h-6 w-6 text-white mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-white text-sm mb-1">{action.name}</h3>
                <p className="text-xs text-gray-300 mb-2">{action.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">⏱️ {action.estimatedTime}</span>
                  {selectedAction === action.id && isProcessing && (
                    <Loader2 className="h-3 w-3 text-blue-400 animate-spin" />
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Session Results */}
      <AnimatePresence>
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/20 pt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-1 rounded-full ${
                activeSession.status === 'completed' ? 'bg-green-500' :
                activeSession.status === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
                {activeSession.status === 'completed' ? <CheckCircle className="h-4 w-4 text-white" /> :
                 activeSession.status === 'error' ? <AlertCircle className="h-4 w-4 text-white" /> :
                 <Loader2 className="h-4 w-4 text-white animate-spin" />}
              </div>
              <h3 className="font-semibold text-white">
                Session: {activeSession.action.replace('_', ' ').toUpperCase()}
              </h3>
              <span className="text-xs text-gray-400">ID: {activeSession.sessionId}</span>
            </div>

            {/* Logs */}
            <div className="bg-black/20 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Execution Logs:</h4>
              <div className="space-y-1">
                {activeSession.logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xs text-green-300 font-mono"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Results */}
            {activeSession.result && (
              <div className="space-y-4">
                {/* Enhanced Files */}
                {activeSession.result.enhanced_files && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Enhanced Files:</h4>
                    <div className="space-y-2">
                      {activeSession.result.enhanced_files.map((file: any, index: number) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium text-white">{file.path}</span>
                          </div>
                          <div className="text-xs text-gray-400 mb-2">Changes:</div>
                          <ul className="text-xs text-green-300 space-y-1">
                            {file.changes.map((change: string, changeIndex: number) => (
                              <li key={changeIndex}>• {change}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {activeSession.result.suggestions && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">AI Suggestions:</h4>
                    <div className="space-y-2">
                      {activeSession.result.suggestions.map((suggestion: any, index: number) => (
                        <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Settings className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-300 capitalize">
                              {suggestion.type}
                            </span>
                          </div>
                          <p className="text-xs text-white mb-2">{suggestion.description}</p>
                          <p className="text-xs text-gray-400">{suggestion.implementation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Improvements */}
                {activeSession.result.performance_improvements && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Performance Improvements:</h4>
                    <div className="space-y-2">
                      {activeSession.result.performance_improvements.map((improvement: any, index: number) => (
                        <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-green-300">{improvement.metric}</span>
                          </div>
                          <p className="text-xs text-white mb-2">{improvement.improvement}</p>
                          <p className="text-xs text-gray-400">{improvement.code_change}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Debug Fixes */}
                {activeSession.result.debug_fixes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Debug Fixes:</h4>
                    <div className="space-y-2">
                      {activeSession.result.debug_fixes.map((fix: any, index: number) => (
                        <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Bug className="h-4 w-4 text-red-400" />
                            <span className="text-sm font-medium text-red-300">
                              {fix.file}:{fix.line}
                            </span>
                          </div>
                          <p className="text-xs text-white mb-1">Issue: {fix.issue}</p>
                          <p className="text-xs text-green-300">Fix: {fix.fix}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}