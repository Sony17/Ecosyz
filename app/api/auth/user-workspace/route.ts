import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../src/lib/auth';
import { prisma } from '../../../../src/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Prisma
    const prismaUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a workspace
    let workspace = await prisma.workspace.findFirst({
      where: {
        ownerId: prismaUser.id
      },
      include: {
        resources: {
          take: 5, // Get first 5 resources
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            resources: true
          }
        }
      }
    });

    // If no workspace exists, create a default one
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          ownerId: prismaUser.id,
          title: `${prismaUser.name || 'My'} Workspace`
        },
        include: {
          resources: true,
          _count: {
            select: {
              resources: true
            }
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      workspace: {
        id: workspace.id,
        title: workspace.title,
        createdAt: workspace.createdAt,
        resources: workspace.resources,
        resourceCount: workspace._count.resources
      },
      user: {
        id: prismaUser.id,
        supabaseId: prismaUser.supabaseId,
        email: prismaUser.email,
        name: prismaUser.name,
        avatarUrl: prismaUser.avatarUrl
      }
    });

  } catch (error) {
    console.error('User workspace API error:', error);
    return NextResponse.json({
      error: 'Failed to get user workspace',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}