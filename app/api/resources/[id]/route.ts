import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/db'
import { getUid } from '../../../../src/lib/auth'

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const userId = await getUid()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the resource and verify ownership through workspace
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: { workspace: true },
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    if (resource.workspace.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the resource (cascade will handle annotations)
    await prisma.resource.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/resources/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}