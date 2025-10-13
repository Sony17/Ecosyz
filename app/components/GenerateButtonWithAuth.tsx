'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Rocket, 
  Code2, 
  Download, 
  Github, 
  Globe, 
  Settings, 
  CheckCircle, 
  Loader2,
  FileText,
  Zap,
  Star,
  ArrowRight,
  X,
  Lock,
  LogIn,
  User,
  Save,
  FolderPlus,
  Folder
} from 'lucide-react';
import { UserWorkspace } from './workspace/UserWorkspace';
import { useAuth } from '../../src/lib/useAuth';

interface Resource {
  id: string;
  title: string;
  type: string;
  description?: string;
  url?: string;
  authors?: string[];
  year?: number;
}

interface GenerateButtonProps {
  resources: Resource[];
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface GeneratedProject {
  id: string;
  name: string;
  framework: string;
  appType: string;
  createdAt: string;
  status: 'generating' | 'completed' | 'error';
  githubRepo?: string;
  deploymentUrl?: string;
  figmaDesign?: string;
  resources: Resource[];
  files?: any[];
  zipData?: string;
}

export default function GenerateButtonWithAuth({ resources }: GenerateButtonProps) {
  const { user, loading: isCheckingAuth, isAuthenticated } = useAuth();

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [config, setConfig] = useState({
    generationType: 'dashboard',
    framework: 'nextjs',
    features: ['responsive', 'modern', 'analytics'],
    deployToGithub: false,
    deployToVercel: false,
    connectToFigma: false
  });

  const appTypes = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      description: 'Interactive data dashboard with charts and analytics',
      icon: '📊',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'data_visualization', 
      name: 'Data Visualization', 
      description: 'Advanced charts and interactive data exploration',
      icon: '📈',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'research_tool', 
      name: 'Research Tool', 
      description: 'Academic research platform with advanced search',
      icon: '🔬',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio', 
      description: 'Professional showcase of research and projects',
      icon: '💼',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'blog', 
      name: 'Blog Platform', 
      description: 'Modern blog with research article publishing',
      icon: '✍️',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      id: 'web_app', 
      name: 'Web Application', 
      description: 'General purpose web application',
      icon: '🌐',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  const frameworks = [
    { 
      id: 'nextjs', 
      name: 'Next.js', 
      description: 'React framework with SSR and API routes',
      icon: '⚛️',
      popular: true
    },
    { 
      id: 'react', 
      name: 'React + Vite', 
      description: 'Fast React development with Vite bundler',
      icon: '⚛️',
      popular: true
    },
    { 
      id: 'vue', 
      name: 'Vue.js', 
      description: 'Progressive JavaScript framework',
      icon: '💚',
      popular: false
    },
    { 
      id: 'angular', 
      name: 'Angular', 
      description: 'Enterprise-grade TypeScript framework',
      icon: '🅰️',
      popular: false
    }
  ];

  const handleLoginRequired = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!resources || resources.length === 0) {
      alert('Please select some resources first');
      return;
    }

    if (!handleLoginRequired()) {
      return;
    }

    setIsGenerating(true);
    setShowModal(true);
    setShowConfig(false);

