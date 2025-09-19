import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/db';
import { ensureOwner } from '../../../../src/lib/auth';
import { CreateWorkspace } from '../../../../src/lib/validation';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await ensureOwner(id);
  if (ws instanceof NextResponse) return ws; // Error response

  // @ts-ignore
  const workspace = await prisma.workspace.findUnique({
    where: { id },
    include: {
      resources: {
        include: {
          annotations: true
        }
      }
    }
  });
  return NextResponse.json(workspace);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await ensureOwner(id);
  if (ws instanceof NextResponse) return ws;

  const body = await req.json();
  const parse = CreateWorkspace.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.message }, { status: 400 });
  }

  // @ts-ignore
  const updated = await prisma.workspace.update({
    where: { id },
    data: { title: parse.data.title },
    select: { id: true, title: true, createdAt: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await ensureOwner(id);
  if (ws instanceof NextResponse) return ws;

  // @ts-ignore
  await prisma.workspace.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}