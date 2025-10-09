'use client';

import { useParams, useSearchParams } from 'next/navigation';
import WorkspacePageClient from '../../../app/components/WorkspacePageClient';

export default function WorkspacePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = params.id as string;
  const projectId = searchParams.get('project');
  
  return (
    <div className="h-screen w-full">
      <WorkspacePageClient
        workspaceId={workspaceId}
        projectId={projectId || undefined}
      />
    </div>
  );
}