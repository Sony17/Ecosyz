'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye,
  Code,
  Layers,
  Grid,
  Move,
  MousePointer,
  Upload,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface FigmaDesign {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  frames: FigmaFrame[];
  components: FigmaComponent[];
  styles: FigmaStyle[];
  created_at: string;
}

interface FigmaFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  image: string;
  components: FigmaComponent[];
}

interface FigmaComponent {
  id: string;
  name: string;
  type: string;
  properties: { [key: string]: any };
  code?: string;
}

interface FigmaStyle {
  id: string;
  name: string;
  type: 'color' | 'typography' | 'effect';
  value: any;
  cssCode?: string;
}

interface FigmaDesignViewerProps {
  designs: FigmaDesign[];
  projectId: string;
}

export function FigmaDesignViewer({ designs, projectId }: FigmaDesignViewerProps) {
  const [selectedDesign, setSelectedDesign] = useState<FigmaDesign | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FigmaFrame | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'preview' | 'inspect' | 'code'>('preview');
  const [selectedComponent, setSelectedComponent] = useState<FigmaComponent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    if (designs.length > 0 && !selectedDesign) {
      setSelectedDesign(designs[0]);
      if (designs[0].frames.length > 0) {
        setSelectedFrame(designs[0].frames[0]);
      }
    }
  }, [designs, selectedDesign]);

  const handleImportFigmaDesign = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Figma URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const response = await fetch('/api/figma/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: importUrl,
          projectId: projectId,
        }),
      });

      if (!response.ok) throw new Error('Failed to import design');

      const newDesign = await response.json();
      
      toast({
        title: "Success",
        description: "Figma design imported successfully!",
      });
      
      setImportUrl('');
      // In a real app, this would trigger a re-fetch of designs
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import Figma design",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleGenerateCode = async (component: FigmaComponent) => {
    try {
      const response = await fetch('/api/figma/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component: component,
          framework: 'react', // Could be dynamic based on project
        }),
      });

      if (!response.ok) throw new Error('Failed to generate code');

      const { code } = await response.json();
      
      // Update component with generated code
      component.code = code;
      setSelectedComponent({ ...component });
      
      toast({
        title: "Success",
        description: "Component code generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate component code",
        variant: "destructive",
      });
    }
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(25, Math.min(500, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (designs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Figma Designs</h3>
          <p className="text-gray-500 mb-6">
            Import your Figma designs to view them here and generate React components automatically.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Paste Figma file URL here..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleImportFigmaDesign}
                disabled={isImporting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
            
            <div className="text-xs text-gray-400">
              Supports Figma file URLs (figma.com/file/...)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* Designs Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Designs</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setImportUrl('')}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Import
            </Button>
          </div>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm bg-white border-gray-200"
            />
          </div>

          {importUrl !== '' && (
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Paste Figma file URL..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="flex-1 text-xs"
              />
              <Button
                size="sm"
                onClick={handleImportFigmaDesign}
                disabled={isImporting}
              >
                Import
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedDesign?.id === design.id
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedDesign(design);
                  if (design.frames.length > 0) {
                    setSelectedFrame(design.frames[0]);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {design.thumbnail ? (
                      <img 
                        src={design.thumbnail} 
                        alt={design.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <Palette className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">
                      {design.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {design.frames.length} frames
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(design.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {design.url && (
                      <a
                        href={design.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View in Figma
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Design Content */}
      <div className="flex-1 flex flex-col">
        {selectedDesign ? (
          <>
            {/* Design Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedDesign.name}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    {selectedDesign.frames.length > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const currentIndex = selectedDesign.frames.findIndex(f => f.id === selectedFrame?.id);
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : selectedDesign.frames.length - 1;
                            setSelectedFrame(selectedDesign.frames[prevIndex]);
                          }}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600">
                          {selectedFrame?.name || 'Select Frame'}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const currentIndex = selectedDesign.frames.findIndex(f => f.id === selectedFrame?.id);
                            const nextIndex = currentIndex < selectedDesign.frames.length - 1 ? currentIndex + 1 : 0;
                            setSelectedFrame(selectedDesign.frames[nextIndex]);
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleZoom(-25)}
                      className="h-6 w-6 p-0"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium min-w-[4ch] text-center">
                      {zoomLevel}%
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleZoom(25)}
                      className="h-6 w-6 p-0"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={resetZoom}
                      className="h-6 w-6 p-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Tabs */}
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 grid w-fit grid-cols-3 bg-gray-100">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="inspect" className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  Inspect
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="preview" className="h-full m-0 p-4">
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    {selectedFrame ? (
                      <div 
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                          transformOrigin: 'center center',
                        }}
                      >
                        <img
                          src={selectedFrame.image}
                          alt={selectedFrame.name}
                          className="max-w-full max-h-full"
                          style={{
                            width: selectedFrame.width,
                            height: selectedFrame.height,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Select a frame to preview</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="inspect" className="h-full m-0 p-0">
                  <div className="h-full flex">
                    <div className="flex-1 p-4">
                      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                        {selectedFrame ? (
                          <div className="relative">
                            <img
                              src={selectedFrame.image}
                              alt={selectedFrame.name}
                              className="max-w-full max-h-full cursor-crosshair"
                              style={{
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'center center',
                              }}
                              onClick={(e) => {
                                // In a real implementation, this would detect components at click position
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                console.log('Clicked at:', x, y);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <MousePointer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Click on elements to inspect</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-80 border-l border-gray-200 bg-white p-4">
                      <h3 className="font-medium text-gray-800 mb-4">Component Inspector</h3>
                      {selectedComponent ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-700">{selectedComponent.name}</h4>
                            <Badge variant="outline" className="mt-1">
                              {selectedComponent.type}
                            </Badge>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Properties</h5>
                            <div className="space-y-2 text-sm">
                              {Object.entries(selectedComponent.properties || {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-500">{key}:</span>
                                  <span className="text-gray-800 truncate ml-2">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleGenerateCode(selectedComponent)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Code className="w-4 h-4 mr-2" />
                            Generate Code
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <MousePointer className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">Click on a component to inspect</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="h-full m-0 p-4">
                  <div className="h-full bg-gray-50 rounded-lg p-6">
                    {selectedComponent?.code ? (
                      <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-800">
                            Generated Component: {selectedComponent.name}
                          </h3>
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(selectedComponent.code || '')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                        <pre className="flex-1 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                          <code>{selectedComponent.code}</code>
                        </pre>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No code generated yet</p>
                          <p className="text-sm text-gray-400">
                            Use the inspect mode to select a component and generate its code
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Frame Selector */}
            {selectedDesign.frames.length > 1 && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {selectedDesign.frames.map((frame) => (
                    <motion.div
                      key={frame.id}
                      whileHover={{ scale: 1.05 }}
                      className={`flex-shrink-0 p-2 rounded-lg cursor-pointer transition-all ${
                        selectedFrame?.id === frame.id
                          ? 'bg-purple-100 border-2 border-purple-300'
                          : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedFrame(frame)}
                    >
                      <img
                        src={frame.image}
                        alt={frame.name}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <p className="text-xs text-center mt-1 truncate w-16">
                        {frame.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Select a design to view</p>
              <p className="text-sm text-gray-400">
                Choose from your imported Figma designs on the left
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}