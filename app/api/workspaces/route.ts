import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/db';
import { getUid } from '../../../src/lib/auth';
import { CreateWorkspace } from '../../../src/lib/validation';

export async function GET() {
  const uid = await getUid();
  // @ts-ignore
  const workspaces = await prisma.workspace.findMany({
    where: { ownerId: uid },
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
  const uid = await getUid();
  const body = await req.json();
  const parse = CreateWorkspace.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.message }, { status: 400 });
  }
  // @ts-ignore
  const ws = await prisma.workspace.create({
    data: {
      title: parse.data.title,
      ownerId: uid,
    },
    select: { id: true, title: true, createdAt: true },
  });
  return NextResponse.json(ws, { status: 201 });
}
