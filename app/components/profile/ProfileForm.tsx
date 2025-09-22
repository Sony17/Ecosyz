'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UpdateProfile } from '../../../src/lib/validation';
import AvatarUploader from './AvatarUploader';

interface ProfileFormData {
  displayName: string;
  bio?: string;
  preferences?: {
    theme: 'system' | 'light' | 'dark';
    language?: string;
    emailNotifications?: boolean;
    marketingEmails?: boolean;
  };
}

interface ProfileFormProps {
  initialData: {
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    preferences: {
      theme: 'system' | 'light' | 'dark';
      language: string;
      emailNotifications: boolean;
      marketingEmails: boolean;
    };
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(UpdateProfile),
    defaultValues: {
      displayName: initialData.displayName,
      bio: initialData.bio || '',
      preferences: initialData.preferences || {
        theme: 'system',
        language: 'en-IN',
        emailNotifications: true,
        marketingEmails: false,
      },
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
  };

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Profile Picture
        </h2>
        <AvatarUploader
          currentAvatarUrl={avatarUrl}
          onAvatarUpdate={handleAvatarUpdate}
        />
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h2>

          <div className="space-y-4">
            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Display Name *
              </label>
              <input
                {...register('displayName')}
                type="text"
                id="displayName"
                data-testid="profile-displayName"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your display name"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bio
              </label>
              <textarea
                {...register('bio')}
                id="bio"
                data-testid="profile-bio"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h2>

          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select
                {...register('preferences.theme')}
                data-testid="profile-theme"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Language
              </label>
              <select
                {...register('preferences.language')}
                id="language"
                data-testid="profile-language"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="en-IN">English (India)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center">
              <input
                {...register('preferences.emailNotifications')}
                type="checkbox"
                id="emailNotifications"
                data-testid="profile-emailNotifications"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="emailNotifications"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Email notifications for important updates
              </label>
            </div>

            {/* Marketing Emails */}
            <div className="flex items-center">
              <input
                {...register('preferences.marketingEmails')}
                type="checkbox"
                id="marketingEmails"
                data-testid="profile-marketingEmails"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="marketingEmails"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Marketing emails and newsletters
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !isDirty}
            data-testid="profile-save"
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}