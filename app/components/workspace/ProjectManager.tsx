'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  Edit,
  Trash2,
  Download,
  Share,
  GitBranch,
  Zap,
  ExternalLink,
  Copy,
  Archive,
  Star,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  appType: string;
  files: { [key: string]: string };
  figmaDesigns?: any[];
  deploymentUrl?: string;
  githubUrl?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectManagerProps {
  project: Project;
  onUpdate: () => void;
  onDelete: () => void;
}

export function ProjectManager({ project, onUpdate, onDelete }: ProjectManagerProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  const { toast } = useToast();

  const handleEdit = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: project.id,
          name: editForm.name.trim(),
          description: editForm.description.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update project');

      toast({
        title: "Success",
        description: "Project updated successfully",
      });

      setShowEditDialog(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleExportProject = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      // Add all project files to zip
      Object.entries(project.files).forEach(([filePath, content]) => {
        zip.file(filePath, content);
      });

      // Add project metadata
      const metadata = {
        name: project.name,
        description: project.description,
        framework: project.framework,
        appType: project.appType,
        created_at: project.created_at,
        updated_at: project.updated_at,
      };
      
      zip.file('project.json', JSON.stringify(metadata, null, 2));
      
      // Add README with deployment instructions
      const readme = `# ${project.name}

${project.description}

## Framework
${project.framework}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

This project was generated using Ecosyz AI Code Generator.

- Framework: ${project.framework}
- App Type: ${project.appType}
- Generated: ${new Date(project.created_at).toLocaleString()}

## Deployment

This project is ready to be deployed on platforms like:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

Refer to your framework's deployment documentation for specific instructions.

---

Generated with ❤️ by [Ecosyz AI Code Generator](https://ecosyz.com)
`;
      
      zip.file('README.md', readme);

      // Generate and download zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Project exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export project",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateShareUrl = async () => {
    try {
      const response = await fetch('/api/projects/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate share URL');

      const { shareUrl } = await response.json();
      setShareUrl(shareUrl);
      setShowShareDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share URL",
        variant: "destructive",
      });
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied",
        description: "Share URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const handleArchiveProject = async () => {
    try {
      const response = await fetch('/api/projects/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to archive project');

      toast({
        title: "Success",
        description: "Project archived successfully",
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive project",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Project
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleExportProject} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Export as ZIP
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleGenerateShareUrl}>
            <Share className="w-4 h-4 mr-2" />
            Share Project
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {project.githubUrl ? (
            <DropdownMenuItem asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                View on GitHub
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <GitBranch className="w-4 h-4 mr-2" />
              No GitHub Repo
            </DropdownMenuItem>
          )}
          
          {project.deploymentUrl ? (
            <DropdownMenuItem asChild>
              <a
                href={project.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                View Live Site
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <Zap className="w-4 h-4 mr-2" />
              Not Deployed
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleArchiveProject}>
            <Archive className="w-4 h-4 mr-2" />
            Archive Project
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project's name and description.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Project Name
              </label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">{project.framework}</Badge>
              <Badge variant="outline">{project.appType}</Badge>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={!editForm.name.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>This will permanently delete:</strong>
            </p>
            <ul className="text-sm text-red-600 mt-1 ml-4 list-disc">
              <li>All project files and code</li>
              <li>Figma designs and components</li>
              <li>Project history and metadata</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your project (read-only).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyShareUrl} size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Share Options:</strong>
              </p>
              <ul className="text-sm text-blue-600 mt-1 ml-4 list-disc">
                <li>Viewers can see code and designs</li>
                <li>No editing permissions</li>
                <li>Link expires in 30 days</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
            <Button onClick={copyShareUrl}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}