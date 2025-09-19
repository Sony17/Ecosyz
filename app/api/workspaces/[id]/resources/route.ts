import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../src/lib/db';
import { ensureOwner } from '../../../../../src/lib/auth';
import { CreateResource } from '../../../../../src/lib/validation';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await ensureOwner(id);
  if (ws instanceof NextResponse) return ws;

  // @ts-ignore
  const resources = await prisma.resource.findMany({
    where: { workspaceId: id },
    include: { annotations: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await ensureOwner(id);
  if (ws instanceof NextResponse) return ws;

  const body = await req.json();
  const parse = CreateResource.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.message }, { status: 400 });
  }

  // @ts-ignore
  const resource = await prisma.resource.create({
    data: {
      workspaceId: id,
      title: parse.data.title,
      url: parse.data.url,
      type: parse.data.type,
      tags: parse.data.tags,
      data: parse.data.data ?? {},
    },
  });
  return NextResponse.json(resource, { status: 201 });
}