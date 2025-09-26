import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../src/lib/auth';
import { prisma } from '../../../../src/lib/db';
import { supabase } from '../../../../src/lib/supabase';

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Delete user from Prisma database first (due to foreign key constraints)
    try {
      await prisma.user.delete({
        where: { supabaseId: user.id },
      });
    } catch (prismaError) {
      console.error('Error deleting user from Prisma:', prismaError);
      // Continue with Supabase deletion even if Prisma deletion fails
    }

    // Delete user from Supabase
    const { error: supabaseError } = await supabase.auth.admin.deleteUser(user.id);

    if (supabaseError) {
      console.error('Error deleting user from Supabase:', supabaseError);
      return NextResponse.json(
        { error: 'Failed to delete user from authentication service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}