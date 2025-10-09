'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Loader2, Check, FileText, Link as LinkIcon, Image, 
  File, Code, Paperclip, Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface SaveResourceProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string | null;
  initialData?: {
    title?: string;
    description?: string;
    url?: string;
    content?: string;
  };
}

export default function SaveResourceModal({ 
  isOpen, 
  onClose, 
  workspaceId,
  initialData = {}
}: SaveResourceProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourceType, setResourceType] = useState<'link' | 'note' | 'file' | 'image' | 'document' | 'code'>('link');
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [url, setUrl] = useState(initialData.url || '');
  const [content, setContent] = useState(initialData.content || '');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const resourceTypes = [
    { id: 'link', label: 'Link', icon: LinkIcon },
    { id: 'note', label: 'Note', icon: FileText },
    { id: 'document', label: 'Document', icon: FileText },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'file', label: 'File', icon: File },
    { id: 'code', label: 'Code', icon: Code },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceId) {
      toast.error('No workspace selected');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Resource title is required');
      return;
    }
    
    if (resourceType === 'link' && !url.trim()) {
      toast.error('URL is required for link resources');
      return;
    }
    
    if (resourceType === 'note' && !content.trim()) {
      toast.error('Content is required for note resources');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This is where you'd connect to your API in a real app
      // const response = await fetch('/api/resources', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     workspaceId,
      //     title,
      //     description,
      //     type: resourceType,
      //     url,
      //     content,
      //     tags,
      //   }),
      // });
      
      // Mock API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Resource saved successfully!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setResourceType('link');
    setTitle('');
    setDescription('');
    setUrl('');
    setContent('');
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-100">Save to Workspace</h2>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Resource Types */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Resource Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {resourceTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setResourceType(type.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                        resourceType === type.id
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
                      } transition-colors`}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Title and Description */}
              <div className="space-y-4 mb-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for this resource"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a brief description"
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
              
              {/* Resource Specific Fields */}
              {(resourceType === 'link' || resourceType === 'image' || resourceType === 'document' || resourceType === 'file') && (
                <div className="mb-5">
                  <label htmlFor="url" className="block text-sm font-medium text-zinc-300 mb-1">
                    {resourceType === 'link' ? 'URL' : 'File Upload'}
                  </label>
                  <div className="flex">
                    <input
                      id="url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={resourceType === 'link' ? "https://example.com" : "Upload or enter a URL"}
                      className="flex-grow px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {resourceType !== 'link' && (
                      <button
                        type="button"
                        className="flex items-center justify-center px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-r-md border border-zinc-600"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {(resourceType === 'note' || resourceType === 'code') && (
                <div className="mb-5">
                  <label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-1">
                    {resourceType === 'note' ? 'Note Content' : 'Code Snippet'}
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={resourceType === 'note' ? "Enter your notes here..." : "Paste your code snippet here..."}
                    rows={5}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>
              )}
              
              {/* Tags */}
              <div className="mb-6">
                <label htmlFor="tags" className="block text-sm font-medium text-zinc-300 mb-1">
                  Tags (Optional)
                </label>
                <div className="flex">
                  <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tags and press Enter"
                    className="flex-grow px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                    className="flex items-center justify-center px-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-200 rounded-r-md border border-zinc-600 disabled:border-zinc-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-md text-sm flex items-center gap-1.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save to Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}