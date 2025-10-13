'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Figma, 
  Download, 
  Code, 
  Palette, 
  Layout, 
  RefreshCw,
  FileImage,
  Layers,
  Copy,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface FigmaFile {
  fileId: string;
  name: string;
  thumbnail?: string;
  lastModified: string;
}

interface FigmaComponent {
  id: string;
  name: string;
  description: string;
  framework: string;
  code: string;
}

export default function FigmaPanel() {
  const [connectedFiles, setConnectedFiles] = useState<FigmaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<FigmaFile | null>(null);
  const [generatedComponents, setGeneratedComponents] = useState<FigmaComponent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'sync'>('import');

  // Mock Figma files
  const mockFiles: FigmaFile[] = [
    {
      fileId: 'ecosyz-design-system',
      name: 'Ecosyz Design System',
      thumbnail: 'https://via.placeholder.com/200x120/6366F1/white?text=Design+System',
      lastModified: '2 hours ago'
    },
    {
      fileId: 'landing-page-mockups',
      name: 'Landing Page Mockups', 
      thumbnail: 'https://via.placeholder.com/200x120/8B5CF6/white?text=Landing+Page',
      lastModified: '1 day ago'
    },
    {
      fileId: 'mobile-app-ui',
      name: 'Mobile App UI',
      thumbnail: 'https://via.placeholder.com/200x120/10B981/white?text=Mobile+UI',
      lastModified: '3 days ago'
    }
  ];

  const handleImportDesign = async (fileId: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import_design',
          fileId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const file = mockFiles.find(f => f.fileId === fileId);
        if (file) {
          setSelectedFile(file);
          setConnectedFiles(prev => [...prev.filter(f => f.fileId !== fileId), file]);
        }
      }
    } catch (error) {
      console.error('Error importing Figma design:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCode = async (fileId: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_code',
          fileId,
          nodeId: 'selected-nodes'
        })
      });

      const result = await response.json();
      
      if (result.success && result.data?.generatedCode) {
        setGeneratedComponents(result.data.generatedCode.map((comp: any) => ({
          id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: comp.componentName,
          description: `Generated from Figma design`,
          framework: comp.framework,
          code: comp.code
        })));
      }
    } catch (error) {
      console.error('Error generating code from Figma:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Show toast notification in real app
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
          <Figma className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Figma Integration</h2>
          <p className="text-sm text-gray-300">Design to code automation</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg">
        {[
          { id: 'import', label: 'Import Design', icon: Download },
          { id: 'export', label: 'Generate Code', icon: Code },
          { id: 'sync', label: 'Sync Assets', icon: RefreshCw }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'import' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Available Figma Files</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFiles.map((file) => (
                <motion.div
                  key={file.fileId}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={file.thumbnail} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h4 className="font-medium text-white mb-1">{file.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">Modified {file.lastModified}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleImportDesign(file.fileId)}
                      disabled={isProcessing}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      Import
                    </button>
                    <button className="px-3 py-2 border border-white/20 text-white rounded-md hover:bg-white/10 text-sm transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generate Components</h3>
              {selectedFile && (
                <button
                  onClick={() => handleGenerateCode(selectedFile.fileId)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-sm font-medium transition-all"
                >
                  {isProcessing ? 'Generating...' : 'Generate Code'}
                </button>
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-blue-400" />
                    <div>
                      <h4 className="font-medium text-white">{selectedFile.name}</h4>
                      <p className="text-sm text-gray-400">Ready for code generation</p>
                    </div>
                  </div>
                </div>

                {generatedComponents.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Generated Components:</h4>
                    {generatedComponents.map((component) => (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-white">{component.name}</h5>
                              <p className="text-sm text-gray-400">{component.framework} Component</p>
                            </div>
                            <button
                              onClick={() => handleCopyCode(component.code)}
                              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                              title="Copy code"
                            >
                              <Copy className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <pre className="bg-black/20 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                            <code>{component.code}</code>
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileImage className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No File Selected</h4>
                <p className="text-gray-400 mb-4">Import a Figma file first to generate components</p>
                <button
                  onClick={() => setActiveTab('import')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Import Design
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'sync' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Asset Synchronization</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-purple-400" />
                    <span className="font-medium text-white">Design Tokens</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">Colors, typography, and spacing synchronized</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-white">Assets Export</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">Icons and images exported in optimized formats</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Layout className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-white">Component Library</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">React components generated and updated</p>
              </div>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Sync All Assets
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}