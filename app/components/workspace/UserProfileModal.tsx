'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, X, Settings, CreditCard, Shield, Bell, Mail, 
  LogOut, ChevronRight, Edit2, Camera, Check, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription?: {
    type: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    twoFactorAuth: boolean;
  };
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'security' | 'notifications' | 'email'>('profile');
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [notifications, setNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/profile');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditedName(data.name || '');
          setTheme(data.preferences?.theme || 'dark');
          setNotifications(data.preferences?.notifications ?? true);
          setTwoFactorAuth(data.preferences?.twoFactorAuth ?? false);
        } else {
          // For demo purposes, use mock data if API fails
          setUser({
            id: 'user-123',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: '/default-avatar.png',
            subscription: {
              type: 'basic',
              status: 'active',
              expiresAt: '2026-10-15',
            },
            preferences: {
              theme: 'dark',
              notifications: true,
              twoFactorAuth: false,
            },
          });
          setEditedName('John Doe');
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        toast.error('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      // Here we would normally update the API
      // const response = await fetch('/api/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: editedName }),
      // });

      // For demo purposes, simulate successful API call
      setTimeout(() => {
        setUser((prev) => prev ? { ...prev, name: editedName } : null);
        setIsEditing(false);
        toast.success('Profile updated successfully');
        setIsSaving(false);
      }, 800);
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile');
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = async (preference: 'theme' | 'notifications' | 'twoFactorAuth', value: any) => {
    try {
      // Here we would normally update the API
      // const response = await fetch('/api/profile/preferences', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ [preference]: value }),
      // });

      // For demo purposes, simulate successful API call
      toast.success('Preference updated');
      setUser((prev) => 
        prev ? { 
          ...prev, 
          preferences: { 
            ...prev.preferences,
            [preference]: value 
          } as any
        } : null
      );
    } catch (error) {
      console.error('Failed to update preference', error);
      toast.error('Failed to update preference');
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Failed to sign out');
      }
    } catch (error) {
      console.error('Sign out failed', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const subscriptionPlan = user?.subscription?.type || 'free';
  const subscriptionStatus = user?.subscription?.status || 'expired';
  const subscriptionExpiry = user?.subscription?.expiresAt;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-100">Profile Settings</h2>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-[70vh] max-h-[600px]">
              {/* Sidebar */}
              <div className="w-full md:w-56 border-r border-zinc-800 overflow-y-auto">
                <nav className="p-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeTab === 'profile' ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                    } transition-colors mb-1`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('subscription')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeTab === 'subscription' ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                    } transition-colors mb-1`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Subscription</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeTab === 'security' ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                    } transition-colors mb-1`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeTab === 'notifications' ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                    } transition-colors mb-1`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeTab === 'email' ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                    } transition-colors mb-1`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                </nav>

                <div className="mt-auto p-4 border-t border-zinc-800">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                    <p className="text-zinc-400 text-sm">Loading profile information...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'profile' && (
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 mb-6">Your Profile</h3>
                        
                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800">
                              {user?.avatar ? (
                                <Image 
                                  src={user.avatar} 
                                  alt="User avatar" 
                                  width={96} 
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/20 text-emerald-400">
                                  <User className="w-10 h-10" />
                                </div>
                              )}
                            </div>
                            <button className="absolute bottom-0 right-0 bg-zinc-700 hover:bg-zinc-600 p-1.5 rounded-full text-zinc-200 transition-colors">
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">
                                  Name
                                </label>
                                <input
                                  id="name"
                                  type="text"
                                  value={editedName}
                                  onChange={(e) => setEditedName(e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            ) : (
                              <h4 className="text-xl font-medium text-zinc-200 mb-1">{user?.name}</h4>
                            )}
                            
                            <p className="text-zinc-400 mb-4">{user?.email}</p>
                            
                            {isEditing ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={handleSaveProfile}
                                  disabled={isSaving}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                >
                                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                  Save Changes
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditing(false);
                                    setEditedName(user?.name || '');
                                  }}
                                  className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-md flex items-center gap-1 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit Profile
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-zinc-800 pt-6">
                          <h4 className="text-md font-medium text-zinc-200 mb-4">Appearance</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-zinc-300 mb-2">Theme</p>
                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => {
                                    setTheme('light');
                                    handleUpdatePreferences('theme', 'light');
                                  }}
                                  className={`px-3 py-1.5 rounded-md text-sm ${
                                    theme === 'light' 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                  }`}
                                >
                                  Light
                                </button>
                                <button
                                  onClick={() => {
                                    setTheme('dark');
                                    handleUpdatePreferences('theme', 'dark');
                                  }}
                                  className={`px-3 py-1.5 rounded-md text-sm ${
                                    theme === 'dark' 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                  }`}
                                >
                                  Dark
                                </button>
                                <button
                                  onClick={() => {
                                    setTheme('system');
                                    handleUpdatePreferences('theme', 'system');
                                  }}
                                  className={`px-3 py-1.5 rounded-md text-sm ${
                                    theme === 'system' 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                  }`}
                                >
                                  System
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'subscription' && (
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 mb-6">Subscription</h3>
                        
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-md font-medium text-zinc-200">
                                {subscriptionPlan === 'free' && 'Free Plan'}
                                {subscriptionPlan === 'basic' && 'Basic Plan'}
                                {subscriptionPlan === 'premium' && 'Premium Plan'}
                                {subscriptionPlan === 'enterprise' && 'Enterprise Plan'}
                              </h4>
                              <p className="text-sm text-zinc-400 mt-1">
                                {subscriptionStatus === 'active' && (
                                  <>Active until {new Date(subscriptionExpiry || '').toLocaleDateString()}</>
                                )}
                                {subscriptionStatus === 'cancelled' && (
                                  <>Cancelled - Access until {new Date(subscriptionExpiry || '').toLocaleDateString()}</>
                                )}
                                {subscriptionStatus === 'expired' && 'Expired'}
                                {subscriptionPlan === 'free' && 'Free tier with limited features'}
                              </p>
                            </div>
                            
                            <div className={`px-2.5 py-1 rounded text-xs font-medium ${
                              subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                              subscriptionStatus === 'cancelled' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-zinc-600/20 text-zinc-400'
                            }`}>
                              {subscriptionStatus === 'active' ? 'Active' : 
                               subscriptionStatus === 'cancelled' ? 'Cancelled' : 'Expired'}
                            </div>
                          </div>
                          
                          {subscriptionPlan !== 'free' && (
                            <button 
                              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors"
                            >
                              Manage Subscription
                            </button>
                          )}
                          
                          {subscriptionPlan === 'free' && (
                            <button 
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md transition-colors"
                            >
                              Upgrade Plan
                            </button>
                          )}
                        </div>
                        
                        <h4 className="text-md font-medium text-zinc-200 mb-4">Available Plans</h4>
                        
                        <div className="space-y-4">
                          <div className={`border ${subscriptionPlan === 'free' ? 'border-emerald-500/30' : 'border-zinc-700'} rounded-lg p-4`}>
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-zinc-200 font-medium">Free</h5>
                              {subscriptionPlan === 'free' && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Current</span>}
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Basic features for getting started</p>
                            <ul className="text-sm text-zinc-300 space-y-1 mb-4">
                              <li>• Limited workspace storage</li>
                              <li>• Basic AI assistance</li>
                              <li>• Public projects only</li>
                            </ul>
                            <p className="text-zinc-200 font-medium mb-3">$0 / month</p>
                            {subscriptionPlan !== 'free' && (
                              <button className="w-full px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors">
                                Downgrade
                              </button>
                            )}
                          </div>
                          
                          <div className={`border ${subscriptionPlan === 'basic' ? 'border-emerald-500/30' : 'border-zinc-700'} rounded-lg p-4`}>
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-zinc-200 font-medium">Basic</h5>
                              {subscriptionPlan === 'basic' && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Current</span>}
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Enhanced features for individuals</p>
                            <ul className="text-sm text-zinc-300 space-y-1 mb-4">
                              <li>• 10GB workspace storage</li>
                              <li>• Advanced AI assistance</li>
                              <li>• Private projects</li>
                              <li>• History retention</li>
                            </ul>
                            <p className="text-zinc-200 font-medium mb-3">$9.99 / month</p>
                            {subscriptionPlan !== 'basic' && (
                              <button className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md transition-colors">
                                {subscriptionPlan === 'premium' || subscriptionPlan === 'enterprise' ? 'Downgrade' : 'Upgrade'}
                              </button>
                            )}
                          </div>
                          
                          <div className={`border ${subscriptionPlan === 'premium' ? 'border-emerald-500/30' : 'border-zinc-700'} rounded-lg p-4`}>
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-zinc-200 font-medium">Premium</h5>
                              {subscriptionPlan === 'premium' && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Current</span>}
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Professional features for power users</p>
                            <ul className="text-sm text-zinc-300 space-y-1 mb-4">
                              <li>• 50GB workspace storage</li>
                              <li>• Priority AI assistance</li>
                              <li>• Team collaboration</li>
                              <li>• Custom workspace templates</li>
                              <li>• Advanced analytics</li>
                            </ul>
                            <p className="text-zinc-200 font-medium mb-3">$24.99 / month</p>
                            {subscriptionPlan !== 'premium' && (
                              <button className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md transition-colors">
                                {subscriptionPlan === 'enterprise' ? 'Downgrade' : 'Upgrade'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 mb-6">Security</h3>
                        
                        <div className="space-y-8">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-md font-medium text-zinc-200">Two-Factor Authentication</h4>
                                <p className="text-sm text-zinc-400 mt-1">Add an extra layer of security to your account</p>
                              </div>
                              
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={twoFactorAuth}
                                  onChange={() => {
                                    setTwoFactorAuth(!twoFactorAuth);
                                    handleUpdatePreferences('twoFactorAuth', !twoFactorAuth);
                                  }}
                                />
                                <div className={`w-11 h-6 rounded-full peer ${
                                  twoFactorAuth ? 'bg-emerald-600' : 'bg-zinc-700'
                                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                              </label>
                            </div>
                            
                            {twoFactorAuth && (
                              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                                <p className="text-sm text-zinc-300 mb-3">Two-factor authentication is enabled for your account.</p>
                                <div className="flex gap-3">
                                  <button className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors">
                                    Change Recovery Methods
                                  </button>
                                  <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-md transition-colors">
                                    Disable 2FA
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="text-md font-medium text-zinc-200 mb-2">Password</h4>
                            <p className="text-sm text-zinc-400 mb-4">Change your password regularly to keep your account secure</p>
                            <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors">
                              Change Password
                            </button>
                          </div>
                          
                          <div>
                            <h4 className="text-md font-medium text-zinc-200 mb-2">Active Sessions</h4>
                            <p className="text-sm text-zinc-400 mb-4">Manage your active login sessions</p>
                            <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors">
                              View Active Sessions
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'notifications' && (
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 mb-6">Notification Settings</h3>
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-md font-medium text-zinc-200">Email Notifications</h4>
                              <p className="text-sm text-zinc-400 mt-1">Receive updates, newsletters and important alerts</p>
                            </div>
                            
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications}
                                onChange={() => {
                                  setNotifications(!notifications);
                                  handleUpdatePreferences('notifications', !notifications);
                                }}
                              />
                              <div className={`w-11 h-6 rounded-full peer ${
                                notifications ? 'bg-emerald-600' : 'bg-zinc-700'
                              } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                            </label>
                          </div>
                          
                          <div className="border-t border-zinc-800 pt-4">
                            <h4 className="text-md font-medium text-zinc-200 mb-4">Notification Categories</h4>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-zinc-300">Project Updates</h5>
                                  <p className="text-xs text-zinc-500 mt-0.5">When your projects are updated or changed</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-9 h-5 rounded-full peer bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                </label>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-zinc-300">Workspace Sharing</h5>
                                  <p className="text-xs text-zinc-500 mt-0.5">When someone shares a workspace with you</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-9 h-5 rounded-full peer bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                </label>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-zinc-300">Resource Updates</h5>
                                  <p className="text-xs text-zinc-500 mt-0.5">When resources are added or changed</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-9 h-5 rounded-full peer bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                </label>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-zinc-300">Marketing Emails</h5>
                                  <p className="text-xs text-zinc-500 mt-0.5">News, updates, and promotional offers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-9 h-5 rounded-full peer bg-zinc-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'email' && (
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 mb-6">Email Address</h3>
                        
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                          <h4 className="text-md font-medium text-zinc-200 mb-1">Primary Email</h4>
                          <p className="text-zinc-400 mb-4">{user?.email}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors">
                              Change Email
                            </button>
                            
                            <button className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-md transition-colors">
                              Add Secondary Email
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-md font-medium text-zinc-200 mb-4">Email Preferences</h4>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h5 className="text-sm font-medium text-zinc-300">Email Format</h5>
                                <p className="text-xs text-zinc-500 mt-0.5">Choose how you'd like to receive emails</p>
                              </div>
                              
                              <select className="bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="html">HTML (recommended)</option>
                                <option value="plain">Plain Text</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-sm font-medium text-zinc-300">Email Language</h5>
                                <p className="text-xs text-zinc-500 mt-0.5">Choose your preferred language for emails</p>
                              </div>
                              
                              <select className="bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}