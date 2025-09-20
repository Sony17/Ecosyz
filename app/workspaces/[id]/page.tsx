import { prisma } from '../../../src/lib/db'
import { notFound } from 'next/navigation'
import WorkspacePageClient from '../../components/workspace/WorkspacePageClient'

interface Resource {
  id: string
  title: string
  url?: string
  notes?: string
  createdAt: string
  tags?: string[]
  annotations: { id: string; body: string; createdAt: string }[]
  annotationCount?: number
}

interface Workspace {
  id: string
  title: string
  resources: Resource[]
  shareLinks: { id: string; token: string; createdAt: string; expiresAt?: string }[]
}

export async function generateStaticParams() {
  return []
}

export default async function WorkspacePage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params

  const workspace = await prisma.workspace.findUnique({
    where: { id },
    include: {
      resources: {
        include: {
          annotations: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      shares: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!workspace) {
    notFound()
  }

  interface ResourceData {
    notes?: string;
  }

  // Add annotation count to resources
  const resourcesWithCount = workspace.resources.map(resource => {
    const data = (resource.data as ResourceData | null) ?? {};
    return {
      ...resource,
      url: resource.url || undefined,
      notes: data.notes,
      createdAt: resource.createdAt.toISOString(),
      annotations: resource.annotations.map((annotation) => ({
        id: annotation.id,
        body: annotation.body,
        createdAt: annotation.createdAt.toISOString(),
      })),
      annotationCount: resource.annotations.length,
      tags: Array.isArray(resource.tags) ? resource.tags.map(tag => String(tag)) : undefined,
    }
  })

  const workspaceData: Workspace = {
    id: workspace.id,
    title: workspace.title,
    resources: resourcesWithCount,
    shareLinks: workspace.shares.map((share) => ({
      id: share.id,
      token: share.token,
      createdAt: share.createdAt.toISOString(),
      expiresAt: share.expiresAt?.toISOString(),
    })),
  }

  return <WorkspacePageClient workspaceData={workspaceData} />
}