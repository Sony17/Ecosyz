import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../src/lib/auth';
import { prisma } from '../../../src/lib/db';
import { UpdateProfile } from '../../../src/lib/validation';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      // Create default profile
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          preferences: {
            theme: 'system',
            language: 'en-IN',
            emailNotifications: true,
            marketingEmails: false,
          },
        },
      });
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        preferences: profile.preferences,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate input
    const validationResult = UpdateProfile.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { displayName, bio, preferences } = validationResult.data;

    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        displayName,
        bio,
        preferences,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        displayName,
        bio,
        preferences,
      },
    });

    return NextResponse.json({
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        preferences: profile.preferences,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}