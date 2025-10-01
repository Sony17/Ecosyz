export interface Workspace {
  workspace: Workspace | null;
}

interface AddResourceFormProps {
  workspaceId: string;
  onClose: () => void;
}

interface ShareLinksPanelProps {
  workspaceId: string;
  onClose: () => void;
}