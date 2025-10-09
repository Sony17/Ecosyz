'use client';

import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Link as LinkIcon, Calendar, Pencil, Save, X, Camera, Activity, Bookmark, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../../../src/lib/ui';
import useResponsive from '../../../src/lib/hooks/useResponsive';

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
  joinedAt: string;
  stats: {
    projects: number;
    resources: number;
    followers: number;
    following: number;
  };
  skills: string[];
  activity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
  resources: Array<{
    id: string;
    title: string;
    type: string;
    createdAt: string;
    views: number;
  }>;
}

interface UserProfileProps {
  userId?: string;
  editable?: boolean;
}

export default function UserProfile({ userId, editable = false }: UserProfileProps) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [editableData, setEditableData] = useState<UserProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'activity'>('overview');
  
  // Responsive
  const { isMobile } = useResponsive();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        
        // Mocked data
        setTimeout(() => {
          const mockData = {
            id: userId || 'user-123',
            name: 'Alex Morgan',
            username: 'alexmorgan',
            email: 'alex@example.com',
            bio: 'AI researcher and developer. Passionate about NLP and computer vision. Working on next-gen AI tools for creative professionals.',
            avatar: 'https://i.pravatar.cc/300',
            location: 'San Francisco, CA',
            website: 'https://alexmorgan.dev',
            joinedAt: '2023-01-15T00:00:00.000Z',
            stats: {
              projects: 7,
              resources: 24,
              followers: 53,
              following: 41
            },
            skills: ['Machine Learning', 'React', 'TypeScript', 'Python', 'Node.js'],
            activity: [
              { 
                id: 'act-1', 
                type: 'project_created', 
                title: 'Created a new project: "AI Image Generator"', 
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() 
              },
              { 
                id: 'act-2', 
                type: 'resource_shared', 
                title: 'Shared resource: "Advanced NLP Techniques"', 
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() 
              },
              { 
                id: 'act-3', 
                type: 'workspace_updated', 
                title: 'Updated workspace: "Research Papers"', 
                timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() 
              }
            ],
            resources: [
              {
                id: 'res-1',
                title: 'Introduction to Neural Networks',
                type: 'document',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                views: 156
              },
              {
                id: 'res-2',
                title: 'Data Visualization Techniques',
                type: 'tutorial',
                createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                views: 89
              },
              {
                id: 'res-3',
                title: 'Building REST APIs with Node.js',
                type: 'guide',
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                views: 212
              }
            ]
          };
          
          setUserData(mockData);
          setEditableData(mockData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  // Handle saving profile changes
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to API
      // await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editableData),
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the userData with editableData
      setUserData(editableData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle editing cancellation
  const handleCancelEditing = () => {
    setEditableData(userData);
    setIsEditing(false);
  };
  
  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setEditableData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-zinc-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-xl text-zinc-400">User not found</p>
          <Link href="/" className="mt-4 text-emerald-500 hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-full">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-emerald-800/50 to-blue-800/50"></div>
        
        {/* Profile Picture and Basic Info */}
        <div className="px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end relative -mt-12 sm:-mt-16">
            <div className="relative z-10">
              <div className="rounded-full border-4 border-zinc-950 overflow-hidden bg-zinc-800 w-24 h-24 sm:w-32 sm:h-32">
                {userData.avatar ? (
                  <Image 
                    src={userData.avatar} 
                    alt={userData.name} 
                    width={128} 
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-white text-2xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                )}
                
                {editable && isEditing && (
                  <button className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-grow mt-4 sm:mt-0 sm:ml-4 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {!isEditing ? (
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{userData.name}</h1>
                  ) : (
                    <input
                      type="text"
                      value={editableData?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl sm:text-3xl font-bold bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white w-full sm:w-auto"
                    />
                  )}
                  <p className="text-zinc-400 mt-1">@{userData.username}</p>
                </div>
                
                {editable && (
                  <div className="mt-4 sm:mt-0">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-md transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelEditing}
                          className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Profile Content */}
      <div className="px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bio and Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h2 className="text-lg font-medium text-zinc-100 mb-3">Bio</h2>
              {!isEditing ? (
                <p className="text-zinc-300 text-sm whitespace-pre-wrap">{userData.bio}</p>
              ) : (
                <textarea
                  value={editableData?.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-200"
                  placeholder="Tell us about yourself..."
                />
              )}
            </div>
            
            {/* Contact Info */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h2 className="text-lg font-medium text-zinc-100 mb-3">Information</h2>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <User className="w-4 h-4 text-zinc-500 mr-3 flex-shrink-0" />
                  <span className="text-zinc-400 mr-2">Name:</span>
                  {!isEditing ? (
                    <span className="text-zinc-200">{userData.name}</span>
                  ) : (
                    <input
                      type="text"
                      value={editableData?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="flex-grow bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200"
                    />
                  )}
                </li>
                <li className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-zinc-500 mr-3 flex-shrink-0" />
                  <span className="text-zinc-400 mr-2">Email:</span>
                  {!isEditing ? (
                    <span className="text-zinc-200">{userData.email}</span>
                  ) : (
                    <input
                      type="email"
                      value={editableData?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-grow bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200"
                    />
                  )}
                </li>
                <li className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-zinc-500 mr-3 flex-shrink-0" />
                  <span className="text-zinc-400 mr-2">Location:</span>
                  {!isEditing ? (
                    <span className="text-zinc-200">{userData.location || 'Not specified'}</span>
                  ) : (
                    <input
                      type="text"
                      value={editableData?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-grow bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200"
                    />
                  )}
                </li>
                <li className="flex items-center text-sm">
                  <LinkIcon className="w-4 h-4 text-zinc-500 mr-3 flex-shrink-0" />
                  <span className="text-zinc-400 mr-2">Website:</span>
                  {!isEditing ? (
                    userData.website ? (
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                        {userData.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-zinc-200">Not specified</span>
                    )
                  ) : (
                    <input
                      type="text"
                      value={editableData?.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="flex-grow bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200"
                      placeholder="https://"
                    />
                  )}
                </li>
                <li className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-zinc-500 mr-3 flex-shrink-0" />
                  <span className="text-zinc-400 mr-2">Joined:</span>
                  <span className="text-zinc-200">
                    {new Date(userData.joinedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Skills */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-zinc-100">Skills</h2>
                {isEditing && (
                  <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                    + Add Skill
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button className="ml-1.5 text-zinc-500 hover:text-zinc-300">×</button>
                    )}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h2 className="text-lg font-medium text-zinc-100 mb-3">Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-zinc-800/50 rounded-md">
                  <p className="text-2xl font-bold text-emerald-400">{userData.stats.projects}</p>
                  <p className="text-xs text-zinc-400 mt-1">Projects</p>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-md">
                  <p className="text-2xl font-bold text-emerald-400">{userData.stats.resources}</p>
                  <p className="text-xs text-zinc-400 mt-1">Resources</p>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-md">
                  <p className="text-2xl font-bold text-emerald-400">{userData.stats.followers}</p>
                  <p className="text-xs text-zinc-400 mt-1">Followers</p>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-md">
                  <p className="text-2xl font-bold text-emerald-400">{userData.stats.following}</p>
                  <p className="text-xs text-zinc-400 mt-1">Following</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-zinc-800 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "pb-3 relative",
                    activeTab === 'overview'
                      ? "text-emerald-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Overview
                  {activeTab === 'overview' && (
                    <motion.div
                      layoutId="activeTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={cn(
                    "pb-3 relative",
                    activeTab === 'resources'
                      ? "text-emerald-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Resources
                  {activeTab === 'resources' && (
                    <motion.div
                      layoutId="activeTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={cn(
                    "pb-3 relative",
                    activeTab === 'activity'
                      ? "text-emerald-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Activity
                  {activeTab === 'activity' && (
                    <motion.div
                      layoutId="activeTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                    />
                  )}
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-zinc-100 mb-4">Recent Projects</h3>
                    {userData.stats.projects > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-emerald-500/30 transition-all cursor-pointer">
                          <h4 className="text-zinc-200 font-medium">AI Image Generator</h4>
                          <p className="text-zinc-400 text-sm mt-2 line-clamp-2">A cutting-edge image generation tool powered by state-of-the-art AI.</p>
                          <div className="mt-3 text-xs text-zinc-500">Updated 2 days ago</div>
                        </div>
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-emerald-500/30 transition-all cursor-pointer">
                          <h4 className="text-zinc-200 font-medium">Research Papers</h4>
                          <p className="text-zinc-400 text-sm mt-2 line-clamp-2">Collection of research papers on natural language processing and computer vision.</p>
                          <div className="mt-3 text-xs text-zinc-500">Updated 2 weeks ago</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-center py-6">No projects yet</p>
                    )}
                    <div className="mt-4 text-center">
                      <Link href="/projects" className="text-sm text-emerald-400 hover:underline">
                        View all projects
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-zinc-100 mb-4">Featured Resources</h3>
                    {userData.resources.length > 0 ? (
                      <div className="space-y-3">
                        {userData.resources.map((resource: any) => (
                          <div 
                            key={resource.id} 
                            className="flex items-start p-3 bg-zinc-800 rounded-lg hover:bg-zinc-800/80 cursor-pointer"
                          >
                            <div className="p-2 bg-zinc-700 rounded mr-3">
                              <FileText className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-zinc-200 font-medium">{resource.title}</h4>
                              <div className="flex items-center mt-1 text-xs text-zinc-500">
                                <span className="capitalize">{resource.type}</span>
                                <span className="mx-2">•</span>
                                <span>{resource.views} views</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-center py-6">No resources shared yet</p>
                    )}
                    <div className="mt-4 text-center">
                      <Link href="/resources" className="text-sm text-emerald-400 hover:underline">
                        View all resources
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-zinc-100">All Resources</h3>
                      <div className="flex gap-2">
                        <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1 text-sm">
                          <option value="newest">Newest</option>
                          <option value="popular">Most Popular</option>
                          <option value="name">Name A-Z</option>
                        </select>
                      </div>
                    </div>
                    
                    {userData.resources.length > 0 ? (
                      <div className="space-y-3">
                        {[...Array(8)].map((_, index) => {
                          // Repeat resources for demo
                          const resource = userData.resources[index % userData.resources.length];
                          return (
                            <div 
                              key={`${resource.id}-${index}`} 
                              className="flex items-start p-4 bg-zinc-800 rounded-lg hover:bg-zinc-800/80 transition-colors cursor-pointer"
                            >
                              <div className="p-2.5 bg-zinc-700 rounded mr-4">
                                <FileText className="w-6 h-6 text-emerald-400" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="text-zinc-200 font-medium">{resource.title}</h4>
                                <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                                  {index % 2 === 0 
                                    ? 'A comprehensive guide to understanding advanced concepts and practical applications.' 
                                    : 'Quick reference material with code examples and best practices for developers.'}
                                </p>
                                <div className="flex items-center mt-2 text-xs text-zinc-500">
                                  <span className="capitalize">{resource.type}</span>
                                  <span className="mx-2">•</span>
                                  <span>{resource.views} views</span>
                                  <span className="mx-2">•</span>
                                  <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <button className="ml-2 p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-700/50 rounded-md">
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-center py-8">No resources shared yet</p>
                    )}
                    
                    <div className="mt-6 flex justify-center">
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400">
                          &lt;
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-emerald-600 text-white">
                          1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                          2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400">
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-zinc-100 mb-4">Recent Activity</h3>
                    <div className="relative pl-6 border-l border-zinc-800">
                      {userData.activity.length > 0 ? (
                        userData.activity.map((activity: any, index: number) => (
                          <div key={activity.id} className="mb-6 relative">
                            <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-7.5 mt-1.5"></div>
                            <div className="flex flex-col">
                              <p className="text-zinc-300">{activity.title}</p>
                              <p className="text-xs text-zinc-500 mt-1">
                                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-400 text-center py-6">No recent activity</p>
                      )}
                      
                      {/* More sample activities for demo */}
                      <div className="mb-6 relative">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-7.5 mt-1.5"></div>
                        <div className="flex flex-col">
                          <p className="text-zinc-300">Commented on a discussion in AI Ethics forum</p>
                          <p className="text-xs text-zinc-500 mt-1">Sep 30, 2023</p>
                        </div>
                      </div>
                      
                      <div className="mb-6 relative">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-7.5 mt-1.5"></div>
                        <div className="flex flex-col">
                          <p className="text-zinc-300">Starred project "Neural Network Visualization Tool"</p>
                          <p className="text-xs text-zinc-500 mt-1">Sep 18, 2023</p>
                        </div>
                      </div>
                      
                      <div className="mb-6 relative">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-7.5 mt-1.5"></div>
                        <div className="flex flex-col">
                          <p className="text-zinc-300">Followed user Sarah Johnson</p>
                          <p className="text-xs text-zinc-500 mt-1">Sep 15, 2023</p>
                        </div>
                      </div>
                      
                      <div className="mb-6 relative">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-7.5 mt-1.5"></div>
                        <div className="flex flex-col">
                          <p className="text-zinc-300">Created account</p>
                          <p className="text-xs text-zinc-500 mt-1">Jan 15, 2023</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <button className="text-sm text-emerald-400 hover:underline">
                        Load more activity
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}