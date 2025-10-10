import { NextResponse } from 'next/server';
import { getUid } from '../../../../src/lib/auth';
import { prisma } from '../../../../src/lib/db';

export async function GET() {
  try {
    const ownerId = await getUid();

    // If getUid returned an anonymous id (not a real prisma user), do not create
    const user = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!user) {
      return NextResponse.json({ workspaceId: null });
    }

    // Find most recent workspace for this owner
    let workspace = await prisma.workspace.findFirst({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
    });

    // If none exists, create a default one
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { ownerId, title: 'My Workspace' },
        select: { id: true, title: true },
      });
    }

    return NextResponse.json({
      workspaceId: workspace.id,
      workspaceTitle: workspace.title,
    });
  } catch (error) {
    console.error('Error fetching user workspace:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user workspace' },
      { status: 500 }
    );
  }
}