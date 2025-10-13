'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          ...userData.user,
          avatar: userData.user.avatarUrl // Map avatarUrl to avatar
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    // Set up periodic auth checks to handle session expiry
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 30000); // Check every 30 seconds

    // Listen for storage events (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-logout') {
        setUser(null);
      } else if (e.key === 'auth-login') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);

  const logout = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      
      // Notify other tabs
      localStorage.setItem('auth-logout', Date.now().toString());
      localStorage.removeItem('auth-logout');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshAuth = useCallback(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return { 
    user, 
    loading, 
    logout, 
    refreshAuth,
    isAuthenticated: !!user && !loading
  };
}