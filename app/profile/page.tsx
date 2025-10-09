import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../src/lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from '../components/ui/Container';
import UserProfile from '../components/profile/UserProfile';

export const dynamic = 'force-dynamic';

async function getProfileData() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/profile`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    return { user, profile: data.profile };
  } catch (error) {
    console.error('Error fetching profile:', error);
    // Return default profile data
    return {
      user,
      profile: {
        displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        bio: '',
        avatarUrl: null,
        preferences: {
          theme: 'system',
          language: 'en-IN',
          emailNotifications: true,
          marketingEmails: false,
        },
      },
    };
  }
}

export default async function ProfilePage() {
  const { user, profile } = await getProfileData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container className="px-0 sm:px-4">
          <UserProfile 
            userId={user.id} 
            editable={true} 
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}