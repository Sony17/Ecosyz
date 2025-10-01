'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Workspace {
  id: string;
  title: string;
  createdAt: string;
  owner: {
    name: string | null;
    email: string;
  };
  _count: {
    resources: number;
    shares: number;
  };
}

export default function Projects() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/workspaces', { method: 'POST', body: JSON.stringify({}) });
      if (res.status === 401) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    } catch {
      setAuthenticated(false);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch {
      setErrorMsg('Failed to fetch workspaces.');
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async () => {
    setCreating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Project' }),
      });
      if (res.ok) {
        const newWorkspace = await res.json();
        router.push(`/workspaces/${newWorkspace.id}`);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to create project.');
      }
    } catch {
      setErrorMsg('Failed to create project.');
    } finally {
      setCreating(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="py-16 sm:py-20 text-white relative">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-radial from-emerald-400/10 to-transparent blur-2xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-4 text-center uppercase">
              Explore Open Projects
            </h1>
            <p className="text-lg text-teal-100/80 font-medium max-w-2xl mx-auto">
              Discover, remix, and contribute to breakthrough innovations. All projects here are community-powered and open by default.
            </p>
          </div>
          {errorMsg && (
            <div className="text-center text-red-400 font-semibold mb-6">{errorMsg}</div>
          )}
          {!authenticated ? (
            <div className="text-center py-12">
              <p className="text-lg text-teal-100/80 mb-4">Login to create your own projects and access advanced features.</p>
              <Link href="/auth" className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-lg shadow-lg transition hover:scale-105">
                Login to Get Started
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[#192527]/90 p-6 rounded-xl border border-emerald-400/10 shadow-lg animate-pulse">
                      <div className="h-6 bg-emerald-400/20 rounded mb-2"></div>
                      <div className="h-4 bg-teal-100/20 rounded mb-1"></div>
                      <div className="h-4 bg-teal-100/20 rounded mb-1 w-3/4"></div>
                      <div className="h-8 bg-emerald-400/30 rounded mt-6 w-24"></div>
                    </div>
                  ))
                ) : workspaces.length > 0 ? (
                  workspaces.map((workspace, index) => {
                    const colors = [
                      { bg: 'bg-[#192527]/90', border: 'border-emerald-400/10', shadow: 'hover:shadow-[0_0_32px_#10b98145]', title: 'text-emerald-200', button: 'from-emerald-400 to-cyan-400' },
                      { bg: 'bg-[#192535]/90', border: 'border-cyan-400/10', shadow: 'hover:shadow-[0_0_32px_#00d9ff45]', title: 'text-cyan-200', button: 'from-cyan-400 to-emerald-400' },
                      { bg: 'bg-[#1a2531]/90', border: 'border-purple-400/10', shadow: 'hover:shadow-[0_0_32px_#c084fc45]', title: 'text-purple-200', button: 'from-purple-300 to-cyan-400' },
                    ];
                    const color = colors[index % colors.length];
                    return (
                      <div key={workspace.id} className={`${color.bg} p-6 rounded-xl border ${color.border} shadow-lg ${color.shadow} transition flex flex-col justify-between`}>
                        <div>
                          <h2 className={`text-xl font-bold ${color.title} mb-2`}>{workspace.title}</h2>
                          <p className="text-teal-100/80 mb-2">
                            Created by {workspace.owner.name || workspace.owner.email} • {new Date(workspace.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-teal-100/60 text-sm mb-4">
                            {workspace._count.resources} resources • {workspace._count.shares} shares
                          </p>
                        </div>
                        <Link
                          href={`/workspaces/${workspace.id}`}
                          className={`inline-block px-6 py-2 mt-auto bg-gradient-to-r ${color.button} text-gray-900 font-semibold rounded-md shadow transition hover:scale-105 text-sm text-center`}
                        >
                          Open Workspace
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-teal-100/80 text-lg mb-4">No projects yet. Start your first project!</p>
                  </div>
                )}
              </div>
              <div className="mt-20 text-center">
                <button
                  onClick={createWorkspace}
                  disabled={creating}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-lg shadow-lg transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Start a New Project'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
