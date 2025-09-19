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

export default async function WorkspacePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

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

  // Add annotation count to resources
  const resourcesWithCount = workspace.resources.map(resource => {
    const data = resource.data as any
    return {
      ...resource,
      url: resource.url || undefined,
      notes: data?.notes || undefined,
      createdAt: resource.createdAt.toISOString(),
      annotations: resource.annotations.map((annotation: any) => ({
        id: annotation.id,
        body: annotation.body,
        createdAt: annotation.createdAt.toISOString(),
      })),
      annotationCount: resource.annotations.length,
      tags: Array.isArray(resource.tags) ? resource.tags as string[] : undefined,
    }
  })

  const workspaceData: Workspace = {
    id: workspace.id,
    title: workspace.title,
    resources: resourcesWithCount,
    shareLinks: workspace.shares.map((share: any) => ({
      id: share.id,
      token: share.token,
      createdAt: share.createdAt.toISOString(),
      expiresAt: share.expiresAt?.toISOString(),
    })),
  }

  return <WorkspacePageClient workspaceData={workspaceData} />
}