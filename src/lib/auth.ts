import { cookies } from 'next/headers';
import { prisma } from './db';
import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'anon_session';

export async function getUid() {
  // Read the session/owner cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  const uid = typeof cookie === 'object' && cookie !== null ? cookie.value : undefined;
  if (!uid) throw new Error('No session cookie found');
  return uid;
}

export async function ensureOwner(workspaceId: string) {
  const uid = await getUid();
  // @ts-ignore: Prisma typegen may not show .workspace if not generated yet
  const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!ws) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }
  if (ws.ownerId !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return ws;
}