    try {
      // Generate the application
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resources,
          ...config,
          userId: user?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        
        // Auto-generate project name based on resources
        const resourceTypes = [...new Set(resources.map(r => r.type))];
        const defaultName = `${config.generationType}-${resourceTypes[0]}-${Date.now()}`;
        setProjectName(defaultName);
        
        // Show save modal for project management
        setShowSaveModal(true);
      } else {
        alert('Generation failed: ' + data.error);
        setShowModal(false);
      }
    } catch (error) {
      alert('Generation failed: ' + error);
      setShowModal(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProjectToWorkspace = async () => {
    if (!result || !user || !projectName.trim()) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName.trim(),
          framework: config.framework,
          appType: config.generationType,
          resources,
          generationData: result,
          userId: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowSaveModal(false);
        setShowModal(false);
        
        // Show workspace to view the saved project
        setTimeout(() => {
          setShowWorkspace(true);
        }, 500);
      } else {
        alert('Failed to save project: ' + data.error);
      }
    } catch (error) {
      alert('Failed to save project: ' + error);
    }
  };

  const downloadZip = () => {
    if (!result?.zipData) return;
    
    const byteCharacters = atob(result.zipData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const redirectToLogin = () => {
    // Store current page to return after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      
      // Redirect to existing auth page which has all provider options
      window.location.href = '/auth';
    }
  };

  const selectedAppType = appTypes.find(type => type.id === config.generationType);
  const selectedFramework = frameworks.find(fw => fw.id === config.framework);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <Loader2 className="h-5 w-5 animate-spin text-white" />
        <span className="text-white">Checking authentication...</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Button Group */}
      <div className="flex items-center gap-3">
        {/* Workspace Button */}
        {user && (
          <motion.button
            onClick={() => setShowWorkspace(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:border-white/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2 text-white">
              <Folder className="h-5 w-5" />
              <span className="font-medium">Workspace</span>
            </div>
          </motion.button>
        )}
        
        <motion.button
          onClick={() => {
            if (handleLoginRequired()) {
              setShowConfig(!showConfig);
            }
          }}
          disabled={!resources || resources.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-2 text-white">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configure</span>
          </div>
        </motion.button>

        <motion.button
          onClick={handleGenerate}
          disabled={!resources || resources.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3 text-white font-semibold">
            {!isAuthenticated ? (
              <Lock className="h-5 w-5" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            )}
            <span>{isAuthenticated ? 'Generate App' : 'Login to Generate'}</span>
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs">
              {resources?.length || 0}
            </div>
            <ArrowRight className="h-4 w-4" />
          </div>
        </motion.button>

        {/* User Status */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/40 rounded-lg">
            <User className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-300">{user.name}</span>
          </div>
        )}
      </div>



      {/* Configuration Panel */}
      <AnimatePresence>
        {showConfig && user && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Generation Configuration</h3>
              </div>
              
              <div className="space-y-6">
                {/* App Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Application Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {appTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => setConfig({...config, generationType: type.id})}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                          config.generationType === type.id
                            ? 'border-white/60 bg-white/20' 
                            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-10 rounded-lg`} />
                        <div className="relative text-left">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-semibold text-white text-sm">{type.name}</div>
                          <div className="text-xs text-gray-300 mt-1">{type.description}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Framework Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Framework
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {frameworks.map((framework) => (
                      <motion.button
                        key={framework.id}
                        onClick={() => setConfig({...config, framework: framework.id})}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                          config.framework === framework.id
                            ? 'border-white/60 bg-white/20' 
                            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{framework.icon}</div>
                          <div className="font-semibold text-white text-sm flex items-center justify-center gap-1">
                            {framework.name}
                            {framework.popular && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                          </div>
                          <div className="text-xs text-gray-300 mt-1">{framework.description}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Phase 4 Integration Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/20"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.deployToGithub}
                        onChange={(e) => setConfig({...config, deployToGithub: e.target.checked})}
                        className="w-4 h-4 text-purple-600 bg-white/20 border-white/40 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <Github className="h-5 w-5 text-white" />
                        <div>
                          <div className="font-semibold text-white text-sm">Deploy to GitHub</div>
                          <div className="text-xs text-gray-300">Create repository automatically</div>
                        </div>
                      </div>
                    </label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/20"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.deployToVercel}
                        onChange={(e) => setConfig({...config, deployToVercel: e.target.checked})}
                        className="w-4 h-4 text-purple-600 bg-white/20 border-white/40 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-white" />
                        <div>
                          <div className="font-semibold text-white text-sm">Deploy to Vercel</div>
                          <div className="text-xs text-gray-300">Live deployment with URL</div>
                        </div>
                      </div>
                    </label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/20"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.connectToFigma}
                        onChange={(e) => setConfig({...config, connectToFigma: e.target.checked})}
                        className="w-4 h-4 text-purple-600 bg-white/20 border-white/40 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-white" />
                        <div>
                          <div className="font-semibold text-white text-sm">Connect to Figma</div>
                          <div className="text-xs text-gray-300">Link design system</div>
                        </div>
                      </div>
                    </label>
                  </motion.div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-sm text-blue-200 mb-2">
                    <Zap className="h-4 w-4 inline mr-1" />
                    Generation Summary
                  </div>
                  <div className="text-white">
                    Creating a <span className="font-semibold text-blue-300">{selectedAppType?.name}</span> using{' '}
                    <span className="font-semibold text-purple-300">{selectedFramework?.name}</span> from{' '}
                    <span className="font-semibold text-pink-300">{resources?.length || 0}</span> resources
                    {config.deployToGithub && <span className="text-green-300"> → GitHub</span>}
                    {config.deployToVercel && <span className="text-blue-300"> → Vercel</span>}
                    {config.connectToFigma && <span className="text-pink-300"> → Figma</span>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-6 max-w-4xl w-full mx-4 border border-white/20 shadow-2xl"
            >
              {isGenerating ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                  >
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    🚀 Generating Your Application...
                  </motion.h3>
                  
                  <p className="text-gray-300 mb-6">
                    Creating {selectedAppType?.name} from {resources.length} resources using {selectedFramework?.name}
                  </p>

                  <div className="space-y-3 text-sm text-gray-400 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      <span>Analyzing research resources...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Code2 className="h-4 w-4 text-purple-400" />
                      <span>Generating application code...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4 text-green-400" />
                      <span>Creating project structure...</span>
                    </div>
                    {config.deployToGithub && (
                      <div className="flex items-center justify-center gap-2">
                        <Github className="h-4 w-4 text-gray-400" />
                        <span>Setting up GitHub repository...</span>
                      </div>
                    )}
                    {config.deployToVercel && (
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <span>Preparing Vercel deployment...</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 text-xs text-gray-500">
                    This may take 30-90 seconds depending on complexity
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Success Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-500/20 rounded-full">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Generation Complete!
                      </h3>
                    </div>
                    <p className="text-gray-300">
                      Your {selectedAppType?.name} is ready for download and will be saved to your workspace
                    </p>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Project Name', value: result.projectId, icon: Rocket },
                      { label: 'Processing Time', value: result.metadata.processingTime, icon: Zap },
                      { label: 'Files Generated', value: result.metadata.filesGenerated, icon: FileText },
                      { label: 'Lines of Code', value: result.metadata.linesOfCode, icon: Code2 }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/20"
                      >
                        <stat.icon className="h-5 w-5 text-white/60 mb-2" />
                        <div className="text-sm text-gray-400">{stat.label}</div>
                        <div className="font-bold text-white text-lg">{stat.value}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Phase 4 Results */}
                  {result.githubRepo && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <Github className="h-5 w-5" />
                        <span className="font-semibold">GitHub Repository Created</span>
                      </div>
                      <a 
                        href={result.githubRepo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-300 hover:text-blue-200 underline"
                      >
                        {result.githubRepo.html_url}
                      </a>
                    </motion.div>
                  )}

                  {result.vercelDeployment && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <Globe className="h-5 w-5" />
                        <span className="font-semibold">Live Deployment Ready</span>
                      </div>
                      <a 
                        href={result.vercelDeployment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-300 hover:text-blue-200 underline"
                      >
                        {result.vercelDeployment.url}
                      </a>
                    </motion.div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={downloadZip}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="h-5 w-5" />
                      Download Project ZIP
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setShowModal(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      <X className="h-5 w-5" />
                      Close
                    </motion.button>
                  </div>
                  
                  {/* Next Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-lg"
                  >
                    <div className="text-sm text-blue-200 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <strong>Next steps:</strong>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>✅ Project will be automatically saved to your workspace</p>
                      <p>📝 Edit code directly in the workspace code editor</p>
                      <p>🎨 View and sync Figma designs in the workspace</p>
                      <p>🚀 Deploy directly from your workspace to GitHub and Vercel</p>
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Project Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FolderPlus className="h-6 w-6 text-purple-400" />
                Save to Workspace
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <p className="text-sm text-gray-400">
                  This project will be saved to your workspace where you can edit code, view designs, and manage deployments.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={saveProjectToWorkspace}
                  disabled={!projectName.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  Save to Workspace
                </motion.button>
                
                <motion.button
                  onClick={() => setShowSaveModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Skip
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Workspace Modal */}
      {showWorkspace && user && (
        <UserWorkspace
          user={user}
          onClose={() => setShowWorkspace(false)}
        />
      )}
    </>
  );
}