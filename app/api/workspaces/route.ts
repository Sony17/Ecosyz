import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/db';
import { getCurrentUser, ensureUserInDb } from '../../../src/lib/auth';
import { CreateWorkspace } from '../../../src/lib/validation';

export async function GET() {
  // Return all workspaces for public project discovery
  const workspaces = await prisma.workspace.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: { resources: true, shares: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(workspaces);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Ensure user exists in our database
  await ensureUserInDb(user);

  // Find the Prisma user record by supabaseId
  const prismaUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!prismaUser) {
    return NextResponse.json(
      { error: 'User not found in database' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const parse = CreateWorkspace.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.message }, { status: 400 });
  }
  const ws = await prisma.workspace.create({
    data: {
      title: parse.data.title,
      ownerId: prismaUser.id,
    },
    select: { id: true, title: true, createdAt: true },
  });
  return NextResponse.json(ws, { status: 201 });
}
