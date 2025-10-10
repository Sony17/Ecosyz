'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check if we have hash fragments (OAuth tokens)
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);
        
        // Handle error in URL parameters
        const error = searchParams.get('error');
        if (error) {
          console.error('OAuth error:', error);
          toast.error('Authentication failed', {
            description: 'Please try again or contact support.',
          });
          router.push('/auth');
          return;
        }

        // Process hash fragments for implicit flow (contains access_token)
        if (hash && hash.includes('access_token=')) {
          console.log('Processing OAuth tokens from hash fragment');
          
          // Extract tokens from hash
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const expiresIn = hashParams.get('expires_in');
          
          if (accessToken && refreshToken) {
            // Send tokens to our API to set secure cookies
            const response = await fetch('/api/auth/oauth-callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: expiresIn ? parseInt(expiresIn) : 3600,
              }),
            });

            if (response.ok) {
              toast.success('Successfully signed in!', {
                description: 'Welcome to Ecosyz',
                duration: 3000,
              });
              
              // Get user's workspace and redirect to it
              try {
                // Small delay to ensure session is established
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const workspaceResponse = await fetch('/api/auth/user-workspace');
                if (workspaceResponse.ok) {
                  const workspaceData = await workspaceResponse.json();
                  if (workspaceData.workspaceId) {
                    router.push(`/workspaces/${workspaceData.workspaceId}`);
                    return;
                  }
                }
              } catch (workspaceError) {
                console.error('Error fetching user workspace:', workspaceError);
              }
              
              // Fallback: redirect to workspaces page to create one
              router.push('/workspaces');
              return;
            } else {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to set session');
            }
          }
        }

        // Check for authorization code (PKCE flow)
        const code = searchParams.get('code');
        if (code) {
          console.log('Processing OAuth code exchange');
          
          const response = await fetch(`/api/auth/oauth-callback?code=${code}`, {
            method: 'GET',
          });

          if (response.ok) {
            toast.success('Successfully signed in!', {
              description: 'Welcome to Ecosyz',
              duration: 3000,
            });
            
            // Get user's workspace and redirect to it
            try {
              // Small delay to ensure session is established
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const workspaceResponse = await fetch('/api/auth/user-workspace');
              if (workspaceResponse.ok) {
                const workspaceData = await workspaceResponse.json();
                if (workspaceData.workspaceId) {
                  router.push(`/workspaces/${workspaceData.workspaceId}`);
                  return;
                }
              }
            } catch (workspaceError) {
              console.error('Error fetching user workspace:', workspaceError);
            }
            
            // Fallback: redirect to workspaces page to create one
            router.push('/workspaces');
            return;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to exchange code');
          }
        }

        // If no tokens or code found, redirect to auth page
        console.log('No OAuth tokens or code found, redirecting to auth');
        router.push('/auth');
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed', {
          description: error instanceof Error ? error.message : 'Please try again.',
        });
        router.push('/auth');
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
        <p className="text-emerald-400 mt-4 text-lg">Completing sign in...</p>
        <p className="text-gray-400 mt-2">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}