import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../src/lib/auth';
import { prisma } from '../../../../src/lib/db';
import { supabaseServer } from '../../../../src/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Storage service unavailable' },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${timestamp}.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      // Check if bucket exists
      const { data: buckets } = await supabaseServer.storage.listBuckets();
      console.log('Available buckets:', buckets?.map((b: any) => b.name));
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseServer.storage
      .from('avatars')
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    // Update profile with new avatar URL
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        avatarUrl: urlData.publicUrl,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatarUrl: urlData.publicUrl,
        preferences: {
          theme: 'system',
          language: 'en-IN',
          emailNotifications: true,
          marketingEmails: false,
        },
      },
    });

    return NextResponse.json({
      avatarUrl: urlData.publicUrl,
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        preferences: profile.preferences,
      },
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}