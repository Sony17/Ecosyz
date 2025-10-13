import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../src/lib/auth';
import { prisma } from '../../../src/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Prisma to get the correct ID
    const prismaUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (projectId) {
      // Get specific workspace (treating as project)
      const workspace = await prisma.workspace.findFirst({
        where: {
          id: projectId,
          ownerId: prismaUser.id
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

      if (!workspace) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const project = {
        id: workspace.id,
        name: workspace.title,
        description: `Workspace with ${workspace._count.resources} resources`,
        framework: 'react',
        appType: 'workspace',
        status: 'active',
        createdAt: workspace.createdAt,
        updatedAt: workspace.createdAt,
        resourceCount: workspace._count.resources,
        resources: workspace.resources
      };

      return NextResponse.json({ success: true, project });
    }

    // Get all user workspaces (treating them as projects for now)
    const projects = await prisma.workspace.findMany({
      where: {
        ownerId: prismaUser.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        resources: true,
        _count: {
          select: {
            resources: true
          }
        }
      }
    }).then(workspaces => 
      workspaces.map(ws => ({
        id: ws.id,
        name: ws.title,
        description: `Workspace with ${ws._count.resources} resources`,
        framework: 'react',
        appType: 'workspace',
        status: 'active',
        createdAt: ws.createdAt,
        updatedAt: ws.createdAt,
        resourceCount: ws._count.resources
      }))
    );
    
    return NextResponse.json({
      success: true,
      projects: projects || [],
      total: projects?.length || 0
    });

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Prisma to get the correct ID
    const prismaUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, framework, appType, resources, generationData, files } = body;

    if (!name) {
      return NextResponse.json({ 
        error: 'Missing required fields: name' 
      }, { status: 400 });
    }

    // Create new workspace (treating as project)
    const workspace = await prisma.workspace.create({
      data: {
        ownerId: prismaUser.id,
        title: name.trim()
      }
    });

    const project = {
      id: workspace.id,
      name: workspace.title,
      description: description?.trim() || 'New workspace',
      framework: framework || 'react',
      appType: appType || 'workspace',
      status: 'active',
      createdAt: workspace.createdAt,
      updatedAt: workspace.createdAt,
      resourceCount: 0
    };

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Prisma to get the correct ID
    const prismaUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { id, name, description, files, deploymentUrl, githubUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Update workspace (treating as project)
    const updateData: any = {};
    if (name !== undefined) updateData.title = name.trim();

    const workspace = await prisma.workspace.update({
      where: {
        id: id,
        ownerId: prismaUser.id
      },
      data: updateData
    });

    const project = {
      id: workspace.id,
      name: workspace.title,
      description: description?.trim() || 'Updated workspace',
      framework: 'react',
      appType: 'workspace',
      status: 'active',
      createdAt: workspace.createdAt,
      updatedAt: workspace.createdAt
    };

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({
      error: 'Failed to update project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Prisma to get the correct ID
    const prismaUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Delete workspace (treating as project)
    await prisma.workspace.delete({
      where: {
        id: projectId,
        ownerId: prismaUser.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}