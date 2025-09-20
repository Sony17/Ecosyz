'use client';

import { useState, useEffect } from 'react';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

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

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Workspaces</h1>

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
        {workspaces.map((workspace) => (
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
        ))}
      </div>
    </div>
  );
}