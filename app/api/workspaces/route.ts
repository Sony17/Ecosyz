import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/db';
import { getCurrentUser } from '../../../src/lib/auth';
import { CreateWorkspace } from '../../../src/lib/validation';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const workspaces = await prisma.workspace.findMany({
    where: { ownerId: user.id },
    select: {
      id: true,
      title: true,
      createdAt: true,
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

  const body = await req.json();
  const parse = CreateWorkspace.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.message }, { status: 400 });
  }
  const ws = await prisma.workspace.create({
    data: {
      title: parse.data.title,
      ownerId: user.id,
    },
    select: { id: true, title: true, createdAt: true },
  });
  return NextResponse.json(ws, { status: 201 });
}
