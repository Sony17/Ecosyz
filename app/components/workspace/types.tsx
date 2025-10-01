export interface Workspace {
  id: string;
  title: string;
  createdAt: string;
  resources: any[];
  shareLinks: any[];
}

export interface WorkspacePageClientProps {
  workspace: Workspace | null;
}

export interface AddResourceFormProps {
  workspaceId: string;
  onClose: () => void;
}

export interface ShareLinksPanelProps {
  workspaceId: string;
  onClose: () => void;
}