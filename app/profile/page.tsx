import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../src/lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from '../components/ui/Container';
import ProfileForm from '../components/profile/ProfileForm';

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
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account settings and preferences.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <ProfileForm initialData={profile} />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}