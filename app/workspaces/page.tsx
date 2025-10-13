'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/lib/useAuth';
import Link from 'next/link';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
}

export default function WorkspacesPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setNewTitle('');
        fetchWorkspaces();
      } else {
        const errorData = await res.json();
        alert(`Failed to create workspace: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workspace?')) return;

    try {
      const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchWorkspaces();
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">My Workspaces</h1>
        <div className="bg-gray-100 p-8 rounded-lg">
          <p className="text-gray-600 mb-4">Please sign in to access your workspaces.</p>
          <Link 
            href="/auth"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto p-4">Loading workspaces...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Workspaces</h1>
        <div className="text-sm text-gray-600">
          Welcome, {user?.name || user?.email}
        </div>
      </div>

      <form onSubmit={createWorkspace} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New workspace title"
            className="flex-1 px-3 py-2 border rounded"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {workspaces.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No workspaces yet. Create your first one above!</p>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <div key={workspace.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <h2 className="text-lg font-semibold">{workspace.title}</h2>
                <p className="text-sm text-gray-500">
                  Created {new Date(workspace.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/workspaces/${workspace.id}`}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Open
                </a>
                <button
                  onClick={() => deleteWorkspace(workspace.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}