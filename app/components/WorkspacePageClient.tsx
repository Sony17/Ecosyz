'use client';

import { useState } from 'react';
import ResponsiveWorkspace from '../components/workspace/ResponsiveWorkspace';
import WorkspaceContent from '../components/workspace/WorkspaceContent';
import { useAIAssistant } from '../../src/lib/hooks/useAIAssistant';
import useResponsive from '../../src/lib/hooks/useResponsive';

interface WorkspacePageClientProps {
  workspaceId?: string;
  projectId?: string;
}

export default function WorkspacePageClient({
  workspaceId,
  projectId
}: WorkspacePageClientProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'chat' | 'files'>('editor');
  const { isDesktop } = useResponsive();
  const { 
    processUserQuery, 
    suggestions, 
    isProcessing 
  } = useAIAssistant({ 
    workspaceId, 
    projectId 
  });
  
  const handleSendMessage = async (message: string) => {
    const response = await processUserQuery(message);
    return response;
  };

  return (
    <ResponsiveWorkspace
      workspaceId={workspaceId}
      projectId={projectId}
    >
      <WorkspaceContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        workspaceId={workspaceId}
        projectId={projectId}
        onSendMessage={handleSendMessage}
        suggestions={suggestions}
        isProcessing={isProcessing}
      />
    </ResponsiveWorkspace>
  );
}