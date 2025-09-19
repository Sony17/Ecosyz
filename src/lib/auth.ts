import { cookies } from 'next/headers';
import { prisma } from './db';
import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'anon_session';

function newSessionId() {
  // Use crypto.randomUUID when available
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  // Secure fallback using Web Crypto
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const bytes = new Uint8Array(16);
    // @ts-ignore
    crypto.getRandomValues(bytes);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = typeof btoa !== 'undefined' ? btoa(bin) : Buffer.from(bytes).toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
  // If secure randomness is not available, fail rather than issue weak IDs
  throw new Error('Secure randomness unavailable');
}

export async function getUid() {
  // Read the session/owner cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  let uid = typeof cookie === 'object' && cookie !== null ? cookie.value : undefined;

  // If no session cookie exists, create a new one
  if (!uid) {
    uid = newSessionId();
    // Set the cookie for future requests
    cookieStore.set({
      name: SESSION_COOKIE,
      value: uid,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 180, // 180 days
    });
  }

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
